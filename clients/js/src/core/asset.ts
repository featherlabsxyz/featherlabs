import { deriveAddress, Rpc } from "@lightprotocol/stateless.js";
import { PublicKey, VersionedTransaction } from "@solana/web3.js";
import BN from "bn.js";
import { FeatherAssetsConstants } from "../constants";
import { FeatherAssetsProgram } from "../program";
import { AssetDataV1, AssetMetadataArgsV1, AssetV1 } from "../types";

export interface CreateAssetResult {
  transaction: VersionedTransaction;
  assetAddress: PublicKey;
  assetDataAddress: PublicKey | null;
}
/**
 *
 * @param rpc RPC to use
 * @param authority Owner Of Asset
 * @param payerPublicKey Transaction Payer
 * @param metadata Metadata for Asset
 * @param rentable Is Asset Time Based Rentable
 * @param transferrable Is Asset Transferreable or soulbound
 * @param royaltiesInitializable If false royalties can't be initialized
 * @returns
 */
export async function createAssetTx(
  rpc: Rpc,
  authority: PublicKey,
  payerPublicKey: PublicKey,
  metadata?: AssetMetadataArgsV1,
  rentable: boolean = true,
  transferrable: boolean = true,
  royaltiesInitializable: boolean = true
): Promise<CreateAssetResult> {
  const {
    assetAddress,
    assetDataAddress,
    instruction: ix,
  } = await FeatherAssetsProgram.createAssetIx(rpc, authority, payerPublicKey, {
    metadata: metadata ? metadata : null,
    royaltiesInitializable,
    rentable,
    transferrable,
  });

  const transaction = await FeatherAssetsProgram.buildTxWithComputeBudget(
    rpc,
    [ix],
    payerPublicKey
  );

  return {
    assetAddress,
    assetDataAddress,
    transaction,
  };
}

/**
 * Need both payer and groupAuthority to sign the transaction.
 * @param rpc RPC to use
 * @param groupAuthority Owner Of Group
 * @param authority Owner Of Asset
 * @param payerPublicKey Transaction Payer
 * @param metadata Metadata for Asset
 * @param rentable Is Asset Time Based Rentable
 * @param transferrable Is Asset Transferreable or soulbound
 * @param royaltiesInitializable If false royalties can't be initialized
 * @returns
 */
export async function createMemberAssetTx(
  rpc: Rpc,
  groupAuthority: PublicKey,
  authority: PublicKey,
  groupAddress: PublicKey,
  payerPublicKey: PublicKey,
  metadata?: AssetMetadataArgsV1,
  rentable: boolean = true,
  transferrable: boolean = true,
  royaltiesInitializable: boolean = true
): Promise<CreateAssetResult> {
  const { assetAddress, assetDataAddress, instruction } =
    await FeatherAssetsProgram.createMemberAssetIx(
      rpc,
      groupAuthority,
      authority,
      groupAddress,
      payerPublicKey,
      {
        metadata: metadata ? metadata : null,
        royaltiesInitializable,
        rentable,
        transferrable,
      }
    );
  const transaction = await FeatherAssetsProgram.buildTxWithComputeBudget(
    rpc,
    [instruction],
    payerPublicKey
  );
  return {
    transaction,
    assetAddress,
    assetDataAddress,
  };
}

export async function getAsset(rpc: Rpc, assetAddress: PublicKey) {
  const assetAccount = await rpc.getCompressedAccount(
    new BN(assetAddress.toBytes())
  );
  if (!assetAccount || !assetAccount.data) {
    throw new Error("Group Account Does Not Exist or Invalid Group Id");
  }
  const asset = FeatherAssetsProgram.decodeTypes<AssetV1>(
    "AssetV1",
    assetAccount.data.data
  );
  return asset;
}

export async function getAssets(rpc: Rpc, assetAddresses: PublicKey[]) {
  const assetAccounts = await Promise.all(
    assetAddresses.map((address) =>
      rpc.getCompressedAccount(new BN(address.toBytes()))
    )
  );

  return assetAccounts.map((account, index) => {
    if (!account || !account.data) {
      throw new Error(
        `Group Account Does Not Exist or Invalid Group Id for address ${assetAddresses[
          index
        ].toBase58()}`
      );
    }
    return FeatherAssetsProgram.decodeTypes<AssetV1>(
      "AssetV1",
      account.data.data
    );
  });
}

export async function getAssetWithMetadata(
  rpc: Rpc,
  assetAddress: PublicKey
): Promise<{ asset: AssetV1; assetMetadata: AssetDataV1 }> {
  const response = await getMultipleAssetWithMetadata(rpc, [assetAddress]);
  return response[0];
}
export async function getMultipleAssetWithMetadata(
  rpc: Rpc,
  assetAddresses: PublicKey[]
): Promise<Array<{ asset: AssetV1; assetMetadata: AssetDataV1 }>> {
  const assetDataAddresses = await Promise.all(
    assetAddresses.map((address) =>
      deriveAddress(
        FeatherAssetsProgram.deriveAssetDataSeed(address),
        FeatherAssetsConstants.addressTree
      )
    )
  );
  const assetAccountPromises = assetAddresses.map((address) =>
    rpc.getCompressedAccount(new BN(address.toBytes()))
  );
  const assetDataAccountPromises = assetDataAddresses.map((address) =>
    rpc.getCompressedAccount(new BN(address.toBytes()))
  );
  const assetAccounts = await Promise.all(assetAccountPromises);
  const assetDataAccounts = await Promise.all(assetDataAccountPromises);

  const result: Array<{ asset: AssetV1; assetMetadata: AssetDataV1 }> = [];
  for (let i = 0; i < assetAddresses.length; i++) {
    const assetAccount = assetAccounts[i];
    const assetDataAccount = assetDataAccounts[i];

    if (!assetAccount || !assetAccount.data) {
      throw new Error(
        `Asset Account Does Not Exist or Invalid Asset Id for address ${assetAddresses[
          i
        ].toBase58()}`
      );
    }
    if (!assetDataAccount || !assetDataAccount.data) {
      throw new Error(
        `Asset Metadata Account Does Not Exist for address ${assetAddresses[
          i
        ].toBase58()}`
      );
    }

    result.push({
      asset: FeatherAssetsProgram.decodeTypes<AssetV1>(
        "AssetV1",
        assetAccount.data.data
      ),
      assetMetadata: FeatherAssetsProgram.decodeTypes<AssetDataV1>(
        "AssetDataV1",
        assetDataAccount.data.data
      ),
    });
  }
  return result;
}
