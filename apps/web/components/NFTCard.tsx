export default function NFTCard({ image }: any) {
    return (
        <div className="relative mx-4 drop-shadow-2xl bg-[#5A5465] font-new-black rounded-2xl text-5xl overflow-hidden">
            <div className="h-[590px] relative z-30">
                <div className="relative z-10 p-10">
                    <h2 className="text-center text-[30px]">NFT Card Title</h2>
                    {image && (
                        <div className="mt-4 flex justify-center">
                            <img src={image} alt="Uploaded NFT" className="max-w-full max-h-[400px] object-contain rounded-lg" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}