import type { Metadata } from "next";
import PropertyDetailClient from "./property-detail-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const title = `Property ${id} in Costa del Sol | Zecco`;

  return {
    title,
    description:
      "Explore detailed property information, images, and AI market intelligence for premium homes in Costa del Sol.",
    alternates: {
      canonical: `/property/${id}`,
    },
    openGraph: {
      title,
      description:
        "Explore detailed property information, images, and AI market intelligence for premium homes in Costa del Sol.",
      url: `https://zecco.es/property/${id}`,
      type: "article",
    },
  };
}

export default function Page() {
  return <PropertyDetailClient />;
}
