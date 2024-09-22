import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import {
  createRpc,
  defaultStaticAccountsStruct,
  LightSystemProgram,
  Rpc,
  packNewAddressParams,
  deriveAddress,
  bn,
  defaultTestStateTreeAccounts,
  packCompressedAccounts,
  NewAddressParams,
  getIndexOrAdd,
  buildAndSignTx,
  sendAndConfirmTx,
  hashToBn254FieldSizeBe,
} from "@lightprotocol/stateless.js";
import { Program } from "@coral-xyz/anchor";
import { FeatherAssets } from "../target/types/feather_assets";
import { sha256 } from "@noble/hashes/sha256";

// These tests don't work, run rust tests'
describe("feather_assets", () => {
  // Configure the client to use the local cluster.
  // const provider = anchor.AnchorProvider.env();
  // const wallet = provider.wallet as anchor.Wallet;
  // anchor.setProvider(provider);
  // const rpc: Rpc = createRpc(undefined, undefined, undefined, {
  //   commitment: "confirmed",
  // });
  // const program = anchor.workspace.FeatherAssets as Program<FeatherAssets>;
  // const {
  //   accountCompressionAuthority,
  //   noopProgram,
  //   registeredProgramPda,
  //   accountCompressionProgram,
  // } = defaultStaticAccountsStruct();
  // const {
  //   addressQueue,
  //   addressTree,
  //   merkleTree,
  //   merkleTreeHeight,
  //   nullifierQueue,
  // } = defaultTestStateTreeAccounts();
  // it("Is initialized!", async () => {
  //   let seeds = bn(1201030102121211);
  //   let addressMerkleContext = {
  //     address_merkle_tree_pubkey: addressTree,
  //     address_queue_pubkey: addressQueue,
  //   };
  //   let group_address = await deriveAddressSeed(
  //     new Uint8Array([
  //       ...anchor.utils.bytes.utf8.encode("group"),
  //       ...wallet.publicKey.toBytes(),
  //       ...seeds.toArray("le", 8),
  //     ]),
  //     program.programId,
  //     addressTree
  //   );
  //   let group_data_address = await deriveAddressSeed(
  //     new Uint8Array([...group_address.toBytes()]),
  //     program.programId,
  //     addressTree
  //   );
  //   console.log(seeds.toArray("le", 8));
  //   console.log(addressTree.toBase58());
  //   console.log("group address: ", group_address.toBytes());
  //   const proof = await rpc.getValidityProof(undefined, [
  //     bn(group_address.toBytes()),
  //     bn(group_data_address.toBytes()),
  //   ]);
  //   const group_compressed_output =
  //     LightSystemProgram.createNewAddressOutputState(
  //       Array.from(group_address.toBytes()),
  //       program.programId
  //     );
  //   const group_data_compressed_output =
  //     LightSystemProgram.createNewAddressOutputState(
  //       Array.from(group_data_address.toBytes()),
  //       program.programId
  //     );
  //   const output_compressed_accounts = [
  //     ...group_compressed_output,
  //     ...group_data_compressed_output,
  //   ];
  //   const groupAddressParams: NewAddressParams = {
  //     seed: group_address.toBytes(),
  //     addressMerkleTreeRootIndex:
  //       proof.rootIndices[proof.rootIndices.length - 1],
  //     addressMerkleTreePubkey: proof.merkleTrees[proof.merkleTrees.length - 1],
  //     addressQueuePubkey:
  //       proof.nullifierQueues[proof.nullifierQueues.length - 1],
  //   };
  //   const { remainingAccounts: ra } = packCompressedAccounts(
  //     [],
  //     proof.rootIndices,
  //     output_compressed_accounts
  //   );
  //   const { newAddressParamsPacked, remainingAccounts } = packNewAddressParams(
  //     [groupAddressParams],
  //     ra
  //   );
  //   const ix = await program.methods
  //     .createGroup(
  //       {
  //         addressMerkleContext: {
  //           addressMerkleTreePubkeyIndex:
  //             newAddressParamsPacked[0].addressMerkleTreeAccountIndex,
  //           addressQueuePubkeyIndex:
  //             newAddressParamsPacked[0].addressQueueAccountIndex,
  //         },
  //         addressMerkleTreeRootIndex:
  //           newAddressParamsPacked[0].addressMerkleTreeRootIndex,
  //         inputs: [],
  //         merkleContext: {
  //           leafIndex: 0,
  //           merkleTreePubkeyIndex: getIndexOrAdd(remainingAccounts, merkleTree),
  //           nullifierQueuePubkeyIndex: getIndexOrAdd(
  //             remainingAccounts,
  //             nullifierQueue
  //           ),
  //           queueIndex: undefined,
  //         },
  //         merkleTreeRootIndex: 0,
  //         proof: proof.compressedProof,
  //       },
  //       seeds,
  //       {
  //         maxSize: 10,
  //         metadata: {
  //           attributes: [],
  //           mutable: true,
  //           name: "NAME",
  //           uri: "uri",
  //         },
  //       }
  //     )
  //     .accounts({
  //       signer: wallet.publicKey,
  //       authority: wallet.publicKey,
  //       cpiSigner: PublicKey.findProgramAddressSync(
  //         [Buffer.from("cpi_authority")],
  //         program.programId
  //       )[0],
  //       selfProgram: program.programId,
  //       lightSystemProgram: LightSystemProgram.programId,
  //       accountCompressionAuthority,
  //       noopProgram,
  //       registeredProgramPda,
  //       accountCompressionProgram,
  //       systemProgram: anchor.web3.SystemProgram.programId,
  //     })
  //     .remainingAccounts(
  //       remainingAccounts.map((acc) => ({
  //         isSigner: false,
  //         isWritable: false,
  //         pubkey: acc,
  //       }))
  //     )
  //     .instruction();
  //   const setComputeUnitIx =
  //     anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
  //       units: 1_000_000,
  //     });
  //   const blockhash = await rpc.getLatestBlockhash();
  //   const tx = buildAndSignTx(
  //     [setComputeUnitIx, ix],
  //     wallet.payer,
  //     blockhash.blockhash,
  //     []
  //   );
  //   const signature = await sendAndConfirmTx(rpc, tx, {
  //     commitment: "confirmed",
  //   });
  //   let l = await rpc.getTransaction(signature, {
  //     commitment: "confirmed",
  //     maxSupportedTransactionVersion: 0,
  //   });
  //   console.log("Your transaction signature", signature);
  //   console.log(l.meta.logMessages);
  // });
});

// async function deriveAddressSeed(
//   seeds: Uint8Array,
//   programId: PublicKey,
//   address_merkle_tree: PublicKey
// ): Promise<PublicKey> {
//   let inputs = Buffer.from([
//     ...programId.toBytes(),
//     ...address_merkle_tree.toBytes(),
//     ...seeds,
//   ]);

//   const address = await hashToBn254FieldSizeBe(inputs);
//   return new PublicKey(address[0]);
// }
