import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface NFTCardProps {
    image: string | null;
    video: string | null;
    name: string;
    description: string;
    website: string;
}

export default function NFTCard({ image, video, name, description, website }: NFTCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [mediaLoaded, setMediaLoaded] = useState(false);
    const [key, setKey] = useState(0);

    useEffect(() => {
        setMediaLoaded(false);
        setKey(prevKey => prevKey + 1);
    }, [image, video]);
    const SkeletonNoise = () => (
        <div className="absolute inset-0 w-full h-full bg-[#5A5465] animate-pulse">
            <div className="w-full h-full relative overflow-hidden">
                {[...Array(100)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-gray-500 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 5 + 2}px`,
                            height: `${Math.random() * 5 + 2}px`,
                            opacity: Math.random() * 0.5 + 0.2,
                            animation: `move${i} 3s ease-in-out infinite`,
                        }}
                    />
                ))}
            </div>
        </div>
    );

    const styles = `
        ${[...Array(100)].map((_, i) => `
            @keyframes move${i} {
                0% { transform: translate(0, 0); }
                50% { transform: translate(${Math.random() * 10}px, ${Math.random() * 10}px); }
                100% { transform: translate(0, 0); }
            }
        `).join('')}
    `;

    document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);

    return (
        <div className="w-full sticky top-10 pt-8 mx-auto">
            <div
                className={`relative mx-4 font-new-black rounded-2xl text-5xl overflow-hidden h-[590px] mb-4 bg-[#5A5465] ${
                    mediaLoaded ? "drop-shadow-2xl" : ""
                }`}
            >
                <AnimatePresence mode="wait">
                    {!image && !video && (
                        <motion.div
                            key="skeleton"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            transition={{duration: 0.5}}
                        >
                            <SkeletonNoise/>
                        </motion.div>
                    )}
                </AnimatePresence>

                {video ? (
                    <motion.div
                        key={`video-${key}`}
                        initial={{opacity: 0}}
                        animate={{opacity: mediaLoaded ? 1 : 0}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.5}}
                        className="absolute inset-0 w-full h-full"
                    >
                        <video
                            src={video}
                            width="100%"
                            height="100%"
                            controls
                            autoPlay
                            loop
                            onLoadedData={() => {
                                console.log("Video loaded");
                                setMediaLoaded(true);
                            }}
                            onError={(e) => console.error("Video error:", e)}
                            style={{objectFit: 'cover'}}
                        />
                    </motion.div>
                ) : image ? (
                    <motion.div
                        key={`image-${key}`}
                        initial={{opacity: 0}}
                        animate={{opacity: mediaLoaded ? 1 : 0}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.5}}
                        className="absolute inset-0 w-full h-full"
                    >
                        <Image
                            src={image}
                            alt="Uploaded NFT"
                            layout="fill"
                            objectFit="cover"
                            onLoadingComplete={() => {
                                console.log("Image loaded");
                                setMediaLoaded(true);
                            }}
                        />
                    </motion.div>
                ) : null}

                {mediaLoaded && (
                    <div
                        className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
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