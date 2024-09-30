import { deriveAddress, Rpc } from "@lightprotocol/stateless.js";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { FeatherAssetsProgram } from "../program";
import { RoyaltyV1 } from "../types";

export async function getRoyalty(
  rpc: Rpc,
  assetAddress: PublicKey
): Promise<RoyaltyV1> {
  const assetRoyaltySeed =
    FeatherAssetsProgram.deriveAssetRoyaltySeed(assetAddress);
  const royaltyAddress = await deriveAddress(assetRoyaltySeed);
  const royaltyAccount = await rpc.getCompressedAccount(
    new BN(royaltyAddress.toBytes())
  );
  if (!royaltyAccount || !royaltyAccount.data) {
    throw new Error("Group Account Does Not Exist or Invalid Group Id");
  }
  const royalty = FeatherAssetsProgram.decodeTypes<RoyaltyV1>(
    "RoyaltyV1",
    royaltyAccount.data.data
  );
  return royalty;
}
