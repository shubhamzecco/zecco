"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import PropertyCard from "@/components/cards/PropertyCard";
import PropertyCardSkeleton from "@/app/costa-del-sol/properties/components/PropertyCardSkeleton";
import CommonCard from "@/components/cards/common-card";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Favorite = () => {
  const { isConnected, sendMessage, lastEvent } = useWebSocket();
  const { mainReducer } = usePosterReducers();
  const router = useRouter();

  useEffect(() => {
    if (
      lastEvent?.data?.status &&
      lastEvent?.data?.request?.type === "userService" &&
      lastEvent?.data?.request?.action === "removeFavorite"
    ) {
      sendMessage("action", {
        type: "userService",
        action: "favoritePropertyList",
        payload: {},
      });
    }
  }, [lastEvent]);

  const isEmpty = mainReducer?.favorite_property_list?.data?.length === 0;

  return (
    <section className="mt-10 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg font-inter text-[#111827]">
          Favorite
        </h2>
        {!isEmpty && (
          <button
            onClick={() => router.push(`${App_url.link.FAVORITES}`)}
            className="rounded-full font-manrope bg-btn_color font-medium  px-3 lg:px-7   py-2 text-xs lg:text-sm shadow-sm  text-white "
          >
            View All
          </button>
        )}
      </div>
      <CommonCard heading={isEmpty ? undefined : undefined} description={isEmpty ? undefined : undefined}>
        {!mainReducer?.favorite_property_list ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
          </div>
        ) : mainReducer?.favorite_property_list?.data?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainReducer?.favorite_property_list?.data
              ?.slice(0, 3)
              ?.map((property) => (
                <PropertyCard
                  property={property}
                  key={property?._id}
                  {...property}
                />
              ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[280px] px-4">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center">
                <Heart size={48} className="text-red-400" strokeWidth={1.5} />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 font-manrope mb-2">
              No Favorite Properties Yet
            </h2>
            <p className="text-center text-sm text-gray-500 font-manrope max-w-md mb-6">
              Explore properties, save your favorites, and unlock AI-powered insights to make smarter decisions.
            </p>
            <button
              onClick={() => router.push("/costa-del-sol/properties")}
              className="relative w-fit mx-auto mt-8 text-xs sm:text-sm whitespace-nowrap my-5 py-3.5 px-4 sm:px-10 rounded-full flex items-center bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] text-white font-manrope font-medium shadow-md disabled:opacity-50 "
            >
              Browse Properties
            </button>
          </div>
        )}
      </CommonCard>
    </section>
  );
};

export default Favorite;
