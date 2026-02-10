import React from "react"
import type { Metadata } from "next"
import { Inter, Manrope, Instrument_Sans, Poppins } from "next/font/google"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import "../styles/globals.css"
import { AppProviders } from "@/components/provider/provider";
import { circular_std } from "@/lib/fonts";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Specify the weights you need
  variable: '--font-poppins', // Optional: for Tailwind CSS integration
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
})

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: [
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
  ],
})

const instrumentSans = Instrument_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument-sans',
});

export const metadata: Metadata = {
  title: "Zecco.es",
  description:
    "Discover luxury properties, expert local insights, and AI-powered property search",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} ${instrumentSans.variable} ${poppins?.variable} ${circular_std?.variable} scrollbar-hide`}>
      <body className="bg-white text-gray-900 antialiased font-sans scrollbar-hide">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  )
}
