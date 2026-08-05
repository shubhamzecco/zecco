"use client";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { Infrastructure, PropertyAnalysis } from "@/redux/modules/main/types";
import {
  Check,
  Landmark,
  Map,
  ThumbsDown,
  ThumbsUp,
  TrendingUp
} from "lucide-react";
import PricingChart from "./Chart";
import NearByPlaces from "./near-by-palces";
import { formatEuro } from "@/utils/common";

export interface IAiInsightProps {
  ai_insight: PropertyAnalysis;
  isPropertyDetail?:boolean
}

export function AIMarketIntelligence({ ai_insight , isPropertyDetail}: IAiInsightProps) {
  const { mainReducer } = usePosterReducers();
  return (
    <div className={`mb-8 bg-[#fafafa] border border-[#F3F4F6] rounded-xl p-6`}>
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-lg lg:text-xl font-bold font-manrope whitespace-nowrap">
          AI Market Intelligence
        </h2>
        <span className="bg-accent/20 text-accent text-xs font-semibold px-3 py-1 rounded-full">
          Live Analysis
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-md border border-[#F3F4F6]">
          <p className="text-sm text-[#136AED] mb-1 font-manrope font-bold uppercase flex items-center">
            <span>
              <Map className="w-5 h-5 inline mr-2" />
            </span>
            Sub-district avg
          </p>
          <p className="text-2xl font-bold text-heading_text_color flex items-center gap-1 mb-1">
            {formatEuro(ai_insight?.city_avg_price_sqm)}{" "}
            <span className="text-[15px] mt-[6px] text-[#9CA3AF] font-manrope font-bold">
              m²
            </span>
          </p>
          <p className="font-manrope font-medium text-[#9CA3AF] text-xs">
            Based on {ai_insight?.comparables_used} recent sales in{" "}
            {ai_insight?.city
              ?.toLowerCase()
              .replace(/\b\w/g, (char) => char?.toUpperCase())}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md border border-[#F3F4F6]">
          <p className="text-sm text-[#059669] mb-1 font-manrope font-bold uppercase flex items-center">
            <span>
              <TrendingUp className="w-5 h-5 inline mr-2" />
            </span>
            Investment Grade
          </p>
          <p className="text-2xl font-bold text-[#059669] flex items-center gap-1 mb-2">
            {ai_insight?.investment_grade}
          </p>
          <p className="font-manrope font-medium text-[#9CA3AF] text-xs">
            {ai_insight?.investment_opportunity} in  {ai_insight?.city
              ?.toLowerCase()
              .replace(/\b\w/g, (char) => char?.toUpperCase())}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md border border-[#F3F4F6]">
          <p className="text-sm text-[#EA580C] mb-1 font-manrope font-bold uppercase flex items-center">
            <span>
              <Landmark className="w-5 h-5 inline mr-2" />
            </span>
            Area Demand
          </p>
          <p className="text-2xl font-bold text-heading_text_color flex items-center gap-1 mb-2">
            {ai_insight?.growth_label}
          </p>
          <p className="font-manrope font-medium text-[#9CA3AF] text-xs">
            Fast-moving market
          </p>
        </div>
      </div>

      {/* Pricing Chart */}
      <div className="bg-white lg:p-6  rounded-xl mb-6">
        <div className="flex max-md:flex-col max-md:p-6 items-center justify-between">
          <h3 className="font-bold text-heading_text_color text-md lg:text-lg mb-4 font-manrope">
            Pricing Trajectory
          </h3>
          <p className="font-manrope font-medium text-[#9CA3AF] text-sm">
            Avg. Price / m²
          </p>
        </div>
        <div className="h-48 flex items-end justify-between gap-2 lg:px-4 mt-20">
          <PricingChart chart_data={ai_insight?.pricing_trajectory} />
        </div>
      </div>

      {/* Advantages & Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-md p-5 rounded-xl">
          <h4 className="font-manrope font-bold text-[#059669] text-md mb-3 flex items-center gap-2">
            <ThumbsUp className="w-5 h-5 -mt-[2px]" />
            Strategic Advantages
          </h4>
          <ul className="list-disc pl-5 text-[15px] font-manrope font-medium text-[#64748B] space-y-2 marker:text-green-500 marker:h-2">
            <li>{ai_insight?.ai_report?.strategic_advantages?.[0]}</li>
            <li>{ai_insight?.ai_report?.strategic_advantages?.[1]}</li>
            <li>{ai_insight?.ai_report?.strategic_advantages?.[2]}</li>
          </ul>
        </div>
        <div className="bg-white shadow-md p-5 rounded-xl">
          <h4 className="font-manrope font-bold text-[#DC2626] text-md mb-3 flex items-center gap-2">
            <ThumbsDown className="w-5 h-5 mt-[4px]" />
            Market Risks
          </h4>
          <ul className="list-disc pl-5 text-[15px] font-manrope font-medium text-[#64748B] space-y-2 marker:text-[#F87171] marker:h-2">
            <li>{ai_insight?.ai_report?.market_risks?.[0]}</li>
            <li>{ai_insight?.ai_report?.market_risks?.[1]}</li>
            <li>{ai_insight?.ai_report?.market_risks?.[2]}</li>
          </ul>
        </div>
      </div>
      <div className="bg-white shadow-md p-5 rounded-xl mt-6">
        <h3 className="font-bold text-heading_text_color text-md lg:text-lg mb-4 font-manrope">
          Property Summary
        </h3>

        <ul className="space-y-3 text-sm">
          {Object.entries(
            mainReducer?.ai_insight?.ai_report?.ai_summary || {},
          ).map(([key, value], i) => {
            const formattedTitle = key
              .replace(/[_-]/g, " ") // remove _ and -
              .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize words

            return (
              <li key={i} className="flex gap-2 items-center">
                <span className="text-[#059669] mt-0.5 border-2 border-[#059669] rounded-full p-[2px]">
                  <Check size={15} />
                </span>

                <span className="font-manrope font-medium text-[#64748B]">
                  <span className="font-bold font-manrope text-[#111827]">
                    {formattedTitle}:
                  </span>{" "}
                  {value}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      {mainReducer?.ai_insight?.infrastructure &&
        Object.keys(mainReducer?.ai_insight?.infrastructure || {}).length > 0 && (
          <NearByPlaces
            near_places={
              mainReducer?.ai_insight?.infrastructure as Infrastructure
            }
          />
        )}
    </div>
  );
}
