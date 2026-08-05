"use client";
import Head from "next/head";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import PropertyCard from "@/components/cards/PropertyCard";
import PropertyCardSkeleton from "@/app/costa-del-sol/properties/components/PropertyCardSkeleton";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import CommonCard from "@/components/cards/common-card";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const FavoritesPage = () => {
  const { isConnected, sendMessage, lastEvent } = useWebSocket();
  const { mainReducer } = usePosterReducers();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      sendMessage("action", {
        type: "propertyService",
        action: "list",
        payload: {
          limit: 1000,
          page: 1,
          search: "",
          location_id: null,
          favorite: true,
        },
      })
      sendMessage("action", {
        type: "userService",
        action: "favoritePropertyList",
        payload: {},
      });
    }
  }, [isConnected]);

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
    <SidebarLayout>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <CommonCard heading={(mainReducer?.favorite_property_list?.data?.length ?? 0) > 0 ? "Favorite Properties" : undefined} description={(mainReducer?.favorite_property_list?.data?.length ?? 0) > 0 ? "Properties you save as favorites will appear here for quick access." : undefined} className="min-h-[calc(100vh-130px)]">
        <div className="">
          {!mainReducer?.favorite_property_list ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
            </div>
          ) : mainReducer?.favorite_property_list?.data?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 overflow-y-scroll max-h-[130vh] pb-3 scrollbar-hide">
              {mainReducer?.favorite_property_list?.data?.map((property) => (
                <PropertyCard
                  property={property}
                  key={property?._id}
                  {...property}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-250px)] px-4">
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
        </div>
      </CommonCard>
    </SidebarLayout>
  );
};

export default FavoritesPage;
