import { PublicKey } from "@solana/web3.js";
export interface GroupV1 {
  address: PublicKey;
  maxSize: number;
  size: number;
  owner: PublicKey;
  hasMetadata: boolean;
}
export interface GroupMembership {
  groupKey: PublicKey;
  memberNumber: number;
}
export type AssetStateV1 =
  | { unlocked: {} }
  | { lockedByDelegate: {} }
  | { lockedByOwner: {} };

export type AssetPrivilege =
  | { none: {} }
  | { all: {} }
  | { transfer: {} }
  | { burn: {} }
  | { freeze: {} }
  | { freezeAndTransfer: {} }
  | { tbf: {} }
  | { assetMetadataPrivilegeAttributes: {} }
  | { allExceptBurn: {} };
export type AssetAuthorityVariantV1 =
  | {
      owner: {};
    }
  | {
      renter: {
        rentTime: number;
        fallbackOwner: PublicKey;
        priviledge: AssetPrivilege;
      };
    }
  | {
      ownerDelegate: {
        timeLock: number | null;
        delegate: PublicKey;
        privilege: AssetPrivilege;
      };
    }
  | {
      ownerPermanentDelegate: {
        delegate: PublicKey;
        privilege: AssetPrivilege;
      };
    };
export interface AssetV1 {
  owner: PublicKey;
  assetAuthorityState: AssetAuthorityVariantV1;
  assetState: AssetStateV1;
  address: PublicKey;
  groupMembership: GroupMembership | null;
  transferable: boolean;
  rentable: boolean;
  hasRoyalties: boolean;
  hasMetadata: boolean;
  hasMultisig: boolean;
}
