import { PublicKey } from "@solana/web3.js";
import { AttributeV1, RuleSetV1 } from ".";
import { CreatorArgsV1 } from "./schema";
export * from "./schema";

export interface CreateGroupArgsV1 {
  maxSize: number;
  metadata: GroupMetadataArgsV1 | null;
}
export interface GroupMetadataArgsV1 {
  name: string;
  uri: string;
  mutable: boolean;
  attributes: AttributeV1[];
}

export interface CreateAssetArgsV1 {
  transferrable: boolean;
  rentable: boolean;
  metadata: AssetMetadataArgsV1 | null;
  royaltiesInitializable: boolean;
}

export interface RoyaltyArgsV1 {
  basisPoints: number;
  creators: CreatorArgsV1[];
  ruleset: RuleSetV1;
}
/**
 * Asset Metadata
 */
export interface AssetMetadataArgsV1 {
  name: string;
  uri: string;
  mutable: boolean;
  /**
   * Custom Additional Attributes
   */
  attributes: AttributeV1[];
}
