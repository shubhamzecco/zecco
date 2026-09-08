import type { Metadata } from "next";
import ZeccoFavoritesClient from "./zecco-favorites-client";

export const metadata: Metadata = {
  title: "Zecco's Handpicked Favorites | Premium Spain Properties",
  description:
    "Discover Zecco's curated collection of top-performing investment villas, luxury apartments, and standout properties in Costa del Sol.",
  alternates: {
    canonical: "/zecco-favorites",
  },
  openGraph: {
    title: "Zecco's Handpicked Favorites | Premium Spain Properties",
    description:
      "Discover Zecco's curated collection of top-performing investment properties in Costa del Sol.",
    url: "https://zw.appristine.co.in/zecco-favorites",
    type: "website",
  },
};

export default function ZeccoFavoritesPage() {
  return <ZeccoFavoritesClient />;
}
