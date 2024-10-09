"use client";

import Logo from "./Logo";
import { SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { WalletButton } from "./ConnectWallet";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const [activeButton, setActiveButton] = useState("create");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleButtonClick = (buttonType: SetStateAction<string>) => {
    setActiveButton(buttonType);
    if (buttonType === "view") {
      router.push("/view-nft");
    }
    if (buttonType === "create") {
      router.push("/");
    }
    setIsMenuOpen(false);
  };

  return (
      <>
        <nav className="w-full sticky top-0 z-[100] bg-transparent backdrop-blur-md transition-all border-b border-[#6D6477]">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Logo />
            </div>
            <div className="hidden md:flex items-center justify-center">
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
            <div className="md:hidden">
              <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white focus:outline-none"
              >
                <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        isMenuOpen
                            ? "M6 18L18 6M6 6l12 12"
                            : "M4 6h16M4 12h16M4 18h16"
                      }
                  />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        <AnimatePresence>
          {isMenuOpen && (
              <>
                {/* Background blur for overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-black bg-opacity-40 z-[99]"
                    onClick={() => setIsMenuOpen(false)}
                />

                <motion.div
                    initial={{ opacity: 0, y: -50, filter: "blur(20px)" }} // More intense blur
                    animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
                    exit={{ opacity: 0, y: -50, filter: "blur(20px)" }}
                    transition={{ duration: 0.4 }}
                    className="fixed top-0 left-0 w-full bg-[#6D6477] z-[100] px-4 py-4 shadow-lg"
                >
                  {/* Close (X) Button */}
                  <div className="flex justify-end">
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="text-white focus:outline-none"
                    >
                      <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                      >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <button
                      className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                          activeButton === "create"
                              ? "bg-[#2D2A35] text-white"
                              : "text-[#9D9D9D]"
                      }`}
                      onClick={() => handleButtonClick("create")}
                  >
                    Create NFT
                  </button>
                  <button
                      className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                          activeButton === "view"
                              ? "bg-[#2D2A35] text-white"
                              : "text-[#9D9D9D]"
                      }`}
                      onClick={() => handleButtonClick("view")}
                  >
                    View NFTs
                  </button>
                  <div className="mt-4">
                    <WalletButton />
                  </div>
                </motion.div>
              </>
          )}
        </AnimatePresence>
      </>
  );
};