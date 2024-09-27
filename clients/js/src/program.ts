import { Program, AnchorProvider, setProvider, BN } from "@coral-xyz/anchor";
import { PublicKey, Keypair, Connection, SystemProgram } from "@solana/web3.js";
import {
  useWallet,
  confirmConfig,
  CompressedProofWithContext,
  getIndexOrAdd,
  packNewAddressParams,
  NewAddressParams,
  Rpc,
  deriveAddress,
  LightSystemProgram,
  bn,
  packCompressedAccounts,
  CompressedAccount,
  CompressedAccountWithMerkleContext,
  createMerkleContext,
  PackedMerkleContext,
} from "@lightprotocol/stateless.js";
import { FeatherAssets, IDL } from "./idl";
import { CreateGroupArgsV1, GroupMetadataArgsV1 } from "./types";
import { FeatherAssetsConstants } from "./constants";

export class FeatherAssetsProgram extends FeatherAssetsConstants {
  private static instance: FeatherAssetsProgram;
  private _program: Program<FeatherAssets> | null = null;
  private constructor() {
    super();
  }
  static getInstance(): FeatherAssetsProgram {
    if (!FeatherAssetsProgram.instance) {
      FeatherAssetsProgram.instance = new FeatherAssetsProgram();
    }
    return FeatherAssetsProgram.instance;
  }

  get program(): Program<FeatherAssets> {
    if (!this._program) {
      this.initializeProgram();
    }
    return this._program!;
  }
  private initializeProgram(): void {
    if (!this._program) {
      const mockKeypair = Keypair.generate();
      const mockConnection = new Connection(
        "http://127.0.0.1:8899",
        "confirmed"
      );
      const mockProvider = new AnchorProvider(
        mockConnection,
        useWallet(mockKeypair),
        confirmConfig
      );
      setProvider(mockProvider);
      this._program = new Program(
        IDL,
        FeatherAssetsProgram.programId,
        mockProvider
      );
    }
  }
  static async createGroupIx(
    params: CreateGroupArgsV1,
    seeds: BN,
    payer: PublicKey,
    authority: PublicKey,
    rpc: Rpc
  ) {
    const { maxSize, metadata } = params;

    const groupSeed = this.deriveGroupSeed(seeds);
    const groupDataSeed = this.deriveGroupDataSeed(seeds);

    const outputAddresses = [];
    const groupAddress: PublicKey = await deriveAddress(groupSeed);
    const groupDataAddress: PublicKey | null = metadata
      ? await deriveAddress(groupDataSeed)
      : null;
    outputAddresses.push(groupAddress);
    if (groupDataAddress) outputAddresses.push(groupDataAddress);

    const proof = await this.getValidityProof(rpc, undefined, outputAddresses);

    const newAddresses = [];
    const groupAddressParams: NewAddressParams = this.getNewAddressParams(
      groupSeed,
      proof
    );
    const groupDataAddressParams: NewAddressParams = this.getNewAddressParams(
      groupDataSeed,
      proof
    );
    newAddresses.push(groupAddressParams);
    if (groupDataAddress) newAddresses.push(groupDataAddressParams);

    const groupCompressedOutput =
      this.createNewAddressOutputState(groupAddress);
    const outputCompressedAccounts = [...groupCompressedOutput];
    if (groupDataAddress) {
      const groupDataCompressedOutput =
        this.createNewAddressOutputState(groupDataAddress);
      outputCompressedAccounts.push(...groupDataCompressedOutput);
    }
    const {
      addressMerkleContext,
      addressMerkleTreeRootIndex,
      merkleContext,
      remainingAccounts,
    } = this.pack([], outputCompressedAccounts, newAddresses, proof);
    const ix = await FeatherAssetsProgram.getInstance()
      .program.methods.createGroup(
        {
          addressMerkleContext,
          addressMerkleTreeRootIndex,
          inputs: [],
          merkleContext,
          merkleTreeRootIndex: 0,
          proof: proof.compressedProof,
        },
        seeds,
        {
          maxSize: maxSize,
          metadata,
        }
      )
      .accounts({
        signer: payer,
        authority: authority,
        ...this.constantAccounts(),
      })
      .remainingAccounts(
        remainingAccounts.map((acc) => ({
          isSigner: false,
          isWritable: false,
          pubkey: acc,
        }))
      )
      .instruction();
    return ix;
  }
  // GROUP UTILS <--------------------------------------------------------------------->
  static deriveGroupSeed(seeds: BN) {
    return new Uint8Array();
  }
  static deriveGroupDataSeed(groupSeed: BN) {
    let groupAddress = deriveAddress(new Uint8Array());
    return new Uint8Array();
  }
  //  <--------------------------------------------------------------------------->
  private static pack(
    inputCompressedAccounts: CompressedAccountWithMerkleContext[],
    outputCompressedAccounts: CompressedAccount[],
    newAddresses: NewAddressParams[],
    proof: CompressedProofWithContext
  ) {
    const { remainingAccounts: _remainingAccounts } = packCompressedAccounts(
      inputCompressedAccounts,
      proof.rootIndices,
      outputCompressedAccounts
    );
    const { newAddressParamsPacked, remainingAccounts } = packNewAddressParams(
      newAddresses,
      _remainingAccounts
    );
    let {
      addressMerkleTreeAccountIndex,
      addressMerkleTreeRootIndex,
      addressQueueAccountIndex,
    } = newAddressParamsPacked[0];
    let merkleContext: PackedMerkleContext = {
      leafIndex: 0,
      merkleTreePubkeyIndex: getIndexOrAdd(remainingAccounts, this.merkleTree),
      nullifierQueuePubkeyIndex: getIndexOrAdd(
        remainingAccounts,
        this.nullifierQueue
      ),
      queueIndex: null,
    };
    return {
      addressMerkleContext: {
        addressMerkleTreePubkeyIndex: addressMerkleTreeAccountIndex,
        addressQueuePubkeyIndex: addressQueueAccountIndex,
      },
      addressMerkleTreeRootIndex,
      merkleContext,
      remainingAccounts,
    };
  }
  protected static async getValidityProof(
    rpc: Rpc,
    input_addrs?: PublicKey[],
    ouput_addrs?: PublicKey[]
  ) {
    const inputHashes = input_addrs?.map((addr) => new BN(addr.toBytes()));
    const outputHashes = ouput_addrs?.map((addr) => new BN(addr.toBytes()));
    return await rpc.getValidityProof(inputHashes, outputHashes);
  }
}
