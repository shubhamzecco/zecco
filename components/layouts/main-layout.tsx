"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Footer from "../Footer";
import Header from "../Header";
import Breadcrumb from "../breadcrumbs";
import ChatbotWidget from "../chat/chatbot-widget";

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
}

const HEADER_HEIGHT = 100; // h-16 (64px) + top spacing
const BREADCRUMB_HEIGHT = 10; // py-3
const FILTER_HEIGHT = 20; // search bar height

const MainLayout = ({
  children,
  isBreadcrumb = false,
  isFilter = false,
  isPropertyDetails = false,
  isPropertyType = false,
  isProperty = false,
  propertyCount = 0,
  onPropertyTypeChange,
  propertyType,
  propertyTypes,
  callBackPropertyType,
  chatBotWidget = true,
  handleSearch,
  savedSearch,
  savedSearches,
  placeholder,
  filteredLocations = [],
  searchValueProp,
}: MainLayoutProps) => {
  const pathname = usePathname();
  const { sendMessage, isConnected } = useWebSocket();
  const { user_data, mainReducer } = usePosterReducers();
  const [searchValue, setSearchValue] = useState(searchValueProp || "");
  const [searchDropdown, setSearchDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const propertyDetails = mainReducer?.property_details ?? {}

  const searchedLocations = searchValue.trim()
    ? filteredLocations?.filter((item: any) =>
      item?.name?.toLowerCase()?.startsWith(searchValue.toLowerCase()),
    )
    : [];

  useEffect(() => {
    setSearchValue(searchValueProp || "");
  }, [searchValueProp]);

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
    { label: "Rent", value: "rent" },
    { label: "New", value: "new" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSearchDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
              <div
                ref={dropdownRef}
                className="flex lg:w-[327px] relative items-center gap-3 max-md:mb-2"
              >
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                  size={18}
                />
                <input
                  type="text"
                  value={searchValue}
                  placeholder={`Search by ${placeholder ? placeholder : "area"}`}
                  className="w-full lg:max-w-[27rem] bg-[#fcfcfc] placeholder:font-manrope font-normal placeholder:text-[#999999] h-9 pl-10 pr-4 rounded-[7px] border border-gray-300 
                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (searchValue.trim() === "") {
                        handleSearch?.(searchValue);
                      }
                      setSearchDropdown(false);
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchValue(value);
                    handleSearch?.(value);
                    setSearchDropdown(value.trim().length > 0);
                  }}
                  onFocus={() => setSearchDropdown(true)}
                />
                {searchValue?.trim() !== '' && (
                  <X
                  onClick={() => {
                     setSearchValue('');
                     handleSearch?.('');
                  }}
                    className="absolute right-3 top-1/2 cursor-pointer bg-red-500 rounded-full -translate-y-1/2 text-white p-1"
                    size={20}
                  />
                )}
                {searchDropdown && searchValue && (
                  <div className="absolute left-0 top-full mt-2 w-full rounded-xl bg-white shadow-lg border border-slate-200 z-50 max-h-[300px] overflow-y-auto scrollbar-hide">
                    {searchedLocations?.length > 0 ? (
                      <ul className="py-1 text-sm text-slate-700">
                        {searchedLocations.map((item: any, index: number) => (
                          <li key={item?.id || index}>
                            <button
                              type="button"
                              onClick={() => {
                                setSearchValue(item?.name);
                                handleSearch?.(item);
                                setSearchDropdown(false);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-slate-100 transition"
                            >
                              {item?.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No locations found
                      </div>
                    )}
                  </div>
                )}
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
