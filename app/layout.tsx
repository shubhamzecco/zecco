import type { Metadata } from "next";
import {
  Instrument_Sans,
  Inter,
  Manrope,
  Poppins,
  Public_Sans,
} from "next/font/google";
import React from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { AppProviders } from "@/components/provider/provider";
import { circular_std } from "@/lib/fonts";
import "leaflet/dist/leaflet.css";
import "../styles/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Specify the weights you need
  variable: "--font-poppins", // Optional: for Tailwind CSS integration
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const instrumentSans = Instrument_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-sans",
});

export const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-public-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zecco.es"),
  title: {
    default: "Zecco Real Estate",
    template: "%s | Zecco Real Estate",
  },
  description:
    "Discover premium properties for sale and rent across Spain. Browse apartments, villas, townhouses, commercial properties, and investment opportunities with Zecco Real Estate.",
  keywords:
    "real estate, properties for sale, properties for rent, apartments, villas, townhouses, commercial properties, Spain real estate, property investment, luxury homes, Zecco",

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon.ico",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.ico",
    other: [
      {
        rel: "web-app-manifest-192x192",
        url: "/web-app-manifest-192x192.png",
        sizes: "192x192",
      },
    ],
  },

  manifest: "/manifest.json",

  openGraph: {
    title: "Zecco Real Estate | Properties for Sale & Rent",
    description:
      "Explore apartments, villas, penthouses, townhouses, and commercial properties across Spain. Find your dream property with Zecco Real Estate.",
    url: "https://zecco.es",
    siteName: "Zecco Real Estate",

    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Zecco Real Estate | Find Your Dream Property",
    description:
      "Browse premium properties for sale and rent. Discover apartments, villas, luxury homes, and investment opportunities across Spain.",
    // images: ["/assets/ogimage.png"],
    creator: "@zecco_es",
  },

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} ${instrumentSans.variable} ${poppins?.variable} ${circular_std?.variable} ${publicSans.variable} scrollbar-hide`}
    >
      <body className="bg-white text-gray-900 antialiased font-sans scrollbar-hide">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
