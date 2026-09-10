import type { Metadata } from "next";
import BlogsClient from "./blogs-client";
import { strapiGet } from "./strapi/strapiClient";
import { STRAPI_ENDPOINTS } from "./strapi/strapiConstant";

// export const revalidate = 300;

export const metadata: Metadata = {
  title: "Real Estate Blogs & Market Insights | Zecco",
  description:
    "Stay informed with Spain's property trends, legal updates, lifestyle guides, and real estate investment insights from Zecco.",
  alternates: {
    canonical: "/blogs",
  },
  openGraph: {
    title: "Real Estate Blogs & Market Insights | Zecco",
    description:
      "Stay informed with Spain's property trends, legal updates, lifestyle guides, and real estate investment insights from Zecco.",
    url: "https://zw.appristine.co.in/blogs",
    type: "website",
  },
};

async function fetchBlogs() {
  try {
    const res = await strapiGet(STRAPI_ENDPOINTS.GET_ARTICLES(1, "en"));
    return {
      data: res?.data || [],
      pagination: res?.meta?.pagination || null,
    };
  } catch (err) {
    return { data: [], pagination: null };
  }
}

export default async function BlogsPage() {
  const initialData = await fetchBlogs();
  return <BlogsClient initialData={initialData} />;
}
