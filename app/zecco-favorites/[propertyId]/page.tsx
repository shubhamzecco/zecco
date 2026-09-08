import type { Metadata } from "next";
import PropertyDetailClient from "@/app/property/[id]/property-detail-client";
import { slugToReadableTitle } from "@/utils/common";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}): Promise<Metadata> {
  const { propertyId } = await params;
  const readableTitle = slugToReadableTitle(propertyId);
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

export default function Page() {
  return <PropertyDetailClient />;
}
