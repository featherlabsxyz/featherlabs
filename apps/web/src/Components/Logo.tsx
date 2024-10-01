import Image from "next/image";
import Link from "next/link";

export default function Logo() {
    return (
        <div className="flex items-center justify-center s">
            <Link href="/" className="flex z-40 font-semibold text-black">
                <Image src='https://utfs.io/f/db8a5c2b-10ec-4a7d-8afe-a705065bbe42-nt597i.png' height={150} width={150}
                       className="pt-1" alt="Mentorix logo"></Image>
            </Link>
        </div>
    )
}