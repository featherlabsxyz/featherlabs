import {
  CompressedProofWithContext,
  defaultStaticAccountsStruct as staticAccounts,
  defaultTestStateTreeAccounts as stateTree,
  LightSystemProgram,
  NewAddressParams,
} from "@lightprotocol/stateless.js";
import { PublicKey, SystemProgram } from "@solana/web3.js";

export class FeatherAssetsConstants {
  static readonly programId: PublicKey = new PublicKey(
    "HNyzkDmhZayxRG77bk84oxe13Qp3PcRhd5o5NJEF6E5W"
  );
  static readonly accountCompressionAuthority =
    staticAccounts().accountCompressionAuthority;
  static readonly accountCompressionProgram =
    staticAccounts().accountCompressionProgram;
  static readonly noopProgram = staticAccounts().noopProgram;
  static readonly registeredProgramPda = staticAccounts().registeredProgramPda;
  static readonly addressQueue = stateTree().addressQueue;
  static readonly addressTree = stateTree().addressTree;
  static readonly merkleTree = stateTree().merkleTree;
  static readonly nullifierQueue = stateTree().nullifierQueue;
  static readonly lightSystemProgram = LightSystemProgram.programId;
  static readonly systemProgram = SystemProgram.programId;
  static readonly cpiSigner = PublicKey.findProgramAddressSync(
    [Buffer.from("cpi_authority")],
    this.programId
  )[0];
  static lightAccounts() {
    return {
      cpiSigner: this.cpiSigner,
      selfProgram: this.programId,
      lightSystemProgram: this.lightSystemProgram,
      accountCompressionAuthority: this.accountCompressionAuthority,
      noopProgram: this.noopProgram,
      registeredProgramPda: this.registeredProgramPda,
      accountCompressionProgram: this.accountCompressionProgram,
      systemProgram: this.systemProgram,
    };
  }
  protected static createNewAddressOutputState(address: PublicKey) {
    return LightSystemProgram.createNewAddressOutputState(
      Array.from(address.toBytes()),
      this.programId
    );
  }
  protected static getNewAddressParams(
    addressSeed: Uint8Array,
    proof: CompressedProofWithContext
  ) {
    const addressParams: NewAddressParams = {
      seed: addressSeed,
      addressMerkleTreeRootIndex:
        proof.rootIndices[proof.rootIndices.length - 1],
      addressMerkleTreePubkey: proof.merkleTrees[proof.merkleTrees.length - 1],
      addressQueuePubkey:
        proof.nullifierQueues[proof.nullifierQueues.length - 1],
    };
    return addressParams;
  }
}
