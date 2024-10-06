import { Connection, PublicKey, VersionedTransaction } from "@solana/web3.js";
import { createNftTx } from "@featherlabs/feather-assets/src/nft";
import {FeatherAssetsProgram} from "@featherlabs/feather-assets/src";

const RPC_ENDPOINT = "https://api.devnet.solana.com";

export async function createNft(
  authority: PublicKey,
  name: string,
  imageUri: string,
  nftAttributes: {
    symbol: string;
    description: string;
    website: string;
    animationUrl?: string;
    [key: string]: string | undefined;
  },
  collection?: PublicKey,
  mutable: boolean = true,
  rentable?: boolean,
  transferrable?: boolean,
  royaltiesInitializable?: boolean
): Promise<VersionedTransaction> {
  const connection = new Connection(RPC_ENDPOINT, "confirmed");

  // Remove animationUrl if it's not provided or empty
  if (!nftAttributes.animationUrl) {
    delete nftAttributes.animationUrl;
  }

  try {
    // Create a FeatherAssetsProgram instance
    const featherAssetsProgram = new FeatherAssetsProgram(connection);

    const transaction = await createNftTx(
      featherAssetsProgram, // Pass the FeatherAssetsProgram instance instead of connection
      authority,
      name,
      imageUri,
      {
        ...nftAttributes,
        animationUrl: nftAttributes.animationUrl || '',
      },
      collection,
      mutable,
      rentable,
      transferrable,
      royaltiesInitializable
    );

    return transaction;
  } catch (error) {
    console.error("Error creating NFT transaction:", error);
    throw error;
  }
}