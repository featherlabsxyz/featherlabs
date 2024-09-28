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
  LightSystemProgram,
  createCompressedAccountWithMerkleContext,
} from "@lightprotocol/stateless.js";
import { FeatherAssets, IDL } from "./idl";
import { AssetType, CreateAssetArgsV1, CreateGroupArgsV1 } from "./types";
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
    rpc: Rpc,
    authority: PublicKey,
    groupId: BN,
    params: CreateGroupArgsV1,
    payer: PublicKey
  ) {
    const { maxSize, metadata } = params;

    const groupSeed = this.deriveGroupSeed(groupId);
    const groupDataSeed = metadata && this.deriveGroupDataSeed(groupId);

    const outputAddresses = [];
    const groupAddress: PublicKey = await deriveAddress(groupSeed);
    const groupDataAddress: PublicKey | null =
      groupDataSeed && (await deriveAddress(groupDataSeed));
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
        groupId,
        {
          maxSize: maxSize,
          metadata,
        }
      )
      .accounts({
        signer: payer,
        authority: authority,
        ...this.lightAccounts(),
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
  static async createAssetIx(
    rpc: Rpc,
    authority: PublicKey,
    assetId: BN,
    payer: PublicKey,
    params: CreateAssetArgsV1
  ) {
    const { rentable, transferrable, metadata, royalty } = params;
    const assetSeed = this.deriveAssetSeed({ type: "Alone", seeds: assetId });
    const assetDataSeed =
      metadata && this.deriveAssetDataSeed({ type: "Alone", seeds: assetId });
    const assetRoyaltySeed =
      royalty && this.deriveAssetRoyaltySeed({ type: "Alone", seeds: assetId });

    const assetAddress = await deriveAddress(assetSeed);
    const assetDataAddress =
      assetDataSeed && (await deriveAddress(assetDataSeed));
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
          proof,
        },
        assetId,
        {
          metadata,
          rentable,
          royalty,
          transferrable,
        }
      )
      .accounts({
        authority,
        signer: payer,
        ...this.lightAccounts(),
      })
      .instruction();
    return ix;
  }
  // static async createMemberAssetIx(
  //   rpc: Rpc,
  //   authority: PublicKey,
  //   groupSeed: BN,
  //   memberNumber: number,
  //   payer: PublicKey,
  //   params: CreateAssetArgsV1
  // ) {
  //   const { rentable, transferrable, metadata, royalty } = params;
  //   const groupAddressSeed = this.deriveGroupSeed(groupSeed);
  //   const assetSeed = this.deriveAssetSeed({
  //     type: "Member",
  //     groupSeed,
  //     memberNumber,
  //   });
  //   const assetDataSeed =
  //     metadata &&
  //     this.deriveAssetDataSeed({ type: "Member", groupSeed, memberNumber });
  //   const assetRoyaltySeed =
  //     royalty &&
  //     this.deriveAssetRoyaltySeed({ type: "Member", groupSeed, memberNumber });

  //   const groupAddress = await deriveAddress(groupAddressSeed);
  //   const assetAddress = await deriveAddress(assetSeed);
  //   const assetDataAddress =
  //     assetDataSeed && (await deriveAddress(assetDataSeed));
  //   const assetRoyaltyAddress =
  //     assetRoyaltySeed && (await deriveAddress(assetRoyaltySeed));

  //   const outputAddresses = [];
  //   outputAddresses.push(groupAddress);
  //   outputAddresses.push(assetAddress);
  //   assetDataAddress && outputAddresses.push(assetDataAddress);
  //   assetRoyaltyAddress && outputAddresses.push(assetRoyaltyAddress);
  //   const inputAddresses = [groupAddress];
  //   const proof = await this.getValidityProof(rpc, inputAddresses, outputAddresses);

  //   const newAddressesParams = [];
  //   newAddressesParams.push(this.getNewAddressParams(assetSeed, proof));
  //   assetDataSeed &&
  //     newAddressesParams.push(this.getNewAddressParams(assetDataSeed, proof));
  //   assetRoyaltySeed &&
  //     newAddressesParams.push(
  //       this.getNewAddressParams(assetRoyaltySeed, proof)
  //     );

  //   const outputCompressedAccounts = [];
  //   outputCompressedAccounts.push(
  //   )
  //   outputCompressedAccounts.push(
  //     ...this.createNewAddressOutputState(assetAddress)
  //   );
  //   assetDataAddress &&
  //     outputCompressedAccounts.push(
  //       ...this.createNewAddressOutputState(assetDataAddress)
  //     );
  //   assetRoyaltyAddress &&
  //     outputCompressedAccounts.push(
  //       ...this.createNewAddressOutputState(assetRoyaltyAddress)
  //     );
  //   const {
  //     addressMerkleContext,
  //     addressMerkleTreeRootIndex,
  //     merkleContext,
  //     remainingAccounts,
  //   } = this.pack([], outputCompressedAccounts, newAddressesParams, proof);
  //   const ix = FeatherAssetsProgram.getInstance()
  //     .program.methods.createAsset(
  //       {
  //         addressMerkleContext,
  //         addressMerkleTreeRootIndex,
  //         inputs: [],
  //         merkleContext,
  //         merkleTreeRootIndex: 0,
  //         proof,
  //       },
  //       assetId,
  //       {
  //         metadata,
  //         rentable,
  //         royalty,
  //         transferrable,
  //       }
  //     )
  //     .accounts({
  //       authority,
  //       signer: payer,
  //       ...this.lightAccounts(),
  //     })
  //     .instruction();
  //   return ix;
  // }
  // ASSET UTILS <--------------------------------------------------------------------->
  static deriveAssetSeed(assetType: AssetType) {
    if (assetType.type === "Alone") {
      return new Uint8Array();
    }
    return new Uint8Array();
  }
  static deriveAssetDataSeed(assetType: AssetType) {
    let assetAddress = deriveAddress(new Uint8Array());
    if (assetType.type === "Alone") {
      return new Uint8Array();
    }
    return new Uint8Array();
  }
  static deriveAssetRoyaltySeed(assetType: AssetType) {
    let assetAddress = deriveAddress(new Uint8Array());
    if (assetType.type === "Alone") {
      return new Uint8Array();
    }
    return new Uint8Array();
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
}
