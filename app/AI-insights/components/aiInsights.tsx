"use client";

import { useWebSocket } from "@/api/socket/WebSocketContext";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { IProperty } from "@/redux/modules/main/types";
import { formatEuro } from "@/utils/common";
import {
  ArrowRight,
  Bath,
  BedSingle,
  ChevronDown,
  Cpu,
  Expand,
  FileText,
  Search,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type AiInsightsProps = {
  onGetStarted: () => void;
};

const AiInsights = ({ onGetStarted }: AiInsightsProps) => {
  const { mainReducer } = usePosterReducers();
  const { sendMessage, isConnected } = useWebSocket();

  return (
    <section className="mb-6">
      <h2 className="mb-4 font-inter text-lg font-bold text-[#111827]">
        AI Insights
      </h2>
      {/* STEPS */}
      <div className="my-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
        <div className="flex items-start gap-4 rounded-lg bg-white p-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#4A86E8] p-2">
            <Search size={25} className="text-white" />
          </div>

          <div className="w-[80%]">
            <h1 className="font-inter text-md font-bold text-[#111827]">
              1. Select Property
            </h1>

            <p className="font-inter text-sm font-medium text-[#4B5563]">
              Choose a property based on your location, budget, and preferences.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-lg bg-white p-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#4A86E8] p-2">
            <Cpu size={25} className="text-white" />
          </div>

          <div className="w-[80%]">
            <h1 className="font-inter text-md font-bold text-[#111827]">
              2. AI Analysis
            </h1>

            <p className="font-inter text-sm font-medium text-[#4B5563]">
              Our AI processes property details using market trends, pricing
              data, and comparable properties.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-4 rounded-lg bg-white p-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#4A86E8] p-2">
          <FileText size={25} className="text-white" />
        </div>

        <div className="w-[80%]">
          <h1 className="font-inter text-md font-bold text-[#111827]">
            3. Property Analysis Report
          </h1>

          <p className="font-inter text-sm font-medium text-[#4B5563]">
            Receive a personalized AI-powered report with valuation, investment
            insights, and market recommendations.
          </p>
        </div>
      </div>

      {/* BUTTON */}
      <button
        onClick={() => onGetStarted()}
        className="
          my-4 flex w-fit items-center gap-2
          rounded-[10px] bg-[#111827]
          px-10 py-2.5 text-[15px]
          font-extrabold tracking-wider
          text-white shadow-md
        "
      >
        Get Started
        <ArrowRight size={18} className="ml-2" />
      </button>
    </section>
  );
};

export default AiInsights;
