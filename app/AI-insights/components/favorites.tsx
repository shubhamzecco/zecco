"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import PropertyCard from "@/components/cards/PropertyCard";
import PropertyCardSkeleton from "@/app/costa-del-sol/properties/components/PropertyCardSkeleton";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { IProperty } from "@/redux/modules/main/types";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";

type AiInsightsProps = {
  onGetStarted: (property: IProperty) => void;
};

const FavoritesPage = ({ onGetStarted }: AiInsightsProps) => {
  const { isConnected, sendMessage } = useWebSocket();
  const { mainReducer } = usePosterReducers();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected) {
      sendMessage("action", {
        type: "userService",
        action: "favoritePropertyList",
        payload: {},
      });
    }
  }, [isConnected]);

  const properties = mainReducer?.favorite_property_list?.data;
  const selectedProperty = properties?.find((p) => p._id === selectedId) || null;

  return (
    <section className="mt-4">
      {!mainReducer?.favorite_property_list ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      ) : (properties?.length ?? 0) > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-scroll scrollbar-hide p-1">
            {properties?.slice(0, 3)?.map((property) => {
              const isSelected = selectedId === property._id;
              return (
                <div
                  key={property._id}
                  onClick={() => {
                    setSelectedId(isSelected ? null : property._id)
                    onGetStarted(property)
                  }}
                  className={`relative cursor-pointer rounded-xl transition-all duration-200 ${isSelected
                    ? "ring-2 ring-[#2563EB] ring-offset-2"
                    : ""
                    }`}
                >
                  {/* Check Icon */}
                  <div
                    className={`absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${isSelected
                      ? "bg-[#2563EB] text-white scale-100 shadow-md shadow-blue-500/30"
                      : "hidden"
                      }`}
                  >
                    <Check size={16} strokeWidth={3} />
                  </div>

                  <PropertyCard
                    property={property}
                    {...property}
                    onNavigate={() => onGetStarted(property)}
                  />
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="!bg-none flex flex-col items-center justify-center">
          <h2 className="mt-5 text-xl font-bold text-gray-800">
            No Favorite Properties
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            Properties you save as favorites will appear here for quick access.
          </p>
        </div>
      )}
    </section>
  );
};

export default FavoritesPage;
