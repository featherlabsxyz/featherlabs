"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface NFTCardProps {
    image: string | null;
    name: string;
}

export default function NFTCard({ image, name}: NFTCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);

    const SkeletonNoise = () => (
        <div className="absolute inset-0  max-w-[320px] h-full bg-[#5A5465] animate-pulse">
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

    // Moving styles to global CSS or a dedicated animation class would be better for performance.
    useEffect(() => {
        const styles = `
            ${[...Array(100)].map((_, i) => `
                @keyframes move${i} {
                    0% { transform: translate(0, 0); }
                    50% { transform: translate(${Math.random() * 10}px, ${Math.random() * 10}px); }
                    100% { transform: translate(0, 0); }
                }
            `).join('')}
        `;

        const styleElement = document.createElement("style");
        styleElement.innerHTML = styles;
        document.head.appendChild(styleElement);

        return () => {
            document.head.removeChild(styleElement); // Cleanup on unmount
        };
    }, []);

    return (
        <div className="w-full sticky top-10 pt-2 md:pt-7 md mx-auto">
            <div
                className="relative mx-4 font-new-black rounded-2xl text-5xl overflow-hidden h-[590px] mb-4 bg-[#5A5465]">

                <AnimatePresence mode="wait">
                    {!image && (
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

                    {image && (
                        <motion.div
                            key="image"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            transition={{duration: 0.5}}
                        >
                            <Image
                                src={image}
                                alt={name}
                                layout="fill"
                                objectFit="cover"
                                onLoadingComplete={() => setImageLoaded(true)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="absolute bottom-0 z-10 p-4 text-white w-full">
                    <div className="font-new-black text-[30px] font-semibold">{name}</div>
                </div>
            </div>
        </div>
    );
}