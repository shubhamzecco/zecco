/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

import { postData } from "@/api/rest/fetchData";
import { Button } from "@/components/ui/button";
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
import { setPropertyFilter } from "@/redux/modules/main/action";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import AuthLayout from "../layout/page";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import { bedroomRanges, priceRanges } from "@/utils/common";
import DropdownSelect from "@/components/ui/DropSelect";
import { MultiSelectButtonGroup } from "@/components/ui/MultiselectButton";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  contact_no: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^\d+$/, "Invalid mobile number"),
  password: z.string().min(1, "Password  is required"),
  confirm_password: z.string().min(1, "Confirm password is required"),
  email: z.string().email("Invalid email address"),
  selectedLocation: z.any().optional(),
  location: z.any().optional(),
  category: z.array(z.number()).default([]),
  budget: z.string().optional(),
  bedrooms: z.array(z.string()).default([]),
});

const SignUpPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [nextPage, setNextPage] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchDropdown, setSearchDropdown] = useState(false);
  const [propertyTypeSearch, setPropertyTypeSearch] = useState("");
  const [propertyTypeDropdown, setPropertyTypeDropdown] = useState(false);
  const { mainReducer } = usePosterReducers();
  const { sendMessage, isConnected } = useWebSocket();

  useEffect(() => {
    dispatch(setPropertyFilter({}));
  }, []);

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      contact_no: "",
      email: "",
      password: "",
      confirm_password: "",
      selectedLocation: "",
      category: undefined,
      budget: "",
      bedrooms: [],
    },
  });



  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!nextPage && values) {
      setNextPage(true);
    }
    if (nextPage && values) {
      const location = mainReducer?.all_location_list?.find(
        (item: any) => item?.id === values?.location
      )
      const payload = {
        ...values,
        user_type: "client",
        locationCity: location?.city_name ? location?.city_name : null,
        locationArea: location?.area_name ? location?.area_name : null,
        locationSubarea: location?.subarea_name ? location?.subarea_name : null,
        locationId: values.location,
      };
      delete payload?.selectedLocation;
      delete payload?.location;
      postData(App_url.endpoint_url.USER_LOGIN, payload)
        ?.then((response: any) => {
          if (response?.status === 200) {
            toast.success(response?.data?.message);
            sessionStorage.setItem("otp_email", values.email);
            router.push(App_url?.link?.OTP_VERIFICATION);
          } else {
            toast.error(response?.data?.message);
          }
        })
        ?.catch((error) => {
          toast.error("Something went wrong");
          console.error(error);
        });
    }
  };

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
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <AuthLayout
        heading={`${!nextPage ? "Create Your Zecco Account" : "Set Your Property Preferences"}`}
        description=""
      >
        <Form {...form}>
          <form
            className="max-md:flex flex-col justify-center max-md:min-h-fit max-md:py-3"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {!nextPage ? (
              <>
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            required
                            className="font-semibold font-inter text-[#101828]"
                          >
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="First name"
                              className="rounded-full h-12 bg-white border-[#D1D5DB] text-black"
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
                          <FormLabel
                            required
                            className="font-semibold font-inter text-[#101828]"
                          >
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Last name"
                              className="rounded-full h-12 bg-white border-[#D1D5DB] text-black"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="contact_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          required
                          className="font-semibold font-inter text-[#101828]"
                        >
                          Mobile Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Mobile number"
                            className="rounded-full h-12 bg-white border-[#D1D5DB] text-black"
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
                        <FormLabel
                          required
                          className="font-semibold font-inter text-[#101828]"
                        >
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Email address"
                            className="rounded-full h-12 bg-white border-[#D1D5DB] text-black"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            required
                            className="font-semibold font-inter text-[#101828]"
                          >
                            Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Password"
                              className="rounded-full h-12 bg-white border-[#D1D5DB] text-black"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirm_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            required
                            className="font-semibold font-inter text-[#101828]"
                          >
                            Confirm Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm password"
                              className="rounded-full h-12 bg-white border-[#D1D5DB] text-black"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex items-center mt-2 gap-5">
                  <Button
                    type="submit"
                    className="w-full capitalize font-inter font-bold tracking-wider shadow-[#BFDBFE] bg-[#136AED] h-12 my-4 text-white border rounded-full shadow-md"
                  >
                    Next <ArrowRight />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="-mt-3 mb-3">
                  <p
                    onClick={() => setNextPage(false)}
                    className="w-full mx-auto flex justify-start items-center gap-2 font-inter font-medium text-[#136AED] text-sm"
                  >
                    <ArrowLeft size={16} />
                    Back
                  </p>
                </div>{" "}
                <div className="grid grid-cols-1 gap-4">
                  <DropdownSelect
                    label="Preferred Location"
                    defaultValue="Preferred Location"
                    options={locationOptions}
                    control={form.control}
                    name="location"
                    labelClassName="font-bold"
                    isRounded
                  />
                  <DropdownSelect
                    label="Property Type"
                    defaultValue="Property Type"
                    options={propertyTypeOptions}
                    control={form.control}
                    name="category"
                    labelClassName="font-bold"
                    multiselect
                    isRounded
                  />

                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold font-inter text-[#101828]">
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
                    control={form.control}
                    name="bedrooms"
                    label="Bedrooms"
                    options={bedroomRanges}
                    columns={5}
                  />
                </div>
                <div className="flex items-center mt-2 gap-5">
                  <Button
                    type="submit"
                    className="w-full capitalize font-inter font-bold tracking-wider shadow-[#BFDBFE] bg-[#136AED] h-12 my-4 text-white border rounded-full shadow-md"
                  >
                    Sign Up
                  </Button>
                </div>
              </>
            )}
          </form>

          <div className="flex items-center px-8">
            <Link
              href={App_url?.link?.SIGN_IN}
              className="w-full whitespace-nowrap font-inter font-medium text-center text-[#6B7280] text-md"
            >
              Already have an account?
              <span className="text-[#3B82F6] font-bold font-inter text-base">
                {" "}
                Log In
              </span>
            </Link>
          </div>
        </Form>
      </AuthLayout>
    </>
  );
};

export default SignUpPage;
