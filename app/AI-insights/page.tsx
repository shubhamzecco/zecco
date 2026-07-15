"use client";

import CommonApiRequest from "@/api/rest/fetchData";
import Head from "next/head";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setAiInsight } from "@/redux/modules/main/action";
import { IProperty, IPropertyResponse } from "@/redux/modules/main/types";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import AiInsights from "./components/aiInsights";
import AIProcessingCard from "./components/analyzing-property-details";
import PropertyInsights from "./components/property-insights";
import { useRouter } from "next/navigation";
import FavoritesPage from "./components/favorites";
import SavedAiInsights from "./components/savedaiInsights";
import CommonCard from "@/components/cards/common-card";

const AIInsights = () => {
  const [step, setStep] = useState("intro");
  const { mainReducer, user_data } = usePosterReducers();
  const dispatch = useDispatch();
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<IProperty | null>(
    null,
  );
  const route = useRouter();

  useEffect(() => {
    const firstProperty = mainReducer?.favorite_property_list?.data?.[0];

    if (firstProperty) {
      setSelectedProperty(firstProperty);
    }
  }, [mainReducer?.favorite_property_list]);

  const handleStarted = (property: IProperty) => {
    if (!property?._id) return;
    setStep("processing");
    setIsCompleted(false);
    CommonApiRequest(
      "GET",
      `${App_url.endpoint_url.AI_INSIGHT}/${property?._id}/${user_data?.user?._id}`,
      {},
      {},
      //   true,
    )?.then((response: any) => {
      if (response?.status === 200) {
        dispatch(setAiInsight(response?.data));
        setStep("complete");
        setIsCompleted(true);
      } else {
        setStep("intro");
        dispatch(setAiInsight({} as IPropertyResponse));
        toast.error(response?.data?.message);
      }
    });
  };

  const activeStep =
    step === "complete" ? 3 : step === "processing" ? 2 : 1;

  return (
    <SidebarLayout>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <CommonCard>
        <div className="flex justify-center">
          <div className="flex flex-col items-center w-full max-w-2xl">
            {/* Circles + Lines */}
            <div className="flex items-center w-full">
              <CircleStep step={1} activeStep={activeStep} />
              <div className={`flex-1 h-0.5 rounded-full transition-colors duration-500 ${activeStep >= 2 ? "bg-[#2563EB]" : "bg-gray-200"}`} />
              <CircleStep step={2} activeStep={activeStep} />
              <div className={`flex-1 h-0.5 rounded-full transition-colors duration-500 ${activeStep >= 3 ? "bg-[#2563EB]" : "bg-gray-200"}`} />
              <CircleStep step={3} activeStep={activeStep} />
            </div>
            {/* Labels */}
            <div className="flex w-full mt-2">
              <div className="w-9 flex justify-center"><span className={`text-xs sm:text-sm font-manrope whitespace-nowrap transition-colors duration-500 ${activeStep === 1 ? "font-bold text-[#0F172A]" : activeStep > 1 ? "font-semibold text-[#2563EB]" : "text-gray-400"}`}>Select Property</span></div>
              <div className="flex-1" />
              <div className="w-9 flex justify-center"><span className={`text-xs sm:text-sm font-manrope whitespace-nowrap transition-colors duration-500 ${activeStep === 2 ? "font-bold text-[#0F172A]" : activeStep > 2 ? "font-semibold text-[#2563EB]" : "text-gray-400"}`}>AI Analyze</span></div>
              <div className="flex-1" />
              <div className="w-9 flex justify-center"><span className={`text-xs sm:text-sm font-manrope whitespace-nowrap transition-colors duration-500 ${activeStep === 3 ? "font-bold text-[#0F172A]" : "text-gray-400"}`}>AI Report</span></div>
            </div>
          </div>
        </div>
      </CommonCard>

      {step === "intro" && (
        <AiInsights onGetStarted={handleStarted}/>
      )}

      {/* {step === "grid" && <FavoritesPage onGetStarted={handleStarted} />} */}

      {step === "processing" && (
        <AIProcessingCard
          isCompleted={isCompleted}
          onComplete={() => setStep("complete")}
        />
      )}

      {step === "complete" && mainReducer?.ai_insight && <PropertyInsights />}
    </SidebarLayout>
  );
};

export default AIInsights;



function CircleStep({ step, activeStep }: { step: number; activeStep: number }) {
  const isActive = step === activeStep;
  const isCompleted = step < activeStep;

  return (
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-all duration-500 ${
        isActive
          ? "bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] text-white shadow-lg shadow-blue-500/30 scale-110"
          : isCompleted
            ? "bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] text-white"
            : "bg-gray-100 text-gray-400 border-2 border-gray-200"
      }`}
    >
      {isCompleted ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        step
      )}
    </div>
  );
}