"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import PropertyCard from "@/components/cards/PropertyCard";
import PropertyCardSkeleton from "@/app/costa-del-sol/properties/components/PropertyCardSkeleton";
import MainLayout from "@/components/layouts/main-layout";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import debounce from 'lodash/debounce'

import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Heart } from "lucide-react";
import { setAiInsight, setStoredAiInsightList } from "@/redux/modules/main/action";
import { IPropertyResponse } from "@/redux/modules/main/types";

const ZeccoFavorites = () => {
  const { mainReducer } = usePosterReducers();
  const { sendMessage, isConnected, lastEvent } = useWebSocket();
  const dispatch = useDispatch();
  const [search, setSearch] = useState('')

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
     dispatch(setAiInsight({} as IPropertyResponse));
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

  const handleSearch = (value: any) => {
    const searchValue =
      typeof value === "string" ? value : value?.name || "";

    setSearch(searchValue);

    debouncedSearch(searchValue);
  };


  const debouncedSearch = useMemo(
    () =>
      debounce((searchValue: string) => {
        sendMessage("action", {
          type: "propertyService",
          action: "list",
          payload: {
            limit: 0,
            page: 1,
            search: searchValue,
            location_id: null,
            favorite: true,
          },
        });
      }, 500),
    [sendMessage]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);



  return (
    <MainLayout
      isBreadcrumb
      isFilter
      placeholder="city name"
      handleSearch={(e) => handleSearch(e)}
      filteredLocations={mainReducer?.location_list_without_limit?.data || []}
    >
      <div className="lg:mx-7 px-4 sm:px-6 lg:px-8">
        {!mainReducer?.zecco_favorite ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-6 mb-8">
            {Array.from({ length: 8 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
          </div>
        ) : mainReducer?.zecco_favorite?.data?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-6 mb-8">
            {mainReducer?.zecco_favorite?.data?.map((property) => (
              <PropertyCard property={property} key={property?._id} {...property} type="zecco-favorites" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] w-full">
            <Heart size={48} className="text-gray-300 mb-4" />
            <h2 className="text-lg font-bold text-gray-800 font-manrope">
              No Favorite Properties
            </h2>
            <p className="mt-2 text-center text-sm text-gray-500 font-manrope max-w-md">
              Saved Zecco&apos;s favorite properties will appear here once added.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ZeccoFavorites;
