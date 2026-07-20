"use client";

import { URL } from "@/api/rest/fetchData";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import CommonCard from "@/components/cards/common-card";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { citySlug, formatEuro, formatMessageDate } from "@/utils/common";
import { Eye, Search, Trash2, View } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

type SavedSearchesProps = {
  isDashboard?: boolean;
  searches?: any
};

const SavedSearches = ({ isDashboard = false, searches }: SavedSearchesProps) => {
  const { sendMessage, lastEvent, isConnected } = useWebSocket();
  const { mainReducer } = usePosterReducers();
  const router = useRouter();

  const handleDelete = (id: string) => {
    sendMessage("action", {
      type: "savedSearchService",
      action: "delete",
      payload: {
        id,
      },
    });
  };

  useEffect(() => {
    if (!isConnected) return;
    sendMessage("action", {
      type: "propertyService",
      action: "propertyTypes",
      payload: {
        is_subtype: true,
      },
    });

    sendMessage("action", {
      type: "propertyService",
      action: "features",
      payload: {},
    });
  }, [isConnected]);

  const propertyCategoryMap = useMemo(() => {
    if (!mainReducer?.property_type_list) return {} as Record<number, string>;

    return mainReducer?.property_type_list?.reduce(
      (acc, item) => {
        if (!item?.is_subtype) {
          acc[item?.id] = item?.name;
        }
        return acc;
      },
      {} as Record<number, string>,
    );
  }, [mainReducer?.property_type_list]);

  const propertyTypeMap = useMemo(() => {
    if (!mainReducer?.property_subtype_list)
      return {} as Record<number, string>;

    return mainReducer?.property_subtype_list?.reduce(
      (acc, item) => {
        if (item?.is_subtype) {
          acc[item?.id] = item?.name;
        }
        return acc;
      },
      {} as Record<number, string>,
    );
  }, [mainReducer?.property_subtype_list]);


  const generateSearchTitle = (item: any) => {
    const parts: string[] = [];
    if (item?.types?.filter(Boolean)?.length > 0) {
      const types = (item?.types || [])
        .filter(Boolean)
        .map((type: number) => propertyTypeMap[type])
        .filter(Boolean);

      if (types?.length > 0) {
        parts.push(types.join(" & "));
      }
    }

    if (
      item?.search &&
      item?.search.toLowerCase() !== item?.city?.name?.toLowerCase()
    ) {
      parts.push(`in ${item?.search}, ${item?.city?.name}, Spain`);
    } else if (item?.city?.name) {
      parts.push(`in ${item?.city.name}, Spain`);
    }
    return parts.join(" ");
  };

  useEffect(() => {
    if (
      lastEvent?.data?.status &&
      lastEvent?.data?.request?.type === "savedSearchService" &&
      (lastEvent?.data?.request?.action === "delete" ||
        lastEvent?.data?.request?.action === "updatePassword")
    ) {
      sendMessage("action", {
        type: "savedSearchService",
        action: "list",
        payload: {},
      });
    }
  }, [lastEvent]);

  return (
    <CommonCard className="max-2xl:p-5" heading={searches && searches.length > 0 ? "Saved Searches" : undefined} description={searches && searches.length > 0 ? "Recent saved searches" : undefined}>
      {!searches || searches.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[280px] lg:h-[365px] 2xl:h-[398px] px-4">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
              <Search size={30} className="text-blue-400" strokeWidth={1.5} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 font-manrope mb-2">
            No Saved Searches Yet
          </h2>
          <p className="text-center text-sm text-gray-500 font-manrope max-w-md mb-4">
            Your saved searches will appear here for quick access to your preferred property filters.
          </p>
          <button
            onClick={() => router.push("/costa-del-sol/properties")}
            className="relative w-fit mx-auto text-xs sm:text-sm whitespace-nowrap my-5 py-3.5 px-4 sm:px-10 rounded-full flex items-center bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] text-white font-manrope font-medium shadow-md disabled:opacity-50 "
          >
            Browse Properties
          </button>
        </div>
      ) : (
        <div className="2xl:mt-2">
          {searches?.map((item: any, index: number) => {
          const title = generateSearchTitle(item);
          return (
            <div
              key={item?._id}
              onClick={() => {
                const params = new URLSearchParams();
                if (item?.cities) params.set("city", citySlug(item.cities));
                if (item?.categories) params.set("categories", String(item.categories));
                if (item?.bedroomsFrom) params.set("bedroomsFrom", String(item.bedroomsFrom));
                if (item?.bedroomsTo) params.set("bedroomsTo", String(item.bedroomsTo));
                if (item?.priceFrom) params.set("priceFrom", String(item.priceFrom));
                if (item?.priceTo) params.set("priceTo", String(item.priceTo));
                if (item?.buildFrom) params.set("buildFrom", String(item.buildFrom));
                if (item?.buildTo) params.set("buildTo", String(item.buildTo));
                router.push(`${App_url.link.COSTA_DEL_SOL}/properties?${params.toString()}`);
              }}
              className={`flex cursor-pointer justify-between !py-[8px] ${index !== searches.length - 1
                ? "border-b border-[#F1F5F9]"
                : ""
                }`}
            >
              <div className="flex gap-3">
                <Search
                  size={20}
                  className="mt-1 text-[#64748B]"
                  strokeWidth={2}
                />

                <div>
                  <h4 className="text-[13px] font-semibold text-[#1F2937]">
                    {title}
                  </h4>

                  {item.filters && (
                    <p className="mt-1 text-[12px] text-[#64748B]">
                      {item.filters}
                    </p>
                  )}

                  <p className="mt-1 text-[11px] text-[#9CA3AF]">{formatMessageDate(item.createdAt)}</p>
                </div>
              </div>

              <div className="flex flex-col items-end">
                {item.badge && (
                  <span className="rounded-full bg-[#22C55E] px-2 py-[3px] text-[10px] font-semibold text-white">
                    {item.badge}
                  </span>
                )}

                <Eye
                  size={20}
                  className="mt-3 text-[#94A3B8]"
                  strokeWidth={2}
                />
              </div>
            </div>
          )
        })}
        </div>
      )}

      {searches && searches.length > 0 && (
        <button onClick={() => router.push(App_url.link.SAVED_SEARCHES)} className="mt-4 text-[13px] font-semibold text-[#2563EB] transition hover:translate-x-1">
          Manage Searches →
        </button>
      )}
    </CommonCard>
  );
};

export default SavedSearches;
