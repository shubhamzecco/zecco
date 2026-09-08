import type { Metadata } from "next";
import MapSearchClient from "./map-search-client";

export const metadata: Metadata = {
  title: "Interactive Property Map Search | Zecco Real Estate",
  description:
    "Explore Costa del Sol real estate on an interactive map. Search villas, apartments, and luxury homes by neighborhood, price, and lifestyle amenities.",
  alternates: {
    canonical: "/map-search",
  },
  openGraph: {
    title: "Interactive Property Map Search | Zecco Real Estate",
    description:
      "Explore Costa del Sol real estate on an interactive map with Zecco.",
    url: "https://zw.appristine.co.in/map-search",
    type: "website",
  },
};

export default function MapSearchPage() {
  return <MapSearchClient />;
}
