import React, { useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { PublicKey } from "@solana/web3.js";
import { createNft } from "@/utils/nftUtils";
export function WalletButton() {
  const { publicKey, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = () => {
    if (connected) {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      setVisible(true);
    }
  };

  const truncatePublicKey = (key: string) => {
    return `${key.slice(0, 4)}..${key.slice(-4)}`;
  };

  const copyToClipboard = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      // You might want to add a toast notification here
    }
  };
  const handleCreateNFT = async () => {
    if (!publicKey) {
      console.error("Wallet not connected");
      // You might want to show a user-friendly message here
      return;
    }

    try {
      const nftAttributes = {
        symbol: "SYMBOL", // You might want to add a state for this
        description: "DESCRIPTION",
        website: "WEBSITE",
        animationUrl: "", // You might want to add a state for this
        // Add any additional attributes here
      };

      const transaction = await createNft(
        publicKey,
        name,
        uploadedImage!, // Make sure uploadedImage is defined earlier
        nftAttributes,
        undefined, // collection
        true, // mutable
        false, // rentable
        true, // transferrable
        enforceRoyalties // royaltiesInitializable
      );

      console.log("NFT transaction created:", transaction);

      // Sign and send the transaction
      if (signTransaction) {
        const signedTransaction = await signTransaction(transaction);
        // Here you would send the signed transaction to the network
        // This part depends on how you're handling transaction submission
        // For example:
        // const signature = await connection.sendRawTransaction(signedTransaction.serialize());
        // await connection.confirmTransaction(signature);
        console.log("Transaction signed:", signedTransaction);
      } else {
        console.error("Wallet does not support transaction signing");
      }

    } catch (error) {
      console.error("Error creating NFT:", error);
    }
  };
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleClick}
        className={`cursor-pointer mr-14 rounded-xl font-new-black ${
          connected ? "bg-[#4F455A]" : "bg-[#6D6477]"
        } px-4 py-2 text-[19px] text-white
                      transition-colors hover:bg-[#4F455A] active:bg-[#463C51] flex items-center`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
          id="Wallet-Add-Plus--Streamline-Flex"
          height="23"
          width="23"
          className="mr-2"
        >
          <desc>Wallet Add Plus Streamline Icon: https://streamlinehq.com</desc>
          <g id="wallet-add-plus--wallet-add-plus-money-payment-finance">
            <path
              id="Union"
              fill="#ffffff"
              fillRule="evenodd"
              d="M10.3677 0.251266C9.45344 0.0650642 7.41579 0 6.23545 0c-0.99189 0 -1.9516 0.158413 -2.91879 0.355948C2.16632 0.590394 1.39282 1.76106 1.22726 3.02306 1.08658 4.09478 1 5.16119 1 6.24277c0 0.24467 0.00281 0.47087 0.00805 0.68207C1.00279 7.08534 1 7.25592 1 7.43869c0 0.29911 0.00751 0.5647 0.02085 0.80565C1.36746 7.64966 2.01206 7.25 2.75 7.25c1.10457 0 2 0.89543 2 2 1.10457 0 2 0.8954 2 2 0 0.5216 -0.19964 0.9965 -0.52666 1.3525 0.29846 0.0144 0.61774 0.0225 0.96556 0.0225 1.38854 0 2.32219 -0.1298 3.2928 -0.2648l0.1611 -0.0223c1.0038 -0.1391 1.8707 -0.7791 2.2735 -1.6654 0.1334 -0.2936 -0.1173 -0.5897 -0.4397 -0.5913 -0.1175 -0.0006 -0.2351 -0.002 -0.3525 -0.0033h-0.0002c-0.1556 -0.0019 -0.3111 -0.0037 -0.4662 -0.0037 -1.4525 0 -2.62993 -1.1526 -2.62993 -2.5744 0 -1.4218 1.17743 -2.57439 2.62993 -2.57439 0.1538 0 0.3078 -0.0013 0.4619 -0.00259l0.0002 -0.00001c0.1027 -0.00086 0.2055 -0.00173 0.3083 -0.00221 0.3284 -0.00154 0.5753 -0.31103 0.4231 -0.60206 -0.2434 -0.46522 -0.6229 -0.85658 -1.0872 -1.12929 -0.7574 -0.39119 -1.7359 -0.47322 -3.11827 -0.47322 -1.1109 0 -2.18068 0.08373 -3.00687 0.14839 -0.22364 0.0175 -0.42944 0.03361 -0.61337 0.04628 -0.33936 0.02338 -0.63383 -0.22697 -0.65771 -0.55917 -0.02388 -0.33219 0.23186 -0.62045 0.57122 -0.64382 0.16788 -0.01157 0.36164 -0.02677 0.57634 -0.04361 0.82676 -0.06484 1.96409 -0.15404 3.13039 -0.15404 0.80939 0 1.58487 0.02248 2.30427 0.15591 0.3527 0.06539 0.6889 -0.21935 0.5249 -0.53831 -0.2215 -0.430909 -0.6045 -0.774007 -1.1072 -0.876394Zm1.2897 8.617884h1.3568c0.5443 0 0.9856 -0.43194 0.9856 -0.96478v-0.80728c0 -0.53284 -0.4413 -0.96478 -0.9856 -0.96478h-1.3568c-0.772 0 -1.3979 0.61266 -1.3979 1.36842s0.6259 1.36842 1.3979 1.36842ZM2.75 8.5c0.41421 0 0.75 0.33579 0.75 0.75v1.25h1.25c0.41421 0 0.75 0.3358 0.75 0.75s-0.33579 0.75 -0.75 0.75H3.5v1.25c0 0.4142 -0.33579 0.75 -0.75 0.75S2 13.6642 2 13.25V12H0.75c-0.414214 0 -0.75 -0.3358 -0.75 -0.75s0.335786 -0.75 0.75 -0.75H2V9.25c0 -0.41421 0.33579 -0.75 0.75 -0.75Z"
              clipRule="evenodd"
              strokeWidth="1"
            />
          </g>
        </svg>
        {connected && publicKey && truncatePublicKey(publicKey.toString())}
      </button>
      {isDropdownOpen && connected && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <button
              onClick={copyToClipboard}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
              role="menuitem"
            >
              Copy Address
            </button>
            <button
              onClick={disconnect}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
              role="menuitem"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
