"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import CommonCard from "@/components/cards/common-card";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import MatchedProperties from "@/components/matched-properties";
import DropdownSelect from "@/components/ui/DropSelect";
import {
  Form
} from "@/components/ui/form";
import { MultiSelectButtonGroup } from "@/components/ui/MultiselectButton";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { bedroomRanges, investmentType, priceRanges, propertyTypes } from "@/utils/common";
import { preferenceSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";


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
        ? user_data?.user?.preferences?.category
        : user_data?.user?.preferences?.category != null
          ? [user_data?.user?.preferences?.category]
          : [],

      budget: user_data?.user?.preferences?.budget ?? "",

      bedrooms: Array.isArray(user_data?.user?.preferences?.bedrooms)
        ? user_data?.user?.preferences?.bedrooms.map(String)
        : user_data?.user?.preferences?.bedrooms != null
          ? [String(user_data?.user?.preferences?.bedrooms)]
          : [],

      investmentType: Array.isArray(user_data?.user?.preferences?.investmentType)
        ? user_data?.user?.preferences?.investmentType
        : user_data?.user?.preferences?.investmentType
          ? [user_data?.user?.preferences?.investmentType]
          : [],

      types: Array.isArray(user_data?.user?.preferences?.types)
        ? user_data?.user?.preferences?.types
        : user_data?.user?.preferences?.types
          ? [user_data?.user?.preferences?.types]
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
    <>
    <CommonCard heading="Property Preferences" description="Tell us what you're looking for.">
      <div className="rounded-2xl">
        <Form {...preferenceForm}>
          <form className="" onSubmit={preferenceForm.handleSubmit(onPreferenceSubmit)}>
            <div className="grid grid-cols-1 gap-5">
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-5">
                <DropdownSelect
                  label="Preferred Location"
                  defaultValue="Preferred Location"
                  options={locationOptions}
                  control={preferenceForm.control}
                  name="location"
                  labelClassName="font-bold" />

                <MultiSelectButtonGroup
                  control={preferenceForm.control}
                  name="category"
                  label="Property Type"
                  options={propertyTypeOptions}
                  className="!flex items-center gap-4 flex-wrap" />

                <MultiSelectButtonGroup
                  control={preferenceForm.control}
                  name="budget"
                  label="Budget Range"
                  options={priceRanges}
                  className="!flex items-center gap-4 flex-wrap" />

                <MultiSelectButtonGroup
                  control={preferenceForm.control}
                  name="bedrooms"
                  label="Bedrooms"
                  options={bedroomRanges}
                  className="!flex items-center gap-4 flex-wrap" />

                <MultiSelectButtonGroup
                  control={preferenceForm.control}
                  name="investmentType"
                  label="Investment Type"
                  options={investmentType}
                  className="!flex items-center gap-4 flex-wrap" />

                <MultiSelectButtonGroup
                  control={preferenceForm.control}
                  name="types"
                  label="Types"
                  options={propertyTypes}
                  className="!flex items-center gap-4 flex-wrap" />
              </div>
            </div>
          </form>
        </Form>
      </div>

      <button
        onClick={preferenceForm.handleSubmit(onPreferenceSubmit)}
        type="submit"
        disabled={loading}
        className="relative w-full mx-auto mt-8 my-5 py-3.5 px-10 rounded-[10px] bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] text-white text-sm font-manrope font-extrabold shadow-md disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Preferences"}
      </button>
    </CommonCard><div className="my-5">
        <MatchedProperties />
      </div></>
  );
};

const PreferenceForm = () => {
  return (
    <SidebarLayout>
      <div className="mb-10">
        <PreferenceSection />
      </div>
    </SidebarLayout>
  );
};

export default PreferenceForm;
