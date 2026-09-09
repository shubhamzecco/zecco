import type { Metadata } from "next";
import PropertyDetailClient from "@/app/property/[id]/property-detail-client";
import { serverFetchPropertyDetail } from "@/lib/serverActions";
import { slugToReadableTitle } from "@/utils/common";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const initialProperty = await serverFetchPropertyDetail(slug);
  const propertyTitle = initialProperty
    ? `${slugToReadableTitle(slug)} | Zecco Real Estate`
    : `Property in Costa del Sol | Zecco`;

  return {
    title: propertyTitle,
    description:
      "Explore detailed property information, images, and AI market intelligence for premium homes in Costa del Sol.",
    alternates: {
      canonical: `/costa-del-sol/properties/${slug}`,
    },
    openGraph: {
      title: propertyTitle,
      description:
        "Explore detailed property information, images, and AI market intelligence for premium homes in Costa del Sol.",
      url: `https://zw.appristine.co.in/costa-del-sol/properties/${slug}`,
      type: "article",
      images: Array.isArray(initialProperty?.propertyImages) &&
        initialProperty.propertyImages.length > 0
        ? [{ url: initialProperty.propertyImages[0]?.url }]
        : undefined,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const initialProperty = await serverFetchPropertyDetail(slug);

  return <PropertyDetailClient initialProperty={initialProperty} />;
}
