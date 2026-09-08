"use client";

import React, { useEffect } from "react";
import MainLayout from "@/components/layouts/main-layout";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";

interface PolicyPageProps {
  initialData?: {
    title?: string;
    description?: string;
  };
}

const PolicyPage = ({ initialData }: PolicyPageProps) => {
  const { isConnected, sendMessage } = useWebSocket();
  const { mainReducer } = usePosterReducers();

  useEffect(() => {
    if (isConnected) {
      sendMessage("action", {
        type: "privacyPolicyService",
        action: "get",
        payload: {},
      });
    }
  }, [isConnected]);

  const title = mainReducer?.privacy_policy?.title || initialData?.title || "Privacy Policy";
  const descriptionHtml = mainReducer?.privacy_policy?.description || initialData?.description || "";

  return (
    <MainLayout chatBotWidget={false}>
      <section className="bg-white py-5 min-h-screen">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">{title}</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] rounded-full"></div>
          </div>

          <div
            className="
              prose
              prose-lg
              max-w-none
              text-base
              prose-headings:text-black
              prose-p:text-gray-700
              prose-li:text-gray-700
            "
            dangerouslySetInnerHTML={{
              __html: descriptionHtml,
            }}
          />
        </div>
      </section>
    </MainLayout>
  );
};

export default PolicyPage;
