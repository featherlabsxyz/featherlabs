import { Program, AnchorProvider, setProvider, BN } from "@coral-xyz/anchor";
import { PublicKey, Keypair, Connection } from "@solana/web3.js";
import {
  useWallet,
  confirmConfig,
  CompressedProofWithContext,
  getIndexOrAdd,
  packNewAddressParams,
  NewAddressParams,
  Rpc,
  deriveAddress,
  packCompressedAccounts,
  CompressedAccount,
  CompressedAccountWithMerkleContext,
  PackedMerkleContext,
  toAccountMetas,
} from "@lightprotocol/stateless.js";
import { FeatherAssets, IDL } from "./idl";
import { CreateAssetArgsV1, CreateGroupArgsV1, GroupV1 } from "./types";
import {
  ASSET_DATA_SEED,
  ASSET_ROYALTY_SEED,
  FeatherAssetsConstants,
  GROUP_DATA_SEED,
} from "./constants";

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
    rpc: Rpc,
    authority: PublicKey,
    params: CreateGroupArgsV1,
    payer: PublicKey
  ) {
    const { maxSize, metadata } = params;
    const derivationKey = new Keypair().publicKey;
    const groupSeed = this.deriveGroupSeed(derivationKey);
    const groupAddress: PublicKey = await deriveAddress(groupSeed);
    const groupDataSeed = metadata && this.deriveGroupDataSeed(groupAddress);
    const groupDataAddress: PublicKey | null =
      groupDataSeed && (await deriveAddress(groupDataSeed));

    const outputAddresses = [];
    outputAddresses.push(groupAddress);
    groupDataAddress && outputAddresses.push(groupDataAddress);

    const proof = await this.getValidityProof(rpc, undefined, outputAddresses);

    const newAddressesParams = [];
    newAddressesParams.push(this.getNewAddressParams(groupSeed, proof));
    groupDataSeed &&
      newAddressesParams.push(this.getNewAddressParams(groupDataSeed, proof));

    const outputCompressedAccounts = [];
    outputCompressedAccounts.push(
      ...this.createNewAddressOutputState(groupAddress)
    );
    groupDataAddress &&
      outputCompressedAccounts.push(
        ...this.createNewAddressOutputState(groupDataAddress)
      );

    const {
      addressMerkleContext,
      addressMerkleTreeRootIndex,
      merkleContext,
      remainingAccounts,
    } = this.pack([], outputCompressedAccounts, newAddressesParams, proof);
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
        derivationKey,
        {
          maxSize: maxSize,
          metadata,
        }
      )
      .accounts({
        payer: payer,
        authority: authority,
        ...this.lightAccounts(),
      })
      .remainingAccounts(toAccountMetas(remainingAccounts))
      .instruction();
    return ix;
  }
  static async createAssetIx(
    rpc: Rpc,
    authority: PublicKey,
    payer: PublicKey,
    params: CreateAssetArgsV1
  ) {
    const { rentable, transferrable, metadata, royalty } = params;
    const derivationKey = new Keypair().publicKey;
    const assetSeed = this.deriveAssetSeed(derivationKey);
    const assetAddress = await deriveAddress(assetSeed);
    const assetDataSeed = metadata && this.deriveAssetDataSeed(assetAddress);
    const assetDataAddress =
      assetDataSeed && (await deriveAddress(assetDataSeed));
    const assetRoyaltySeed =
      royalty && this.deriveAssetRoyaltySeed(assetAddress);
    const assetRoyaltyAddress =
      assetRoyaltySeed && (await deriveAddress(assetRoyaltySeed));

    const outputAddresses = [];
    outputAddresses.push(assetAddress);
    assetDataAddress && outputAddresses.push(assetDataAddress);
    assetRoyaltyAddress && outputAddresses.push(assetRoyaltyAddress);

    const proof = await this.getValidityProof(rpc, undefined, outputAddresses);

    const newAddressesParams = [];
    newAddressesParams.push(this.getNewAddressParams(assetSeed, proof));
    assetDataSeed &&
      newAddressesParams.push(this.getNewAddressParams(assetDataSeed, proof));
    assetRoyaltySeed &&
      newAddressesParams.push(
        this.getNewAddressParams(assetRoyaltySeed, proof)
      );

    const outputCompressedAccounts = [];
    outputCompressedAccounts.push(
      ...this.createNewAddressOutputState(assetAddress)
    );
    assetDataAddress &&
      outputCompressedAccounts.push(
        ...this.createNewAddressOutputState(assetDataAddress)
      );
    assetRoyaltyAddress &&
      outputCompressedAccounts.push(
        ...this.createNewAddressOutputState(assetRoyaltyAddress)
      );
    const {
      addressMerkleContext,
      addressMerkleTreeRootIndex,
      merkleContext,
      remainingAccounts,
    } = this.pack([], outputCompressedAccounts, newAddressesParams, proof);
    const ix = FeatherAssetsProgram.getInstance()
      .program.methods.createAsset(
        {
          addressMerkleContext,
          addressMerkleTreeRootIndex,
          inputs: [],
          merkleContext,
          merkleTreeRootIndex: 0,
          proof: proof.compressedProof,
        },
        derivationKey,
        {
          metadata,
          rentable,
          royalty,
          transferrable,
        }
      )
      .accounts({
        authority,
        payer: payer,
        ...this.lightAccounts(),
      })
      .remainingAccounts(toAccountMetas(remainingAccounts))
      .instruction();
    return ix;
  }
  static async createMemberAssetIx(
    rpc: Rpc,
    groupAuthority: PublicKey,
    authority: PublicKey,
    groupAddress: PublicKey,
    payer: PublicKey,
    params: CreateAssetArgsV1
  ) {
    const { rentable, transferrable, metadata, royalty } = params;
    const groupAccount = await rpc.getCompressedAccount(
      new BN(groupAddress.toBytes())
    );
    if (!groupAccount || !groupAccount.data) {
      throw new Error("Group Account Does Not Exist or Invalid Group Id");
    }
    const group = this.decodeTypes<GroupV1>("GroupV1", groupAccount.data.data);
    if (groupAuthority != group.owner) {
      throw new Error("Invalid Group Authority Public Key");
    }
    const inputCompressedAccounts = [groupAccount];
    const assetDerivationKey = new Keypair().publicKey;
    const assetSeed = this.deriveAssetSeed(assetDerivationKey);
    const assetAddress = await deriveAddress(assetSeed);
    const assetDataSeed = metadata && this.deriveAssetDataSeed(assetAddress);
    const assetDataAddress =
      assetDataSeed && (await deriveAddress(assetDataSeed));
    const assetRoyaltySeed =
      royalty && this.deriveAssetRoyaltySeed(assetAddress);
    const assetRoyaltyAddress =
      assetRoyaltySeed && (await deriveAddress(assetRoyaltySeed));

    const outputAddresses = [];
    outputAddresses.push(groupAddress);
    outputAddresses.push(assetAddress);
    assetDataAddress && outputAddresses.push(assetDataAddress);
    assetRoyaltyAddress && outputAddresses.push(assetRoyaltyAddress);
    const inputAddresses = [groupAddress];
    const proof = await this.getValidityProof(
      rpc,
      inputAddresses,
      outputAddresses
    );

    const newAddressesParams = [];
    newAddressesParams.push(this.getNewAddressParams(assetSeed, proof));
    assetDataSeed &&
      newAddressesParams.push(this.getNewAddressParams(assetDataSeed, proof));
    assetRoyaltySeed &&
      newAddressesParams.push(
        this.getNewAddressParams(assetRoyaltySeed, proof)
      );
    const outputCompressedAccounts = [];
    outputCompressedAccounts.push(
      ...this.createNewAddressOutputState(groupAddress)
    );
    outputCompressedAccounts.push(
      ...this.createNewAddressOutputState(assetAddress)
    );
    assetDataAddress &&
      outputCompressedAccounts.push(
        ...this.createNewAddressOutputState(assetDataAddress)
      );
    assetRoyaltyAddress &&
      outputCompressedAccounts.push(
        ...this.createNewAddressOutputState(assetRoyaltyAddress)
      );
    const {
      addressMerkleContext,
      addressMerkleTreeRootIndex,
      merkleContext,
      remainingAccounts,
    } = this.pack(
      inputCompressedAccounts,
      outputCompressedAccounts,
      newAddressesParams,
      proof
    );
    const ix = FeatherAssetsProgram.getInstance()
      .program.methods.createMemberAsset(
        {
          addressMerkleContext,
          addressMerkleTreeRootIndex,
          inputs: [],
          merkleContext,
          merkleTreeRootIndex: 0,
          proof: proof.compressedProof,
        },
        group.derivationKey,
        assetDerivationKey,
        {
          metadata,
          rentable,
          royalty,
          transferrable,
        }
      )
      .accounts({
        authority,
        payer: payer,
        ...this.lightAccounts(),
      })
      .remainingAccounts(toAccountMetas(remainingAccounts))
      .instruction();
    return ix;
  }
  // ASSET UTILS <--------------------------------------------------------------------->
  static deriveAssetSeed(derivationKey: PublicKey): Uint8Array {
    return this.deriveSeed([derivationKey.toBytes()]);
  }
  static deriveAssetDataSeed(assetAddress: PublicKey): Uint8Array {
    return this.deriveSeed([ASSET_DATA_SEED, assetAddress.toBytes()]);
  }
  static deriveAssetRoyaltySeed(assetAddress: PublicKey): Uint8Array {
    return this.deriveSeed([ASSET_ROYALTY_SEED, assetAddress.toBytes()]);
  }
  // GROUP UTILS <--------------------------------------------------------------------->
  static deriveGroupSeed(derivationKey: PublicKey): Uint8Array {
    return this.deriveSeed([derivationKey.toBytes()]);
  }
  static deriveGroupDataSeed(groupAddress: PublicKey): Uint8Array {
    return this.deriveSeed([GROUP_DATA_SEED, groupAddress.toBytes()]);
  }
  //  <--------------------------------------------------------------------------->
  private static pack(
    inputCompressedAccounts: CompressedAccountWithMerkleContext[],
    outputCompressedAccounts: CompressedAccount[],
    newAddressesParams: NewAddressParams[],
    proof: CompressedProofWithContext
  ) {
    const { remainingAccounts: _remainingAccounts } = packCompressedAccounts(
      inputCompressedAccounts,
      proof.rootIndices,
      outputCompressedAccounts
    );
    const { newAddressParamsPacked, remainingAccounts } = packNewAddressParams(
      newAddressesParams,
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
  static decodeTypes<T>(typeName: string, data: Buffer) {
    return FeatherAssetsProgram.getInstance().program.coder.types.decode<T>(
      typeName,
      data
    );
  }
}
