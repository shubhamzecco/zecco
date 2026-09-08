import type { Metadata } from "next";
import BlogsClient from "./blogs-client";

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

export default function BlogsPage() {
  return <BlogsClient />;
}
