import type { Metadata } from "next";
import BlogDetailClient from "./blog-detail-client";
import { strapiGet } from "../strapi/strapiClient";
import { STRAPI_ENDPOINTS } from "../strapi/strapiConstant";

export const dynamic = "force-dynamic";

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
      url: `https://zw.appristine.co.in/blogs/${id}`,
      type: "article",
    },
  };
}

async function fetchBlog(params: Promise<{ id: string }>) {
  const { id } = await params;
  try {
    const res = await strapiGet(
      STRAPI_ENDPOINTS.GET_ARTICLES_BY_SLUG(String(id), "en"),
    );
    return res?.data?.[0] || null;
  } catch (err) {
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const initialBlog = await fetchBlog(params);
  return <BlogDetailClient initialBlog={initialBlog} />;
}
