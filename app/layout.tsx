import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LegalMate-BD",
  description:
    "A bridge between legal professionals and clients in Bangladesh, providing a platform for seamless communication and efficient legal services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="bn" className={`${inter.variable}`}>
        <body className="font-sans bg-[#FAFAFA] text-[#111111] antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}