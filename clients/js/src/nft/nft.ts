import { Rpc } from "@lightprotocol/stateless.js";
import { PublicKey } from "@solana/web3.js";
import { Nft } from ".";
import {
  CreateAssetResult,
  createAssetTx,
  createMemberAssetTx,
  getAssetWithMetadata,
  getMultipleAssetWithMetadata,
} from "../core/asset";
import {
  AssetDataV1,
  AssetMetadataArgsV1,
  AssetV1,
  getAssetAuthorityVariant,
  getAssetState,
  getRoyaltyState,
} from "../types";
/**
 * Creates a transaction for a standalone NFT.
 * @param rpc The RPC client.
 * @param authority The public key of the authority.
 * @param name The name of the NFT.
 * @param imageUri The URI of the NFT image.
 * @param mutable Whether the NFT is mutable (default: true).
 * @param rentable Whether the NFT is rentable.
 * @param transferrable Whether the NFT is transferrable.
 * @param royaltiesInitializable Whether royalties can be initialized for the NFT.
 * @returns A promise that resolves to the `CreateAssetResult`.
 */
export async function createNftAloneTx(
  rpc: Rpc,
  authority: PublicKey,
  name: string,
  imageUri: string,
  // nftAttributes: NftAttributes,
  mutable: boolean = true,
  rentable?: boolean,
  transferrable?: boolean,
  royaltiesInitializable?: boolean
): Promise<CreateAssetResult> {
  // const attributesArray = Object.entries(nftAttributes).map(([key, value]) => ({
  //   key,
  //   value,
  // }));

  const metadata: AssetMetadataArgsV1 = {
    name,
    uri: imageUri,
    mutable,
    // attributes: attributesArray,
    updateAuthority: authority,
  };

  return await createAssetTx(
    rpc,
    authority,
    authority,
    metadata,
    rentable,
    transferrable,
    royaltiesInitializable
  );
}

/**
 * Creates a transaction for an NFT that is a member of a collection.
 * @param rpc The RPC client.
 * @param authority The public key of the authority.
 * @param name The name of the NFT.
 * @param imageUri The URI of the NFT image.
 * @param collection The public key of the collection.
 * @param mutable Whether the NFT is mutable (default: true).
 * @param rentable Whether the NFT is rentable.
 * @param transferrable Whether the NFT is transferrable.
 * @param royaltiesInitializable Whether royalties can be initialized for the NFT.
 * @returns A promise that resolves to the CreateAssetResult.
 */
export async function createNftMemberTx(
  rpc: Rpc,
  authority: PublicKey,
  name: string,
  imageUri: string,
  // nftAttributes: NftAttributes,
  collection: PublicKey,
  mutable: boolean = true,
  rentable?: boolean,
  transferrable?: boolean,
  royaltiesInitializable?: boolean
): Promise<CreateAssetResult> {
  // const attributesArray = Object.entries(nftAttributes).map(([key, value]) => ({
  //   key,
  //   value,
  // }));

  const metadata: AssetMetadataArgsV1 = {
    name,
    uri: imageUri,
    mutable,
    // attributes: attributesArray,
    updateAuthority: authority,
  };

  return await createMemberAssetTx(
    rpc,
    authority,
    authority,
    collection,
    authority,
    metadata,
    rentable,
    transferrable,
    royaltiesInitializable
  );
}
export async function fetchNft(rpc: Rpc, nftAddress: PublicKey): Promise<Nft> {
  const assetWithMetadata = await getAssetWithMetadata(rpc, nftAddress);
  return assetToNft(assetWithMetadata);
}

export async function fetchNfts(
  rpc: Rpc,
  nftAddresses: PublicKey[]
): Promise<Nft[]> {
  const assetsWithMetadata = await getMultipleAssetWithMetadata(
    rpc,
    nftAddresses
  );
  return assetsWithMetadata.map(assetToNft);
}

export function assetToNft({
  asset,
  assetMetadata,
}: {
  asset: AssetV1;
  assetMetadata: AssetDataV1;
}): Nft {
  return {
    name: assetMetadata.name,
    imageUri: assetMetadata.uri,
    mutable: assetMetadata.mutable,
    owner: asset.owner,
    assetAuthortyState: getAssetAuthorityVariant(asset.assetAuthorityState),
    royaltyState: getRoyaltyState(asset.royaltyState),
    assetState: getAssetState(asset.assetState),
    rentable: asset.rentable,
    transferrable: asset.transferable,
    collection: asset.groupMembership ? asset.groupMembership : undefined,
    // attributes: {
    //   symbol: assetMetadata.attributes[0].value,
    //   description: assetMetadata.attributes[1].value,
    //   website: assetMetadata.attributes[2].value,
    //   animationUrl: assetMetadata.attributes[3].value,
    //   ...Object.fromEntries(
    //     assetMetadata.attributes.slice(4).map((attr) => [attr.key, attr.value])
    //   ),
    // },
  };
}
