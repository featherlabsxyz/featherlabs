import * as anchor from "@coral-xyz/anchor";
import { BN } from "@coral-xyz/anchor";

import { PublicKey, Keypair } from "@solana/web3.js";
import {
  createRpc,
  defaultStaticAccountsStruct,
  LightSystemProgram,
  Rpc,
  packNewAddressParams,
  bn,
  defaultTestStateTreeAccounts,
  packCompressedAccounts,
  NewAddressParams,
  getIndexOrAdd,
  buildAndSignTx,
  sendAndConfirmTx,
  deriveAddress,
  toAccountMetas,
} from "@lightprotocol/stateless.js";
import { Program } from "@coral-xyz/anchor";
import { FeatherAssets } from "../target/types/feather_assets";
import { keccak_256 } from "@noble/hashes/sha3";
// These tests don't work, run rust tests'
describe("feather_assets", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  const wallet = provider.wallet as anchor.Wallet;
  anchor.setProvider(provider);
  const rpc: Rpc = createRpc(undefined, undefined, undefined, {
    commitment: "confirmed",
  });
  const program = anchor.workspace.FeatherAssets as Program<FeatherAssets>;
  const {
    accountCompressionAuthority,
    noopProgram,
    registeredProgramPda,
    accountCompressionProgram,
  } = defaultStaticAccountsStruct();
  const {
    addressQueue,
    addressTree,
    merkleTree,
    merkleTreeHeight,
    nullifierQueue,
  } = defaultTestStateTreeAccounts();
  it("Is initialized!", async () => {
    const derivingKey = new Keypair().publicKey;
    const groupAddressSeed = deriveAddressSeed(
      [derivingKey.toBytes()],
      program.programId
    );
    console.log(new PublicKey(groupAddressSeed));
    const groupAddress = await deriveAddress(groupAddressSeed, addressTree);
    const groupDataAddressSeed = deriveAddressSeed(
      [anchor.utils.bytes.utf8.encode("group_data"), groupAddress.toBytes()],
      program.programId
    );
    const groupDataAddress = await deriveAddress(
      groupDataAddressSeed,
      addressTree
    );
    console.log("group address: ", groupAddress);
    const proof = await rpc.getValidityProof(undefined, [
      bn(groupAddress.toBytes()),
      bn(groupDataAddress.toBytes()),
    ]);
    const group_compressed_output =
      LightSystemProgram.createNewAddressOutputState(
        Array.from(groupAddress.toBytes()),
        program.programId
      );
    const group_data_compressed_output =
      LightSystemProgram.createNewAddressOutputState(
        Array.from(groupDataAddress.toBytes()),
        program.programId
      );
    const output_compressed_accounts = [
      ...group_compressed_output,
      ...group_data_compressed_output,
    ];
    const groupAddressParams: NewAddressParams = {
      seed: groupAddressSeed,
      addressMerkleTreeRootIndex:
        proof.rootIndices[proof.rootIndices.length - 1],
      addressMerkleTreePubkey: proof.merkleTrees[proof.merkleTrees.length - 1],
      addressQueuePubkey:
        proof.nullifierQueues[proof.nullifierQueues.length - 1],
    };
    const groupDataAddressParams: NewAddressParams = {
      seed: groupDataAddressSeed,
      addressMerkleTreeRootIndex:
        proof.rootIndices[proof.rootIndices.length - 1],
      addressMerkleTreePubkey: proof.merkleTrees[proof.merkleTrees.length - 1],
      addressQueuePubkey:
        proof.nullifierQueues[proof.nullifierQueues.length - 1],
    };

    const { remainingAccounts: ra } = packCompressedAccounts(
      [],
      proof.rootIndices,
      output_compressed_accounts
    );
    const { newAddressParamsPacked, remainingAccounts } = packNewAddressParams(
      [groupAddressParams, groupDataAddressParams],
      ra
    );
    const ix = await program.methods
      .createGroup(
        {
          addressMerkleContext: {
            addressMerkleTreePubkeyIndex:
              newAddressParamsPacked[0].addressMerkleTreeAccountIndex,
            addressQueuePubkeyIndex:
              newAddressParamsPacked[0].addressQueueAccountIndex,
          },
          addressMerkleTreeRootIndex:
            newAddressParamsPacked[0].addressMerkleTreeRootIndex,
          inputs: [],
          merkleContext: {
            leafIndex: 0,
            merkleTreePubkeyIndex: getIndexOrAdd(remainingAccounts, merkleTree),
            nullifierQueuePubkeyIndex: getIndexOrAdd(
              remainingAccounts,
              nullifierQueue
            ),
            queueIndex: undefined,
          },
          merkleTreeRootIndex: 0,
          proof: proof.compressedProof,
        },
        derivingKey,
        {
          maxSize: 10,
          metadata: {
            attributes: [],
            mutable: true,
            name: "NAME",
            uri: "uri",
          },
        }
      )
      .accounts({
        payer: wallet.publicKey,
        authority: wallet.publicKey,
        cpiSigner: PublicKey.findProgramAddressSync(
          [Buffer.from("cpi_authority")],
          program.programId
        )[0],
        selfProgram: program.programId,
        lightSystemProgram: LightSystemProgram.programId,
        accountCompressionAuthority,
        noopProgram,
        registeredProgramPda,
        accountCompressionProgram,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .remainingAccounts(toAccountMetas(remainingAccounts))
      .instruction();
    const setComputeUnitIx =
      anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
        units: 1_000_000,
      });
    const blockhash = await rpc.getLatestBlockhash();
    const tx = buildAndSignTx(
      [setComputeUnitIx, ix],
      wallet.payer,
      blockhash.blockhash,
      []
    );

    const signature = await sendAndConfirmTx(rpc, tx, {
      commitment: "confirmed",
      skipPreflight: true,
    });
    let l = await rpc.getTransaction(signature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    });
    console.log("Your transaction signature", signature);
    console.log(l.meta.logMessages);
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
