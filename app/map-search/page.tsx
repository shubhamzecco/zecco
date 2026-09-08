import type { Metadata } from "next";
import { Suspense } from "react";
import MapSearchClient from "./map-search-client";
import {
  serverFetchAllLocationList,
  serverFetchAreaList,
} from "@/lib/serverActions";

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

export default async function MapSearchPage() {
  const [areasData, locationData] = await Promise.allSettled([
    serverFetchAreaList({ search: "", limit: 200, page: 1 }),
    serverFetchAllLocationList({}),
  ]);

  const initialAreas =
    areasData.status === "fulfilled" ? areasData.value : null;
  const initialLocations =
    locationData.status === "fulfilled" ? locationData.value : null;

  return (
    <Suspense>
      <MapSearchClient
        initialAreas={initialAreas}
        initialLocations={initialLocations}
      />
    </Suspense>
  );
}
