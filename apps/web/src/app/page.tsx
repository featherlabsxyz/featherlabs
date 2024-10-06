"use client";

import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import NFTCard from "../../components/NFTCard";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";
import Link from "next/link";
import {useState} from "react";
import {AnimatePresence, motion} from "framer-motion";


export default function CreateNFT() {
    const [enforceRoyalties, setEnforceRoyalties] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imageName, setImageName] = useState("");
    const [inputs, setInputs] = useState([{id: 1}]);

    const addInputs = () => {
        setInputs([...inputs, {id: Date.now()}]);
    };

    const removeInputs = (indexToRemove: number) => {
        setInputs((prevInputs) => prevInputs.filter((_, index) => index !== indexToRemove));
    };
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setImageName(file.name);
            const reader = new FileReader();

            reader.onload = (e) => {
                if (e.target) {
                    // @ts-ignore
                    setUploadedImage(e.target.result);
                }
            };

            reader.readAsDataURL(file);
        }
    };

    // @ts-ignore
    return (
        <div className="container mx-auto px-40 mb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20">
                <div
                    className="col-span-1 md:col-span-2 h-full pb-10 mx-4 drop-shadow-2xl bg-[#5A5465] font-new-black rounded-2xl text-5xl">
                    <motion.div initial={{opacity: 0, filter: "blur(10px)"}}
                                animate={{opacity: 1, filter: "blur(0)"}}
                                exit={{
                                    opacity: 0,
                                    filter: "blur(10px)",
                                    transition: {duration: 0.5},
                                }} className="border-b-[0.5px] py-4 border-[#888888] flex justify-between items-center">
                        <div className="mx-8 text-[25px] font-archivo font-[900] archivo-heading">Create NFT</div>
                        <div className="mr-10 flex justify-center">
                            <Link href="/create-collection-nft" className="flex justify-center">
                                <button
                                    className={`cursor-pointer border-[0.5px] border-[#888888] rounded-xl bg-[#6D6477] text-[17px] font-new-black px-4 py-2 text-white
                            transition-colors hover:bg-[#4F455A] active:bg-[#463C51]`}>Collection NFT
                                </button>
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, filter: "blur(10px)"}}
                        animate={{opacity: 1, filter: "blur(0)"}}
                        exit={{
                            opacity: 0,
                            filter: "blur(10px)",
                            transition: {duration: 0.5},
                        }}
                        className="mx-10">

                        <Label htmlFor="name" className="text-[20px] archivo-label">
                            Name
                        </Label>
                        <Input id="name" type="text" className="archivo-label"/>


                        <div className="flex items-center mt-4 space-x-2 archivo-label">
                            <Checkbox
                                id="terms"
                                checked={enforceRoyalties}
                                onCheckedChange={(checked) => {
                                    // @ts-ignore
                                    setEnforceRoyalties(checked);
                                }}
                            />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Enforce Royalties
                            </label>
                        </div>
                        <p className="archivo-label text-[14px] mt-2 text-[#BEBEBE] mx-6">
                            Enable to create royalty enforced pNFTs.
                        </p>


                        <AnimatePresence>
                            {enforceRoyalties && (
                                <motion.div
                                    initial={{opacity: 0, height: 0, filter: 'blur(10px)'}}
                                    animate={{opacity: 1, height: 'auto', filter: 'blur(0px)'}}
                                    exit={{opacity: 0, height: 0, filter: 'blur(10px)'}}
                                    transition={{duration: 0.5}}
                                >
                                    <Label htmlFor="sellFee" className="text-[20px] archivo-label">
                                        Sell Fee Basis Points
                                    </Label>
                                    <Input id="sellFee" type="text" className="archivo-label"/>
                                    <p className="archivo-label text-[14px] mt-2 text-[#BEBEBE]">
                                        The percentage of the sale price that the original receives. Each percent is
                                        represented by 100 points. 10% = 1000 points.
                                    </p>

                                    <Label htmlFor="collection" className="text-[20px] archivo-label">
                                        Collection
                                    </Label>
                                    <Input id="collection" type="text" className="archivo-label"/>
                                    <p className="archivo-label text-[14px] mt-2 text-[#BEBEBE]">
                                        The collection address that your NFT will be added to. If you haven't created a
                                        collection NFT yet it would be recommended to create one first by selecting
                                        collection as the NFT type as the first question.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

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


                        <p className="archivo-label text-[14px] mt-2 text-[#BEBEBE]">
                            This is your image/placeholder of your NFT. If you are creating an NFT type other than image
                            then this will act as the placeholder image in wallets.
                        </p>


                        <Label htmlFor="image" className="text-[20px] archivo-label">
                            Animation File
                        </Label>
                        <div className="flex gap-2 mt-1">
                            <Input
                                id="image-input"
                                type="text"
                                disabled={true}
                                placeholder="File name, chosen by user"
                                className="archivo-input flex-[3] text-xl text-[#BEBEBE] underline"
                            />
                            <div>
                                <button
                                    id="image-button"
                                    type="button"
                                    value="Choose File"
                                    className="cursor-pointer archivo-input border-[0.5px] border-[#888888] rounded-xl bg-[#6D6477] text-[20px] font-new-black px-4 py-[10px] text-white flex items-center justify-center gap-2
    transition-colors hover:bg-[#4F455A] active:bg-[#463C51]"
                                >
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
                                            fill-rule="evenodd"
                                            d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0Zm-0.05 5.6a0.75 0.75 0 0 1 0.75 0.75v4.85h4.85a0.75 0.75 0 0 1 0 1.5H12.7v4.95a0.75 0.75 0 1 1-1.5 0V12.7H6.35a0.75 0.75 0 0 1 0-1.5h4.85V6.35a0.75 0.75 0 0 1 0.75-0.75Z"
                                            clip-rule="evenodd"
                                            stroke-width="1"
                                        ></path>
                                    </svg>
                                    Choose File
                                </button>
                            </div>
                        </div>
                        <p className="archivo-label text-[14px] mt-2 text-[#BEBEBE]">
                            Animation file can be a video file, an audio file, a 3d glb file, a html file. Please
                            remember to also upload a placeholder image and select the right category of NFT you are
                            creating below so websites know how to display your nft.
                        </p>


                        <Label htmlFor="symbol" className="text-[20px] archivo-label">
                            Symbol
                        </Label>
                        <Input id="symbol" type="text" className="archivo-label"/>
                        <p className="archivo-label text-[14px] mt-2 text-[#BEBEBE]">A shorthand ticker symbol for your
                            NFT.</p>


                        <Label htmlFor="description" className="text-[20px] archivo-label">
                            Description
                        </Label>
                        <Textarea placeholder="" className="archivo-label"/>
                        <p className="archivo-label text-[14px] mt-2 text-[#BEBEBE]">The description of your NFT or
                            collection.</p>

                        <Label htmlFor="website" className="text-[20px] archivo-label">
                            Website
                        </Label>
                        <Input id="website" type="text" className="archivo-label"/>
                        <p className="archivo-label text-[14px] mt-2 text-[#BEBEBE]">A link to a website owned by the
                            project.</p>

                        <Label htmlFor="website" className="text-[20px] archivo-label">
                            Sell Fee Basis Points
                        </Label>
                        <Input id="website" type="text" className="archivo-label"/>
                        <p className="archivo-label text-[14px] mt-2 text-[#BEBEBE]">The percentage of the sale price
                            that the original receives. Each percent is represented by 100 points. 10% = 1000
                            points.</p>


                        <div>
                            <Label htmlFor="image" className="text-[20px] archivo-label">
                                Attributes
                            </Label>

                            {inputs.map((input, index) => (
                                <AnimatePresence key={input.id}>
                                    <motion.div
                                        initial={{opacity: 0, filter: "blur(10px)"}}
                                        animate={{opacity: 1, filter: "blur(0)"}}
                                        exit={{
                                            opacity: 0,
                                            filter: "blur(10px)",
                                            transition: {duration: 0.5},
                                        }}
                                        className="flex gap-2 mt-1"
                                    >
                                        <Input
                                            id={`image-input-${index}`}
                                            type="text"
                                            placeholder="Trait Type"
                                            className="archivo-input flex-[3] text-xl text-[#BEBEBE] underline"
                                        />
                                        <Input
                                            id={`image-input-${index}-2`}
                                            type="text"
                                            placeholder="Trait Type"
                                            className="archivo-input flex-[3] text-xl text-[#BEBEBE] underline"
                                        />
                                        <div className="flex flex-col gap-2">
                                            <button
                                                id="minus-button"
                                                type="button"
                                                onClick={() => {
                                                    if (inputs.length > 1) {
                                                        removeInputs(index);
                                                    }
                                                }}
                                                className={`cursor-pointer archivo-input border-[0.5px] border-[#888888] rounded-xl bg-[#6D6477] text-[20px] font-new-black px-4 py-[10px] text-white flex items-center justify-center gap-2 transition-colors ${inputs.length === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#4F455A] active:bg-[#463C51]'}`}
                                                disabled={inputs.length === 1}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"
                                                     height="24" width="24">
                                                    <path fill="#ffffff" fillRule="evenodd"
                                                          d="M1.83645 1.83645C3.06046 0.612432 4.82797 0 7 0s3.9395 0.612432 5.1636 1.83645C13.3876 3.06046 14 4.82797 14 7s-0.6124 3.9395 -1.8364 5.1636C10.9395 13.3876 9.17203 14 7 14s-3.93954 -0.6124 -5.16355 -1.8364C0.612432 10.9395 0 9.17203 0 7s0.612432 -3.93954 1.83645 -5.16355ZM10.5625 7c0 0.34518 -0.2798 0.625 -0.625 0.625h-5.875c-0.34518 0 -0.625 -0.27982 -0.625 -0.625s0.27982 -0.625 0.625 -0.625h5.875c0.3452 0 0.625 0.27982 0.625 0.625Z"
                                                          clipRule="evenodd" strokeWidth="1"></path>
                                                </svg>
                                            </button>


                                            {index === inputs.length - 1 && (
                                                <button
                                                    id="plus-button"
                                                    type="button"
                                                    onClick={addInputs}
                                                    className="cursor-pointer archivo-input border-[0.5px] border-[#888888] rounded-xl bg-[#6D6477]
                                    text-[20px] font-new-black px-4 py-[10px] text-white flex items-center justify-center gap-2 transition-colors hover:bg-[#4F455A] active:bg-[#463C51]"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                         viewBox="0 0 24 24" height="24" width="24">
                                                        <path fill="#ffffff" fill-rule="evenodd"
                                                              d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0Zm-0.05 5.6a0.75 0.75 0 0 1 0.75 0.75v4.85h4.85a0.75 0.75 0 0 1 0 1.5H12.7v4.95a0.75 0.75 0 1 1-1.5 0V12.7H6.35a0.75 0.75 0 0 1 0-1.5h4.85V6.35a0.75 0.75 0 0 1 0.75-0.75Z"
                                                              clip-rule="evenodd" stroke-width="1">
                                                        </path>
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            ))}

                            <p className="archivo-label text-[14px] mt-2 text-[#BEBEBE]">
                                Attributes show on your nft as metadata. This could be anything from the colour of your
                                nft, to an item of clothing on the item, to camera metadata .
                            </p>
                        </div>


                        <Label htmlFor="website" className="text-[20px] archivo-label">
                            Collection
                        </Label>
                        <Input id="website" type="text" className="archivo-label"/>
                        <p className="archivo-label text-[14px] mt-2 text-[#BEBEBE]">The collection address that
                            your
                            NFT will be added to. If you haven&apos;t created a collection NFT yet it would be
                            recommended to
                            create one first by selecting collection as the NFT type as the first question.</p>

                    </motion.div>
                </div>
                <div className="hidden md:block col-span-1">
                    <NFTCard image={uploadedImage}/>
                </div>
            </div>
        </div>
    )
        ;
}
