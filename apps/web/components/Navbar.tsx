'use client';

import Logo from "./Logo";

export const Navbar = () => {

    return (
        <nav
            className="w-full sticky top-0 z-[100] bg-transparent backdrop-blur-md transition-all border-b border-[#6D6477]">
            <div className="flex h-16 items-center justify-between">
                <div className="ml-14">
                    <Logo/>
                </div>
                <div>
                    <button
                        className={`cursor-pointer mr-14 rounded-xl font-new-black bg-[#6D6477] px-4 py-2  text-[19px] text-white
                            transition-colors hover:bg-[#4F455A] active:bg-[#463C51]`}>Connect Wallet</button>
                </div>
            </div>
        </nav>
    );
};