"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setZeccoFavoriteList } from "@/redux/modules/main/action";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import PropertyCard from "../../../components/cards/PropertyCard";
import PropertyCardSkeleton from "@/app/costa-del-sol/properties/components/PropertyCardSkeleton";

export default function PropertyListings({
  initialData,
}: {
  initialData?: any;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { mainReducer } = usePosterReducers();
  const { sendMessage, isConnected, lastEvent } = useWebSocket();

  useEffect(() => {
    if (initialData && !mainReducer?.zecco_favorite?.data?.length) {
      dispatch(setZeccoFavoriteList(initialData));
    }
  }, []);

  const favoriteCount = mainReducer?.zecco_favorite?.data?.length ?? 0;
  const favoriteData = favoriteCount > 0 ? mainReducer?.zecco_favorite : initialData;

  const handleNavigate = () => {
    router.push(`${App_url.link.ZECCO_FAVORITES}`);
  };

  const hasLoadedFavoritesRef = useRef(!!initialData?.data?.length);

  useEffect(() => {
    if (!isConnected) return;
    if (hasLoadedFavoritesRef.current) {
      hasLoadedFavoritesRef.current = false;
      return;
    }
    sendMessage("action", {
      type: "propertyService",
      action: "list",
      payload: {
        limit: 10,
        page: 1,
        search: "",
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
          limit: 10,
          page: 1,
          search: "",
          location_id: null,
          favorite: true,
        },
      });
    }
  }, [lastEvent]);

  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-10 bg-white  lg:mx-10 mb-10">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold font-manrope text-[#00000]">
            Zecco's Favorites
          </h2>
          <button
            onClick={handleNavigate}
            className="rounded-full font-manrope bg-btn_color font-medium  px-3 lg:px-7   py-2 text-xs lg:text-sm shadow-sm  text-white "
          >
            View All Properties
          </button>
        </div>

        {/* Grid */}
        {!favoriteData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 8 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
          </div>
        ) : favoriteData?.data?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {favoriteData?.data?.slice(0, 8)?.map((property : any) => (
              <PropertyCard key={property?._id} {...property} property={property} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
