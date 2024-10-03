'use client';

import Link from "next/link";

export const Footer = () => {
    return (
        <footer
            className="w-full bottom-0 z-[100] bg-transparent backdrop-blur-md transition-all border-t border-[#6D6477] relative "
        >
            <div className="flex h-16 items-center justify-between relative z-10">
                <div className="ml-14 text-[#BEBEBE] text-[14px]">
                    ©️copyright Feather Labs 2024. All rights reserved.
                </div>
                <div>
                    <Link href="/" className="flex justify-center items-center">
                        <button role="link"
                                className="mr-10">
                            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                                 id="X--Streamline-Simple-Icons" height="24" width="24">
                                <desc>X Streamline Icon: https://streamlinehq.com</desc>
                                <title>X</title>
                                <path
                                    d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8 -7.584 -6.638 7.584H0.474l8.6 -9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
                                    fill="#ffffff" stroke-width="1"></path>
                            </svg>
                        </button>
                    </Link>
                </div>
            </div>

        </footer>
    );
};