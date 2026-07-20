"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import PropertyCard from "@/components/cards/PropertyCard";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";

import { IProperty } from "@/redux/modules/main/types";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import PropertyCardSkeleton from "@/app/costa-del-sol/properties/components/PropertyCardSkeleton";

interface PropertyInfoProps {
  property: IProperty;
}

export default function ZeccoFavorites({ property }: PropertyInfoProps) {
  const router = useRouter();
  const { mainReducer } = usePosterReducers();
  const { sendMessage, isConnected, lastEvent } = useWebSocket();

  const handleNavigate = () => {
    router.push(`${App_url.link.ZECCO_FAVORITES}`);
  };

  console.log("property ::: " , property)

  useEffect(() => {
    sendMessage("action", {
      type: "propertyService",
      action: "list",
      payload: {
        limit: 10,
        page: 1,
        search:  "",
        location_id: null,
        favorite: true,
      },
    });
  }, [isConnected]);

  useEffect(() => {
    if (
      lastEvent?.data?.status &&
      lastEvent?.data?.request?.type === "userService" &&
      (lastEvent?.data?.request?.action === "addFavorite" ||
        lastEvent?.data?.request?.action === "removeFavorite")
    ) {
      sendMessage("action", {
        type: "propertyService",
        action: "list",
        payload: {
          limit: 0,
          page: 1,
          search: "",
          location_id: null,
          favorite: true,
        },
      });
    }
  }, [lastEvent]);

  const randomFavorites = useMemo(() => {
    const currentId = String(property?._id || property?.id || "");
    const seen = new Set<string>();
    const unique: IProperty[] = [];

    for (const item of mainReducer?.zecco_favorite?.data || []) {
      const key = String(item?._id || item?.id || "");
      if (key && key === currentId) continue;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(item);
    }

    return unique.sort((a: any, b: any) => {
      const aKey = String(a?._id || a?.id || "");
      const bKey = String(b?._id || b?.id || "");
      return aKey.localeCompare(bKey);
    }).slice(0, 4);
  }, [mainReducer?.zecco_favorite?.data, property?._id, property?.id]);

  return (
    <section className=" bg-white mb-20">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl sm:text-xl font-bold font-manrope text-[#00000]">
            Zecco's Favorites
          </h2>
          <button
            onClick={handleNavigate}
            className="rounded-full font-manrope bg-btn_color font-medium  px-3 lg:px-7   py-2 text-xs lg:text-sm shadow-sm  text-white "
          >
            View All
          </button>
        </div>

        {/* Grid */}
        {!mainReducer?.zecco_favorite ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
          </div>
        ) : randomFavorites?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {randomFavorites?.map((property) => (
              <PropertyCard key={property?._id} {...property} property={property} type="zecco-favorites"/>
            ))}
          </div>
        ) : (
          <div className="!bg-none text-center w-full mx-auto mb-8">
            <h2 className="mt-5 text-lg font-bold text-gray-400">
              No Favorite Properties
            </h2>
          </div>
        )}
      </div>
    </section>
  );
}
