import type { Metadata } from "next";
import BlogDetailClient from "./blog-detail-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const title = `Blog article ${id} | Zecco`;

  return {
    title,
    description:
      "Read the latest Zecco real estate insights, market updates, and property guidance across Costa del Sol.",
    alternates: {
      canonical: `/blogs/${id}`,
    },
    openGraph: {
      title,
      description:
        "Read the latest Zecco real estate insights, market updates, and property guidance across Costa del Sol.",
      url: `https://zecco.es/blogs/${id}`,
      type: "article",
    },
  };
}

export default function Page() {
  return <BlogDetailClient />;
}
