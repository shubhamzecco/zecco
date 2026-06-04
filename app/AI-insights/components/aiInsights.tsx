"use client";

import { useWebSocket } from "@/api/socket/WebSocketContext";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { IProperty } from "@/redux/modules/main/types";
import {
  ArrowRight,
  Bath,
  BedSingle,
  ChevronDown,
  Cpu,
  Expand,
  FileText,
  Search,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type AiInsightsProps = {
  property: IProperty;
  onGetStarted: (property: IProperty) => void;
};

const AiInsights = ({ onGetStarted, property }: AiInsightsProps) => {
  const { mainReducer } = usePosterReducers();

  const { sendMessage, isConnected } = useWebSocket();

  const [selectedProperty, setSelectedProperty] = useState<IProperty>(property);

  const [openDropdown, setOpenDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // LOAD FAVORITE PROPERTY LIST
  useEffect(() => {
    if (isConnected) {
      sendMessage("action", {
        type: "userService",
        action: "favoritePropertyList",
        payload: {},
      });
    }
  }, [isConnected]);

  // SET FIRST FAVORITE PROPERTY
  useEffect(() => {
    if (
      mainReducer?.favorite_property_list?.data &&
      mainReducer.favorite_property_list.data.length > 0
    ) {
      setSelectedProperty(mainReducer.favorite_property_list.data[0]);
    }
  }, [mainReducer?.favorite_property_list]);

  // CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section className="mb-6">
      <h2 className="mb-4 font-inter text-lg font-bold text-[#111827]">
        AI Insights
      </h2>

      {/* PROPERTY CARD */}
      <div className="relative flex flex-col gap-6" ref={dropdownRef}>
        <div className="relative overflow-visible rounded-2xl bg-white/70">
          {/* DROPDOWN BUTTON */}
          {selectedProperty && (
            <button
              type="button"
              onClick={() => setOpenDropdown(!openDropdown)}
              className="
              md:hidden
              absolute right-4 top-12 z-30
              flex items-center gap-2
              rounded-full  px-3 py-2 hover:bg-slate-100
              hover:shadow-md hover:transition hover:scale-105
            "
            >
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  openDropdown ? "rotate-180" : ""
                }`}
              />
            </button>
          )}

          {!selectedProperty ? (
            <div className="flex lg:h-32 max-md:h-52 flex-col items-center justify-center px-6 py-10 text-center">
              <h2 className="font-inter text-xl font-semibold text-[#111827]">
                No Favorite Properties
              </h2>

              <p className="mt-2 max-w-md font-manrope text-sm text-[#64748B]">
                Add properties to your favorites to view AI insights and
                comparisons.
              </p>
            </div>
          ) : (
            <>
              <div className="lg:flex items-start gap-3">
                <div className="lg:h-32 max-md:h-52">
                  <Image
                    src={selectedProperty?.propertyImages?.[0]?.url || ""}
                    alt="AI Insights"
                    width={160}
                    height={100}
                    className="
                  object-cover
                  lg:h-32
                  max-md:h-52
                  max-md:w-full
                  lg:rounded-l-2xl
                  max-md:rounded-t-2xl
                "
                  />
                </div>

                <div className="flex flex-col gap-1 max-md:mb-5">
                  <h1 className="px-4 pt-4 font-inter text-md font-bold text-[#111827]">
                    {selectedProperty?.bedrooms
                      ? `${selectedProperty?.bedrooms} Bedroom `
                      : ""}{" "}
                    {selectedProperty?.propertyType
                      ? selectedProperty?.propertyType?.name
                      : selectedProperty?.propertyCategory?.name}{" "}
                    for{" "}
                    {selectedProperty?.isSale && selectedProperty?.isRent
                      ? "Sale or Rent"
                      : selectedProperty?.isSale
                        ? "Sale"
                        : selectedProperty?.isRent
                          ? "Rent"
                          : ""}{" "}
                    in{" "}
                    {selectedProperty?.locationSubarea
                      ? `${selectedProperty?.locationSubarea},`
                      : ""}{" "}
                    {selectedProperty?.locationArea
                      ? `${selectedProperty?.locationArea},`
                      : ""}{" "}
                    {selectedProperty?.locationCity},{" "}
                    {selectedProperty?.locationCountry}
                  </h1>
                  <h2 className="px-4 pt-1 font-manrope text-lg font-bold text-[#64748B]">
                    €{selectedProperty?.salePrice}
                  </h2>

                  <div className="flex items-center gap-5 px-4 pt-2 text-sm">
                    <div className="flex items-center gap-1 font-manrope font-normal">
                      <Expand size={18} className="text-gray-400" />

                      <span>{selectedProperty?.mtsBuild} /m²</span>
                    </div>

                    <div className="flex items-center gap-1 font-manrope font-normal">
                      <BedSingle size={18} className="text-gray-400" />

                      <span>{selectedProperty?.bedrooms} Bed</span>
                    </div>

                    <div className="flex items-center gap-1 font-manrope font-normal">
                      <Bath size={18} className="text-gray-400" />

                      <span>{selectedProperty?.bathrooms} Bath</span>
                    </div>
                  </div>
                </div>
              </div>
              {selectedProperty && (
                <div className="flex justify-center lg:absolute lg:right-4 lg:top-12 lg:z-30 lg:block">
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(!openDropdown)}
                    className="
        mt-3 lg:mt-0
        flex items-center gap-2
        rounded-full px-4 py-2
        hover:bg-slate-100
        hover:shadow-md
        transition
      "
                  >
                    <span className="text-sm font-medium text-gray-600 lg:hidden">
                      View Properties
                    </span>

                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        openDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
              )}
            </>
          )}

          {/* DROPDOWN PROPERTY LIST */}
          {openDropdown && (
            <div
              className="
                absolute left-0 top-full z-50 mt-3
                max-h-[400px] w-full overflow-y-auto scrollbar-hidee
                rounded-2xl border border-gray-100
                bg-white p-3 shadow-2xl
              "
            >
              {(mainReducer?.favorite_property_list?.data?.length ?? 0) > 0 ? (
                <div className="space-y-3">
                  {mainReducer?.favorite_property_list?.data?.map(
                    (item: IProperty, index: number) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setSelectedProperty(item);

                          setOpenDropdown(false);
                        }}
                        className="
                        w-full overflow-hidden
                        rounded-2xl border
                        border-gray-100 bg-white
                        text-left transition
                        hover:border-[#2563EB]
                      "
                      >
                        <div className="flex items-start gap-3">
                          <div className="max-md:h-32 h-24 w-[150px]">
                            <Image
                              src={item?.propertyImages?.[0]?.url || ""}
                              alt="Property"
                              width={110}
                              height={90}
                              className="
                              max-md:h-32 h-24 w-full
                              rounded-l-2xl
                              object-cover
                            "
                            />
                          </div>

                          <div className="flex flex-col gap-1 p-3">
                            <h1 className="font-inter text-sm font-bold text-[#111827]">
                              {item?.bedrooms
                                ? `${item?.bedrooms} Bedroom `
                                : ""}{" "}
                              {item?.propertyCategory?.name} for{" "}
                              {item?.isSale && item?.isRent
                                ? "Sale or Rent"
                                : item?.isSale
                                  ? "Sale"
                                  : item?.isRent
                                    ? "Rent"
                                    : ""}{" "}
                              in{" "}
                              {item?.locationSubarea
                                ? `${item?.locationSubarea},`
                                : ""}{" "}
                              {item?.locationArea
                                ? `${item?.locationArea},`
                                : ""}{" "}
                              {item?.locationCity}, {item?.locationCountry}
                            </h1>

                            <h2 className="font-manrope text-sm font-bold text-[#64748B]">
                              €{item?.salePrice}
                            </h2>

                            <div className="flex items-center gap-3 pt-1 text-xs">
                              <div className="flex items-center gap-1">
                                <Expand size={14} className="text-gray-400" />

                                <span>{item?.mtsBuild} /m²</span>
                              </div>

                              <div className="flex items-center gap-1">
                                <BedSingle
                                  size={14}
                                  className="text-gray-400"
                                />

                                <span>{item?.bedrooms} Bed</span>
                              </div>

                              <div className="flex items-center gap-1">
                                <Bath size={14} className="text-gray-400" />

                                <span>{item?.bathrooms} Bath</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    ),
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <h2 className="font-inter text-lg font-semibold text-[#111827]">
                    No favorite properties found
                  </h2>

                  <p className="mt-2 font-manrope text-sm text-[#64748B]">
                    Add properties to your favorites to compare AI insights.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* STEPS */}
      <div className="my-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
        <div className="flex items-start gap-4 rounded-lg bg-white p-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#4A86E8] p-2">
            <Search size={25} className="text-white" />
          </div>

          <div className="w-[80%]">
            <h1 className="font-inter text-md font-bold text-[#111827]">
              1. Select Property
            </h1>

            <p className="font-inter text-sm font-medium text-[#4B5563]">
              Choose a property based on your location, budget, and preferences.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-lg bg-white p-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#4A86E8] p-2">
            <Cpu size={25} className="text-white" />
          </div>

          <div className="w-[80%]">
            <h1 className="font-inter text-md font-bold text-[#111827]">
              2. AI Analysis
            </h1>

            <p className="font-inter text-sm font-medium text-[#4B5563]">
              Our AI processes property details using market trends, pricing
              data, and comparable properties.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-4 rounded-lg bg-white p-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#4A86E8] p-2">
          <FileText size={25} className="text-white" />
        </div>

        <div className="w-[80%]">
          <h1 className="font-inter text-md font-bold text-[#111827]">
            3. Property Analysis Report
          </h1>

          <p className="font-inter text-sm font-medium text-[#4B5563]">
            Receive a personalized AI-powered report with valuation, investment
            insights, and market recommendations.
          </p>
        </div>
      </div>

      {/* BUTTON */}
      <button
        onClick={() => onGetStarted(selectedProperty)}
        className="
          my-4 flex w-fit items-center gap-2
          rounded-[10px] bg-[#111827]
          px-10 py-2.5 text-[15px]
          font-extrabold tracking-wider
          text-white shadow-md
        "
      >
        Get Started
        <ArrowRight size={18} className="ml-2" />
      </button>
    </section>
  );
};

export default AiInsights;
