import type { Metadata } from "next";
import { cache } from "react";
import PropertyDetailClient from "@/app/property/[id]/property-detail-client";
import { slugToReadableTitle, generatePropertySlug } from "@/utils/common";
import { serverFetchPropertyDetail } from "@/lib/serverActions";

export const revalidate = 300;

const cachedFetchProperty = cache(async (propertyId: string) => {
  return serverFetchPropertyDetail(propertyId);
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}): Promise<Metadata> {
  const { propertyId } = await params;
  const initialProperty = await cachedFetchProperty(propertyId);
  const readableTitle = initialProperty
    ? slugToReadableTitle(generatePropertySlug(initialProperty))
    : slugToReadableTitle(propertyId);
  const title = `${readableTitle} | Zecco's Favorites`;

  return {
    title,
    description:
      "Explore detailed property information, images, and AI market intelligence for this Zecco favorite in Costa del Sol.",
    alternates: {
      canonical: `/zecco-favorites/${propertyId}`,
    },
    openGraph: {
      title,
      description:
        "Explore detailed property information, images, and AI market intelligence for this Zecco favorite in Costa del Sol.",
      url: `https://zw.appristine.co.in/zecco-favorites/${propertyId}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description:
        "Explore detailed property information, images, and AI market intelligence for this Zecco favorite in Costa del Sol.",
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;
  const initialProperty = await cachedFetchProperty(propertyId);

  return <PropertyDetailClient initialProperty={initialProperty} />;
}
