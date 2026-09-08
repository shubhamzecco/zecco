import type { Metadata } from "next";
import ZeccoFavoritesClient from "./zecco-favorites-client";
import { serverFetchPropertyList } from "@/lib/serverActions";

export const dynamic = "force-dynamic";

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

export default async function ZeccoFavoritesPage() {
  let initialData: any = null;
  try {
    initialData = await serverFetchPropertyList({
      limit: 0,
      page: 1,
      search: "",
      location_id: null,
      favorite: true,
    });
  } catch (err) {
    initialData = null;
  }

  return <ZeccoFavoritesClient initialData={initialData} />;
}
