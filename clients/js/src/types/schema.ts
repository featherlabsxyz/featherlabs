import { PublicKey } from "@solana/web3.js";
import { AttributeV1 } from ".";
import { AssetAuthorityVariantV1, AssetStateV1, RuleSetV1 } from "./variants";

// Groupinterfaces
export interface GroupV1 {
  owner: PublicKey;
  derivationKey: PublicKey;
  maxSize: number;
  size: number;
  hasMetadata: boolean;
}

export interface GroupDataV1 {
  name: string;
  uri: string;
  mutable: boolean;
  groupKey: PublicKey;
  attributes: AttributeV1[];
}

// Asset interfaces
export interface AssetV1 {
  owner: PublicKey;
  derivationKey: PublicKey;
  assetAuthorityState: AssetAuthorityVariantV1;
  assetState: AssetStateV1;
  groupMembership: GroupMembership | null;
  transferable: boolean;
  rentable: boolean;
  hasRoyalties: boolean;
  hasMetadata: boolean;
  hasMultisig: boolean;
}

export interface GroupMembership {
  groupKey: PublicKey;
  memberNumber: number;
}

export interface AssetDataV1 {
  name: string;
  uri: string;
  mutable: boolean;
  assetKey: PublicKey;
  attributes: AttributeV1[];
  privilegeAttributes: AttributeV1[];
}

// Asset Royalty interfaces
export interface RoyaltyV1 {
  basisPoints: number;
  creators: CreatorArgsV1[];
  ruleset: RuleSetV1;
  assetKey: PublicKey;
}

export interface CreatorArgsV1 {
  address: PublicKey;
  percentage: number;
}
