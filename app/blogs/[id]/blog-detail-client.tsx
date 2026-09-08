"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

import MainLayout from "@/components/layouts/main-layout";
import { customToast } from "@/components/customToast";

import { STRAPI_ENDPOINTS } from "../strapi/strapiConstant";
import { strapiGet } from "../strapi/strapiClient";

const STRAPI_URL = "http://localhost:1337";

interface ContentChild {
  text: string;
  type: string;
}

interface ContentImage {
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
}

interface ContentItem {
  type: string;
  level?: number;
  children?: ContentChild[];
  image?: ContentImage;
}
interface ImageFormats {
  large?: {
    url: string;
  };
  medium?: {
    url: string;
  };
  small?: {
    url: string;
  };
  thumbnail?: {
    url: string;
  };
}

interface BlogImage {
  url: string;
  formats?: ImageFormats;
}

interface Blog {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  publishedAt: string;
  content: ContentItem[];

  cover: BlogImage;

  content_image: BlogImage;
}

const DetailPage = ({ initialBlog }: { initialBlog?: Blog | null }) => {
  const params = useParams();

  const [blog, setBlog] = useState<Blog | null>(initialBlog || null);
  const [loading, setLoading] = useState(!initialBlog);

  useEffect(() => {
    async function fetchArticle() {
      try {
        setLoading(true);

        const res = await strapiGet(
          STRAPI_ENDPOINTS.GET_ARTICLES_BY_SLUG(
            String(params?.id),
            "en"
          )
        );

        const articleData = res?.data?.[0];

        if (!articleData) {
          customToast.error("Article not found");
          return;
        }

        setBlog(articleData);
      } catch (error) {
        console.error(error);
        customToast.error("Failed to load article");
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [params]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl font-semibold text-gray-500">
            Loading...
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout isBreadcrumb>
      <div className="bg-[#f8f8f8] min-h-screen">
        {/* HERO SECTION */}
        <section className="relative w-full h-[550px] overflow-hidden">
          <Image
            src={`${STRAPI_URL}${blog?.cover?.url}`}
            alt={blog?.title || "blog"}
            fill
            priority
            className="object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/45" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="max-w-7xl mx-auto px-5 lg:px-10 pb-16">
              <div className="max-w-4xl">
                <p className="uppercase tracking-[4px] text-white/80 text-sm mb-5">
                  Luxury Real Estate
                </p>

                <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight">
                  {blog?.title}
                </h1>

                <p className="mt-6 text-lg text-gray-200 leading-8 max-w-3xl">
                  {blog?.short_description}
                </p>

                <div className="mt-8 flex items-center gap-4 text-white/80 text-sm">
                  <span>
                    {new Date(
                      blog?.publishedAt || ""
                    ).toDateString()}
                  </span>

                  <span>•</span>

                  <span>5 min read</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="max-w-5xl mx-auto px-5 lg:px-0 py-16">
          {/* CONTENT IMAGE */}
          <div className="relative w-full h-[500px] rounded-[30px] overflow-hidden shadow-2xl mb-14">
            <Image
              src={`${STRAPI_URL}${blog?.content_image?.url}`}
              alt={blog?.title || "blog"}
              fill
              className="object-cover"
            />
          </div>

          {/* BLOG CONTENT */}
          <div className="bg-white rounded-[30px] p-6 md:p-12 shadow-sm">
            <div className="space-y-8">
              {/* BLOG CONTENT RENDERER */}

              <div className="space-y-8">
                <div className="max-w-7xl mx-auto py-12">

                  {/* BLOG CONTENT */}
                  <div className="space-y-8">

                    {blog?.content?.map((item: any, index: number) => {

                      /* ================= HEADING ================= */

                      if (item?.type === "heading") {

                        const text = item?.children
                          ?.map((child: any) => child?.text)
                          ?.join("");

                        const headingClass = `
        font-bold
        text-[#172131]
        leading-tight
        ${item?.level === 1
                            ? "text-5xl"
                            : item?.level === 2
                              ? "text-4xl"
                              : item?.level === 3
                                ? "text-3xl"
                                : item?.level === 4
                                  ? "text-2xl"
                                  : "text-xl"
                          }
      `;

                        switch (item?.level) {

                          case 1:
                            return (
                              <h1 key={index} className={headingClass}>
                                {text}
                              </h1>
                            );

                          case 2:
                            return (
                              <h2 key={index} className={headingClass}>
                                {text}
                              </h2>
                            );

                          case 3:
                            return (
                              <h3 key={index} className={headingClass}>
                                {text}
                              </h3>
                            );

                          case 4:
                            return (
                              <h4 key={index} className={headingClass}>
                                {text}
                              </h4>
                            );

                          default:
                            return (
                              <h5
                                key={index}
                                className={`${headingClass} italic`}
                              >
                                {text}
                              </h5>
                            );
                        }
                      }

                      /* ================= PARAGRAPH ================= */

                      if (item?.type === "paragraph") {

                        // CHECK PREVIOUS ITEM
                        const prevItem = blog?.content?.[index - 1];

                        // IMAGE + CONTENT SIDE BY SIDE
                        if (prevItem?.type === "image") {

                          return (
                            <div
                              key={index}
                              className={`
              grid
              grid-cols-1
              lg:grid-cols-2
              gap-10
              items-center
              my-10
            `}
                            >

                              {/* IMAGE LEFT / RIGHT */}
                              <div
                                className={`
                relative
                overflow-hidden
                rounded-[28px]
                h-[420px]
                group
                ${index % 2 === 0 ? "lg:order-2" : ""}
              `}
                              >
                                <Image
                                  src={prevItem?.image?.url ?? ''}
                                  alt={
                                    prevItem?.image?.alternativeText ||
                                    "blog-image"
                                  }
                                  fill
                                  className="
                  object-cover
                  transition-all
                  duration-700
                  group-hover:scale-110
                "
                                />

                                {/* OVERLAY */}
                                <div
                                  className="
                  absolute
                  inset-0
                  bg-black/10
                "
                                />

                                {/* SHINE EFFECT */}
                                <div
                                  className="
                  absolute
                  top-0
                  -left-[100%]
                  w-[40%]
                  h-full
                  bg-gradient-to-r
                  from-transparent
                  via-white/40
                  to-transparent
                  skew-x-[-20deg]
                  group-hover:left-[140%]
                  transition-all
                  duration-[1200ms]
                "
                                />
                              </div>

                              {/* CONTENT */}
                              <div
                                className={`
                ${index % 2 === 0 ? "lg:order-1" : ""}
              `}
                              >
                                <p
                                  className="
                  text-[18px]
                  leading-[38px]
                  text-gray-600
                  font-light
                "
                                >
                                  {item?.children?.map(
                                    (child: any, childIndex: number) => (
                                      <span
                                        key={childIndex}
                                        className={`
                        ${child?.bold ? "font-semibold text-[#172131]" : ""}
                        ${child?.italic ? "italic" : ""}
                        ${child?.underline ? "underline" : ""}
                      `}
                                      >
                                        {child?.text}
                                      </span>
                                    )
                                  )}
                                </p>
                              </div>
                            </div>
                          );
                        }

                        // NORMAL PARAGRAPH
                        return (
                          <p
                            key={index}
                            className="
            text-[18px]
            leading-[38px]
            text-gray-600
            font-light
          "
                          >
                            {item?.children?.map(
                              (child: any, childIndex: number) => (
                                <span
                                  key={childIndex}
                                  className={`
                  ${child?.bold ? "font-semibold text-[#172131]" : ""}
                  ${child?.italic ? "italic" : ""}
                  ${child?.underline ? "underline" : ""}
                `}
                                >
                                  {child?.text}
                                </span>
                              )
                            )}
                          </p>
                        );
                      }

                      /* ================= SINGLE IMAGE ================= */

                      if (item?.type === "image") {

                        // IF NEXT ITEM IS PARAGRAPH
                        // IMAGE WILL BE RENDERED WITH CONTENT
                        // SO SKIP HERE
                        const nextItem = blog?.content?.[index + 1];

                        if (nextItem?.type === "paragraph") {
                          return null;
                        }

                        // ONLY IMAGE
                        return (
                          <div
                            key={index}
                            className="
            relative
            overflow-hidden
            rounded-[28px]
            h-[500px]
            my-12
            group
          "
                          >
                            <Image
                              src={item?.image?.url}
                              alt={
                                item?.image?.alternativeText ||
                                "blog-image"
                              }
                              fill
                              className="
              object-cover
              transition-all
              duration-700
              group-hover:scale-105
            "
                            />

                            <div
                              className="
              absolute
              inset-0
              bg-black/10
            "
                            />
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default DetailPage;