"use client";
import CommonApiRequest from "@/api/rest/fetchData";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import AIProcessingCard from "@/app/AI-insights/components/analyzing-property-details";
import MainLayout from "@/components/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setAiInsight } from "@/redux/modules/main/action";
import {
  Property,
  PropertyAnalysis
} from "@/redux/modules/main/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AIMarketIntelligence } from "./components/AIMarketIntelligence";
import { AgentCard } from "./components/AgentCard";
import BasicFeatures from "./components/BasicFeatures";
import PropertyGallery from "./components/ImageGallery";
import { MapSection } from "./components/MapSection";
import { PropertyDescription } from "./components/PropertyDescription";
import { PropertyInfo } from "./components/PropertyInfo";
import PropertyStats from "./components/PropertyStats";
import ZeccoFavorites from "./components/ZeccoFavorites";

const Page = () => {
  const { sendMessage, isConnected } = useWebSocket();
  const { mainReducer , user_data } = usePosterReducers();
  const params = useParams();
  const dispatch = useDispatch();
  const [step, setStep] = useState("intro");
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isConnected || !params?.id) return;

    sendMessage("action", {
      type: "propertyService",
      action: "get",
      payload: {
        id: params.id,
      },
    });
  }, [isConnected, params?.id]);

  const handleAIInsight = () => {
    setStep("processing");
    setIsCompleted(false);
    CommonApiRequest(
      "GET",
      `${App_url.endpoint_url?.AI_INSIGHT}/${params.id}`,
      {},
      {},
      // true,
    )?.then((response: any) => {
      if (response?.status === 200) {
        dispatch(setAiInsight(response?.data));
        setStep("complete");
        setIsCompleted(true);
      } else {
        dispatch(setAiInsight(response?.data));
      }
    });
  };

  return (
    <MainLayout isBreadcrumb isPropertyDetails chatBotWidget={false}>
      <div className="lg:mx-7 px-4 sm:px-6 lg:px-8">
        <div className="lg:col-span-1">
          <PropertyGallery
            property={mainReducer?.property_details?.images as string[]}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PropertyInfo
              property={mainReducer?.property_details as Property}
            />
            <PropertyStats
              property={mainReducer?.property_details as Property}
            />
            <div className="flex items-center gap-5 mb-2">
              <Button
                type="submit"
                onClick={() => handleAIInsight()}
                className="w-full capitalize bg-[#136AED] shadow-[#BFDBFE] h-11 my-4 text-white rounded-full shadow-md"
              >
                AI Market Intelligence
              </Button>
            </div>
            {step === "processing" && (
              <AIProcessingCard
                isCompleted={isCompleted}
                onComplete={() => setStep("complete")}
                heading="AI Market Intelligence"
              />
            )}
            {step === "complete" && (
              <AIMarketIntelligence
                ai_insight={mainReducer?.ai_insight as PropertyAnalysis}
              />
            )}
            <PropertyDescription />
            <BasicFeatures />
            <MapSection />
          </div>

          <div className="lg:col-span-1">
            <AgentCard user_data={user_data} />
          </div>
        </div>
        <div className="lg:col-span-1">
          {/* <NearByPlaces
            near_places={
              mainReducer?.ai_insight?.infrastructure as Infrastructure
            }
          /> */}
          <ZeccoFavorites />
        </div>
      </div>
    </MainLayout>
  );
};

export default Page;
