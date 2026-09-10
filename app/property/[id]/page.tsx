import type { Metadata } from "next";
import { cache } from "react";
import PropertyDetailClient from "./property-detail-client";
import { slugToReadableTitle } from "@/utils/common";
import { serverFetchPropertyDetail } from "@/lib/serverActions";

export const revalidate = 300;

const cachedFetchProperty = cache(async (id: string) => {
  return serverFetchPropertyDetail(id);
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const readableTitle = slugToReadableTitle(id);
  const title = `${readableTitle} | Costa del Sol Real Estate | Zecco`;
  const description = `Explore ${readableTitle} in Costa del Sol, Spain. View photos, floor plans, ROI analysis, and local market insights with Zecco.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/property/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://zw.appristine.co.in/property/${id}`,
      type: "article",
      siteName: "Zecco Real Estate",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const initialProperty = await cachedFetchProperty(id);
  return <PropertyDetailClient initialProperty={initialProperty} />;
}
