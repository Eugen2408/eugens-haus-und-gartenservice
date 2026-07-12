import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Bricolage_Grotesque } from "next/font/google";
import ConsentBanner from "@/components/ConsentBanner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eugens Haus- und Gartenservice | Hamburg",
  description:
    "Ihr zuverlässiger Partner für Garten- und Hauspflege in Hamburg. Rasenpflege, Heckenschnitt, Gartengestaltung, Winterdienst und mehr.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-forest-950">
        {children}
        <ConsentBanner />
      </body>
    </html>
  );
}
