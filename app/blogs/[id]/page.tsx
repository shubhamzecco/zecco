import type { Metadata } from "next";
import BlogDetailClient from "./blog-detail-client";

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const title = `Blog article ${params.id} | Zecco`;

  return {
    title,
    description:
      "Read the latest Zecco real estate insights, market updates, and property guidance across Costa del Sol.",
    alternates: {
      canonical: `/blogs/${params.id}`,
    },
    openGraph: {
      title,
      description:
        "Read the latest Zecco real estate insights, market updates, and property guidance across Costa del Sol.",
      url: `https://zecco.es/blogs/${params.id}`,
      type: "article",
    },
  };
}

export default function Page() {
  return <BlogDetailClient />;
}
