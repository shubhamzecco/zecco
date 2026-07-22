"use client";

import { useWebSocket } from "@/api/socket/WebSocketContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { parsePrice } from "@/utils/common";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { PropertyMap } from "./map";

interface FilterPanelProps {
  initialFilters?: Record<string, any>;
  onFilterChange?: (filters: any) => void;
  areas?: any[];
  parentArea?: any;
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

type CheckboxGroup = "types" | "propertyStatus" | "condition" | "features" | "floor" | "multimedia" | "publicationDate";

const defaultFilters: FiltersState = {
  categories: null, priceFrom: "", priceTo: "", buildFrom: "", buildTo: "",
  types: {}, propertyStatus: { bareOwnership: true }, bedroomsFrom: null, bedroomsTo: null,
  condition: {}, features: {}, floor: {}, multimedia: {}, publicationDate: {},
};

export default function FilterPanel({ initialFilters, onFilterChange, areas, parentArea, onAreaClick }: FilterPanelProps) {
  const [filters, setFilters] = useState<FiltersState>(() => ({
    ...defaultFilters,
    ...initialFilters,
  }));
  const { sendMessage } = useWebSocket();

  useEffect(() => {
    sendMessage("action", { type: "propertyService", action: "features", payload: {} });
    if (filters?.categories) {
      sendMessage("action", {
        type: "propertyService", action: "propertyTypes",
        payload: { id: Number(filters?.categories), is_subtype: true },
      });
    }
  }, []);

  const { mainReducer } = usePosterReducers();
  const propertyTypeList = mainReducer?.property_type_list || [];
  const propertySubtypeList = (mainReducer?.property_subtype_list || []).filter(
    (item: any) => filters.categories ? item?.external_property_type_id === Number(filters.categories) : true
  );
  console.log("propertySubtypeList ::: ", propertySubtypeList)
  console.log("mainReducer?.property_subtype_list ::: ", mainReducer?.property_subtype_list)
  console.log("filters.categories ::: ", filters.categories)
  const propertyFeaturesList = (mainReducer?.property_features_list || []).filter(
    (item: any) => {
      const itemName = item.name.toLowerCase();
      return !propertyTypeList.some((t: any) => {
        const typeName = t.name.toLowerCase();
        return typeName === itemName || itemName.includes(typeName) || typeName.includes(itemName);
      });
    }
  );

  const handleInputChange = (field: string, value: string | number) => {
    let updated = { ...filters, [field]: value };
    if (field === "categories") {
      updated = { ...updated, types: {} };
      sendMessage("action", {
        type: "propertyService", action: "propertyTypes",
        payload: { id: Number(value), is_subtype: true },
      });
    }
    setFilters(updated);
    if (field === "categories") {
      onFilterChange?.(updated);
    }
  };

  const handleEnterPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "tab") {
      onFilterChange?.(filters);
    }
  };

  const handleCheckboxChange = (category: CheckboxGroup, option: string | number, checked: boolean) => {
    const updatedCategory = { ...filters[category] };
    if (checked) (updatedCategory as any)[option] = true;
    else delete (updatedCategory as any)[option];
    const updated = { ...filters, [category]: updatedCategory };
    setFilters(updated);
    onFilterChange?.(updated);
  };

  return (
    <div className="w-full bg-[#F8FAFC] rounded-lg h-full overflow-y-auto">
      <div className="w-full h-96 p-1">
        <PropertyMap areas={areas} parentArea={parentArea} onAreaClick={onAreaClick} />
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-3">
          <Label className="text-md font-medium text-text_gray_color font-manrope tracking-wide">Property type</Label>
          <div className="relative">
            <select
              value={filters.categories ?? ""}
              onChange={(e) => handleInputChange("categories", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">All Property Types</option>
              {propertyTypeList?.map((t: any) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {propertySubtypeList?.length > 0 && filters?.categories && (
          <div className="space-y-3">
            <Label className="text-md font-medium text-text_gray_color font-manrope tracking-wide">Type of home</Label>
            <div className="space-y-2.5">
              {propertySubtypeList?.map((item: any) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={String(item.id)}
                    checked={!!filters.types?.[item.id]}
                    onCheckedChange={(checked) => handleCheckboxChange("types", item.id, checked as boolean)}
                    className="rounded"
                  />
                  <Label htmlFor={String(item.id)} className="text-sm font-manrope font-normal text-[#0F172A] cursor-pointer">
                    {item.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Label className="text-md font-medium text-text_gray_color font-manrope tracking-wide">Price</Label>
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Min"
                  value={filters.priceFrom ?? ""}
                  onChange={(e) => handleInputChange("priceFrom", parsePrice(e.target.value))}
                  onKeyDown={handleEnterPress}
                  className="w-full bg-white pr-14 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-manrope text-text_gray_color pointer-events-none">€</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Max"
                  value={filters.priceTo ?? ""}
                  onChange={(e) => handleInputChange("priceTo", e.target.value)}
                  onKeyDown={handleEnterPress}
                  className="w-full bg-white pr-14 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-manrope text-text_gray_color pointer-events-none">€</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-md font-medium text-text_gray_color font-manrope tracking-wide">Size</Label>
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Min"
                  value={filters.buildFrom ?? ""}
                  onChange={(e) => handleInputChange("buildFrom", e.target.value)}
                  onKeyDown={handleEnterPress}
                  className="w-full bg-white pr-14 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-manrope text-text_gray_color pointer-events-none">m²</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Max"
                  value={filters.buildTo ?? ""}
                  onChange={(e) => handleInputChange("buildTo", e.target.value)}
                  onKeyDown={handleEnterPress}
                  className="w-full bg-white pr-14 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-manrope text-text_gray_color pointer-events-none">m²</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-md font-medium text-text_gray_color font-manrope tracking-wide">Bedroom</Label>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="From"
                value={filters.bedroomsFrom ?? ""}
                onChange={(e) => handleInputChange("bedroomsFrom", e.target.value)}
                onKeyDown={handleEnterPress}
                className="w-full bg-white pr-14 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <Input
                placeholder="To"
                value={filters.bedroomsTo ?? ""}
                onChange={(e) => handleInputChange("bedroomsTo", e.target.value)}
                onKeyDown={handleEnterPress}
                className="w-full bg-white pr-14 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-md font-medium text-text_gray_color font-manrope tracking-wide">More filters</Label>
          <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
            {propertyFeaturesList?.map((item: any) => (
              <div key={item.id} className="flex items-center space-x-3">
                <Checkbox
                  id={item.name}
                  checked={!!filters.features?.[item.id]}
                  onCheckedChange={(checked) => handleCheckboxChange("features", item.id, checked as boolean)}
                  onKeyDown={handleEnterPress}
                  className="rounded"
                />
                <Label htmlFor={item.name} className="text-sm font-manrope font-normal text-[#0F172A] cursor-pointer">
                  {item.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
