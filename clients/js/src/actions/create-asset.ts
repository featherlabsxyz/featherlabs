import { buildTx, Rpc } from "@lightprotocol/stateless.js";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { FeatherAssetsProgram } from "../program";
import { AssetMetadataArgsV1, AssetV1, RoyaltyArgsV1 } from "../types";

/**
 *
 * @param rpc RPC to use
 * @param assetId Unique Asset Id Or Asset Number Per authority
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
  assetId: number,
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
    assetId,
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
 * @param groupId The Group ID associated with the parent group to which this asset will belong.
 * @param groupAuthority Owner Of Asset
 * @param authority Owner Of Asset
 * @param payerPublicKey Transaction Payer
 * @param metadata Metadata for Asset
 * @param royalty Enforce Royalties On Asset Transfers
 * @param rentable Is Asset Time Based Rentable
 * @param transferrable Is Asset Transferreable or soulbound
 * @returns
 */
export async function createMemberAssetTx(
  rpc: Rpc,
  groupId: number,
  groupAuthority: PublicKey,
  authority: PublicKey,
  payerPublicKey: PublicKey,
  metadata?: AssetMetadataArgsV1,
  royalty?: RoyaltyArgsV1,
  rentable?: boolean,
  transferrable?: boolean
) {
  const ix = await FeatherAssetsProgram.createMemberAssetIx(
    rpc,
    groupAuthority,
    authority,
    groupId,
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
