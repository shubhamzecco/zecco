"use client";

import CommonApiRequest from "@/api/rest/fetchData";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setAiInsight } from "@/redux/modules/main/action";
import { IProperty } from "@/redux/modules/main/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AiInsights from "./components/aiInsights";
import AIProcessingCard from "./components/analyzing-property-details";
import PropertyInsights from "./components/property-insights";

const AIInsights = () => {
  const [step, setStep] = useState("intro");
  const { mainReducer, user_data } = usePosterReducers();
  const { sendMessage, isConnected } = useWebSocket();
  const params = useParams();
  const dispatch = useDispatch();
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<IProperty | null>(
    null,
  );

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
      `${App_url.endpoint_url?.AI_INSIGHT}/${property.id}/${user_data?.user?._id}`,
      {},
      {},
      //   true,
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
    <SidebarLayout>
      <div
        className="lg:px-12 px-5 pt-12 pb-4 mb-10
        bg-gradient-to-r
        from-[#60A5FA]/10
        via-[#fafafa] via-[70%]
        to-[#fafafa] to-[100%]"
      >
        {step === "intro" && (
          <AiInsights
            property={selectedProperty as IProperty}
            onGetStarted={handleStarted}
          />
        )}

        {step === "processing" && (
          <AIProcessingCard
            isCompleted={isCompleted}
            onComplete={() => setStep("complete")}
          />
        )}

        {step === "complete" && <PropertyInsights />}
      </div>
    </SidebarLayout>
  );
};

export default AIInsights;
