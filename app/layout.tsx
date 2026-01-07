import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import Template from "./template";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-jetbrains',
  display: 'swap',
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-libre-baskerville',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "New Defence Public School | Excellence in Education",
  description: "Premier co-educational institution providing holistic education with modern values.",
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Dock } from "@/components/Dock";
import Link from "next/link";
import SmoothScroll from "@/components/SmoothScroll";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} ${libreBaskerville.variable}`}>
      <body className="font-sans antialiased bg-[#F7F9FC] text-[#1E2933] selection:bg-[#C6A75E] selection:text-white">
        <SmoothScroll>
          <Navbar />
          <Template>
            {children}
          </Template>
          <Footer />
          <Dock />
        </SmoothScroll>



        {/* Mobile Sticky CTA */}
        <div className="fixed bottom-0 left-0 w-full p-4 md:hidden z-[110] bg-white/80 backdrop-blur-md border-t border-slate-200">
          <Link
            href="/admissions/apply"
            className="flex items-center justify-center w-full py-4 bg-[#0B1C2D] text-white font-bold rounded-xl text-sm tracking-widest uppercase"
          >
            Admissions Open
          </Link>
        </div>
      </body>

    </html>
  );
}

