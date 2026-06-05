"use client";
import { URL } from "@/api/rest/fetchData";
import { App_url, strapi_base_url } from "@/constant/static";
import { clearBreadcrumbs, setBreadcrumbs } from "@/redux/modules/main/action";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";

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
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
  cover: BlogImage;
  localizations: Blog[];
}

interface BlogCardsProps {
  data: Blog[];
  className?: string;
}

const BlogCards: React.FC<BlogCardsProps> = ({ data = [], className = "" }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleNavigate = (blog: Blog) => {
    dispatch(clearBreadcrumbs());
    dispatch(
      setBreadcrumbs([
        { label: "Home", href: "/" },
        {
          label: "Blogs & Insights",
          href: App_url.link.BLOGS,
        },
        {
          label: blog?.title,
          href: `${App_url.link.BLOGS}/${blog.slug}`,
        },
      ]),
    );
    router.push(`${App_url.link.BLOGS}/${blog.slug}`);
  };

  return (
    <>
      {data?.map((blog, index) => (
        <div
          onClick={() => handleNavigate(blog)}
          key={index}
          className="group relative cursor-pointer h-[440px] overflow-hidden shadow-sm"
        >
          {/* IMAGE */}
          <Image
            src={strapi_base_url +  blog.cover?.url}
            alt={blog.cover?.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className="absolute inset-y-0 left-0 right-0
                        bg-gradient-to-t
                        from-[#172131]
                        via-[#172131] via-15%
                        to-transparent
                        pointer-events-none select-none"
          />
          <div className="absolute bottom-0 p-6 text-center w-full">
            <h3 className="text-lg font-manrope font-semibold text-white mb-2">
              {blog.title}
            </h3>
            <p className="text-sm text-center font-manrope font-normal max-w-[18rem] mx-auto text-white/60 leading-relaxed">
              {blog.short_description}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default BlogCards;
