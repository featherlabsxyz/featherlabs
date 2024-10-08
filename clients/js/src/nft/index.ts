import { PublicKey } from "@solana/web3.js";
import {
  AssetAuthorityVariantReturn,
  AssetStateType,
  GroupMembership as CollectionMeta,
  RoyaltyStateType,
} from "../types";

export * from "./collection";
export * from "./nft";
export * from "./royalty";

// Collection interface
export interface Collection {
  owner: PublicKey;
  maxSize: number;
  currentSize: number;
  // Metadata
  name: string;
  imageUri: string;
  mutable: boolean;
  // attributes: NftAttributes;
}

// Nft interface
export interface Nft {
  owner: PublicKey;
  transferrable: boolean;
  rentable: boolean;
  collection?: CollectionMeta; // if nft is member of collection
  assetState: AssetStateType;
  assetAuthortyState: AssetAuthorityVariantReturn;
  // Metadata
  name: string;
  imageUri: string;
  mutable: boolean;
  // attributes: NftAttributes;
  // Royalty
  royaltyState: RoyaltyStateType;
}

// Complete Collection Data
export interface CollectionWithNfts {
  collection: Collection;
  nfts: {
    results: Nft[];
    page: number; // per 100 nft
  };
}

// export interface NftAttributes {
//   symbol: string;
//   description: string;
//   website: string;
//   animationUrl: string;
//   [key: string]: string;
// }
