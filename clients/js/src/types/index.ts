import { PublicKey } from "@solana/web3.js";
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
  royalty: RoyaltyArgsV1 | null;
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
export type RuleSetV1 =
  | { none: {} }
  | {
      programAllowList: [PublicKey[]];
    }
  | {
      programDenyList: [PublicKey[]];
    };

export interface CreatorArgsV1 {
  address: PublicKey;
  percentage: number;
}

export enum FeatherErrorCode {
  CustomError = "Custom error message",
  InvalidMaxSize = "Invalid Max Size, there are existing members",
  InvalidGroupSigner = "Unauthorized group signer",
  InvalidAssetSigner = "Unauthorized asset signer",
  ArgumentsNotFound = "No Update Inputs found",
  MemberAssetOverflow = "Max members reached",
  MetadataAccountExistAlready = "Metadata Account Already Exist",
  RoyaltyAccountExistAlready = "Royalty Account Already Exist",
  GroupAccountNotFound = "Group Account Not Found",
}

export const SEED: Uint8Array = Buffer.from("feather_assets");
export const GROUP_DATA_SEED: Uint8Array = Buffer.from("group_data");
export const ASSET_DATA_SEED: Uint8Array = Buffer.from("asset_data");
export const ASSET_ROYALTY_SEED: Uint8Array = Buffer.from("asset_royalty");

export interface AttributeV1 {
  key: string;
  value: string;
}
