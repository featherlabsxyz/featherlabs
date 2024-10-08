import {
  AssetAuthorityVariantReturn,
  AssetAuthorityVariantV1,
  AssetPrivilege,
  AssetPrivilegeVariantType,
  AssetStateType,
  AssetStateV1,
  RoyaltyState,
  RoyaltyStateType,
} from "./variants";

export function getAssetPrivilegeVariant(
  privilege: AssetPrivilege
): AssetPrivilegeVariantType {
  if ("none" in privilege) return "none";
  if ("all" in privilege) return "all";
  if ("transfer" in privilege) return "transfer";
  if ("burn" in privilege) return "burn";
  if ("freeze" in privilege) return "freeze";
  if ("freezeAndTransfer" in privilege) return "freezeAndTransfer";
  if ("tbf" in privilege) return "tbf";
  if ("assetMetadataPrivilegeAttributes" in privilege)
    return "assetMetadataPrivilegeAttributes";
  if ("allExceptBurn" in privilege) return "allExceptBurn";
  throw new Error("Invalid AssetPrivilege");
}

export function getAssetAuthorityVariant(
  authority: AssetAuthorityVariantV1
): AssetAuthorityVariantReturn {
  if ("owner" in authority) {
    return { type: "owner", data: undefined };
  } else if ("renter" in authority) {
    return { type: "renter", data: authority.renter };
  } else if ("ownerDelegate" in authority) {
    return { type: "ownerDelegate", data: authority.ownerDelegate };
  } else if ("ownerPermanentDelegate" in authority) {
    return {
      type: "ownerPermanentDelegate",
      data: authority.ownerPermanentDelegate,
    };
  } else {
    throw new Error("Invalid AssetAuthorityVariantV1");
  }
}

export function getAssetState(state: AssetStateV1): AssetStateType {
  if ("unlocked" in state) {
    return "unlocked";
  } else if ("lockedByDelegate" in state) {
    return "lockedByDelegate";
  } else if ("lockedByOwner" in state) {
    return "lockedByOwner";
  } else {
    throw new Error("Invalid AssetStateV1");
  }
}

export function getRoyaltyState(state: RoyaltyState): RoyaltyStateType {
  if ("unintialized" in state) {
    return "unintialized";
  } else if ("intialized" in state) {
    return "intialized";
  } else if ("disabled" in state) {
    return "disabled";
  } else if ("freeze" in state) {
    return "freeze";
  } else {
    throw new Error("Invalid RoyaltyState");
  }
}
