import { Rpc } from "@lightprotocol/stateless.js";
import { PublicKey, VersionedTransaction } from "@solana/web3.js";
import { Nft, NftAttributes } from ".";
import {
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
  RoyaltyArgsV1,
} from "../types";

export async function createNftTx(
  rpc: Rpc,
  authority: PublicKey,
  name: string,
  imageUri: string,
  nftAttributes: NftAttributes,
  collection?: PublicKey,
  mutable: boolean = true,
  rentable?: boolean,
  transferrable?: boolean,
  royaltiesInitializable?: boolean
): Promise<VersionedTransaction> {
  const attributesArray = Object.entries(nftAttributes).map(([key, value]) => ({
    key,
    value,
  }));

  const metadata: AssetMetadataArgsV1 = {
    name,
    uri: imageUri,
    mutable,
    attributes: attributesArray,
  };
  let transaction;
  if (collection) {
    transaction = await createMemberAssetTx(
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
  transaction = await createAssetTx(
    rpc,
    authority,
    authority,
    metadata,
    rentable,
    transferrable,
    royaltiesInitializable
  );
  return transaction;
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
    assetState: getAssetState(asset.assetState),
    rentable: asset.rentable,
    transferrable: asset.transferable,
    collection: asset.groupMembership ? asset.groupMembership : undefined,
    hasRoyalties: asset.hasRoyalties,
    attributes: {
      symbol: assetMetadata.attributes[0].value,
      description: assetMetadata.attributes[1].value,
      website: assetMetadata.attributes[2].value,
      animationUrl: assetMetadata.attributes[3].value,
      ...Object.fromEntries(
        assetMetadata.attributes.slice(4).map((attr) => [attr.key, attr.value])
      ),
    },
  };
}
