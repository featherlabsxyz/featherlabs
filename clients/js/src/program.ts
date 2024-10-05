import { Program, AnchorProvider, setProvider, BN } from "@coral-xyz/anchor";
import {
  PublicKey,
  Keypair,
  Connection,
  VersionedTransaction,
  TransactionInstruction,
  ComputeBudgetProgram,
} from "@solana/web3.js";
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
  bn,
  buildTx,
} from "@lightprotocol/stateless.js";
import { FeatherAssets, IDL } from "./idl";
import {
  AssetV1,
  CreateAssetArgsV1,
  CreateGroupArgsV1,
  GroupV1,
} from "./types";
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
    const groupAddress: PublicKey = await deriveAddress(
      groupSeed,
      this.addressTree
    );
    console.log(groupAddress);
    const groupDataSeed = metadata && this.deriveGroupDataSeed(groupAddress);
    const groupDataAddress: PublicKey | null =
      groupDataSeed && (await deriveAddress(groupDataSeed, this.addressTree));

    const newUniqueAddresses: PublicKey[] = [];
    newUniqueAddresses.push(groupAddress);
    groupDataAddress && newUniqueAddresses.push(groupDataAddress);
    console.log(newUniqueAddresses);
    const proof = await this.getValidityProof(
      rpc,
      undefined,
      newUniqueAddresses
    );

    const newAddressesParams: NewAddressParams[] = [];
    newAddressesParams.push(this.getNewAddressParams(groupSeed, proof));
    groupDataSeed &&
      newAddressesParams.push(this.getNewAddressParams(groupDataSeed, proof));

    const outputCompressedAccounts: CompressedAccount[] = [];
    outputCompressedAccounts.push(
      ...this.createNewAddressOutputState(groupAddress)
    );
    groupDataAddress &&
      outputCompressedAccounts.push(
        ...this.createNewAddressOutputState(groupDataAddress)
      );
    console.log(
      newUniqueAddresses.length,
      outputCompressedAccounts.length,
      newAddressesParams.length
    );
    const {
      addressMerkleContext,
      addressMerkleTreeRootIndex,
      merkleContext,
      remainingAccounts,
    } = this.packNew(outputCompressedAccounts, newAddressesParams, proof);
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
    return {
      instruction: ix,
      groupAddress,
      groupDataAddress,
    };
  }
  static async createAssetIx(
    rpc: Rpc,
    authority: PublicKey,
    payer: PublicKey,
    params: CreateAssetArgsV1
  ) {
    const { rentable, transferrable, metadata, royaltiesInitializable } =
      params;
    const derivationKey = new Keypair().publicKey;
    const assetSeed = this.deriveAssetSeed(derivationKey);
    const assetAddress = await deriveAddress(assetSeed, this.addressTree);
    console.log(assetAddress);
    const assetDataSeed = metadata && this.deriveAssetDataSeed(assetAddress);
    const assetDataAddress =
      assetDataSeed && (await deriveAddress(assetDataSeed, this.addressTree));
    const newUniqueAddresses = [];
    newUniqueAddresses.push(assetAddress);
    assetDataAddress && newUniqueAddresses.push(assetDataAddress);

    const proof = await this.getValidityProof(
      rpc,
      undefined,
      newUniqueAddresses
    );

    const newAddressesParams = [];
    newAddressesParams.push(this.getNewAddressParams(assetSeed, proof));
    assetDataSeed &&
      newAddressesParams.push(this.getNewAddressParams(assetDataSeed, proof));

    const outputCompressedAccounts = [];
    outputCompressedAccounts.push(
      ...this.createNewAddressOutputState(assetAddress)
    );
    assetDataAddress &&
      outputCompressedAccounts.push(
        ...this.createNewAddressOutputState(assetDataAddress)
      );
    const {
      addressMerkleContext,
      addressMerkleTreeRootIndex,
      merkleContext,
      remainingAccounts,
    } = this.packNew(outputCompressedAccounts, newAddressesParams, proof);
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
          transferrable,
          royaltiesInitializable,
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
    const { rentable, transferrable, metadata, royaltiesInitializable } =
      params;
    const groupAccount = await rpc.getCompressedAccount(
      new BN(groupAddress.toBytes())
    );
    if (!groupAccount || !groupAccount.data) {
      throw new Error("Group Account Does Not Exist or Invalid Group Id");
    }
    const group = this.decodeTypes<GroupV1>("GroupV1", groupAccount.data.data);
    if (groupAuthority.toBase58() != group.owner.toBase58()) {
      throw new Error("Invalid Group Authority Public Key");
    }
    const inputCompressedAccounts = [groupAccount];
    const assetDerivationKey = new Keypair().publicKey;
    const assetSeed = this.deriveAssetSeed(assetDerivationKey);
    const assetAddress = await deriveAddress(assetSeed, this.addressTree);
    const assetDataSeed = metadata && this.deriveAssetDataSeed(assetAddress);
    const assetDataAddress =
      assetDataSeed && (await deriveAddress(assetDataSeed, this.addressTree));

    const newUniqueAddresses = [];
    newUniqueAddresses.push(assetAddress);
    assetDataAddress && newUniqueAddresses.push(assetDataAddress);
    const inputleafhashes = [bn(groupAccount.hash)];
    const proof = await this.getValidityProof(
      rpc,
      inputleafhashes,
      newUniqueAddresses
    );
    const newAddressesParams = [];
    newAddressesParams.push(this.getNewAddressParams(assetSeed, proof));
    assetDataSeed &&
      newAddressesParams.push(this.getNewAddressParams(assetDataSeed, proof));
    const outputCompressedAccounts = [];
    outputCompressedAccounts.push(
      ...this.createNewAddressOutputState(assetAddress)
    );
    assetDataAddress &&
      outputCompressedAccounts.push(
        ...this.createNewAddressOutputState(assetDataAddress)
      );
    const {
      addressMerkleContext,
      addressMerkleTreeRootIndex,
      merkleContext,
      remainingAccounts,
    } = this.packWithInput(
      inputCompressedAccounts,
      outputCompressedAccounts,
      newAddressesParams,
      proof
    );
    console.log(addressMerkleContext);
    console.log(addressMerkleTreeRootIndex);
    console.log(merkleContext);
    console.log(proof.rootIndices[0]);
    const ix = FeatherAssetsProgram.getInstance()
      .program.methods.createMemberAsset(
        {
          addressMerkleContext,
          addressMerkleTreeRootIndex,
          inputs: [groupAccount.data.data],
          merkleContext,
          merkleTreeRootIndex: proof.rootIndices[0],
          proof: proof.compressedProof,
        },
        group.derivationKey,
        assetDerivationKey,
        {
          metadata,
          rentable,
          royaltiesInitializable,
          transferrable,
        }
      )
      .accounts({
        authority,
        groupAuthority: authority,
        payer: payer,
        ...this.lightAccounts(),
      })
      .remainingAccounts(toAccountMetas(remainingAccounts))
      .instruction();
    return ix;
  }
  static async addRoyalties(
    rpc: Rpc,
    assetAddress: PublicKey,
    assetAuthority: PublicKey
  ) {
    const assetAccountPromise = rpc.getCompressedAccount(
      bn(assetAddress.toBytes())
    );
    const royaltySeed = this.deriveAssetRoyaltySeed(assetAddress);
    const royaltyAddress = await deriveAddress(royaltySeed, this.addressTree);
    const royaltyAccountPromise = rpc.getCompressedAccount(
      bn(royaltyAddress.toBytes())
    );
    const [royaltyAccount, assetAccount] = await Promise.all([
      royaltyAccountPromise,
      assetAccountPromise,
    ]);
    if (royaltyAccount) {
      throw new Error("Royalty Account Already Exist");
    }
    if (!assetAccount || !assetAccount.data) {
      throw new Error("Asset Account Does Not Exist or Invalid Asset Address");
    }
    const asset = this.decodeTypes<AssetV1>("AssetV1", assetAccount.data.data);
    if (assetAuthority.toBase58() != asset.owner.toBase58()) {
      throw new Error("Invalid Asset Authority Public Key");
    }
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
  private static packWithInput(
    inputCompressedAccounts: CompressedAccountWithMerkleContext[],
    outputCompressedAccounts: CompressedAccount[],
    newAddressesParams: NewAddressParams[],
    proof: CompressedProofWithContext
  ) {
    const {
      remainingAccounts: _remainingAccounts,
      packedInputCompressedAccounts,
    } = packCompressedAccounts(
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
    const merkleContext = packedInputCompressedAccounts[0].merkleContext;
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
  private static packNew(
    outputCompressedAccounts: CompressedAccount[],
    newAddressesParams: NewAddressParams[],
    proof: CompressedProofWithContext
  ) {
    const { remainingAccounts: _remainingAccounts } = packCompressedAccounts(
      [],
      proof.rootIndices,
      outputCompressedAccounts
    );
    const { newAddressParamsPacked, remainingAccounts } = packNewAddressParams(
      newAddressesParams,
      _remainingAccounts
    );
    let merkleContext: PackedMerkleContext = {
      leafIndex: 0,
      merkleTreePubkeyIndex: getIndexOrAdd(remainingAccounts, this.merkleTree),
      nullifierQueuePubkeyIndex: getIndexOrAdd(
        remainingAccounts,
        this.nullifierQueue
      ),
      queueIndex: null,
    };
    let {
      addressMerkleTreeAccountIndex,
      addressMerkleTreeRootIndex,
      addressQueueAccountIndex,
    } = newAddressParamsPacked[0];
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
    inputHashes?: BN[],
    newUniqueAddresses?: PublicKey[]
  ) {
    const outputHashes = newUniqueAddresses?.map((addr) => bn(addr.toBytes()));
    return await rpc.getValidityProof(inputHashes, outputHashes);
  }
  static decodeTypes<T>(typeName: string, data: Buffer) {
    return FeatherAssetsProgram.getInstance().program.coder.types.decode<T>(
      typeName,
      data
    );
  }
  static async buildTxWithComputeBudget(
    rpc: Rpc,
    instructions: TransactionInstruction[],
    payerPubkey: PublicKey
  ): Promise<VersionedTransaction> {
    const setComputeUnitIx = ComputeBudgetProgram.setComputeUnitLimit({
      units: 1_000_000,
    });
    instructions.unshift(setComputeUnitIx);
    const { blockhash } = await rpc.getLatestBlockhash();
    const transaction = buildTx(instructions, payerPubkey, blockhash);
    return transaction;
  }
}
