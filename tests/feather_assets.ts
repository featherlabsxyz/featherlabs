import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SendTransactionError } from "@solana/web3.js";
import { createRpc, Rpc, sendAndConfirmTx } from "@lightprotocol/stateless.js";
import { keccak_256 } from "@noble/hashes/sha3";
import {
  addRoyaltyToAsset,
  createGroupTx,
  createMemberAssetTx,
} from "@featherlabs/feather-assets/src/core";
describe("feather_assets", () => {
  const provider = anchor.AnchorProvider.env();
  const wallet = provider.wallet as anchor.Wallet;
  anchor.setProvider(provider);
  const rpc: Rpc = createRpc(undefined, undefined, undefined, {
    commitment: "confirmed",
  });

  let ga: PublicKey;
  let aa: PublicKey;
  it("Create Group", async () => {
    const {
      groupAddress,
      groupDataAddress,
      transaction: tx1,
    } = await createGroupTx(rpc, 100, wallet.publicKey, wallet.publicKey, {
      attributes: [],
      mutable: true,
      name: "a",
      uri: "a",
    });
    tx1.sign([wallet.payer]);
    const sig = await sendAndConfirmTx(rpc, tx1, {
      skipPreflight: true,
      commitment: "confirmed",
    });
    let log = await rpc.getTransaction(sig, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    });
    console.log("Your transaction signature", sig);
    console.log(log.meta.logMessages);
    ga = groupAddress;
  });
  it("Create Member Asset!", async () => {
    try {
      const { assetAddress, assetDataAddress, transaction } =
        await createMemberAssetTx(
          rpc,
          wallet.publicKey,
          wallet.publicKey,
          ga,
          wallet.publicKey,
          {
            attributes: [],
            mutable: true,
            name: "a",
            uri: "a",
          }
        );
      transaction.sign([wallet.payer]);
      const sig = await sendAndConfirmTx(rpc, transaction, {
        commitment: "confirmed",
      });
      let log = await rpc.getTransaction(sig, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
      });
      console.log("Your transaction signature", sig);
      console.log(log.meta.logMessages);
      aa = assetAddress;
    } catch (error) {
      if (error instanceof SendTransactionError) {
        const logs = await error.getLogs(provider.connection);
        console.error("Transaction failed. Logs:", logs);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  });
  it("Add royalties to asset!", async () => {
    try {
      const { royaltyAddress, transaction } = await addRoyaltyToAsset(
        rpc,
        aa,
        wallet.publicKey,
        { basisPoints: 100, creators: [], ruleset: { none: {} } }
      );
      transaction.sign([wallet.payer]);
      const sig = await sendAndConfirmTx(rpc, transaction, {
        commitment: "confirmed",
      });
      let log = await rpc.getTransaction(sig, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
      });
      console.log("Your transaction signature", sig);
      console.log(log.meta.logMessages);
    } catch (error) {
      if (error instanceof SendTransactionError) {
        const logs = await error.getLogs(provider.connection);
        console.error("Transaction failed. Logs:", logs);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  });
});

export function deriveAddressSeed(
  seeds: Uint8Array[],
  programId: PublicKey
): Uint8Array {
  const combinedSeeds: Uint8Array[] = [programId.toBytes(), ...seeds];
  const hash = hashvToBn254FieldSizeBe(combinedSeeds);
  return hash;
}
export function hashvToBn254FieldSizeBe(bytes: Uint8Array[]): Uint8Array {
  const hasher = keccak_256.create();
  for (const input of bytes) {
    hasher.update(input);
  }
  const hash = hasher.digest();
  hash[0] = 0;
  return hash;
}
