import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavBar from "@/components/ui/NavBar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const meta = {
  title: 'Tomorrow will be better than today.',
  description: `Jack Retterer`,
  robots: 'follow, index',
  favicon: '/favicon.ico',
  image: '/og-image.png',
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: meta.title,
    description: meta.description,
    referrer: 'origin-when-cross-origin',
    keywords: ['AI', 'SWE', 'Machine Learning', 'Vent AI', 'Vent'],
    authors: [{ name: 'Jack Retterer', url: 'https://jackretterer.xyz/' }],
    creator: 'Jack Retterer',
    publisher: 'Jack Retterer',
    robots: meta.robots,
    icons: { icon: meta.favicon },
    openGraph: {
      title: meta.title,
      description: meta.description,
      images: [
        {
          url: meta.image,
          width: 1200,
          height: 630,
          alt: 'A cool photo of space.',
        },
      ],
      siteName: `Jack Retterer`,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@jaretterer',
      creator: '@jaretterer',
      title: meta.title,
      description: meta.description,
      images: [meta.image],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen bg-black`}>
        <NavBar />
        <main className="flex-grow relative z-0">{children}</main>
      </body>
    </html>
  );
}
