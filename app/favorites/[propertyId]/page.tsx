import type { Metadata } from "next";
import PropertyDetailClient from "@/app/property/[id]/property-detail-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ location: string; propertyId: string }>;
}): Promise<Metadata> {
  const { location, propertyId } = await params;
  const title = `Property ${propertyId} in Costa del Sol | Zecco`;

  return {
    title,
    description:
      "Explore detailed property information, images, and AI market intelligence for premium homes in Costa del Sol.",
    alternates: {
      canonical: `/costa-del-sol/${location}/${propertyId}`,
    },
    openGraph: {
      title,
      description:
        "Explore detailed property information, images, and AI market intelligence for premium homes in Costa del Sol.",
      url: `https://zecco.es/costa-del-sol/${location}/${propertyId}`,
      type: "article",
    },
  };
}

export default function Page() {
  return <PropertyDetailClient />;
}
