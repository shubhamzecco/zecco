"use client";
import Head from "next/head";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import PropertyCard from "@/components/cards/PropertyCard";
import PropertyCardSkeleton from "@/app/costa-del-sol/properties/components/PropertyCardSkeleton";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { useEffect } from "react";

const FavoritesPage = () => {
  const { isConnected, sendMessage, lastEvent } = useWebSocket();
  const { mainReducer } = usePosterReducers();

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
      <>
        <section className="mt-2 mb-10">
       
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
      </>
    </SidebarLayout>
  );
};

export default FavoritesPage;
