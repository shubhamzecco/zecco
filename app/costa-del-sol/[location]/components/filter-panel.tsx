"use client";

import { useWebSocket } from "@/api/socket/WebSocketContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setPropertyFilter } from "@/redux/modules/main/action";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { PropertyMap } from "./map";
import { parsePrice } from "@/utils/common";

interface FilterPanelProps {
  onFilterChange?: (filters: any) => void;
  areas?: any[];
  onAreaClick?: (area: any) => void;
}

type FiltersState = {
  categories: string | null;
  priceFrom: string;
  priceTo: string;
  buildFrom: string;
  buildTo: string;
  types: Record<number, boolean>;
  propertyStatus: Record<string, boolean>;
  condition: Record<string, boolean>;
  features: Record<string, boolean>;
  floor: Record<string, boolean>;
  multimedia: Record<string, boolean>;
  publicationDate: Record<string, boolean>;
  bedroomsFrom: number | null;
  bedroomsTo: number | null;
};

type CheckboxGroup =
  | "types"
  | "propertyStatus"
  | "condition"
  | "features"
  | "floor"
  | "multimedia"
  | "publicationDate";

export default function FilterPanel({ onFilterChange, areas, onAreaClick }: FilterPanelProps) {
  const [filters, setFilters] = useState<FiltersState>({
    categories: null,
    priceFrom: "",
    priceTo: "",
    buildFrom: "",
    buildTo: "",
    types: {},
    propertyStatus: { bareOwnership: true },
    bedroomsFrom: null,
    bedroomsTo: null,
    condition: {},
    features: {},
    floor: {},
    multimedia: {},
    publicationDate: {},
  });
  const { mainReducer } = usePosterReducers();
  const { sendMessage, lastEvent } = useWebSocket();
  const dispatch = useDispatch();

  const defaultFilters: FiltersState = {
    categories: null,
    priceFrom: "",
    priceTo: "",
    buildFrom: "",
    buildTo: "",
    types: {},
    propertyStatus: { bareOwnership: true },
    bedroomsFrom: null,
    bedroomsTo: null,
    condition: {},
    features: {},
    floor: {},
    multimedia: {},
    publicationDate: {},
  };

  useEffect(() => {
    if (mainReducer?.propertyFilter) {

      setFilters({
        categories: mainReducer?.propertyFilter?.categories || "",

        priceFrom: mainReducer?.propertyFilter?.priceFrom || "",

        priceTo: mainReducer?.propertyFilter?.priceTo || "",

        buildFrom: mainReducer?.propertyFilter?.buildFrom || "",

        buildTo: mainReducer?.propertyFilter?.buildTo || "",

        bedroomsFrom: mainReducer?.propertyFilter?.bedroomsFrom || null,

        bedroomsTo: mainReducer?.propertyFilter?.bedroomsTo || null,

        types: Array.isArray(mainReducer?.propertyFilter?.types)
          ? mainReducer?.propertyFilter?.types.reduce(
            (acc: Record<number, boolean>, item: number) => {
              acc[item] = true;
              return acc;
            },
            {},
          )
          : mainReducer?.propertyFilter?.types || {},

        features: Array.isArray(mainReducer?.propertyFilter?.features)
          ? mainReducer?.propertyFilter?.features.reduce(
            (acc: Record<number, boolean>, item: number) => {
              acc[item] = true;
              return acc;
            },
            {},
          )
          : mainReducer?.propertyFilter?.features || {},

        propertyStatus: { bareOwnership: true },
        condition: {},
        floor: {},
        multimedia: {},
        publicationDate: {},
      });
    } else {
      dispatch(setPropertyFilter(defaultFilters));
      setFilters(defaultFilters);
    }
  }, [mainReducer?.propertyFilter]);

  useEffect(() => {
    if (mainReducer?.propertyFilter?.categories) {
      sendMessage("action", {
        type: "propertyService",
        action: "propertyTypes",
        payload: {
          id: Number(mainReducer?.propertyFilter?.categories),
          is_subtype: true,
        },
      });
      setFilters((prev) => ({
        ...prev,
        categories: mainReducer?.propertyFilter?.categories,
      }));
    }
  }, [mainReducer?.propertyFilter?.categories]);

  const handleInputChange = (field: string, value: string | number) => {
    let updated: FiltersState = {
      ...filters,
      [field]: value,
    };
    if (field === "propertyTypes") {
      updated = {
        ...updated,
        types: {},
      };
      sendMessage("action", {
        type: "propertyService",
        action: "propertyTypes",
        payload: {
          id: Number(value),
          is_subtype: true,
        },
      });
    }
    setFilters(updated);

    if (field === "categories") {
      onFilterChange?.(updated);
      dispatch(setPropertyFilter(updated));
    }
  };

  const handleEnterPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "tab") {
      onFilterChange?.(filters);
      dispatch(setPropertyFilter(filters));
    }
  };

  useEffect(() => {
    sendMessage("action", {
      type: "propertyService",
      action: "features",
      payload: {},
    });
  }, []);

  const handleCheckboxChange = (
    category: CheckboxGroup,
    option: string | number,
    checked: boolean,
  ) => {
    const updatedCategory = {
      ...filters[category],
    };

    if (checked) {
      (updatedCategory as any)[option] = true;
    } else {
      delete (updatedCategory as any)[option];
    }

    const updated: FiltersState = {
      ...filters,
      [category]: updatedCategory,
    };

    setFilters(updated);

    dispatch(setPropertyFilter(updated));

    onFilterChange?.(updated);
  };


  // useEffect(() => {
  //   if (
  //     lastEvent?.data?.status &&
  //     lastEvent?.data?.request?.type === "savedSearchService" &&
  //     lastEvent?.data?.request?.action === "add"
  //   ) {
  //     const emptyFilters: FiltersState = {
  //       categories: null,
  //       priceFrom: "",
  //       priceTo: "",
  //       buildFrom: "",
  //       buildTo: "",
  //       types: {},
  //       propertyStatus: { bareOwnership: true },
  //       bedroomsFrom: null,
  //       bedroomsTo: null,
  //       condition: {},
  //       features: {},
  //       floor: {},
  //       multimedia: {},
  //       publicationDate: {},
  //     };
  //     setFilters(emptyFilters);
  //     dispatch(setPropertyFilter(emptyFilters));
  //     onFilterChange?.(emptyFilters);
  //   }
  // }, [lastEvent]);

  return (
    <div className="w-full bg-[#F8FAFC] rounded-lg h-full overflow-y-auto">
      <div className="w-full h-96 p-1">
        <PropertyMap areas={areas} onAreaClick={onAreaClick} />
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-3">
          <Label className="text-md font-medium text-text_gray_color font-manrope  tracking-wide">
            Property type
          </Label>
          <div className="relative">
            <select
              value={filters?.categories ?? ""}
              onChange={(e) => {
                handleInputChange("categories", e.target.value);
              }}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">All Property Types</option>
              {mainReducer?.property_type_list?.map((type) => {
                return (
                  <option key={type?.id} value={type?.id}>
                    {type?.name}
                  </option>
                );
              })}
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {(mainReducer?.property_subtype_list ?? [])?.length > 0 &&
          mainReducer?.propertyFilter?.categories && (
            <div className="space-y-3">
              <Label className="text-md font-medium text-text_gray_color font-manrope  tracking-wide">
                Type of home
              </Label>
              <div className="space-y-2.5">
                {mainReducer?.property_subtype_list?.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={String(item.id)}
                      // checked={filters.types[item.id] || false}
                      checked={!!filters?.types?.[item.id]}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "types",
                          item.id,
                          checked as boolean,
                        )
                      }
                      className="rounded"
                    />
                    <Label
                      htmlFor={String(item.id)}
                      className="text-sm font-manrope font-normal text-[#0F172A] cursor-pointer"
                    >
                      {item.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Price */}
        <div className="space-y-3">
          <Label className="text-md font-medium text-text_gray_color font-manrope  tracking-wide">
            Price
          </Label>
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Min"
                  value={filters.priceFrom ?? ""}
                  onChange={(e) =>
                    handleInputChange("priceFrom", parsePrice(e.target.value))
                  }
                  onKeyDown={handleEnterPress}
                  className="w-full  bg-white pr-14 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-manrope text-text_gray_color pointer-events-none">
                  €
                </span>
              </div>
            </div>

            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Max"
                  value={filters.priceTo ?? ""}
                  onChange={(e) => handleInputChange("priceTo", e.target.value)}
                  onKeyDown={handleEnterPress}
                  className="w-full  bg-white pr-14 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-manrope text-text_gray_color pointer-events-none">
                  €
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Size */}
        <div className="space-y-3">
          <Label className="text-md font-medium text-text_gray_color font-manrope  tracking-wide">
            Size
          </Label>
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Min"
                  value={filters.buildFrom ?? ""}
                  onChange={(e) =>
                    handleInputChange("buildFrom", e.target.value)
                  }
                  onKeyDown={handleEnterPress}
                  className="w-full  bg-white pr-14 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-manrope text-text_gray_color pointer-events-none">
                  m²
                </span>
              </div>
            </div>

            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Max"
                  value={filters.buildTo ?? ""}
                  onChange={(e) => handleInputChange("buildTo", e.target.value)}
                  onKeyDown={handleEnterPress}
                  className="w-full  bg-white pr-14 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-manrope text-text_gray_color pointer-events-none">
                  m²
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-md font-medium text-text_gray_color font-manrope  tracking-wide">
            Bedroom
          </Label>
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="From"
                  value={filters?.bedroomsFrom ?? ""}
                  onChange={(e) =>
                    handleInputChange("bedroomsFrom", e.target.value)
                  }
                  onKeyDown={handleEnterPress}
                  className="w-full  bg-white pr-14 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-manrope text-text_gray_color pointer-events-none">
                                    from
                                </span> */}
              </div>
            </div>

            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="To"
                  value={filters?.bedroomsTo ?? ""}
                  onChange={(e) =>
                    handleInputChange("bedroomsTo", e.target.value)
                  }
                  onKeyDown={handleEnterPress}
                  className="w-full  bg-white pr-14 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-manrope text-text_gray_color pointer-events-none">
                                    to
                                </span> */}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-md font-medium text-text_gray_color font-manrope tracking-wide">
            More filters
          </Label>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
            {mainReducer?.property_features_list?.map((item: any) => (
              <div key={item?.id} className="flex items-center space-x-3">
                <Checkbox
                  id={item?.name}
                  // checked={filters?.moreFilters?.[item.id]}
                  checked={!!filters?.features?.[item?.id]}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(
                      "features",
                      item.id,
                      checked as boolean,
                    )
                  }
                  onKeyDown={handleEnterPress}
                  className="rounded"
                />

                <Label
                  htmlFor={item?.name}
                  className="text-sm font-manrope font-normal text-[#0F172A] cursor-pointer"
                >
                  {item?.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
