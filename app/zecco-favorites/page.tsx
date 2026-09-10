import type { Metadata } from "next";
import ZeccoFavoritesClient from "./zecco-favorites-client";
import {
  serverFetchPropertyList,
  serverFetchLocationList,
} from "@/lib/serverActions";

// export const revalidate = 300;

export const metadata: Metadata = {
  title: "Zecco's  Favorites | Premium Spain Properties",
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

export default async function ZeccoFavoritesPage() {
  const [favoriteResult, locationResult] = await Promise.allSettled([
    serverFetchPropertyList({
      limit: 0,
      page: 1,
      search: "",
      location_id: null,
      favorite: true,
    }),
    serverFetchLocationList({
      search: "",
      limit: 0,
      page: 1,
      status: true,
    }),
  ]);

  const initialData =
    favoriteResult.status === "fulfilled" ? favoriteResult.value : null;
  const initialLocations =
    locationResult.status === "fulfilled" ? locationResult.value : null;

  return (
    <ZeccoFavoritesClient
      initialData={initialData}
      initialLocations={initialLocations}
    />
  );
}
