import type { Metadata } from "next";
import { Suspense } from "react";
import PropertiesClient from "./properties-client";

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

export default function PropertiesPage() {
  return (
    <Suspense>
      <PropertiesClient />
    </Suspense>
  );
}
