import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

interface NFTCardProps {
    image: string | null;
    name: string;
    description: string;
    website: string;
}

export default function NFTCard({ image, name, description, website }: NFTCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div className="w-full sticky top-10 pt-8 mx-auto">
            <div
                className={`relative mx-4 font-new-black rounded-2xl text-5xl overflow-hidden h-[590px] mb-4 bg-[#5A5465] ${
                    imageLoaded ? "drop-shadow-2xl" : ""
                }`}
            >
                {image && (
                    <motion.div
                        initial={{ opacity: 0, filter: "blur(50px)" }}
                        animate={{ opacity: 1, filter: "blur(0)" }}
                        exit={{
                            opacity: 0,
                            filter: "blur(10px)",
                            transition: { duration: 0.5 },
                        }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <Image
                            src={image}
                            alt="Uploaded NFT"
                            width={590}
                            height={590}
                            className="w-full h-full object-cover z-0"
                            onLoadingComplete={() => setImageLoaded(true)}
                        />
                    </motion.div>
                )}

                {imageLoaded && (
                    <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                )}

                <div className="absolute bottom-0 z-10 p-4 text-white w-full">
                    <div className="font-new-black text-[30px] font-semibold">{name}</div>
                    <div className="text-sm truncate">{description}</div>
                    <div className="text-sm underline mt-4">{website}</div>
                </div>
            </div>
        </div>
    );
}
