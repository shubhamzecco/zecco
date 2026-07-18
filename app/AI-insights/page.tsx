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
import SavedAiInsights from "./components/savedaiInsights";
import CommonCard from "@/components/cards/common-card";
import { Sparkles, ArrowLeft, MousePointerClick, Brain, FileBarChart } from "lucide-react";

const AIInsights = () => {
  const [step, setStep] = useState("intro");
  const [showNewInsight, setShowNewInsight] = useState(false);
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

      {!showNewInsight && step === "intro" && (
        <CommonCard className="mb-5">
          <div className="text-center mb-5">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/20">
              <Sparkles size={24} className="text-white" />
            </div>
            <h2 className="font-manrope text-xl font-bold text-[#0F172A] mb-1">
              Generate New AI Insight
            </h2>
            <p className="font-manrope text-sm text-[#64748B] max-w-lg mx-auto">
              Get an AI-powered investment report for any of your saved properties in 3 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-[#F8FAFC]">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                <MousePointerClick size={20} className="text-[#2563EB]" />
              </div>
              <h3 className="font-manrope text-sm font-bold text-[#0F172A] mb-1">1. Select Property</h3>
              <p className="font-manrope text-xs text-[#64748B]">Choose a property from your saved favorites list.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-[#F8FAFC]">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                <Brain size={20} className="text-[#2563EB]" />
              </div>
              <h3 className="font-manrope text-sm font-bold text-[#0F172A] mb-1">2. AI Analyzes</h3>
              <p className="font-manrope text-xs text-[#64748B]">Our AI evaluates market data, location, and property details.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-[#F8FAFC]">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                <FileBarChart size={20} className="text-[#2563EB]" />
              </div>
              <h3 className="font-manrope text-sm font-bold text-[#0F172A] mb-1">3. Get Report</h3>
              <p className="font-manrope text-xs text-[#64748B]">Receive your personalized AI investment report instantly.</p>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setShowNewInsight(true)}
              className="relative w-fit mx-auto text-xs sm:text-sm whitespace-nowrap py-3.5 px-4 sm:px-10 rounded-full flex items-center bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] text-white font-manrope font-medium shadow-md disabled:opacity-50 "
            >
              <Sparkles size={18} className="mr-2" />
              Generate New AI Insight
            </button>
          </div>
        </CommonCard>
      )}

      {!showNewInsight && <SavedAiInsights />}


      {showNewInsight && (
        <>
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => {
                setShowNewInsight(false);
                setStep("intro");
              }}
              className="flex items-center gap-2 text-sm font-manrope font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Saved Insights
            </button>
          </div>

          <CommonCard className="!p-4 sm:!p-6">
            <div className="text-center mb-4">
              <h2 className="font-manrope text-lg sm:text-xl font-bold text-[#0F172A] mb-1">
                {step === "intro" && "Step 1 — Select a Property"}
                {step === "processing" && "Step 2 — AI Analyzing"}
                {step === "complete" && "Step 3 — Your AI Report"}
              </h2>
              <p className="font-manrope text-xs sm:text-sm text-[#64748B]">
                {step === "intro" && "Choose a favorite property below to generate an AI-powered investment report."}
                {step === "processing" && "Our AI is analyzing the property data. This may take a moment."}
                {step === "complete" && "Review your personalized AI investment analysis."}
              </p>
            </div>

            <div className="flex justify-center">
              <div className="flex flex-col items-center w-full max-w-2xl px-6 lg:px-0">
                <div className="flex items-center w-full">
                  <CircleStep step={1} activeStep={activeStep} />
                  <div className={`flex-1 h-0.5 rounded-full transition-colors duration-500 ${activeStep >= 2 ? "bg-[#2563EB]" : "bg-gray-200"}`} />
                  <CircleStep step={2} activeStep={activeStep} />
                  <div className={`flex-1 h-0.5 rounded-full transition-colors duration-500 ${activeStep >= 3 ? "bg-[#2563EB]" : "bg-gray-200"}`} />
                  <CircleStep step={3} activeStep={activeStep} />
                </div>
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

          {step === "processing" && (
            <AIProcessingCard
              isCompleted={isCompleted}
              onComplete={() => setStep("complete")}
            />
          )}

          {step === "complete" && mainReducer?.ai_insight && <PropertyInsights />}
        </>
      )}
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