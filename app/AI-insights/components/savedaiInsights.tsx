"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setAiInsight } from "@/redux/modules/main/action";
import { IPropertyResponse } from "@/redux/modules/main/types";
import CommonCard from "@/components/cards/common-card";
import { formatEuro } from "@/utils/common";
import { Bath, BedSingle, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface SavedAiInsightsProps {
  onSelectInsight?: (property: any, aiData: any) => void;
}

const SavedAiInsights = ({ onSelectInsight }: SavedAiInsightsProps) => {
  const { mainReducer } = usePosterReducers();
  const router = useRouter();
  const dispatch = useDispatch();
  const { sendMessage, isConnected } = useWebSocket();
  const pathname = usePathname()
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    dispatch(setAiInsight({} as IPropertyResponse));
  }, []);

  useEffect(() => {
    sendMessage("action", {
      type: "aiInsightService",
      action: "list",
      payload: {
        search: "",
        limit: 10,
        page: 1,
      },
    });
  }, [isConnected]);

  const handlePropertyNavigation = (property: any, aiData?: any) => {
    if (onSelectInsight) {
      onSelectInsight(property, aiData);
      return;
    }

    if (aiData) {
      dispatch(setAiInsight(aiData));
    }

    const identifier = property?.slug || property?._id;

    if (!identifier) return;

    const propertyIdentifier = property?.slug || property?._id;
    const propertyDetailUrl = `${pathname.replace(/\/$/, "")}/${propertyIdentifier}`;

    router.push(propertyDetailUrl);
  };

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const hasData = (mainReducer?.stored_aiInsight?.data?.length ?? 0) > 0;

  return (
    <CommonCard heading={hasData ? "Saved AI Insights" : undefined} description={hasData ? "Click on any insight to view the full AI report." : undefined}>
      {hasData ? (
        <div className="flex flex-col gap-6 overflow-y-auto max-h-[60vh] sm:max-h-[50vh] scrollbar-hide">
          {mainReducer?.stored_aiInsight?.data?.map(
            (item: any, index: number) => {
              const id = item?._id || index;
              const isExpanded = expandedCards[id] || false;

              return (
                <div
                  onClick={() => handlePropertyNavigation(item?.property, item?.data)}
                  key={id}
                  className="bg-white/70 rounded-2xl relative cursor-pointer transition-all duration-200 hover:shadow-lg border border-gray-100"
                >
                  <div className="flex flex-col lg:flex-row items-stretch gap-3">
                    <div className="relative w-full h-[200px] lg:w-[250px] lg:min-w-[250px] lg:h-auto lg:self-stretch shrink-0">
                      <Image
                        src={item?.property?.propertyImages?.[0]?.url || ""}
                        alt="AI Insights"
                        fill
                        className="object-cover rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none"
                      />
                    </div>
                    <div className="flex-1 min-w-0 p-4">
                      <h1 className={`font-bold text-base sm:text-lg font-inter text-[#111827] ${!isExpanded ? "line-clamp-2" : ""}`}>
                        {item?.property?.bedrooms
                          ? `${item?.property?.bedrooms} Bedroom `
                          : ""}{" "}
                        {item?.property?.propertyCategory?.name} for{" "}
                        {item?.property?.isSale && item?.property?.isRent
                          ? "Sale or Rent"
                          : item?.property?.isSale
                            ? "Sale"
                            : item?.property?.isRent
                              ? "Rent"
                              : ""}{" "}
                        in{" "}
                        {item?.property?.locationSubarea
                          ? `${item?.property?.locationSubarea},`
                          : ""}{" "}
                        {item?.property?.locationArea
                          ? `${item?.property?.locationArea},`
                          : ""}{" "}
                        {item?.property?.locationCity},{" "}
                        {item?.property?.locationCountry}
                      </h1>
                      <div className="flex flex-wrap gap-3 sm:gap-5 items-center pt-2 text-sm">
                        <div className="flex font-inter font-medium items-center gap-1 text-[#4B5563]">
                          {formatEuro(item?.property?.salePrice) ||
                            formatEuro(item?.property?.rentalPrice) ||
                            formatEuro(item?.property?.rentalPriceLong) ||
                            formatEuro(item?.property?.rentalPriceShort)}
                        </div>
                        <div className="flex font-manrope font-normal items-center gap-1">
                          <BedSingle size={18} className="text-gray-400" />
                          <span>{item?.property?.bedrooms} Bed</span>
                        </div>
                        <div className="flex font-manrope font-normal items-center gap-1">
                          <Bath size={18} className="text-gray-400" />
                          <span>{item?.property?.bathrooms} Bath</span>
                        </div>
                      </div>

                      <div className="bg-[#F2F3F6] mt-3 py-2 px-3 rounded-lg border border-[#F3F4F6]">
                        <h1 className="font-inter font-medium text-[#4B5563] flex items-center text-sm">
                          <Image
                            src={App_url.image.chat_logo}
                            alt="AI Insights"
                            width={20}
                            height={20}
                            className="object-cover mr-2 shrink-0"
                          />
                          AI Rationale
                        </h1>
                        <div className={`${!isExpanded ? "max-h-[60px] overflow-hidden lg:max-h-none lg:overflow-visible" : ""} transition-all duration-300`}>
                          <ul className="my-2 sm:px-6 space-y-1.5">
                            {item?.data?.ai_report?.strategic_advantages
                              ?.slice(0, 2)
                              ?.map((adv: any, idx: number) => (
                                <li key={idx} className="flex items-start gap-2 font-manrope font-normal text-xs sm:text-sm text-[#374151]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                                  {adv}
                                </li>
                              ))}
                          </ul>
                        </div>
                        {item?.data?.ai_report?.strategic_advantages?.length > 0 && (
                          <button
                            onClick={(e) => toggleExpand(id, e)}
                            className="lg:hidden flex items-center gap-1 text-xs font-manrope font-semibold text-[#2563EB] hover:text-[#1d4ed8] transition-colors sm:px-6"
                          >
                            {isExpanded ? (
                              <>View Less <ChevronUp size={14} /></>
                            ) : (
                              <>View More <ChevronDown size={14} /></>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            },
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-250px)] px-4">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
              <Sparkles size={48} className="text-blue-400" strokeWidth={1.5} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 font-manrope mb-2">
            No Saved AI Insights Yet
          </h2>
          <p className="text-center text-sm text-gray-500 font-manrope max-w-md mb-6">
            Select a property from your favorites below to generate your first AI-powered investment report.
          </p>
        </div>
      )}
    </CommonCard>
  );
};

export default SavedAiInsights;
