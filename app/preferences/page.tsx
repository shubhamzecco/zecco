"use client";
import { postData, URL } from "@/api/rest/fetchData";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import ProfileAvatar from "@/components/profile";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

const preferenceSchema = z.object({
  selectedLocation: z.any().optional(),
  category: z.number().nullable().optional(),
  budget: z.string().nullable().optional(),
  bedrooms: z.string().nullable().optional(),
  investmentType: z.string().nullable().optional(),
  types: z.string().nullable().optional(),
});

export const PreferenceSection = () => {
  const { user_data, mainReducer } = usePosterReducers();
  const { sendMessage, lastEvent, isConnected } = useWebSocket();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchDropdown, setSearchDropdown] = useState(false);
  const [propertyTypeSearch, setPropertyTypeSearch] = useState("");
  const [propertyTypeDropdown, setPropertyTypeDropdown] = useState(false);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (!isConnected) return;
    sendMessage("action", {
      type: "locationService",
      action: "searchLocationArea",
      payload: {},
    });
    sendMessage("action", {
      type: "propertyService",
      action: "propertyTypes",
      payload: {},
    });
  }, [isConnected]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSearchDropdown(false);
        setPropertyTypeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchedLocations = searchValue.trim()
    ? mainReducer?.all_location_list?.filter((item: any) =>
        item?.name?.toLowerCase()?.startsWith(searchValue.toLowerCase()),
      )
    : [];

  const priceRanges = [
    {
      label: "Under €1M",
      value: "0-1000000",
    },
    {
      label: "€1M - €2M",
      value: "1000000-2000000",
    },
    {
      label: "€2M - €3.5M",
      value: "2000000-3500000",
    },
    {
      label: "€3.5M+",
      value: "3500000+",
    },
  ];

  const investmentType = [
    {
      label: "Wealth Preservation",
      value: "wealth_preservation",
    },
    {
      label: "Return",
      value: "return",
    },
    {
      label: "Growth",
      value: "growth",
    },
  ];

  const propertyTypes = [
    {
      label: "New Property",
      value: "new_property",
    },
    {
      label: "Existing Property",
      value: "existing_property",
    },
    {
      label: "Rental Property",
      value: "rental_property",
    },
  ];

  const bedroomRanges = [
    {
      label: "1",
      value: "1",
    },
    {
      label: "2",
      value: "2",
    },
    {
      label: "3",
      value: "3",
    },
    {
      label: "4",
      value: "4",
    },
    {
      label: "5+",
      value: "5+",
    },
  ];

  const preferenceForm = useForm<z.infer<typeof preferenceSchema>>({
    resolver: zodResolver(preferenceSchema),
    defaultValues: {
      selectedLocation: "",
      category: undefined,
      budget: "",
      bedrooms: "",
      investmentType: "",
      types: "",
    },
  });

  useEffect(() => {
    if (
      lastEvent?.data?.status &&
      lastEvent?.data?.request?.type === "userService" &&
      lastEvent?.data?.request?.action === "update"
    ) {
      const payload = {
        type: "userService",
        action: "get",
        payload: {},
      };
      sendMessage("action", payload);
    }
  }, [lastEvent]);

  const onPreferenceSubmit = (data: z.infer<typeof preferenceSchema>) => {
    const location = data.selectedLocation || null;
    const payload = {
      type: "userService",
      action: "update",
      payload: {
        id: user_data?.user?._id,
        preferences: {
          locationCity: location?.city_name ? location?.city_name : null,
          locationArea: location?.area_name ? location?.area_name : null,
          locationSubarea: location?.subarea_name
            ? location?.subarea_name
            : null,
          category: data.category || null,
          budget: data.budget || null,
          bedrooms: data.bedrooms || null,
          investmentType: data.investmentType || null,
          types: data.types || null,
        },
      },
    };
    sendMessage("action", payload);
  };

  useEffect(() => {
    preferenceForm?.reset({
      selectedLocation: {
        name:
          user_data?.user?.preferences?.locationSubarea ||
          user_data?.user?.preferences?.locationArea ||
          user_data?.user?.preferences?.locationCity,
        city_name: user_data?.user?.preferences?.locationCity,
        area_name: user_data?.user?.preferences?.locationArea,
        subarea_name: user_data?.user?.preferences?.locationSubarea,
      },
      category: user_data?.user?.preferences?.category,
      budget: user_data?.user?.preferences?.budget,
      bedrooms: user_data?.user?.preferences?.bedrooms,
      investmentType: user_data?.user?.preferences?.investmentType,
      types: user_data?.user?.preferences?.types,
    });

    const selectedType = mainReducer?.property_type_list?.find(
      (item: any) => item.id === user_data?.user?.preferences?.category,
    );

    if (selectedType) {
      setPropertyTypeSearch(selectedType?.name);
    }
    setSearchValue(
      user_data?.user?.preferences?.locationSubarea ||
        user_data?.user?.preferences?.locationArea ||
        user_data?.user?.preferences?.locationCity ||
        "",
    );
  }, [user_data]);

  return (
    <section className="mt-8 mb-6">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold text-lg mb-4 font-inter text-[#111827]">
          Update Preferences
        </h2>
      </div>

      <div className="bg-white/70 p-7 rounded-lg">
        <div className="p-8 bg-[#F2F3F6] rounded-lg">
          <Form {...preferenceForm}>
            <form className="" onSubmit={preferenceForm.handleSubmit(onPreferenceSubmit)}>
              <div className="grid grid-cols-1 gap-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <FormField
                        control={preferenceForm.control}
                        name="selectedLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium font-inter text-[#101828]">
                              Preferred Location
                            </FormLabel>

                            <FormControl>
                              <div ref={dropdownRef} className="relative">
                                <input
                                  type="text"
                                  value={searchValue}
                                  placeholder="Search location"
                                  className="w-full h-12 pl-4 pr-4 rounded-[10px] border border-[#D1D5DB] bg-white text-black focus:outline-none"
                                  onChange={(e) => {
                                    const value = e.target.value;

                                    setSearchValue(value);
                                    field.onChange(value);

                                    setSearchDropdown(value.trim().length > 0);
                                  }}
                                  onFocus={() => setSearchDropdown(true)}
                                />

                                {searchDropdown && searchValue && (
                                  <div className="absolute left-0 top-full mt-2 w-full rounded-xl bg-white shadow-lg border border-slate-200 z-50 max-h-[250px] overflow-y-auto scrollbar-hide">
                                    {searchedLocations.filter((item: any) =>
                                      item.name
                                        .toLowerCase()
                                        .includes(searchValue.toLowerCase()),
                                    ).length ? (
                                      <ul>
                                        {searchedLocations
                                          .filter((item: any) =>
                                            item.name
                                              .toLowerCase()
                                              .includes(
                                                searchValue.toLowerCase(),
                                              ),
                                          )
                                          .map((item: any) => (
                                            <li key={item.id}>
                                              <button
                                                type="button"
                                                className="w-full text-left px-4 py-3 hover:bg-slate-100"
                                                onMouseDown={(e) => {
                                                  e.preventDefault();
                                                  setSearchValue(item.name);
                                                  field.onChange(item);
                                                  setSearchDropdown(false);
                                                }}
                                              >
                                                {item.name}
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
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={preferenceForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium font-inter text-[#101828]">
                              Property Type
                            </FormLabel>

                            <FormControl>
                              <div ref={dropdownRef} className="relative">
                                <input
                                  type="text"
                                  value={propertyTypeSearch}
                                  placeholder="Search property type"
                                  className="w-full h-12 pl-4 pr-4 rounded-[10px] border border-[#D1D5DB] bg-white text-black focus:outline-none"
                                  onChange={(e) => {
                                    const value = e.target.value;

                                    setPropertyTypeSearch(value);
                                    setPropertyTypeDropdown(true);
                                  }}
                                  onFocus={() => setPropertyTypeDropdown(true)}
                                />

                                {propertyTypeDropdown && (
                                  <div className="absolute left-0 top-full mt-2 w-full rounded-xl bg-white shadow-lg border border-slate-200 z-50 max-h-[250px] overflow-y-auto scrollbar-hide">
                                    {mainReducer?.property_type_list?.filter(
                                      (item: any) =>
                                        item.name
                                          .toLowerCase()
                                          .includes(
                                            propertyTypeSearch.toLowerCase(),
                                          ),
                                    ).length ? (
                                      <ul>
                                        {mainReducer?.property_type_list
                                          ?.filter((item: any) =>
                                            item.name
                                              .toLowerCase()
                                              .includes(
                                                propertyTypeSearch.toLowerCase(),
                                              ),
                                          )
                                          .map((item: any) => (
                                            <li key={item.id}>
                                              <button
                                                type="button"
                                                className="w-full text-left px-4 py-3 hover:bg-slate-100"
                                                onClick={() => {
                                                  setPropertyTypeSearch(
                                                    item.name,
                                                  );
                                                  field.onChange(item.id);
                                                  setPropertyTypeDropdown(
                                                    false,
                                                  );
                                                }}
                                              >
                                                {item.name}
                                              </button>
                                            </li>
                                          ))}
                                      </ul>
                                    ) : (
                                      <div className="px-4 py-3 text-sm text-gray-500">
                                        No property types found
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={preferenceForm.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium font-inter text-[#101828]">
                              Budget Range
                            </FormLabel>

                            <FormControl>
                              <div className="grid grid-cols-4 gap-2">
                                {priceRanges?.map((item) => {
                                  const isSelected = field.value === item.value;

                                  return (
                                    <button
                                      key={item.value}
                                      type="button"
                                      onClick={() => field.onChange(item.value)}
                                      className={`
                  h-12 rounded-[10px] border text-sm font-medium transition-all
                  ${
                    isSelected
                      ? "border-[#136AED] bg-[#136AED] text-white shadow-md"
                      : "border-[#D1D5DB] bg-white text-[#374151] hover:border-[#136AED]"
                  }
                `}
                                    >
                                      {item.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={preferenceForm.control}
                        name="bedrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium font-inter text-[#101828]">
                              Bedrooms
                            </FormLabel>

                            <FormControl>
                              <div className="grid grid-cols-5 gap-2">
                                {bedroomRanges?.map((item) => {
                                  const isSelected = field.value === item.value;

                                  return (
                                    <button
                                      key={item.value}
                                      type="button"
                                      onClick={() => field.onChange(item.value)}
                                      className={`
                  h-12 rounded-[10px] border text-sm font-medium transition-all
                  ${
                    isSelected
                      ? "border-[#136AED] bg-[#136AED] text-white shadow-md"
                      : "border-[#D1D5DB] bg-white text-[#374151] hover:border-[#136AED]"
                  }
                `}
                                    >
                                      {item.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={preferenceForm.control}
                        name="investmentType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium font-inter text-[#101828]">
                              Investment Type
                            </FormLabel>

                            <FormControl>
                              <div className="grid grid-cols-3 gap-2">
                                {investmentType?.map((item) => {
                                  const isSelected = field.value === item.value;

                                  return (
                                    <button
                                      key={item.value}
                                      type="button"
                                      onClick={() => field.onChange(item.value)}
                                      className={`
                  h-12 rounded-[10px] border text-sm font-medium transition-all
                  ${
                    isSelected
                      ? "border-[#136AED] bg-[#136AED] text-white shadow-md"
                      : "border-[#D1D5DB] bg-white text-[#374151] hover:border-[#136AED]"
                  }
                `}
                                    >
                                      {item.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={preferenceForm.control}
                        name="types"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium font-inter text-[#101828]">
                              Types
                            </FormLabel>

                            <FormControl>
                              <div className="grid grid-cols-3 gap-2">
                                {propertyTypes?.map((item) => {
                                  const isSelected = field.value === item.value;

                                  return (
                                    <button
                                      key={item.value}
                                      type="button"
                                      onClick={() => field.onChange(item.value)}
                                      className={`
                  h-12 rounded-[10px] border text-sm font-medium transition-all
                  ${
                    isSelected
                      ? "border-[#136AED] bg-[#136AED] text-white shadow-md"
                      : "border-[#D1D5DB] bg-white text-[#374151] hover:border-[#136AED]"
                  }
                `}
                                    >
                                      {item.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>

        <button
          onClick={preferenceForm.handleSubmit(onPreferenceSubmit)}
          type="submit"
          className="w-fit px-10 tracking-wider shadow-md mt-4 bg-[#111827] text-white text-[12px] py-2.5 rounded-[10px] font-manrope font-extrabold flex items-center gap-2"
        >
          Update Preferences
        </button>
      </div>
    </section>
  );
};

const PreferenceForm = () => {
  return (
    <SidebarLayout>
      <div
        className="lg:px-12 px-5 py-8 h-full
                            bg-gradient-to-r
                        from-[#60A5FA]/10
                        via-[#fafafa] via-[70%]
                        to-[#fafafa] to-[100%]"
      >
        <PreferenceSection />
      </div>
    </SidebarLayout>
  );
};

export default PreferenceForm;
