import { Rpc } from "@lightprotocol/stateless.js";
import { PublicKey } from "@solana/web3.js";
import { Collection, NftAttributes } from ".";
import {
  createGroupTx,
  getGroupWithMetadata,
  getMultipleGroupsWithMetadata,
} from "../core/group";
import {
  AttributeV1,
  GroupDataV1,
  GroupMetadataArgsV1,
  GroupV1,
} from "../types";

/**
 *
 * @param rpc Rpc to use
 * @param maxSize Initial max size of collection
 * @param authority Authority of collection
 * @param name Collection Name
 * @param imageUri Collection Image URI
 * @param mutable Setting mutable to false will prevent updating group metadata
 * @param nftAttributes Common with additional attributes
 * @returns transaction Sign the transaction using private key or wallet adapter
 */
export async function createCollectionTx(
  rpc: Rpc,
  maxSize: number,
  authority: PublicKey,
  name: string,
  imageUri: string,
  mutable: boolean,
  nftAttributes: NftAttributes
) {
  const attributesArray = Object.entries(nftAttributes).map(([key, value]) => ({
    key,
    value,
  }));

  const metadata: GroupMetadataArgsV1 = {
    name,
    uri: imageUri,
    mutable,
    attributes: attributesArray,
  };
  const transaction = await createGroupTx(
    rpc,
    maxSize,
    authority,
    authority,
    metadata
  );
  return transaction;
}

export async function fetchCollection(
  rpc: Rpc,
  collectionAddress: PublicKey
): Promise<Collection> {
  const { group, groupMetadata } = await getGroupWithMetadata(
    rpc,
    collectionAddress
  );
  return convertGroupToCollection(group, groupMetadata);
}

export async function fetchCollections(
  rpc: Rpc,
  collectionAddresses: PublicKey[]
): Promise<Collection[]> {
  const groupsWithMetadata = await getMultipleGroupsWithMetadata(
    rpc,
    collectionAddresses
  );
  return groupsWithMetadata.map(({ group, groupMetadata }) =>
    convertGroupToCollection(group, groupMetadata)
  );
}

function convertGroupToCollection(
  group: GroupV1,
  groupMetadata: GroupDataV1
): Collection {
  return {
    name: groupMetadata.name,
    imageUri: groupMetadata.uri,
    maxSize: group.maxSize,
    currentSize: group.size,
    mutable: groupMetadata.mutable,
    owner: group.owner,
    attributes: {
      symbol: groupMetadata.attributes[0].value,
      description: groupMetadata.attributes[1].value,
      website: groupMetadata.attributes[2].value,
      animationUrl: groupMetadata.attributes[3].value,
      ...Object.fromEntries(
        groupMetadata.attributes.slice(4).map((attr) => [attr.key, attr.value])
      ),
    },
  };
}
