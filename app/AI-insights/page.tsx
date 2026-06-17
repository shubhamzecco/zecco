"use client";

import CommonApiRequest from "@/api/rest/fetchData";
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
      `${App_url.endpoint_url?.AI_INSIGHT}/${property._id}/${user_data?.user?._id}`,
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
          <AiInsights onGetStarted={() => setStep("grid")} />
        )}

        {step === "grid" && <FavoritesPage onGetStarted={handleStarted} />}

        {step === "processing" && (
          <AIProcessingCard
            isCompleted={isCompleted}
            onComplete={() => setStep("complete")}
          />
        )}

        {step === "complete" && mainReducer?.ai_insight && <PropertyInsights />}
        <SavedAiInsights />
      </div>
    </SidebarLayout>
  );
};

export default AIInsights;
