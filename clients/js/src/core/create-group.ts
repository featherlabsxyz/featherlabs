import { buildTx, deriveAddress, Rpc } from "@lightprotocol/stateless.js";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { FeatherAssetsProgram } from "../program";
import { GroupMetadataArgsV1, GroupV1 } from "../types";

/**
 *
 * @param rpc RPC to use
 * @param maxSize Initial Max Size of Group
 * @param authority Authority of the group
 * @param payerPublicKey Transaction Payer
 * @returns
 */
export async function createGroupTx(
  rpc: Rpc,
  maxSize: number,
  authority: PublicKey,
  payerPublicKey: PublicKey,
  metadata?: GroupMetadataArgsV1
) {
  const ix = await FeatherAssetsProgram.createGroupIx(
    rpc,
    authority,
    { maxSize, metadata: metadata ? metadata : null },
    payerPublicKey
  );
  const { blockhash } = await rpc.getLatestBlockhash();
  const transaction = buildTx([ix], payerPublicKey, blockhash);
  return transaction;
}

/**
 *
 * @param rpc Rpc to use
 * @param groupAddress Provide or derive Group Address
 * @returns
 */
export async function getGroup(rpc: Rpc, groupAddress: PublicKey) {
  const groupAccount = await rpc.getCompressedAccount(
    new BN(groupAddress.toBytes())
  );
  if (!groupAccount || !groupAccount.data) {
    throw new Error("Group Account Does Not Exist or Invalid Group Id");
  }
  const group = FeatherAssetsProgram.decodeTypes<GroupV1>(
    "GroupV1",
    groupAccount.data.data
  );
  return group;
}
