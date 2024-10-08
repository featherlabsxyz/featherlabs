import { useWallet } from "@solana/wallet-adapter-react";

export default function ViewNFT() {
  const { publicKey } = useWallet();

  return (
    <>
      <div className="h-screen w-screen flex justify-center items-center"></div>
    </>
  );
}
