import { buildTx, Rpc } from "@lightprotocol/stateless.js";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { FeatherAssetsProgram } from "../program";
import { GroupMetadataArgsV1 } from "../types";

/**
 *
 * @param rpc RPC to use
 * @param maxSize Initial Max Size of Group
 * @param groupId GroupId or seed to create multiple groups
 * @param authority Authority of the group
 * @param payerPublicKey Transaction Payer
 * @returns
 */
export async function createGroupTx(
  rpc: Rpc,
  maxSize: number,
  groupId: BN,
  authority: PublicKey,
  payerPublicKey: PublicKey,
  metadata?: GroupMetadataArgsV1
) {
  const ix = await FeatherAssetsProgram.createGroupIx(
    rpc,
    authority,
    groupId,
    { maxSize, metadata: metadata ? metadata : null },
    payerPublicKey
  );
  const { blockhash } = await rpc.getLatestBlockhash();
  const transaction = buildTx([ix], payerPublicKey, blockhash);
  return transaction;
}
