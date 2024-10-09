"use client";
import {createUmi} from "@metaplex-foundation/umi-bundle-defaults";
import {bundlrUploader} from "@metaplex-foundation/umi-uploader-bundlr";
import {walletAdapterIdentity} from "@metaplex-foundation/umi-signer-wallet-adapters";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import Link from "next/link";
import NFTCard from "../../../components/NFTCard";
import {Checkbox} from "@/components/ui/checkbox";
import {toast} from "sonner";
import {useState} from "react";
import {motion} from "framer-motion";

import {useWallet} from "@solana/wallet-adapter-react";
import {createCollectionTx} from "@featherlabs/feather-assets/src/nft";
import {createRpc, Rpc} from "@lightprotocol/stateless.js";
import {GenericFile} from "@metaplex-foundation/umi";
import {
    calculateNFTMintingCost,
    getTransactionWithRetry,
} from "@featherlabs/feather-assets/src/types";

export const dynamic = "force-dynamic";

const endpoint =
    "https://devnet.helius-rpc.com/?api-key=2a3681db-784a-40fb-9c8d-8fcab42275f8";

export default function CreateCollectionNFT() {
    const wallet = useWallet();
    const umi = createUmi(endpoint)
        .use(walletAdapterIdentity(wallet))
        .use(bundlrUploader());

    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [imageName, setImageName] = useState("");
    const [imageUri, setImageUri] = useState<null | string>(null);
    const [maxSize, setMaxSize] = useState(10);
    const [mutable, setMutable] = useState(false);

    const handleCreateNFT = async () => {
        const {publicKey, signTransaction} = wallet;
        if (!publicKey || !signTransaction) {
            toast.error("Wallet not connected or no image uploaded");
            return;
        }

        toast.promise(
            async () => {
                const image: string | null = imageUri;
                const rpc: Rpc = createRpc(endpoint, endpoint, endpoint, {
                    commitment: "confirmed",
                });
                if (
                    !name ||
                    !image ||
                    name.length === 0 ||
                    image.length === 0 ||
                    !maxSize
                ) {
                    throw new Error("Name and Image and Max size can't be empty");
                }
                const {groupAddress, transaction} = await createCollectionTx(
                    rpc,
                    maxSize,
                    publicKey,
                    name,
                    image,
                    mutable
                );
                const signedTransaction = await signTransaction(transaction);
                toast.info("Transaction signed successfully");

                const signature = await rpc.sendRawTransaction(
                    signedTransaction.serialize()
                );
                const log = await getTransactionWithRetry(rpc, signature);
                if (!log) {
                    throw new Error("Log is undefined");
                }
                const cost = await calculateNFTMintingCost(rpc, log);
                return {cost, aa: groupAddress.toBase58()};
            },
            {
                loading: "Creating NFT...",
                success: ({aa, cost}) =>
                    `NFT created successfully! Cost: ${cost?.toFixed(
                        6
                    )} SOL! Asset address: ${aa}`,
                error: (error) => `Error creating NFT: ${error.message}`,
            }
        );
    };

    const handleImageUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setImageName(file.name);

            try {
                const buffer = await file.arrayBuffer();
                const genericFile: GenericFile = {
                    buffer: new Uint8Array(buffer),
                    fileName: file.name,
                    displayName: file.name,
                    uniqueName: `${Date.now()}-${file.name}`,
                    contentType: file.type,
                    extension: file.name.split(".").pop() || null,
                    tags: [],
                };
                const uris = await umi.uploader.upload([genericFile]);
                if (uris.length > 0) {
                    setImageUri(uris[0]);
                } else {
                    throw new Error("No URI returned from upload");
                }

                // Set the uploaded image for preview
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target && typeof e.target.result === "string") {
                        setUploadedImage(e.target.result);
                    }
                };
                reader.readAsDataURL(file);
            } catch (error) {
                toast.error(
                    `Error uploading file: ${
                        error instanceof Error ? error.message : String(error)
                    }`
                );
            }
        }
    };

    return (
        <motion.div
            initial={{opacity: 0, filter: "blur(10px)"}}
            animate={{opacity: 1, filter: "blur(0)"}}
            exit={{
                opacity: 0,
                filter: "blur(10px)",
                transition: {duration: 0.5},
            }}
            className="container h-screen mx-auto px-2 sm:px-4 lg:px-6 mb-20 max-w-7xl"
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4 lg:mt-20">
                <div
                    className="col-span-1 lg:col-span-2 h-full mx-0 sm:mx-2 drop-shadow-2xl mt-4 sm:mt-8 bg-[#5A5465] font-new-black rounded-2xl text-2xl sm:text-3xl lg:text-5xl">
                    <motion.div
                        initial={{opacity: 0, filter: "blur(10px)"}}
                        animate={{opacity: 1, filter: "blur(0)"}}
                        exit={{
                            opacity: 0,
                            filter: "blur(10px)",
                            transition: {duration: 0.5},
                        }}
                        className="border-b-[0.5px] py-2 sm:py-4 border-[#888888] flex justify-between items-center"
                    >
                        <div
                            className="mx-2 sm:mx-4 ml-8 lg:mx-8 text-[18px] sm:text-[20px] lg:text-[25px] font-archivo font-[900] archivo-heading">
                            Create Collection NFT
                        </div>
                        <motion.div className="mx-2 sm:mx-4 lg:mr-10 mr-8 flex justify-center">
                            <Link href="/" className="flex justify-center">
                                <button
                                    className="cursor-pointer flex items-center gap-1 sm:gap-2 border-[0.5px] border-[#888888] rounded-xl bg-[#6D6477] text-[12px] sm:text-[14px] lg:text-[17px] font-new-black px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-white transition-colors hover:bg-[#4F455A] active:bg-[#463C51]">
                                    <span className="hidden sm:inline">NFT</span>
                                    <svg
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                        id="Arrow-Right-1--Streamline-Ultimate"
                                        height="16"
                                        width="16"
                                        className="sm:h-5 sm:w-5"
                                    >
                                        <desc>Arrow Right 1 Streamline Icon: https://streamlinehq.com</desc>
                                        <path
                                            d="M6.6395 0.975L17.1451 11.4806C17.4323 11.7673 17.4323 12.2327 17.1451 12.5194L6.6395 23.025"
                                            fill="none"
                                            stroke="#ffffff"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.5"
                                        ></path>
                                    </svg>
                                </button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    <div className="mx-10">
                        <Label htmlFor="name" className="text-[20px] archivo-label">
                            Name
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            className="archivo-label"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Label htmlFor="maxSize" className="text-[20px] archivo-label">
                            Max Size
                        </Label>
                        <Input
                            id="maxSize"
                            type="text"
                            className="archivo-label"
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (!isNaN(value) && value >= 0) {
                                    setMaxSize(value);
                                } else {
                                    toast.error("Please enter a valid non-negative number", {
                                        duration: 1000,
                                    });
                                }
                            }}
                        />

                        <Label htmlFor="image" className="text-[20px] archivo-label">
                            Image
                        </Label>
                        <div className="flex gap-2 mt-1">
                            <Input
                                id="image-input"
                                type="text"
                                disabled={true}
                                value={imageName}
                                placeholder="File name, chosen by user"
                                className="archivo-input flex-[3] text-xl text-[#BEBEBE] underline"
                            />
                            <div>
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <div
                                        className="archivo-input border-[0.5px] border-[#888888] rounded-xl bg-[#6D6477] text-[20px] font-new-black px-4 py-[10px] text-white flex items-center justify-center gap-2 transition-colors hover:bg-[#4F455A] active:bg-[#463C51]">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            id="Plus-Math-Symbol-Circle--Streamline-Ultimate"
                                            height="24"
                                            width="24"
                                        >
                                            <desc>Plus Math Symbol Circle Streamline Icon</desc>
                                            <path
                                                fill="#ffffff"
                                                fillRule="evenodd"
                                                d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0Zm-0.05 5.6a0.75 0.75 0 0 1 0.75 0.75v4.85h4.85a0.75 0.75 0 0 1 0 1.5H12.7v4.95a0.75 0.75 0 1 1-1.5 0V12.7H6.35a0.75 0.75 0 0 1 0-1.5h4.85V6.35a0.75 0.75 0 0 1 0.75-0.75Z"
                                                clipRule="evenodd"
                                                strokeWidth="1"
                                            ></path>
                                        </svg>
                                        Choose File
                                    </div>
                                </label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </div>
                        </div>
                        <div className="flex items-center mt-8 space-x-2 archivo-label">
                            <Checkbox
                                id="terms"
                                checked={mutable}
                                onCheckedChange={(checked) => {
                                    setMutable(checked as boolean);
                                }}
                            />
                            <label
                                htmlFor="terms"
                                className="text-xl archivo-label leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Mutable
                            </label>
                        </div>
                        <p className="archivo-label text-[14px] mt-2 text-[#BEBEBE] mx-6">
                            Do you want metadata to be mutable?
                        </p>
                    </div>
                    <motion.div
                        initial={{opacity: 0, filter: "blur(10px)"}}
                        animate={{opacity: 1, filter: "blur(0)"}}
                        exit={{
                            opacity: 0,
                            filter: "blur(10px)",
                            transition: {duration: 0.5},
                        }}
                        className="border-t-[0.5px] mt-4 sm:mt-5 pt-3 sm:pt-4 border-[#888888] flex justify-between items-center"
                    >
                        <div
                            className="mx-2 sm:mx-4 lg:mx-8 text-[18px] sm:text-[20px] lg:text-[25px] font-archivo font-[900] archivo-heading"></div>
                        <div className="mx-2 sm:mx-4 lg:mr-10 flex justify-center">
                            <button
                                onClick={handleCreateNFT}
                                className="flex items-center gap-1 sm:gap-2 cursor-pointer border-[0.5px] border-[#888888] rounded-xl bg-[#6D6477] text-[12px] sm:text-[14px] lg:text-[17px] font-new-black px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-white transition-colors hover:bg-[#4F455A] active:bg-[#463C51]"
                            >
                                Create Collection
                            </button>
                        </div>
                    </motion.div>
                </div>
                <div className="hidden lg:block col-span-1">
                    <NFTCard image={uploadedImage} name={name}/>
                </div>
            </div>
            <div className="lg:hidden mt-6 sm:mt-8">
                <NFTCard image={uploadedImage} name={name}/>
            </div>
        </motion.div>
    );
}