"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { citySlug, investmentType, propertyTypes } from "@/utils/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import DropdownSelect from "./ui/DropSelect";
import { MultiSelectButtonGroup } from "./ui/MultiselectButton";
import { Loader2 } from "lucide-react";

const preferenceSchema = z.object({
  location: z.any().optional(),
  category: z.union([z.number(), z.array(z.number())]).nullable().optional(),
  budget: z.string().nullable().optional(),
  bedrooms: z.union([z.string(), z.array(z.string())]).nullable().optional(),
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
  const [location, setLocation] = useState<any>();
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
      location: "",
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

    const categories = Array.isArray(data?.category)
      ? data.category
      : data?.category
        ? [data.category]
        : null;
    const bedroomValues: string[] = data?.bedrooms
      ? Array.isArray(data.bedrooms)
        ? data.bedrooms
        : [data.bedrooms]
      : [];

    const bedroomNumbers = bedroomValues.map((item: string) =>
      Number(item.replace("+", "")),
    );

    const bedroomsFrom = bedroomNumbers.length > 0 ? Math.min(...bedroomNumbers) : null;

    const bedroomsTo = bedroomNumbers.length > 0 ? Math.max(...bedroomNumbers) : null;

    const params = new URLSearchParams();
    if (location?.label) params.set("city", citySlug(location.label));
    if (data.location?.subarea_name) params.set("area", citySlug(data.location.subarea_name));
    if (categories) params.set("categories", String(categories));
    if (bedroomsFrom !== null) params.set("bedroomsFrom", String(bedroomsFrom));
    if (bedroomsTo !== null) params.set("bedroomsTo", String(bedroomsTo));
    if (priceFrom) params.set("priceFrom", String(priceFrom));
    if (priceTo) params.set("priceTo", String(priceTo));

    onClose?.();
    router.replace(
      `${App_url.link.COSTA_DEL_SOL}/properties?${params.toString()}`,
    );
  };


  const propertyTypeOptions =
    mainReducer?.property_type_list?.map((item: any) => ({
      value: item?.id,
      label: item?.name,
      key: item?.id,
    })) || [];

  const locationOptions =
    mainReducer?.all_location_list?.map((item: any) => ({
      value: item?.id,
      label: item?.name,
      key: item?.id,
    })) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm max-md:p-3">
      <div className="w-[550px] max-sm:w-full rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-[#F9F9F9]">
          <h2 className="text-lg font-semibold text-gray-900">Filter Popup</h2>
        </div>

        <div className={`bg-white/70 p-3 sm:px-7 pt-5 mb-3 rounded-lg `}>
          <div className="sm:p-8 p-3 bg-[#F2F3F6] rounded-lg">
            <Form {...preferenceForm}>
              <form
                className="max-md:flex flex-col justify-center max-md:min-h-fit max-md:py-3"
                onSubmit={preferenceForm.handleSubmit(onPreferenceSubmit)}
              >
                <div className="grid grid-cols-1 gap-4">
                  <DropdownSelect
                    label="Preferred Location"
                    defaultValue="Preferred Location"
                    options={locationOptions}
                    control={preferenceForm.control}
                    name="location"
                    labelClassName="font-bold"
                    isRounded
                    onSelect={(e) => setLocation(e)}
                  />
                  <DropdownSelect
                    label="Property Type"
                    defaultValue="Property Type"
                    options={propertyTypeOptions}
                    control={preferenceForm.control}
                    name="category"
                    labelClassName="font-bold"
                    multiselect
                    isRounded
                  />

                  <FormField
                    control={preferenceForm.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold font-inter text-[#101828]">
                          Budget Range
                        </FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 gap-2">
                            {priceRanges?.map((item) => {
                              const isSelected = field.value === item.value;
                              return (
                                <button
                                  key={item.value}
                                  type="button"
                                  onClick={() => field.onChange(item.value)}
                                  className={`
                                  h-11 rounded-full border text-sm font-medium transition-all
                                  ${isSelected
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

                  <MultiSelectButtonGroup
                    control={preferenceForm.control}
                    name="bedrooms"
                    label="Bedrooms"
                    options={bedroomRanges}
                    columns={5}
                  />
                </div>
                <div className="flex gap-3  px-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 font-circular_std rounded-lg bg-[#000037] px-4 py-2.5 text-sm font-medium text-white"
                  >
                    Cancel
                  </button>
                  <button
                    // onClick={preferenceForm.handleSubmit(onPreferenceSubmit)}
                    type="submit"
                    className="flex-1 font-circular_std rounded-lg bg-[#0C87F1] px-4 py-2.5 text-sm font-medium text-white"
                  >
                    Apply
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPopup;
