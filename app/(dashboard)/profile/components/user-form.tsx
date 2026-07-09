"use client";
import { postData, URL } from "@/api/rest/fetchData";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import { PreferenceSection } from "@/app/preferences/page";
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

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  contact_no: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^((\+91|0)?[6-9]\d{9}|(\+34)?[67]\d{8})$/, "Invalid mobile number"),
  email: z.string().min(1, "Email address is required").email("Please enter a valid email address"),
  consultation: z.string().optional(),
  project_information: z.string().optional(),
});

const passwordSchema = z
  .object({
    current_password: z.string().min(6, "Current password is required"),
    new_password: z
      .string()
      .min(1, "New password is required.")
      .min(6, "New password must be at least 6 characters long.")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d).+$/,
        "New password must contain both letters and numbers."
      ),
    confirm_password: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });

const preferenceSchema = z.object({
  selectedLocation: z.any().optional(),
  category: z.number().nullable().optional(),
  budget: z.string().nullable().optional(),
  bedrooms: z.string().nullable().optional(),
  investmentType: z.string().nullable().optional(),
  types: z.string().nullable().optional(),
});

const UserForm = () => {
  const { user_data, mainReducer } = usePosterReducers();
  const { sendMessage, lastEvent, isConnected } = useWebSocket();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      contact_no: "",
      email: "",
    },
    mode: "onChange"
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

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
      lastEvent?.data?.request?.type === "userService"
    ) {
      if (lastEvent?.data?.request?.action === "update") {
        setProfileLoading(false);
        const payload = {
          type: "userService",
          action: "get",
          payload: {},
        };
        sendMessage("action", payload);
      }
      if (lastEvent?.data?.request?.action === "updatePassword") {
        setPasswordLoading(false);
        form?.reset({});
        const payload = {
          type: "userService",
          action: "get",
          payload: {},
        };
        sendMessage("action", payload);
      }
    }
  }, [lastEvent]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setProfileLoading(true);
    const payload = {
      type: "userService",
      action: "update",
      payload: {
        id: user_data?.user?._id,
        email: data?.email,
        first_name: data?.first_name,
        last_name: data?.last_name,
        status: true,
        contact_no: data?.contact_no,
      },
    };
    sendMessage("action", payload);
  };

  const onPasswordSubmit = (data: z.infer<typeof passwordSchema>) => {
    setPasswordLoading(true);
    const payload = {
      type: "userService",
      action: "updatePassword",
      payload: {
        id: user_data?.user?._id,
        current_password: data?.current_password,
        new_password: data?.new_password,
        confirm_password: data?.confirm_password,
      },
    };
    sendMessage("action", payload);
  };

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
    form?.reset({
      first_name: user_data?.user?.first_name,
      last_name: user_data?.user?.last_name,
      contact_no: user_data?.user?.contact_no,
      email: user_data?.user?.email,
    });
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

  const uploadAvatar = async (file: File) => {
    try {
      const endpoint = App_url.endpoint_url.UPLOAD_FILE;
      let response: any;
      const formData = new FormData();
      formData.append("file", file);

      response = await postData(
        endpoint,
        formData,
        user_data?.access_token,
        "multipart/form-data",
      );
      if (response?.data?.success) {
        const payload = {
          type: "userService",
          action: "update",
          payload: {
            id: user_data?.user?._id,
            profile_image: response?.data?.data?.fileUrl,
          },
        };
        sendMessage("action", payload);
      } else {
        toast.error("Upload failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while uploading");
    } finally {
      // setIsUpload(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadAvatar(file);
  };

  return (
    <section className=" mb-6">
      <h2 className="font-bold text-lg mb-4 font-inter text-[#111827]">
        Edit Profile
      </h2>

      <div className="bg-white p-8 rounded-lg ">
        <div className="flex items-center gap-3 ">
          {user_data?.user?.profile_image ? (
            <Image
              src={URL + user_data?.user?.profile_image}
              alt="AI Insights"
              width={160}
              height={100}
              className="rounded-full object-cover w-20 h-20"
            />
          ) : (
            <>
              <ProfileAvatar
                name={`${user_data?.user?.first_name + " " + user_data?.user?.last_name}`}
                className="!w-20 !h-20 !text-2xl border-4 border-[#EFF6FF] !text-white !bg-[#2563EB]"
              />
            </>
          )}

          <div className="">
            <button
              type="button"
              onClick={handleCameraClick}
              className="w-fit  text-sm px-2 tracking-wider shadow-md my-3 bg-[#111827] text-white text-[15px] py-1 rounded-[5px] font-manrope font-normal flex items-center gap-2"
            >
              Update Photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <p className="text-[#64748B] font-manrope font-medium text-xs">
              JPG, PNG or GIF (max. 5MB)
            </p>
          </div>
        </div>

        <div className="my-5">
          <div className="p-8 bg-[#F2F3F6] rounded-lg my-5">
            <Form {...form}>
              <form className="" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-5">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required className="font-medium font-inter text-[#101828]">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="First name"
                              className="rounded-[10px] h-12 bg-white border-[#D1D5DB] text-black"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required className="font-medium font-inter text-[#101828]">
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Last name"
                              className="rounded-[10px] h-12 bg-white border-[#D1D5DB] text-black"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contact_no"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required className="font-medium font-inter text-[#101828]">
                            Mobile Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Mobile number"
                              className="rounded-[10px] h-12 bg-white border-[#D1D5DB] text-black"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required className="font-medium font-inter text-[#101828]">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Email address"
                              className="rounded-[10px] h-12 bg-white border-[#D1D5DB] text-black"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </form>
            </Form>
          </div>

          <button
            onClick={form.handleSubmit(onSubmit)}
            type="submit"
            disabled={profileLoading}
            className="w-fit px-10 tracking-wider shadow-md my-4 bg-[#111827] text-white text-[12px] py-2.5 rounded-[10px] font-manrope font-extrabold flex items-center gap-2 disabled:opacity-50"
          >
            {profileLoading ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : null}
            Update Profile
          </button>
        </div>

        <div className="my-5">
          <div className="p-8 bg-[#F2F3F6] rounded-lg my-5">
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                <div className="grid grid-cols-1 gap-5">
                  <FormField
                    control={passwordForm.control}
                    name="current_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required className="font-medium font-inter text-[#101828]">
                            Current Password
                          </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Current password"
                            className="rounded-[10px] h-12 bg-white border-[#D1D5DB]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <FormField
                      control={passwordForm.control}
                      name="new_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required className="font-medium font-inter text-[#101828]">
                            New Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="New password"
                              className="rounded-[10px] h-12 bg-white border-[#D1D5DB]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="confirm_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required className="font-medium font-inter text-[#101828]">
                            Confirm Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm password"
                              className="rounded-[10px] h-12 bg-white border-[#D1D5DB]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </form>
            </Form>
          </div>
          <button
            onClick={passwordForm.handleSubmit(onPasswordSubmit)}
            type="button"
            disabled={passwordLoading}
            className="w-fit px-10 tracking-wider shadow-md my-4 bg-[#111827] text-white text-[12px] py-2.5 rounded-[10px] font-manrope font-extrabold flex items-center gap-2 disabled:opacity-50"
          >
            {passwordLoading ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : null}
            Update Password
          </button>
        </div>
        <PreferenceSection hideTitle classname={"mt-[-20px]"} innerClassname={"py-5 px-0"}/>
      </div>
    </section>
  );
};

export default UserForm;
