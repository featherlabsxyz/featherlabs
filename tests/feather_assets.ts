import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SendTransactionError } from "@solana/web3.js";
import { createRpc, Rpc, sendAndConfirmTx } from "@lightprotocol/stateless.js";
import { keccak_256 } from "@noble/hashes/sha3";
import {
  addRoyaltyToAsset,
  createGroupTx,
  createMemberAssetTx,
  getAsset,
  getRoyalty,
} from "@featherlabs/feather-assets/src/core";
import { calculateNFTMintingCost } from "@featherlabs/feather-assets/src/types/utils";
import {
  createCollectionTx,
  createNftMemberTx,
  fetchCollection,
  fetchNft,
} from "@featherlabs/feather-assets/src/nft";
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
    } = await createCollectionTx(
      rpc,
      100,
      wallet.publicKey,
      "name",
      "uri",
      true
      // {
      //   animationUrl: "asasasasasasasasasasasasasasasasasas",
      //   description: "ad",
      //   symbol: "aadd",
      //   website: "daada",
      // }
    );
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
    console.log(await fetchCollection(rpc, groupAddress));
  });
  // return;
  it("Create Member Asset!", async () => {
    try {
      const initialBalance = await rpc.getBalance(wallet.publicKey);
      const { assetAddress, assetDataAddress, transaction } =
        await createNftMemberTx(
          rpc,
          wallet.publicKey,
          "aasadadaaasadadaaasadadaaasadadaaasadadaaasadadaaasadadaaasadada",
          "uri",
          // {
          //   animationUrl: "as",
          //   description: "ad",
          //   symbol: "aadd",
          //   website: "daada",
          // },
          ga,
          true,
          true,
          true,
          true
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
      // Wait for a moment to ensure the balance is updated
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Get final balance
      const finalBalance = await rpc.getBalance(wallet.publicKey);
      const costInLamports = initialBalance - finalBalance;
      const costInSOL = costInLamports / 1e9;

      console.log(`Initial balance: ${initialBalance / 1e9} SOL`);
      console.log(`Final balance: ${finalBalance / 1e9} SOL`);
      console.log(`Total minting cost: ${costInSOL} SOL`);
      console.log(`Transaction signature: ${sig}`);

      console.log(await fetchNft(rpc, assetAddress));
      const cost = await calculateNFTMintingCost(rpc, log);
      console.log(cost);
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
        {
          basisPoints: 100,
          creators: [],
          ruleset: { none: {} },
          updateAuthority: wallet.publicKey,
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
      console.log(await getRoyalty(rpc, aa));
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
