import { Rpc } from "@lightprotocol/stateless.js";
import { VersionedTransactionResponse } from "@solana/web3.js";
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

export async function calculateNFTMintingCost(
  rpc: Rpc,
  tx: VersionedTransactionResponse
): Promise<number | null> {
  if (!tx || !tx.meta) {
    console.log("Transaction not found");
    return null;
  }

  // 1. Transaction fee
  const txFee = tx.meta.fee / 1e9; // Convert lamports to SOL
  if (!txFee) {
    return null;
  }
  // 2. Rent for new accounts
  let totalRent = 0;
  if (tx.meta?.postBalances && tx.meta.preBalances) {
    for (let i = 0; i < tx.meta.postBalances.length; i++) {
      const rentPaid = (tx.meta.postBalances[i] - tx.meta.preBalances[i]) / 1e9;
      if (rentPaid > 0) {
        totalRent += rentPaid;
      }
    }
  }
  const totalCost = txFee + totalRent;
  return totalCost;
}
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export async function getTransactionWithRetry(rpc: Rpc, signature: string) {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const log = await rpc.getTransaction(signature, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
      });
      if (!log) {
        throw new Error("log undefined");
      }
      return log;
    } catch (error) {
      retries++;
      if (retries >= MAX_RETRIES) {
        throw error; // Rethrow the error if we've exhausted all retries
      }
      console.log(`Attempt ${retries} failed. Retrying in ${RETRY_DELAY}ms...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
}
