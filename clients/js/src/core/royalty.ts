import { deriveAddress, Rpc } from "@lightprotocol/stateless.js";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { FeatherAssetsProgram } from "../program";
import { RoyaltyArgsV1, RoyaltyV1 } from "../types";

/**
 * Adds a royalty to an asset.
 *
 * @param rpc - The RPC client used for communication with the blockchain.
 * @param assetAddress - The public key of the asset to which the royalty will be added.
 * @param assetAuthority - The public key of the authority controlling the asset.
 * @param args - The arguments for the royalty to be added, of type RoyaltyArgsV1.
 * @returns A promise that resolves to an object containing the transaction and the royalty address.
 */
export async function addRoyaltyToAsset(
  rpc: Rpc,
  assetAddress: PublicKey,
  assetAuthority: PublicKey,
  args: RoyaltyArgsV1
) {
  const { royaltyAddress, instruction: ix } =
    await FeatherAssetsProgram.addRoyalties(
      rpc,
      assetAddress,
      assetAuthority,
      args
    );
  const transaction = await FeatherAssetsProgram.buildTxWithComputeBudget(
    rpc,
    [ix],
    assetAuthority
  );
  return { transaction, royaltyAddress };
}
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
