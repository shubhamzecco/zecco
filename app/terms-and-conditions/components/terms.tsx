"use client";

import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layouts/main-layout";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";

const TermsConditionPage = () => {
  const { isConnected, sendMessage, lastEvent } = useWebSocket();
  const { mainReducer } = usePosterReducers();

  useEffect(() => {
    if (isConnected) {
      sendMessage("action", {
        type: "termsConditionsService",
        action: "get",
        payload: {},
      });
    }
  }, [isConnected]);

  return (
    <MainLayout chatBotWidget={false}>
      <section className="bg-white py-5 min-h-screen">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">
              {mainReducer?.terms_conditions?.title || "Privacy Policy"}
            </h1>

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
              __html: mainReducer?.terms_conditions?.description || "",
            }}
          />
        </div>
      </section>
    </MainLayout>
  );
};

export default TermsConditionPage;
