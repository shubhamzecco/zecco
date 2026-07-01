import type { Metadata } from "next";
import PropertyDetailClient from "./property-detail-client";

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const title = `Property ${params.id} in Costa del Sol | Zecco`;

  return {
    title,
    description:
      "Explore detailed property information, images, and AI market intelligence for premium homes in Costa del Sol.",
    alternates: {
      canonical: `/property/${params.id}`,
    },
    openGraph: {
      title,
      description:
        "Explore detailed property information, images, and AI market intelligence for premium homes in Costa del Sol.",
      url: `https://zecco.es/property/${params.id}`,
      type: "article",
    },
  };
}

export default function Page() {
  return <PropertyDetailClient />;
}
