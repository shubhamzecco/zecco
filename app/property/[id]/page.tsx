"use client";
import MainLayout from "@/components/layouts/main-layout";
import React, { useEffect } from "react";
import PropertyGallery from "./components/ImageGallery";
import { PropertyInfo } from "./components/PropertyInfo";
import { AIMarketIntelligence } from "./components/AIMarketIntelligence";
import { PropertyDescription } from "./components/PropertyDescription";
import { MapSection } from "./components/MapSection";
import { AgentCard } from "./components/AgentCard";
import PropertyStats from "./components/PropertyStats";
import BasicFeatures from "./components/BasicFeatures";
import ZeccoFavorites from "./components/ZeccoFavorites";
import NearByPlaces from "./components/near-by-palces";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import { useParams } from "next/navigation";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import {
  Infrastructure,
  Property,
  PropertyAnalysis,
} from "@/redux/modules/main/types";
import CommonApiRequest from "@/api/rest/fetchData";
import { App_url } from "@/constant/static";
import { useDispatch } from "react-redux";
import { setAiInsight } from "@/redux/modules/main/action";

const Page = () => {
  const { sendMessage, isConnected } = useWebSocket();
  const { mainReducer } = usePosterReducers();
  const params = useParams();
  const dispatch = useDispatch();
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

//   useEffect(() => {
//     if (!params?.id) return;
//     CommonApiRequest(
//       "GET",
//       `${App_url.endpoint_url?.AI_INSIGHT}/${params.id}`,
//       {},
//       {},
//       true,
//     )?.then((response: any) => {
//       if (response?.status === 200) {
//         dispatch(setAiInsight(response?.data));
//       } else {
//         dispatch(setAiInsight(response?.data));
//       }
//     });
//   }, [params?.id]);

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
            <AIMarketIntelligence
              ai_insight={mainReducer?.ai_insight as PropertyAnalysis}
            />
            <PropertyDescription />
            <BasicFeatures />
            <MapSection />
          </div>

          <div className="lg:col-span-1">
            <AgentCard />
          </div>
        </div>
        <div className="lg:col-span-1">
          <NearByPlaces
            near_places={
              mainReducer?.ai_insight?.infrastructure as Infrastructure
            }
          />
          <ZeccoFavorites />
        </div>
      </div>
    </MainLayout>
  );
};

export default Page;