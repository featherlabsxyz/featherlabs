import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "../../components/Navbar";

import localFont from "next/font/local";
import { Footer } from "../../components/Footer";
import { WalletConnectionProvider } from "./provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

const newBlackTypeface = localFont({
  src: [
    {
      path: "./fonts/NewBlackTypeface-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/NewBlackTypeface-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/NewBlackTypeface-SemiBold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/NewBlackTypeface-ExtraBold.woff",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-new-black",
});

const archivoSemiCondensed = localFont({
  src: "./fonts/Archivo_SemiCondensed-Medium.ttf",
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: "FeatherLabs",
  description:
    "New-gen onchain stateless asset protocol for ownership, delegation, and rentability of digital assets at scale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${newBlackTypeface.variable} ${archivoSemiCondensed.variable} font-sans antialiased`}
      >
        <WalletConnectionProvider>
          <Navbar />
          {children}
          <Footer />
        </WalletConnectionProvider>
      </body>
    </html>
  );
}
