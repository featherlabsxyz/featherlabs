import { deriveAddress, Rpc } from "@lightprotocol/stateless.js";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { FeatherAssetsConstants } from "../constants";
import { FeatherAssetsProgram } from "../program";
import { AssetRoyaltiesV1, RoyaltyArgsV1 } from "../types";

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
): Promise<AssetRoyaltiesV1> {
  const assetRoyaltySeed =
    FeatherAssetsProgram.deriveAssetRoyaltySeed(assetAddress);
  const royaltyAddress = await deriveAddress(
    assetRoyaltySeed,
    FeatherAssetsConstants.addressTree
  );
  console.log(royaltyAddress.toBase58());
  const royaltyAccount = await rpc.getCompressedAccount(
    new BN(royaltyAddress.toBytes())
  );
  if (!royaltyAccount || !royaltyAccount.data) {
    throw new Error("Royalty Account Does Not Exist or Invalid Asset Id");
  }
  const royalty = FeatherAssetsProgram.decodeTypes<AssetRoyaltiesV1>(
    "AssetRoyaltiesV1",
    royaltyAccount.data.data
  );
  return royalty;
}
