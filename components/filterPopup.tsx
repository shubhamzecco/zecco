"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setPropertyFilter } from "@/redux/modules/main/action";
import { citySlug } from "@/utils/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";

const preferenceSchema = z.object({
  selectedLocation: z.any().optional(),
  category: z.number().nullable().optional(),
  budget: z.string().nullable().optional(),
  bedrooms: z.string().nullable().optional(),
});

const FilterPopup = ({
  propertyType,
  onClose,
  openPopup,
}: {
  propertyType: string;
  onClose?: () => void;
  openPopup?: boolean;
}) => {
  if (!openPopup) return null;
  const { user_data, mainReducer } = usePosterReducers();
  const { sendMessage, lastEvent, isConnected } = useWebSocket();
  const [searchValue, setSearchValue] = useState("");
  const [searchDropdown, setSearchDropdown] = useState(false);
  const [propertyTypeSearch, setPropertyTypeSearch] = useState("");
  const [propertyTypeDropdown, setPropertyTypeDropdown] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

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
    },
  });

  const onPreferenceSubmit = (data: z.infer<typeof preferenceSchema>) => {
    const budget = data?.budget || "";
    const priceFrom = budget.includes("+")
      ? Number(budget.replace("+", ""))
      : Number(budget.split("-")[0]);
    const priceTo = budget.includes("+") ? null : Number(budget.split("-")[1]);

    dispatch(
      setPropertyFilter({
        categories: data?.category || null,
        bedroomsFrom: Number(data?.bedrooms?.replace("+", "")) || null,
        bedroomsTo: Number(data?.bedrooms?.replace("+", "")) || null,
        priceFrom,
        priceTo,
        propertyType: propertyType || "all",
        search:
          data.selectedLocation?.area_name ??
          data.selectedLocation?.subarea_name ??
          null,
      }),
    );
    onClose?.();
    router.replace(
      `${App_url.link.COSTA_DEL_SOL}/${citySlug(data.selectedLocation?.city_name)}`,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm max-md:p-3">
      <div className="w-[470px] rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-[#F9F9F9]">
          <h2 className="text-lg font-semibold text-gray-900">Filter Popup</h2>
        </div>

        <div className="m-2">
          <div className="p-5">
            <Form {...preferenceForm}>
              <form
                className=""
                onSubmit={preferenceForm.handleSubmit(onPreferenceSubmit)}
              >
                <div className="grid grid-cols-1 gap-5">
                  <div className="grid grid-cols-1 lg:grid-cols-1 gap-5">
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
                                                setPropertyTypeDropdown(false);
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
                  </div>
                </div>
              </form>
            </Form>
          </div>
          <div className="flex gap-3 border-t px-4 py-4">
            <button
              onClick={onClose}
              className="flex-1 font-circular_std rounded-lg bg-[#000037] px-4 py-2.5 text-sm font-medium text-white"
            >
              Cancel
            </button>
            <button
              onClick={preferenceForm.handleSubmit(onPreferenceSubmit)}
              type="submit"
              className="flex-1 font-circular_std rounded-lg bg-[#0C87F1] px-4 py-2.5 text-sm font-medium text-white"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPopup;
