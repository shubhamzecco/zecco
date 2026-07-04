"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import PropertyCard from "@/components/cards/PropertyCard";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
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

  return (
    <section className="mt-10 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg font-inter text-[#111827]">
          Favorite
        </h2>
        <button
          onClick={() => router.push(`${App_url.link.FAVORITES}`)}
          className="rounded-full font-manrope bg-btn_color font-medium  px-3 lg:px-7   py-2 text-xs lg:text-sm shadow-sm  text-white "
        >
          View All
        </button>
      </div>
      <div className="bg-white/70 p-7  rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
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
        {mainReducer?.favorite_property_list?.data?.length === 0 && (
          <div className="!bg-none flex flex-col items-center justify-center">
            <h2 className="mt-5 text-xl font-bold text-gray-800">
              No Favorite Properties
            </h2>

            <p className="mt-2 text-center text-sm text-gray-500">
              Properties you save as favorites will appear here for quick
              access.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Favorite;
