import type { Metadata } from "next";
import { Suspense } from "react";
import PropertiesClient from "./properties-client";
import { serverFetchPropertyList, serverFetchAllPropertyList } from "@/lib/serverActions";
import { generatePropertySlug } from "@/utils/common";
import { getSiteBaseUrl } from "@/utils/siteUrl";

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

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const get = (key: string) => {
    const v = sp[key];
    return Array.isArray(v) ? v[0] || "" : v || "";
  };

  const city = get("city");
  const area = get("area");
  const subarea = get("subarea");
  const categories = get("categories");
  const bedroomsFrom = get("bedroomsFrom");
  const bedroomsTo = get("bedroomsTo");
  const priceFrom = get("priceFrom");
  const priceTo = get("priceTo");
  const buildFrom = get("buildFrom");
  const buildTo = get("buildTo");
  const types = get("types") || get("propertyType");
  const features = get("features") || get("feature");

  const toNum = (v: string) => {
    const n = Number(v);
    return Number.isFinite(n) && v !== "" ? n : undefined;
  };

  const payload: any = {
    limit: 18,
    page: 1,
    country: "Spain",
    status: true,
    forAll: true,
    ...(city ? { cities: city } : {}),
    ...(area || subarea ? { search: area || subarea } : {}),
    ...(categories
      ? { categories: toNum(categories) ?? categories }
      : {}),
    ...(bedroomsFrom ? { bedroomsFrom: toNum(bedroomsFrom) } : {}),
    ...(bedroomsTo ? { bedroomsTo: toNum(bedroomsTo) } : {}),
    ...(priceFrom ? { priceFrom: toNum(priceFrom) } : {}),
    ...(priceTo ? { priceTo: toNum(priceTo) } : {}),
    ...(buildFrom ? { buildFrom: toNum(buildFrom) } : {}),
    ...(buildTo ? { buildTo: toNum(buildTo) } : {}),
    ...(types
      ? {
          types: types
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
            .map((t) => toNum(t) ?? t),
        }
      : {}),
    ...(features
      ? {
          features: features
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean)
            .map((f) => toNum(f) ?? f),
        }
      : {}),
  };

  const initialData = await serverFetchPropertyList(payload);

  // Fetch the complete result set for this filter so crawlers and AI agents
  // can discover every property detail URL, not just the visible page (18).
  const allProperties = await serverFetchAllPropertyList(payload);
  const allList = Array.isArray(allProperties?.data) ? allProperties.data : [];
  const siteBaseUrl = getSiteBaseUrl();

  const fullItemListJsonLd =
    allList.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: allList.map((p: any, index: number) => ({
            "@type": "ListItem",
            position: index + 1,
            name: `${p?.bedrooms ? `${p.bedrooms}-bedroom ` : ""}${
              p?.propertyType?.name || p?.propertyCategory?.name || "Property"
            } for ${p?.isRent ? "Rent" : "Sale"} in ${
              p?.locationCity || p?.locationArea || "Costa del Sol"
            }`,
            url: `${siteBaseUrl}/costa-del-sol/properties/${generatePropertySlug(p)}`,
          })),
        }
      : null;

  return (
    <>
      {fullItemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(fullItemListJsonLd),
          }}
        />
      )}
      <Suspense>
        <PropertiesClient initialData={initialData} />
      </Suspense>
    </>
  );
}
