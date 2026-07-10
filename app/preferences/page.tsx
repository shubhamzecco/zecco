"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import DropdownSelect from "@/components/ui/DropSelect";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { MultiSelectButtonGroup } from "@/components/ui/MultiselectButton";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { bedroomRanges, investmentType, priceRanges, propertyTypes } from "@/utils/common";
import { preferenceSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";


export const PreferenceSection = (props?: any) => {
  const { user_data, mainReducer, socketResponse } = usePosterReducers();
  const { sendMessage, lastEvent, isConnected } = useWebSocket();
  const [loading, setLoading] = useState(false);

  const preferenceForm = useForm<z.infer<typeof preferenceSchema>>({
    resolver: zodResolver(preferenceSchema),
    defaultValues: {
      selectedLocation: "",
      location: "",
      category: undefined,
      budget: "",
      bedrooms: [],
      investmentType: [],
      types: [],
    },
    mode: "onChange"
  });

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


  useEffect(() => {
    if (
      lastEvent?.data?.status &&
      lastEvent?.data?.request?.type === "userService" &&
      lastEvent?.data?.request?.action === "update"
    ) {
      setLoading(false);
      const payload = {
        type: "userService",
        action: "get",
        payload: {},
      };
      sendMessage("action", payload);
    }
  }, [lastEvent]);

  const onPreferenceSubmit = (data: z.infer<typeof preferenceSchema>) => {
    setLoading(true);
    const location = mainReducer?.all_location_list?.find(
      (item: any) => item.id === data.location
    )
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
          locationId: data.location,
          category: Array.isArray(data?.category)
            ? data?.category?.map(Number)
            : data?.category
              ? [Number(data?.category)]
              : null,
          budget: data.budget || null,
          bedrooms: data.bedrooms?.map((bedroom) => Number(bedroom.replace("+", ""))) || null,
          investmentType: data.investmentType || null,
          types: data.types || null,
        },
      },
    };
    sendMessage("action", payload);
    if (props?.isPreferenceCall) {
      const payload = {
        "type": "userService",
        "action": "getPreferenceProperties",
        "payload": {
          "limit": 18,
          "page": 1,
          "status": true
        }
      }
      sendMessage("action", payload);
    }
  };

  useEffect(() => {
    preferenceForm.reset({
      selectedLocation: {
        name:
          user_data?.user?.preferences?.locationSubarea ||
          user_data?.user?.preferences?.locationArea ||
          user_data?.user?.preferences?.locationCity ||
          "",
        city_name: user_data?.user?.preferences?.locationCity,
        area_name: user_data?.user?.preferences?.locationArea,
        subarea_name: user_data?.user?.preferences?.locationSubarea,
      },
      location: user_data?.user?.preferences?.locationId,

      category: Array.isArray(user_data?.user?.preferences?.category)
        ? user_data.user.preferences.category
        : user_data?.user?.preferences?.category != null
          ? [user_data.user.preferences.category]
          : [],

      budget: user_data?.user?.preferences?.budget ?? "",

      bedrooms: Array.isArray(user_data?.user?.preferences?.bedrooms)
        ? user_data.user.preferences.bedrooms.map(String)
        : user_data?.user?.preferences?.bedrooms != null
          ? [String(user_data.user.preferences.bedrooms)]
          : [],

      investmentType: Array.isArray(user_data?.user?.preferences?.investmentType)
        ? user_data.user.preferences.investmentType
        : user_data?.user?.preferences?.investmentType
          ? [user_data.user.preferences.investmentType]
          : [],

      types: Array.isArray(user_data?.user?.preferences?.types)
        ? user_data.user.preferences.types
        : user_data?.user?.preferences?.types
          ? [user_data.user.preferences.types]
          : [],
    });
  }, [user_data, preferenceForm]);


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
    <section className={`mt-8 mb-6 ${props?.classname}`}>
      {!props?.hideTitle && <div className="flex justify-between items-center mb-1">
        <h2 className="font-bold text-lg mb-4 font-inter text-[#111827]">
          Update Preferences
        </h2>
      </div>}

      <div className={`bg-white/70 p-3 sm:p-7 rounded-lg ${props?.innerClassname}`}>
        <div className="sm:p-8 p-3 bg-[#F2F3F6] rounded-lg">
          <Form {...preferenceForm}>
            <form className="" onSubmit={preferenceForm.handleSubmit(onPreferenceSubmit)}>
              <div className="grid grid-cols-1 gap-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <DropdownSelect
                    label="Preferred Location"
                    defaultValue="Preferred Location"
                    options={locationOptions}
                    control={preferenceForm.control}
                    name="location"
                    labelClassName="font-bold"
                  />
                  <DropdownSelect
                    label="Property Type"
                    defaultValue="Property Type"
                    options={propertyTypeOptions}
                    control={preferenceForm.control}
                    name="category"
                    labelClassName="font-bold"
                    multiselect
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
                          <div className="grid max-sm:grid-cols-2 grid-cols-4 gap-2">
                            {priceRanges?.map((item) => {
                              const isSelected = field.value === item.value;

                              return (
                                <button
                                  key={item.value}
                                  type="button"
                                  onClick={() => field.onChange(item.value)}
                                  className={`
                  h-11 rounded-[10px] border text-sm font-medium transition-all
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

                  <MultiSelectButtonGroup
                    control={preferenceForm.control}
                    name="investmentType"
                    label="Investment Type"
                    options={investmentType}
                  />

                  <MultiSelectButtonGroup
                    control={preferenceForm.control}
                    name="types"
                    label="Types"
                    options={propertyTypes}
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>

        <button
          onClick={preferenceForm.handleSubmit(onPreferenceSubmit)}
          type="submit"
          disabled={loading}
          className="w-fit px-10 tracking-wider shadow-md mt-4 bg-[#111827] text-white text-[12px] py-2.5 rounded-[10px] font-manrope font-extrabold flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Preferences"}
        </button>
      </div>
    </section>
  );
};

const PreferenceForm = () => {
  return (
    <SidebarLayout>
      <div
        className="lg:px-12 px-3 sm:px-5 py-2 h-full
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
