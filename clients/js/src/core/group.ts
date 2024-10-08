import { deriveAddress, Rpc } from "@lightprotocol/stateless.js";
import { PublicKey, VersionedTransaction } from "@solana/web3.js";
import BN from "bn.js";
import { FeatherAssetsConstants } from "../constants";
import { FeatherAssetsProgram } from "../program";
import { GroupDataV1, GroupMetadataArgsV1, GroupV1 } from "../types";

export interface CreateGroupResult {
  transaction: VersionedTransaction;
  groupAddress: PublicKey;
  groupDataAddress: PublicKey | null;
}
/**
 *
 * @param rpc RPC to use
 * @param maxSize Initial Max Size of Group
 * @param authority Authority of the group
 * @param payerPublicKey Transaction Payer
 * @param metadata optionally add metadata, or add it later
 * @returns
 */
export async function createGroupTx(
  rpc: Rpc,
  maxSize: number,
  authority: PublicKey,
  payerPublicKey: PublicKey,
  metadata?: GroupMetadataArgsV1
): Promise<CreateGroupResult> {
  const {
    groupAddress,
    groupDataAddress,
    instruction: ix,
  } = await FeatherAssetsProgram.createGroupIx(
    rpc,
    authority,
    { maxSize, metadata: metadata ? metadata : null },
    payerPublicKey
  );
  const transaction = await FeatherAssetsProgram.buildTxWithComputeBudget(
    rpc,
    [ix],
    payerPublicKey
  );
  return { transaction, groupAddress, groupDataAddress };
}

/**
 *
 * @param rpc Rpc to use
 * @param groupAddress Provide or derive Group Address
 * @returns
 */
export async function getGroup(
  rpc: Rpc,
  groupAddress: PublicKey
): Promise<GroupV1> {
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

/**
 *
 * @param rpc Rpc to use
 * @param groupAddresses Array of Group Addresses
 * @returns
 */
export async function getMultipleGroups(
  rpc: Rpc,
  groupAddresses: PublicKey[]
): Promise<GroupV1[]> {
  const accountPromises = groupAddresses.map((address) =>
    rpc.getCompressedAccount(new BN(address.toBytes()))
  );

  const accounts = await Promise.all(accountPromises);

  const groups: GroupV1[] = [];

  for (let i = 0; i < groupAddresses.length; i++) {
    const groupAccount = accounts[i];

    if (!groupAccount || !groupAccount.data) {
      throw new Error(
        `Group Account Does Not Exist or Invalid Group Id for address ${groupAddresses[
          i
        ].toBase58()}`
      );
    }

    groups.push(
      FeatherAssetsProgram.decodeTypes<GroupV1>(
        "GroupV1",
        groupAccount.data.data
      )
    );
  }

  return groups;
}
/**
 *
 * @param rpc Rpc to use
 * @param groupAddress Provide or derive Group Address
 * @returns
 */
export async function getGroupWithMetadata(
  rpc: Rpc,
  groupAddress: PublicKey
): Promise<{ group: GroupV1; groupMetadata: GroupDataV1 }> {
  const result = await getMultipleGroupsWithMetadata(rpc, [groupAddress]);
  return result[0];
}

/**
 *
 * @param rpc Rpc to use
 * @param groupAddresses Array of Group Addresses
 * @returns
 */
export async function getMultipleGroupsWithMetadata(
  rpc: Rpc,
  groupAddresses: PublicKey[]
): Promise<Array<{ group: GroupV1; groupMetadata: GroupDataV1 }>> {
  const groupDataAddresses = await Promise.all(
    groupAddresses.map((address) =>
      deriveAddress(
        FeatherAssetsProgram.deriveGroupDataSeed(address),
        FeatherAssetsConstants.addressTree
      )
    )
  );
  const groupAccountPromises = groupAddresses.map((address) =>
    rpc.getCompressedAccount(new BN(address.toBytes()))
  );
  const groupDataAccountPromises = groupDataAddresses.map((address) =>
    rpc.getCompressedAccount(new BN(address.toBytes()))
  );
  const groupAccounts = await Promise.all(groupAccountPromises);
  const groupDataAccounts = await Promise.all(groupDataAccountPromises);

  const result: Array<{ group: GroupV1; groupMetadata: GroupDataV1 }> = [];

  for (let i = 0; i < groupAddresses.length; i++) {
    const groupAccount = groupAccounts[i];
    const groupDataAccount = groupDataAccounts[i];
    if (!groupAccount || !groupAccount.data) {
      throw new Error(
        `Group Account Does Not Exist or Invalid Group Id for address ${groupAddresses[
          i
        ].toBase58()}`
      );
    }
    if (!groupDataAccount || !groupDataAccount.data) {
      throw new Error(
        `Group Metadata Account Does Not Exist for address ${groupAddresses[
          i
        ].toBase58()}`
      );
    }

    result.push({
      group: FeatherAssetsProgram.decodeTypes<GroupV1>(
        "GroupV1",
        groupAccount.data.data
      ),
      groupMetadata: FeatherAssetsProgram.decodeTypes<GroupDataV1>(
        "GroupDataV1",
        groupDataAccount.data.data
      ),
    });
  }

  return result;
}
