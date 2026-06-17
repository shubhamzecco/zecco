"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import PropertyCard from "@/components/cards/PropertyCard";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { IProperty } from "@/redux/modules/main/types";
import { useEffect } from "react";

type AiInsightsProps = {
  onGetStarted: (property: IProperty) => void;
};

const FavoritesPage = ({ onGetStarted }: AiInsightsProps) => {
  const { isConnected, sendMessage, lastEvent } = useWebSocket();
  const { mainReducer } = usePosterReducers();

  useEffect(() => {
    if (isConnected) {
      sendMessage("action", {
        type: "userService",
        action: "favoritePropertyList",
        payload: {},
      });
    }
  }, [isConnected]);

  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold text-lg mb-4 font-inter text-[#111827]">
          Select Property
        </h2>
        <div className=" bg-[#EEF2FF] rounded-full px-3 py-1 ">
          <p className="font-manrope font-semibold text-[#2828FF] uppercase text-sm">
            {mainReducer?.favorite_property_list?.data?.length} Properties
          </p>
        </div>
      </div>
      <div className="bg-white/70 p-7 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-scroll max-h-[130vh] scrollbar-hide">
          {mainReducer?.favorite_property_list?.data?.map((property) => (
            <PropertyCard
              property={property}
              key={property._id}
              {...property}
              onNavigate={() => onGetStarted(property)}
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

export default FavoritesPage;
