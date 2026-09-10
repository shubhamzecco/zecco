import type { Metadata } from "next";
import { cache } from "react";
import BlogDetailClient from "./blog-detail-client";
import { strapiGet } from "../strapi/strapiClient";
import { STRAPI_ENDPOINTS } from "../strapi/strapiConstant";

export const revalidate = 300;

const cachedFetchBlog = cache(async (id: string) => {
  try {
    const res = await strapiGet(
      STRAPI_ENDPOINTS.GET_ARTICLES_BY_SLUG(String(id), "en"),
    );
    return res?.data?.[0] || null;
  } catch (err) {
    return null;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = await cachedFetchBlog(id);
  const attrs = article?.attributes || article || {};
  const title = attrs?.title || `Blog article ${id} | Zecco`;
  const description =
    attrs?.short_description ||
    "Read the latest Zecco real estate insights, market updates, and property guidance across Costa del Sol.";
  const publishedAt = attrs?.publishedAt || attrs?.createdAt;

  return {
    title,
    description,
    alternates: {
      canonical: `/blogs/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://zw.appristine.co.in/blogs/${id}`,
      type: "article",
      ...(publishedAt ? { publishedTime: publishedAt } : {}),
      ...(attrs?.author?.name
        ? { authors: [attrs.author.name] }
        : {}),
      ...(attrs?.category?.name
        ? { section: attrs.category.name }
        : {}),
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
  const initialBlog = await cachedFetchBlog(id);
  return <BlogDetailClient initialBlog={initialBlog} />;
}
