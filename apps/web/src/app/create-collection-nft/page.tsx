"use client";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import Link from "next/link";
import NFTCard from "../../../components/NFTCard";
import {useState} from "react";
import {motion} from "framer-motion";

export const dynamic = 'force-dynamic'

export default function CreateCollectionNFT() {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imageName, setImageName] = useState("");
    const [inputs, setInputs] = useState([{id: 1}]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState(
        ""
    );
    const [website, setWebsite] = useState("");

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setImageName(file.name);
            const reader = new FileReader();

            reader.onload = (e) => {
                if (e.target && typeof e.target.result === 'string') {
                    // @ts-ignore
                    setUploadedImage(e.target.result);
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const addInputs = () => {
        setInputs([...inputs, {id: Date.now()}]);
    };

    const removeInputs = (indexToRemove: number) => {
        setInputs((prevInputs) => prevInputs.filter((_, index) => index !== indexToRemove));
    };

    return (
        <motion.div initial={{opacity: 0, filter: "blur(10px)"}}
                    animate={{opacity: 1, filter: "blur(0)"}}
                    exit={{
                        opacity: 0,
                        filter: "blur(10px)",
                        transition: {duration: 0.5},
                    }}
                    className="container mx-auto px-40 mb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20">
                <div
                    className="col-span-1 md:col-span-2 h-full pb-10 mt-8 mx-4 drop-shadow-2xl bg-[#5A5465] font-new-black rounded-2xl text-5xl">
                    <div className="border-b-[0.5px] py-4 border-[#888888] flex justify-between items-center">
                        <div className="mx-8 text-[25px] font-archivo font-[900] archivo-heading">Create Collection
                            NFT
                        </div>
                        <div className="mr-10 flex justify-center">
                            <Link href="/" className="flex justify-center">
                                <button
                                    className={`cursor-pointer border-[0.5px] border-[#888888] rounded-xl bg-[#6D6477] text-[17px] font-new-black px-4 py-2 text-white
                            transition-colors hover:bg-[#4F455A] active:bg-[#463C51]`}>NFT
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="mx-10">

                        <Label htmlFor="name" className="text-[20px] archivo-label">
                            Name
                        </Label>
                        <Input id="name" type="text" className="archivo-label"/>


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
                            Animation file can be a video file, an audio file, a 3d glb file, a html file. Please
                            remember to also upload a placeholder image and select the right category of NFT you are
                            creating below so websites know how to display your nft.
                        </p>


                        <Label htmlFor="symbol" className="text-[20px] archivo-label">
                            Symbol
                        </Label>
                        <Input id="symbol" type="text" className="archivo-label"/>
                        <p className="archivo-label text-[14px] mt-2 text-[#BEBEBE]">A shorthand ticker symbol for
                            your
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
                        <p className="archivo-label text-[14px] mt-2 text-[#BEBEBE]">A link to a website owned by
                            the
                            project.</p>

                    </div>
                </div>
                <div className="hidden md:block col-span-1">
                    <NFTCard
                        image={uploadedImage}
                        name={name}
                        description={description}
                        website={website}
                    />
                </div>
            </div>
        </motion.div>
    );
}
