"use client";
import { URL } from "@/api/rest/fetchData";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import MainLayout from "@/components/layouts/main-layout";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const detailPage = () => {
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
  return (
    <MainLayout isBreadcrumb>
      <div className="llg:mx-7 px-4 sm:px-6 lg:px-16">
        {/* IMAGE */}
        <div className="relative w-full h-[410px] rounded-2xl overflow-hidden">
          <Image
            src={blog?.image ? URL + blog?.image : ""}
            alt={blog?.name || "blog"}
            fill
            className="object-cover"
          />
        </div>

        {/* CONTENT */}
        <div className="max-w-5xl mx-auto my-10">
          {/* TITLE */}
          <h1 className="text-3xl md:text-5xl font-bold text-[#172131] mb-5">
            {blog?.name}
          </h1>

          {/* SHORT DESCRIPTION */}
          <p className="text-lg text-gray-500 leading-8 mb-8">
            {blog?.description}
          </p>

          {/* PAGE DESCRIPTION HTML */}
          <div
            className="
              prose 
              prose-lg 
              max-w-none
              prose-p:text-gray-600
              prose-span:text-gray-600
              prose-headings:text-[#172131]
            "
            dangerouslySetInnerHTML={{
              __html: blog?.page_description || "",
            }}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default detailPage;
