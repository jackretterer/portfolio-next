import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavBar from "@/components/ui/NavBar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JR",
  description: "Jack Retterer's Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar/>
        <main className="relative z-0">{children}</main>
        </body>
    </html>
  );
}
