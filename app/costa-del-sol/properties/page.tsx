import type { Metadata } from "next";
import { Suspense } from "react";
import PropertiesClient from "./properties-client";
import { serverFetchPropertyList } from "@/lib/serverActions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Properties for Sale & Rent in Costa del Sol | Zecco",
  description:
    "Browse luxury villas, apartments, penthouses, and townhouses across Costa del Sol, Spain. Verified listings, AI market insights, and local advisor support.",
  alternates: {
    canonical: "/costa-del-sol/properties",
  },
  openGraph: {
    title: "Properties for Sale & Rent in Costa del Sol | Zecco",
    description:
      "Browse luxury villas, apartments, penthouses, and townhouses across Costa del Sol, Spain with Zecco.",
    url: "https://zw.appristine.co.in/costa-del-sol/properties",
    type: "website",
  },
};

export default async function PropertiesPage() {
  const initialData = await serverFetchPropertyList({
    limit: 18,
    page: 1,
    country: "Spain",
    status: true,
    forAll: true,
  });

  return (
    <Suspense>
      <PropertiesClient initialData={initialData} />
    </Suspense>
  );
}
