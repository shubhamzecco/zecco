"use client";

import { useWebSocket } from "@/api/socket/WebSocketContext";
import CommonCard from "@/components/cards/common-card";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { IProperty } from "@/redux/modules/main/types";
import {
  ArrowRight,
  Sparkles
} from "lucide-react";
import FavoritesPage from "./favorites";
import { useState } from "react";
import { useRouter } from "next/navigation";

type AiInsightsProps = {
  onGetStarted: (property: IProperty) => void;
};

const AiInsights = ({ onGetStarted }: AiInsightsProps) => {
  const { mainReducer } = usePosterReducers();
  const [property, setProperty] = useState<any>()
  const router = useRouter()

  return (
    <CommonCard className="mt-5 px-3">
      <h2 className="mb-2 font-manrope text-2xl text-center font-bold text-[#111827]">
        Step 01 — Select Your Property
      </h2>
      <p className="font-manrope text-base text-center font-normal text-[#64748B]">Choose a property from your saved properties to generate an AI-powered investment report.</p>

      <FavoritesPage onGetStarted={(data) => setProperty(data)} />

      {mainReducer?.favorite_property_list?.data && mainReducer.favorite_property_list.data.length > 0 && (
        <>
          <button
            onClick={() => onGetStarted(property)}
            className="relative w-fit mx-auto mt-8 text-xs sm:text-sm whitespace-nowrap my-5 py-3.5 px-4 sm:px-10 rounded-full flex items-center bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] text-white font-manrope font-medium shadow-md disabled:opacity-50 "
          >
            <Sparkles size={18} className="mr-2" />
            Select the property to generate AI reports
          </button>
          <p className="font-normal text-xs sm:text-sm mb-4 font-manrope text-[#64748B] text-center">⚡ Powered by Zecco AI · Free for Premium Members</p>

          <button
            onClick={() => router.push("/costa-del-sol/properties?select=true")}
            className="relative w-fit mx-auto mt-8 text-xs sm:text-sm whitespace-nowrap my-5 py-3.5 px-4 sm:px-10 rounded-full flex items-center bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] text-white font-manrope font-medium shadow-md disabled:opacity-50 "
          >
            Browse Properties
          </button>
        </>
      )}

    </CommonCard>
  );
};

export default AiInsights;
