"use client";
import BlogCards from "@/components/cards/blog-Card";
import MainLayout from "@/components/layouts/main-layout";
import { useEffect, useState } from "react";
import { strapiGet } from "./strapi/strapiClient";
import { STRAPI_ENDPOINTS } from "./strapi/strapiConstant";

interface BlogImageFormat {
  url: string;
  width: number;
  height: number;
}

interface BlogImage {
  id: number;
  name: string;
  url: string;
  width: number;
  height: number;
  formats?: {
    thumbnail?: BlogImageFormat;
    small?: BlogImageFormat;
    medium?: BlogImageFormat;
    large?: BlogImageFormat;
  };
}

interface BlogContentChild {
  text: string;
  type: string;
}

interface BlogContent {
  type: string;
  children: BlogContentChild[];
}

export interface Blog {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  short_description: string;
  locale: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  content: BlogContent[];
  cover: BlogImage;
  content_image: BlogImage;
  author: {
    id: number;
    name: string;
    email?: string;
    avatar?: BlogImage;
  } | null;
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
  localizations: Blog[];
}

export default function BlogsClient() {
  const [loading, setLoading] = useState(false);
  const [blogList, setBlogList] = useState<Blog[]>();
  const [pagination, setPagination] = useState();

  const fetchArticles = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await strapiGet(STRAPI_ENDPOINTS.GET_ARTICLES(1, "en"));
      setBlogList(res?.data || []);
      setPagination(res?.meta?.pagination || null);
    } catch (err) {
      console.error("Failed to load articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(1);
  }, []);

  return (
    <MainLayout isBreadcrumb>
      <div className="lg:mx-7 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <BlogCards data={blogList || []} />
        </div>
      </div>
    </MainLayout>
  );
}
