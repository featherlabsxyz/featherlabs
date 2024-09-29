import { PublicKey } from "@solana/web3.js";
import {
  AssetAuthorityVariantV1,
  AttributeV1,
  GroupMembership as CollectionMeta,
} from "../types";

export * from "./collection";

export interface NftAttributes {
  symbol: string;
  description: string;
  website: string;
  animationUrl: string;
  [key: string]: string;
}

export interface Collection {
  name: string;
  imageUri: string;
  mutable: boolean;
  maxSize: number;
  currentSize: number;
  owner: PublicKey;
  attributes: NftAttributes;
}

export interface Nft {
  name: string;
  imageUri: string;
  mutable: boolean;
  owner: PublicKey;
  transferrable: boolean;
  rentable: boolean;
  collection?: CollectionMeta;
  isRoyaltiesEnforced: boolean;
  assetState: "unlocked" | "lockedByDelegate" | "lockedByOwner";
  assetAuthortyState: AssetAuthorityVariantV1;
  attributes: NftAttributes;
}
