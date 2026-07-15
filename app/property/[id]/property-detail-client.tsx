"use client";
import CommonApiRequest from "@/api/rest/fetchData";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import AIProcessingCard from "@/app/AI-insights/components/analyzing-property-details";
import MainLayout from "@/components/layouts/main-layout";
import LoginPopup from "@/components/login-popup";
import { Button } from "@/components/ui/button";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setAiInsight, setLoginPopup } from "@/redux/modules/main/action";
import {
  IFeature,
  IImage,
  IProperty,
  IPropertyDescription,
  IPropertyResponse,
  PropertyAnalysis,
} from "@/redux/modules/main/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { AIMarketIntelligence } from "./components/AIMarketIntelligence";
import { AgentCard } from "./components/AgentCard";
import BasicFeatures from "./components/BasicFeatures";
import PropertyGallery from "./components/ImageGallery";
import { MapSection } from "./components/MapSection";
import { PropertyDescription } from "./components/PropertyDescription";
import { PropertyInfo } from "./components/PropertyInfo";
import PropertyStats from "./components/PropertyStats";
import ZeccoFavorites from "./components/ZeccoFavorites";

export default function PropertyDetailClient() {
  const { sendMessage, isConnected, lastEvent } = useWebSocket();
  const { mainReducer, user_data } = usePosterReducers();
  const params = useParams();
  const propertyId = params.id || params.propertyId || (Array.isArray(params.slug) ? params.slug[params.slug.length - 1] : params.slug);
  const dispatch = useDispatch();
  const [step, setStep] = useState("intro");
  const [isCompleted, setIsCompleted] = useState(false);
  const isLoggedIn = !!user_data?.access_token;

  useEffect(() => {
    if (!isConnected || !propertyId) return;
    sendMessage("action", {
      type: "propertyService",
      action: "get",
      payload: {
        id: propertyId,
      },
    });
  }, [isConnected, propertyId]);

  useEffect(() => {
    if (
      lastEvent?.data?.status &&
      lastEvent?.data?.request?.type === "userService" &&
      (lastEvent?.data?.request?.action === "addFavorite" ||
        lastEvent?.data?.request?.action === "removeFavorite")
    ) {
      sendMessage("action", {
        type: "propertyService",
        action: "get",
        payload: {
          id: propertyId,
        },
      });
    }
  }, [lastEvent]);

  useEffect(() => {
    if (
      mainReducer?.ai_insight &&
      Object.keys(mainReducer?.ai_insight).length > 0
    ) {
      setStep("complete");
      setIsCompleted(true);
    }
  }, [mainReducer?.ai_insight]);

  const handleAIInsight = () => {
    setStep("processing");
    setIsCompleted(false);
    CommonApiRequest(
      "GET",
      `${App_url.endpoint_url?.AI_INSIGHT}/${propertyId}/${user_data?.user?._id}`,
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

  const property = mainReducer?.property_details as IProperty | null;

  const jsonLd = property
    ? {
      "@context": "https://schema.org",
      "@type": "Residence",
      name:
        (property as any)?.title ||
        (property as any)?.name ||
        "Property in Costa del Sol",
      description:
        (property as any)?.description ||
        (property as any)?.propertyDescriptions?.[0]?.description,
      url: `https://zecco.es/property/${propertyId}`,
      image: (property as any)?.propertyImages?.map((image: any) => image?.image),
      address: {
        "@type": "PostalAddress",
        addressLocality: (property as any)?.locationCity || "Costa del Sol",
        addressCountry: "ES",
      },
      offers: (property as any)?.price
        ? {
          "@type": "Offer",
          price: (property as any)?.price,
          priceCurrency: "EUR",
        }
        : undefined,
    }
    : null;

  return (
    <MainLayout isBreadcrumb isPropertyDetails chatBotWidget={false}>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <div className="lg:mx-7 px-4 sm:px-6 lg:px-8">
        <div className="lg:col-span-1">
          <PropertyGallery
            property={mainReducer?.property_details?.propertyImages as IImage[]}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PropertyInfo
              property={mainReducer?.property_details as IProperty}
            />
            <PropertyStats
              property={mainReducer?.property_details as IProperty}
            />
            <div className="flex items-center gap-5 mb-2">
              <Button
                type="submit"
                onClick={() =>
                  isLoggedIn ? handleAIInsight() : dispatch(setLoginPopup(true))
                }
                className="w-full capitalize bg-[#136AED] shadow-[#BFDBFE] h-11 my-4 text-white rounded-full shadow-md"
              >
                AI Market Intelligence
              </Button>
            </div>
            {step === "processing" && (
              <AIProcessingCard
                isPropertyDetail
                isCompleted={isCompleted}
                onComplete={() => setStep("complete")}
                heading="AI Market Intelligence"
              />
            )}
            {step === "complete" && mainReducer?.ai_insight && (
              <AIMarketIntelligence
              isPropertyDetail
                ai_insight={mainReducer?.ai_insight as PropertyAnalysis}
              />
            )}
            <PropertyDescription
              propertyDescriptions={
                mainReducer?.property_details
                  ?.propertyDescriptions as IPropertyDescription[]
              }
            />
            <BasicFeatures
              features={mainReducer?.property_details?.features as IFeature[]}
            />
            <MapSection />
          </div>

          <div className="lg:col-span-1">
            <AgentCard
              agent_details={mainReducer?.property_details?.agent_assigned}
              user_data={user_data}
            />
          </div>
        </div>
        <div className="lg:col-span-1">
          {mainReducer?.property_details?.locationCity && (
            <ZeccoFavorites
              property={mainReducer?.property_details as IProperty}
            />
          )}
        </div>
      </div>
      <LoginPopup />
    </MainLayout>
  );
}
