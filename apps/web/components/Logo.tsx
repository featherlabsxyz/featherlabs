import Image from "next/image";
import Link from "next/link";

export default function Logo() {
    return (
        <div className="flex items-center justify-center">
            <Link href="/" className="flex z-40 font-semibold text-black">
                <Image
                    src='https://utfs.io/f/lLv8UXP6doLZU6V1ZHl9d01aG7sC4fxiRQjKMhry2VtJbZeq'
                    height={80}
                    width={250}
                    className="object-contain"
                    alt="Mentorix logo"
                    priority
                />
            </Link>
        </div>
    )
}