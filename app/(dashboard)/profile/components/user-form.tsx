"use client";
import { postData, URL } from "@/api/rest/fetchData";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import { PreferenceSection } from "@/app/preferences/page";
import CommonCard from "@/components/cards/common-card";
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
import { ImageIcon, User } from "lucide-react";
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
    current_password: z.string().min(6, "Current password is required."),
    new_password: z
      .string()
      .nonempty("Password is required.")
      .min(6, "Password must be at least 6 characters.")
      .regex(/[a-z]/, "Must contain one lowercase letter.")
      .regex(/[0-9]/, "Must contain one number."),
    confirm_password: z.string().min(6, "Confirm password is required."),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });

const getPasswordStrength = (password: string) => {
  if (!password) return { text: "", color: "bg-gray-200", width: "0%", level: 0 };

  let types = 0;
  if (/[a-z]/.test(password)) types++;
  if (/[A-Z]/.test(password)) types++;
  if (/[0-9]/.test(password)) types++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) types++;

  if (types <= 1)
    return {
      text: "Weak",
      color: "bg-red-500",
      width: "33%",
      level: 1,
    };

  if (types === 2)
    return {
      text: "Medium",
      color: "bg-amber-500",
      width: "66%",
      level: 2,
    };

  return {
    text: "Strong",
    color: "bg-green-500",
    width: "100%",
    level: 3,
  };
};

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

  const password = passwordForm.watch("new_password");
  const strength = getPasswordStrength(password || "");

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
    <section className="flex max-2xl:flex-col 2xl:grid grid-cols-[1.4fr_0.6fr] gap-7 mb-10">

      <CommonCard heading="Personal Information" description="Update your photo and personal details.">
        <div
          onClick={handleCameraClick}
          className="w-full border border-dashed border-[#F3B8A3] bg-[#FFF9F6] rounded-2xl px-6 py-5 cursor-pointer hover:bg-[#FFF5F1] transition-all duration-300"
        >
          <div className="grid grid-cols-[0.4fr_1fr] sm:flex items-center gap-4">
            
            <div className="w-12 h-12 rounded-full bg-[#FDE9DF] flex items-center justify-center border border-[#F5C7B6]">
              <User size={24} className="text-[#D89A6A]" />
            </div>

            {/* Content */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-[#222]">
                Drag & Drop
              </span>

              <span className="text-[#999]">or</span>

              <button
                type="button"
                className="text-[#E26B43] font-medium hover:underline"
              >
                Upload New Photo
              </button>

              <span className="text-[#999] text-xs">
                PNG JPG · 5MB
              </span>
            </div>
          </div>

          {/* Hidden Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="mt-5">
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
                            className="rounded-[10px] h-12 bg-[#F8FAFE] border-[#E2E8F0] text-black"
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
                            className="rounded-[10px] h-12 bg-[#F8FAFE] border-[#E2E8F0] text-black"
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
                            className="rounded-[10px] h-12 bg-[#F8FAFE] border-[#E2E8F0] text-black"
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
                            className="rounded-[10px] h-12 bg-[#F8FAFE] border-[#E2E8F0] text-black"
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

          <button
            onClick={form.handleSubmit(onSubmit)}
            type="submit"
            disabled={profileLoading}
            className="relative w-full mx-auto my-5 py-3 px-10 rounded-[10px] bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] text-white text-sm font-manrope font-extrabold shadow-md disabled:opacity-50"
          >
            {profileLoading && (
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}

            <span className="block text-center">
              Update Profile
            </span>
          </button>
        </div>
      </CommonCard>

      <CommonCard heading="Personal Information" description="Update your photo and personal details.">
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
                        className="rounded-[10px] h-12 bg-[#F8FAFE] border-[#E2E8F0]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 lg:grid-cols-1 gap-5">
                <div className="">
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
                            className="rounded-[10px] h-12 bg-[#F8FAFE] border-[#E2E8F0]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {password?.trim() !== '' && (
                    <div className="flex gap-1 mt-3">
                      <div
                        className={`h-1 flex-1 rounded-full transition-all duration-500 overflow-hidden ${password.length > 0 ? "bg-red-500" : "bg-gray-200"
                          }`}
                      >
                        {password.length > 0 && (
                          <div className="h-full w-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                        )}
                      </div>

                      <div
                        className={`h-1 flex-1 rounded-full transition-all duration-500 overflow-hidden ${strength.level >= 2 ? "bg-amber-500" : "bg-gray-200"
                          }`}
                      >
                        {strength.level >= 2 && (
                          <div className="h-full w-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                        )}
                      </div>

                      <div
                        className={`h-1 flex-1 rounded-full transition-all duration-500 overflow-hidden ${strength.level >= 3 ? "bg-green-500" : "bg-gray-200"
                          }`}
                      >
                        {strength.level >= 3 && (
                          <div className="h-full w-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                        )}
                      </div>
                    </div>
                  )}
                </div>

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
                          className="rounded-[10px] h-12 bg-[#F8FAFE] border-[#E2E8F0]"
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
        <button
          onClick={passwordForm.handleSubmit(onPasswordSubmit)}
          type="button"
          disabled={passwordLoading}
          className="relative w-full mx-auto my-5 py-3 px-10 rounded-[10px] bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] text-white text-sm font-manrope font-extrabold shadow-md disabled:opacity-50"
        >
          {passwordLoading ? (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : null}
          Update Password
        </button>
      </CommonCard>
    </section >
  );
};

export default UserForm;
