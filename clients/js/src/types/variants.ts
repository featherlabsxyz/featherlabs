import { PublicKey } from "@solana/web3.js";

export type EmptyVariant = undefined;

// Asset state and privilege types
export type AssetStateV1 =
  | { unlocked: {} }
  | { lockedByDelegate: {} }
  | { lockedByOwner: {} };

export type AssetStateType = "unlocked" | "lockedByDelegate" | "lockedByOwner";
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

export type AssetPrivilegeVariantType =
  | "none"
  | "all"
  | "transfer"
  | "burn"
  | "freeze"
  | "freezeAndTransfer"
  | "tbf"
  | "assetMetadataPrivilegeAttributes"
  | "allExceptBurn";

// Asset authority types
export type RenterVariant = {
  rentTime: number;
  fallbackOwner: PublicKey;
  priviledge: AssetPrivilege;
};

export type OwnerDelegateVariant = {
  timeLock: number | null;
  delegate: PublicKey;
  privilege: AssetPrivilege;
};

export type OwnerPermanentDelegateVariant = {
  delegate: PublicKey;
  privilege: AssetPrivilege;
};

type OwnerVariant = undefined;

export type RoyaltyState =
  | {
      unintialized: {};
    }
  | { initialized: {} }
  | { disabled: {} }
  | { freeze: {} };

export type RoyaltyStateType =
  | "unintialized"
  | "intialized"
  | "disabled"
  | "freeze";
export type AssetAuthorityVariantV1 =
  | { owner: {} }
  | { renter: RenterVariant }
  | { ownerDelegate: OwnerDelegateVariant }
  | { ownerPermanentDelegate: OwnerPermanentDelegateVariant };

export type AssetAuthorityVariantReturn =
  | { type: "owner"; data: OwnerVariant }
  | { type: "renter"; data: RenterVariant }
  | { type: "ownerDelegate"; data: OwnerDelegateVariant }
  | { type: "ownerPermanentDelegate"; data: OwnerPermanentDelegateVariant };

export type RuleSetV1 =
  | { none: {} }
  | { programAllowList: [PublicKey[]] }
  | { programDenyList: [PublicKey[]] };

export type RuleSetType =
  | { type: "none"; data: EmptyVariant }
  | { type: "programAllowList"; data: [PublicKey[]] }
  | { type: "programDenyList"; data: [PublicKey[]] };
