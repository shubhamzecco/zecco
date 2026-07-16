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
    router.push(`${App_url.link.COSTA_DEL_SOL}/properties?${params.toString()}`);
  };

  const generateSearchTitle = (item: any) => {
    const parts: string[] = [];
    if (item?.categories && item?.types?.filter(Boolean)?.length === 0) {
      const categoryName = propertyCategoryMap[item?.categories];
      if (categoryName) {
        parts.push(categoryName);
      }
    }

    // Property Types
    if (item?.types?.filter(Boolean)?.length > 0) {
      const types = (item?.types || [])
        .filter(Boolean)
        .map((type: number) => propertyTypeMap[type])
        .filter(Boolean);

      if (types.length > 0) {
        parts.push(types.join(" & "));
      }
    }

    if (item?.search && (item?.search.toLowerCase() !== item?.city?.name?.toLowerCase())) {
      parts.push(`in ${item?.search}, ${item?.city?.name}, Spain`);
    } else if (item?.city?.name) {
      parts.push(`in ${item?.city?.name}, Spain`);
    }
    return parts?.join(" ");
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

      {!mainReducer?.saved_searches?.data || mainReducer?.saved_searches?.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[400px] w-full">
          <Search size={40} className="text-gray-300 mb-3" />
          <h2 className="text-lg font-bold text-gray-800">
            No Saved Searches
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            Your saved searches will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4 overflow-y-auto max-h-[100vh] scrollbar-hide bg-slate-50">
          {mainReducer?.saved_searches?.data?.map((item: any) => {
            const title = generateSearchTitle(item);

            return (
              <div key={item?.id} >
                <SavedSearchCard title={title} item={item} handleDelete={handleDelete}  onApplySearch={handleApplySearch} />
              </div>
            );
          })}
        </div>
      )}

    </SidebarLayout>
  );
};

export default SavedSearches;
