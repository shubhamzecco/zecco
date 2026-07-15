"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import { App_url } from "@/constant/static";
import { citySlug } from "@/utils/common";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Footer from "../Footer";
import Header from "../Header";
import Breadcrumb from "../breadcrumbs";
import ChatbotWidget from "../chat/chatbot-widget";
import DropdownSelect from "../ui/DropSelect";
import { useDispatch } from "react-redux";
import { setPropertyFilter } from "@/redux/modules/main/action";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";

type PropertyType = "buy" | "rent" | "new" | "all";
interface MainLayoutProps {
  children: React.ReactNode;
  isBreadcrumb?: boolean;
  isFilter?: boolean;
  isPropertyDetails?: boolean;
  isPropertyType?: boolean;
  isProperty?: boolean;
  propertyCount?: number;
  propertyType?: PropertyType;
  onPropertyTypeChange?: (type: PropertyType) => void;
  chatBotWidget?: boolean;
  callBackPropertyType?: (value: string) => void; // callback
  propertyTypes?: string; // property types value
  handleSearch?: (value: any) => void;
  savedSearch?: boolean;
  savedSearches?: () => void;
  placeholder?: string;
  filteredLocations?: any[];
  searchValueProp?: string;
  propertyPage?: boolean;
  isLocationDropdown?: boolean;
}

const HEADER_HEIGHT = 100; // h-16 (64px) + top spacing
const BREADCRUMB_HEIGHT = 10; // py-3
const FILTER_HEIGHT = 20; // search bar height

const MainLayout = ({
  children,
  isBreadcrumb = false,
  isFilter = false,
  isPropertyType = false,
  propertyCount = 0,
  onPropertyTypeChange,
  propertyType,
  chatBotWidget = true,
  savedSearch,
  savedSearches,
  filteredLocations = [],
  searchValueProp,
}: MainLayoutProps) => {
  const pathname = usePathname();
  const dispatch = useDispatch()
  const { sendMessage, isConnected } = useWebSocket();
  const { mainReducer } = usePosterReducers();
  const param = useParams();
  const searchval = searchValueProp || param?.location
  const { control } = useForm({
    defaultValues: {
      location: searchval
    }
  })
  const router = useRouter();

  useEffect(() => {
    if (!isPropertyType) return;
    sendMessage("action", {
      type: "propertyService",
      action: "propertyTypes",
      payload: {},
    });
  }, [isConnected]);

  const topOffset =
    HEADER_HEIGHT +
    (isBreadcrumb ? BREADCRUMB_HEIGHT : 0) +
    (isFilter ? FILTER_HEIGHT : 0);

  const TABS: { label: string; value: PropertyType }[] = [
    { label: "All", value: "all" },
    { label: "Buy", value: "buy" },
    { label: "New", value: "new" },
  ];

  const callLocationSelect = (data: any) => {
    dispatch(
      setPropertyFilter({
        ...mainReducer?.propertyFilter,
        cities: data?.value,
      })
    );
    router.push(`${App_url.link.COSTA_DEL_SOL}/${citySlug(data?.label)}`);
  }

  return (
    <main className="w-full bg-white">
      <Header />
      <div style={{ height: HEADER_HEIGHT }} />
      <div className="lg:mx-7 px-4 sm:px-6 lg:px-8">
        {isBreadcrumb && (
          <div className="flex justify-between items-center mb-3 gap-4">
            <Breadcrumb />
          </div>
        )}
        {isFilter && (
          <div className="flex max-md:flex-col max-md:w-full justify-between items-start mb-8 mt-3 gap-4">
            <div className=" flex-1  lg:flex  items-center gap-3 max-md:w-full lg:w-[70%]  rounded-[7px]">
              <div className="lg:w-[327px] max-md:mb-2">
                <DropdownSelect
                  placeholder="All Area"
                  onSelect={callLocationSelect}
                  options={filteredLocations?.map((location) => ({
                    value: location?.name?.toLowerCase(),
                    label: location?.name,
                    key: location?.id
                  })) || []}
                  control={control}
                  name="location"
                  formClassName="rounded-xl"
                  labelClassName="font-bold"
                />
              </div>
              {propertyCount !== 0 && (
                <div className="">
                  <p className="font-manrope hidden lg:block font-semibold text-black">
                    {propertyCount} results in drawn area
                  </p>
                </div>
              )}
            </div>
            <div className="flex max-md:flex-col lg:justify-between max-md:w-full gap-5">
              {savedSearch && (
                <button
                  onClick={savedSearches}
                  className={`px-4 py-1.5 max-md:py-2.5 font-manrope font-semibold  max-md:w-full uppercase text-xs rounded-md bg-blue_color text-white`}
                >
                  Save Searches
                </button>
              )}
              {isPropertyType && (
                <div className="inline-flex gap-1 rounded-lg max-md:w-fit bg-[#E5E7EB] p-1 shrink-0">
                  {TABS?.map((tab, i) => (
                    <button
                      onClick={() => {
                        onPropertyTypeChange &&
                          onPropertyTypeChange(tab?.value);
                      }}
                      key={i}
                      className={`px-4 py-1.5 font-manrope font-semibold uppercase text-xs rounded-md
                                        ${tab?.value === propertyType
                          ? "bg-white text-black"
                          : "text-[#6B7280] hover:bg-slate-100"
                        }`}
                    >
                      {tab?.value}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div
        style={{ minHeight: `calc(100vh - ${topOffset}px)` }}
        className={pathname === App_url?.link.PACKAGE ? "" : "mt-2 mb-5"}
      >
        {children}
      </div>
      {chatBotWidget && <ChatbotWidget />}
      <Footer />
    </main>
  );
};

export default React.memo(MainLayout);
