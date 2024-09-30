import { buildTx, deriveAddress, Rpc } from "@lightprotocol/stateless.js";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { FeatherAssetsProgram } from "../program";
import {
  AssetDataV1,
  AssetMetadataArgsV1,
  AssetV1,
  RoyaltyArgsV1,
} from "../types";

/**
 *
 * @param rpc RPC to use
 * @param authority Owner Of Asset
 * @param payerPublicKey Transaction Payer
 * @param metadata Metadata for Asset
 * @param rentable Is Asset Time Based Rentable
 * @param transferrable Is Asset Transferreable or soulbound
 * @param royalty Enforce Royalties On Asset Transfers
 * @returns
 */
export async function createAssetTx(
  rpc: Rpc,
  authority: PublicKey,
  payerPublicKey: PublicKey,
  metadata?: AssetMetadataArgsV1,
  rentable?: boolean,
  transferrable?: boolean,
  royalty?: RoyaltyArgsV1
) {
  const ix = await FeatherAssetsProgram.createAssetIx(
    rpc,
    authority,
    payerPublicKey,
    {
      metadata: metadata ? metadata : null,
      royalty: royalty ? royalty : null,
      rentable: rentable !== undefined ? rentable : true,
      transferrable: transferrable !== undefined ? transferrable : true,
    }
  );
  const { blockhash } = await rpc.getLatestBlockhash();
  const transaction = buildTx([ix], payerPublicKey, blockhash);
  return transaction;
}

/**
 * Need both payer and groupAuthority to sign the transaction.
 * @param rpc RPC to use
 * @param groupAuthority Owner Of Asset
 * @param authority Owner Of Asset
 * @param payerPublicKey Transaction Payer
 * @param metadata Metadata for Asset
 * @param rentable Is Asset Time Based Rentable
 * @param transferrable Is Asset Transferreable or soulbound
 * @param royalty Enforce Royalties On Asset Transfers
 * @returns
 */
export async function createMemberAssetTx(
  rpc: Rpc,
  groupAuthority: PublicKey,
  authority: PublicKey,
  groupAddress: PublicKey,
  payerPublicKey: PublicKey,
  metadata?: AssetMetadataArgsV1,
  rentable?: boolean,
  transferrable?: boolean,
  royalty?: RoyaltyArgsV1
) {
  const ix = await FeatherAssetsProgram.createMemberAssetIx(
    rpc,
    groupAuthority,
    authority,
    groupAddress,
    payerPublicKey,
    {
      metadata: metadata ? metadata : null,
      royalty: royalty ? royalty : null,
      rentable: rentable !== undefined ? rentable : true,
      transferrable: transferrable !== undefined ? transferrable : true,
    }
  );
  const { blockhash } = await rpc.getLatestBlockhash();
  const transaction = buildTx([ix], payerPublicKey, blockhash);
  return transaction;
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
      deriveAddress(FeatherAssetsProgram.deriveAssetDataSeed(address))
    )
  );
  const accounts = await rpc.getMultipleCompressedAccounts([
    ...assetAddresses.map((addr) => new BN(addr.toBytes())),
    ...assetDataAddresses.map((addr) => new BN(addr.toBytes())),
  ]);
  const result: Array<{ asset: AssetV1; assetMetadata: AssetDataV1 }> = [];
  for (let i = 0; i < assetAddresses.length; i++) {
    const assetAccount = accounts[i];
    const assetDataAccount = accounts[i + assetAddresses.length];

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
