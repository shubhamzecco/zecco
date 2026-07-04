"use client";
import { URL } from "@/api/rest/fetchData";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import MainLayout from "@/components/layouts/main-layout";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function BlogDetailClient() {
  const id = useParams();
  const { mainReducer } = usePosterReducers();
  const { sendMessage, isConnected } = useWebSocket();

  useEffect(() => {
    sendMessage("action", {
      type: "blogService",
      action: "get",
      payload: {
        id: id?.id,
      },
    });
  }, [isConnected]);

  const blog = mainReducer?.blog_details;

  const jsonLd = blog
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: blog?.name,
        description: blog?.description,
        image: blog?.image ? URL + blog?.image : undefined,
        mainEntityOfPage: `https://zecco.es/blogs/${id?.id}`,
        author: {
          "@type": "Organization",
          name: "Zecco Real Estate",
        },
        publisher: {
          "@type": "Organization",
          name: "Zecco Real Estate",
          logo: {
            "@type": "ImageObject",
            url: "https://zecco.es/assets/images/logo.png",
          },
        },
      }
    : null;

  return (
    <MainLayout isBreadcrumb>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <div className="llg:mx-7 px-4 sm:px-6 lg:px-16">
        <div className="relative w-full h-[410px] rounded-2xl overflow-hidden">
          <Image
            src={blog?.image ? URL + blog?.image : ""}
            alt={blog?.name || "blog"}
            fill
            className="object-cover"
          />
        </div>
        <div className="max-w-5xl mx-auto my-10">
          <h1 className="text-3xl md:text-5xl font-bold text-[#172131] mb-5">
            {blog?.name}
          </h1>
          <p className="text-lg text-gray-500 leading-8 mb-8">
            {blog?.description}
          </p>
          <div
            className="prose prose-lg max-w-none prose-p:text-gray-600 prose-span:text-gray-600 prose-headings:text-[#172131]"
            dangerouslySetInnerHTML={{
              __html: blog?.page_description || "",
            }}
          />
        </div>
      </div>
    </MainLayout>
  );
}
