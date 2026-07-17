"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setPropertyFilter } from "@/redux/modules/main/action";
import { cityName, citySlug } from "@/utils/common";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import Footer from "../Footer";
import Header from "../Header";
import Breadcrumb from "../breadcrumbs";
import ChatbotWidget from "../chat/chatbot-widget";
import DropdownSelect from "../ui/DropSelect";

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
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch()
  const { sendMessage, isConnected } = useWebSocket();
  const { mainReducer } = usePosterReducers();
  const city = searchParams.get("city") || "";
  const area = searchParams.get("area") || "";
  const subarea = searchParams.get("subarea") || "";
  const searchval = searchValueProp || subarea || area || city
  const updatedSearchVal = cityName(searchval)

  const { control, reset } = useForm({
    defaultValues: {
      location: updatedSearchVal
    }
  })

  useEffect(() => {
    reset({
      location: updatedSearchVal,
    });
  }, [updatedSearchVal]);


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
    console.log("data::",data)
    dispatch(
      setPropertyFilter({
        ...mainReducer?.propertyFilter,
        cities: data?.city,
      })
    );
    const type=data?.type || "city"

    const params = new URLSearchParams(window.location.search);
    if(type === 'city'){
      params.delete("area");
      params.delete("subarea");
    }
    if(type === 'area' || type === "subarea"){
      params.delete("city");
      params.set('city', citySlug(data?.city || ""));
    }
    params.delete("cities");
    params.set(type, citySlug(data?.label || data?.value || ""));

    router.push(
      `${App_url.link.COSTA_DEL_SOL}/properties?${params.toString()}`
    );
  };

//   {
//     "id": "6a212988be616682e93b6102",
//     "type": "city",
//     "name": "Benadalid",
//     "name_slug": "benadalid",
//     "city_name": "benadalid",
//     "area_name": null,
//     "subarea_name": null,
//     "point": {
//         "type": "Point",
//         "coordinates": [
//             -5.268939,
//             36.605768
//         ]
//     }
// }

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
                    value: location?.name_slug,
                    label: location?.name,
                    key: location?.id,
                    type:location?.type,
                    city:location?.city_name
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
