import { buildTx, Rpc } from "@lightprotocol/stateless.js";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { FeatherAssetsProgram } from "../program";
import { AssetMetadataArgsV1, RoyaltyArgsV1 } from "../types";

/**
 *
 * @param rpc RPC to use
 * @param assetId Unique Asset Id
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
  assetId: BN,
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
 *
 * @param rpc RPC to use
 * @param groupId The Group ID associated with the parent group to which this asset will belong.
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
  assetId: BN,
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
