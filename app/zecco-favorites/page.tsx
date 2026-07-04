"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import PropertyCard from "@/components/cards/PropertyCard";
import MainLayout from "@/components/layouts/main-layout";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setBreadcrumbs } from "@/redux/modules/main/action";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const ZeccoFavorites = () => {
  const { mainReducer } = usePosterReducers();
  const { sendMessage, isConnected, lastEvent } = useWebSocket();
  const dispatch = useDispatch();
  const [search , setSearch] = useState('')

  useEffect(() => {
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
    sendMessage("action", {
      type: "locationService",
      action: "list",
      payload: {
        search: "",
        limit: 0,
        page: 1,
        status: true,
      },
    });
  }, [isConnected]);

  useEffect(() => {
    if (mainReducer?.breadcrumbs?.length === 3) {
      const breadcrumbsWithoutLast =
        mainReducer.breadcrumbs?.slice(0, -1) || [];

      dispatch(setBreadcrumbs(breadcrumbsWithoutLast));
    }
  }, []);

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
          search: search ?? '',
          location_id: null,
          favorite: true,
        },
      });
    }
  }, [lastEvent]);

  const handleSearch = (e: any) => {
    setSearch(e.name);
    sendMessage("action", {
      type: "propertyService",
      action: "list",
      payload: {
        limit: 0,
        page: 1,
        search: e.name,
        location_id: null,
        favorite: true,
      },
    });
  };

  return (
    <MainLayout
      isBreadcrumb
      isFilter
      placeholder="city name"
      handleSearch={(e) => handleSearch(e)}
      filteredLocations={mainReducer?.location_list_without_limit?.data || []}
    >
      <div className="lg:mx-7 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mainReducer?.zecco_favorite?.data?.map((property) => (
            <PropertyCard property={property} key={property?._id} {...property} />
          ))}
        </div>
        {mainReducer?.zecco_favorite?.data?.length === 0 && (
          <div className="!bg-none flex flex-col items-center justify-center">
            <h2 className="mt-5 text-xl font-bold text-gray-800">
              No Favorite Properties
            </h2>

            <p className="mt-2 text-center text-sm text-gray-500">
              Saved Zecco's favorite properties will appear here once added.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ZeccoFavorites;
