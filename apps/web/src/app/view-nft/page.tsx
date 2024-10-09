"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PublicKey } from "@solana/web3.js";
import { fetchNft, Nft } from "@featherlabs/feather-assets/src/nft";
import { createRpc, Rpc } from "@lightprotocol/stateless.js";
import { toast } from "sonner";

const endpoint =
  "https://devnet.helius-rpc.com/?api-key=2a3681db-784a-40fb-9c8d-8fcab42275f8";

const rpc: Rpc = createRpc(endpoint, endpoint, endpoint, {
  commitment: "confirmed",
});
export default function ViewNFT() {
  const [address, setAddress] = useState<PublicKey | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      if (!address) {
        setError("Set Address Please");
        return;
      }
      setError("");
      const fetchedNft = await fetchNft(rpc, address);
      toast.info(JSON.stringify(fetchedNft));
      setError("Failed to fetch NFT. Please check the address and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Input
          type="text"
          placeholder="Enter NFT Address"
          onChange={(e) => {
            try {
              const address = new PublicKey(e.target.value);
              setAddress(address);
              setError("");
            } catch (err) {
              setError((err as Error).message);
            }
          }}
          className="w-full"
        />
        <Button
          variant={"link"}
          type="submit"
          className="w-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Loading..." : "View NFT"}
        </Button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
