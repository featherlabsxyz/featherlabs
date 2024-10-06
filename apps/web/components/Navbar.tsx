"use client";

import Logo from "./Logo";
import { SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { WalletButton } from "./ConnectWallet";

export const Navbar = () => {
  const [activeButton, setActiveButton] = useState("create");
  const router = useRouter();

  const handleButtonClick = (buttonType: SetStateAction<string>) => {
    setActiveButton(buttonType);
    if (buttonType === "view") {
      router.push("/view-nft");
    }
    if (buttonType === "create") {
      router.push("/");
    }
  };
  const buttonClass = (buttonType: string) => `
        cursor-pointer
        rounded-xl
        font-new-black
        px-4
        py-2
        text-[19px]
        text-white
        transition-colors
        ${
          activeButton === buttonType
            ? "bg-[#4F455A] hover:bg-[#463C51]"
            : "bg-[#6D6477] hover:bg-[#5A5465]"
        }
    `;
  return (
    <nav className="w-full sticky top-0 z-[100] bg-transparent backdrop-blur-md transition-all border-b border-[#6D6477]">
      <div className="flex h-16 items-center justify-between">
        <div className="ml-14">
          <Logo />
        </div>
        <div className="flex items-center justify-center">
          <div className="flex bg-[#6D6477] rounded-xl p-[2px] w-fit m-2">
            <button
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors ${
                activeButton === "create"
                  ? "bg-[#2D2A35] text-white"
                  : "bg-transparent text-[#9D9D9D]"
              }`}
              onClick={() => handleButtonClick("create")}
            >
              Create NFT
            </button>
            <button
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors ${
                activeButton === "view"
                  ? "bg-[#2D2A35] text-white"
                  : "bg-transparent text-[#9D9D9D]"
              }`}
              onClick={() => handleButtonClick("view")}
            >
              View NFTs
            </button>
          </div>
          <WalletButton />
        </div>
      </div>
    </nav>
  );
};
