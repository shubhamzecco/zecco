"use client";

import { useWebSocket } from "@/api/socket/WebSocketContext";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { citySlug } from "@/utils/common";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import SavedSearchCard from "./components/search-card";
import CommonCard from "@/components/cards/common-card";
import { parseCSV } from "../costa-del-sol/properties/page";

const SavedSearches = () => {
  const { sendMessage, lastEvent, isConnected } = useWebSocket();
  const { mainReducer } = usePosterReducers();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) return;
    sendMessage("action", {
      type: "savedSearchService",
      action: "list",
      payload: {},
    });

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

  const featureMap = useMemo(() => {
    if (!mainReducer?.property_features_list)
      return {} as Record<number, string>;

    return mainReducer?.property_features_list.reduce(
      (acc, item) => {
        acc[item?.id] = item?.name;

        return acc;
      },
      {} as Record<number, string>,
    );
  }, [mainReducer?.property_features_list]);

  const handleDelete = (id: string) => {
    sendMessage("action", {
      type: "savedSearchService",
      action: "delete",
      payload: {
        id,
      },
    });
  };


  const handleApplySearch = (item: any) => {
    const params = new URLSearchParams();
    if (item?.cities) params.set("city", citySlug(item.cities));
    if (item?.categories) params.set("categories", String(item.categories));
    if (item?.bedroomsFrom) params.set("bedroomsFrom", String(item.bedroomsFrom));
    if (item?.bedroomsTo) params.set("bedroomsTo", String(item.bedroomsTo));
    if (item?.priceFrom) params.set("priceFrom", String(item.priceFrom));
    if (item?.priceTo) params.set("priceTo", String(item.priceTo));
    if (item?.buildFrom) params.set("buildFrom", String(item.buildFrom));
    if (item?.buildTo) params.set("buildTo", String(item.buildTo));
    if (item?.types?.length > 0) params.set("types", item.types.join(","));
    if (item?.features?.length > 0) params.set("features", item.features.join(","));
    router.push(`${App_url.link.COSTA_DEL_SOL}/properties?${params.toString()}`);
  };

  const generateSearchTitle = (item: any) => {
    const categoryName = item?.categories && propertyCategoryMap[item?.categories];

    const types = (item?.types || [])
      .filter(Boolean)
      .map((type: number) => propertyTypeMap[type])
      .filter(Boolean);

    const baseTitle = categoryName || (types.length > 0 ? types.join(" & ") : "Properties");

    if (item?.search && item?.search.toLowerCase() !== item?.city?.name?.toLowerCase()) {
      return `${baseTitle} in ${item.search}, ${item.city.name}, spain`;
    } else if (item?.city?.name) {
      return `${baseTitle} in ${item.city.name}, spain`;
    }

    return `${baseTitle} in Costa del sol`;
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
    <SidebarLayout>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <CommonCard heading={mainReducer?.saved_searches?.data && mainReducer?.saved_searches?.data?.length > 0 ? "Saved Searches" : undefined} description={mainReducer?.saved_searches?.data && mainReducer?.saved_searches?.data?.length > 0 ? "Your saved searches will appear here for quick access to your preferred property filters." : undefined} className="min-h-[calc(100vh-130px)]">
        {!mainReducer?.saved_searches?.data || mainReducer?.saved_searches?.data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-250px)] px-4">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
                <Search size={48} className="text-blue-400" strokeWidth={1.5} />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 font-manrope mb-2">
              No Saved Searches Yet
            </h2>
            <p className="text-center text-sm text-gray-500 font-manrope max-w-md mb-6">
              Your saved searches will appear here for quick access to your preferred property filters.
            </p>
            <button
              onClick={() => router.push("/costa-del-sol/properties")}
              className="relative w-fit mx-auto mt-8 text-xs sm:text-sm whitespace-nowrap my-5 py-3.5 px-4 sm:px-10 rounded-full flex items-center bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] text-white font-manrope font-medium shadow-md disabled:opacity-50 "
            >
              Browse Properties
            </button>
          </div>
        ) : (
          <div className="space-y-4 overflow-y-auto max-h-[100vh] scrollbar-hide">
            {mainReducer?.saved_searches?.data?.map((item: any) => {
              const title = generateSearchTitle(item);
              return (
                <div key={item?.id} >
                  <SavedSearchCard featureMap={featureMap} title={title} item={item} handleDelete={handleDelete} onApplySearch={handleApplySearch} propertyTypeMap={propertyTypeMap} />
                </div>
              );
            })}
          </div>
        )}
      </CommonCard>

    </SidebarLayout>
  );
};

export default SavedSearches;
