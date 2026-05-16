"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import PropertyCard from "@/components/cards/PropertyCard";
import MainLayout from "@/components/layouts/main-layout";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import React, { useEffect, useState } from "react";

const ZeccoFavorites = () => {
  const { mainReducer } = usePosterReducers();
  const { sendMessage, isConnected, lastEvent } = useWebSocket();

  useEffect(() => {
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

  const handleSearch = (e: any) => {
    sendMessage("action", {
      type: "propertyService",
      action: "list",
      payload: {
        limit: 10,
        page: 1,
        search: e,
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
    >
      <div className="lg:mx-7 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mainReducer?.zecco_favorite?.data?.map((property) => (
            <PropertyCard property={property} key={property.id} {...property} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default ZeccoFavorites;
