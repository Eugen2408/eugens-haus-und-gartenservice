import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Outfit } from "next/font/google";
import ConsentBanner from "@/components/ConsentBanner";
import ScrollProgress from "@/components/ScrollProgress";
import SmoothAnchors from "@/components/SmoothAnchors";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const SITE_URL = "https://eugens-haus-und-gartenservice.vercel.app";
const DESCRIPTION =
  "Eugens Haus- und Gartenservice in Hamburg: Gartenpflege, Heckenschnitt, Malerarbeiten, Badsanierung, Bodenverlegung, Montage, Reparaturen und mehr – zuverlässig, termintreu, aus einer Hand.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Eugens Haus- und Gartenservice | Hamburg",
    template: "%s | Eugens Haus- und Gartenservice",
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: SITE_URL,
    siteName: "Eugens Haus- und Gartenservice",
    title: "Eugens Haus- und Gartenservice | Hamburg",
    description: DESCRIPTION,
    images: [{ url: "/images/og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eugens Haus- und Gartenservice | Hamburg",
    description: DESCRIPTION,
    images: ["/images/og.jpg"],
  },
  robots: { index: true, follow: true },
};

// JSON-LD LocalBusiness für Google (Firma, Adresse, Kontakt)
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: "Eugens Haus- und Gartenservice",
  description: DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}/images/og.jpg`,
  logo: `${SITE_URL}/images/logo.webp`,
  telephone: "+49 155 60691797",
  email: "kontakt@eugens-hausundgartenservice.de",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Reembroden 14",
    postalCode: "22339",
    addressLocality: "Hamburg",
    addressCountry: "DE",
  },
  areaServed: { "@type": "City", name: "Hamburg" },
  founder: { "@type": "Person", name: "Eugen Wermter" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-forest-950">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <ScrollProgress />
        <SmoothAnchors />
        {children}
        <ConsentBanner />
      </body>
    </html>
  );
}
