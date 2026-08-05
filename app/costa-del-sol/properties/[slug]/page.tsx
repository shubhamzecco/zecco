import type { Metadata } from "next";
import PropertyDetailClient from "@/app/property/[id]/property-detail-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = `Property in Costa del Sol | Zecco`;

  return {
    title,
    description: "Explore detailed property information, images, and AI market intelligence for premium homes in Costa del Sol.",
    alternates: {
      canonical: `/costa-del-sol/properties/${slug}`,
    },
    openGraph: {
      title,
      description: "Explore detailed property information, images, and AI market intelligence for premium homes in Costa del Sol.",
      url: `https://zecco.es/costa-del-sol/properties/${slug}`,
      type: "article",
    },
  };
}

export default function Page() {
  return <PropertyDetailClient />;
}
