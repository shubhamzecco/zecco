"use client";

import { postData } from "@/api/rest/fetchData";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { App_url } from "@/constant/static";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import AuthLayout from "../layout/page";
import DropdownSelect from "@/components/ui/DropSelect";
import { MultiSelectButtonGroup } from "@/components/ui/MultiselectButton";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { bedroomRanges, priceRanges } from "@/utils/common";
import PackagesModal from "../components/package-modal";
import { setAuthData, setLogin } from "@/redux/modules/common/user_data/action";
import { useDispatch } from "react-redux";

const otpSchema = z.object({
  otp: z
    .string()
    .min(1, "One-Time Code is required")
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

const preferenceSchema = z.object({
  location: z.any().optional(),
  category: z.array(z.number()).default([]),
  budget: z.string().optional(),
  bedrooms: z.array(z.string()).default([]),
});

const OTP_TIME = 300;

const OtpVerification = () => {
  const router = useRouter();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [forgetPassword, setForgetPassword] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(OTP_TIME);
  const [canResend, setCanResend] = useState(false);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [prefLoading, setPrefLoading] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const { mainReducer } = usePosterReducers();
  const { sendMessage, isConnected, lastEvent } = useWebSocket();
  const [packageModal, setPackageModal] = useState(false);
  const dispatch = useDispatch()

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const preferenceForm = useForm<z.infer<typeof preferenceSchema>>({
    resolver: zodResolver(preferenceSchema),
    defaultValues: {
      location: "",
      category: [],
      budget: "",
      bedrooms: [],
    },
  });

  useEffect(() => {
    setEmail(sessionStorage.getItem("otp_email"));
    setForgetPassword(sessionStorage.getItem("forget_password"));
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

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    value: string,
    onChange: (val: string) => void,
  ) => {
    const digit = e.target.value.replace(/\D/g, "");
    if (!digit) return;
    const newValue = value.split("");
    newValue[index] = digit[0];
    onChange(newValue.join(""));
    if (index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    value: string,
    onChange: (val: string) => void,
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newValue = value.split("");
      if (newValue[index]) {
        newValue[index] = "";
      } else if (index > 0) {
        newValue[index - 1] = "";
        inputsRef.current[index - 1]?.focus();
      }
      onChange(newValue.join(""));
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    onChange: (val: string) => void,
  ) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      onChange(pasted);
      inputsRef.current[5]?.focus();
    }
  };

  const onSubmit = (values: z.infer<typeof otpSchema>) => {
    setLoading(true);
    postData(
      forgetPassword === "forget-password"
        ? App_url?.endpoint_url?.FORGET_PASSWORD_VERIFY_OTP
        : App_url?.endpoint_url?.VERIFY_ACCOUNT,
      {
        otp: String(values?.otp),
        email,
      },
    ).then((response) => {
      if (response?.status === 200) {
        sessionStorage.setItem("otp_email", email || "");
        sessionStorage.setItem("otp", values?.otp);
        toast.success(response?.data?.message);
        if (forgetPassword === "forget-password") {
          router.push(App_url?.link?.RESET_PASSWORD);
        } else {
          const payload = {
            ...response?.data?.data,
            user: response?.data?.data?.user,
            access_token: response?.data?.data?.accessToken,
          };
          localStorage.setItem("access_token", response?.data?.data?.accessToken);
          dispatch(setLogin(true));
          dispatch(setAuthData(payload));
          setUserId(response?.data?.data?.user?._id);
          setShowPreferences(true);
        }
      }
    }).catch(() => {
      // error handled by toast
    }).finally(() => setLoading(false));
  };

  const onPreferenceSubmit = (data: z.infer<typeof preferenceSchema>) => {
    setPrefLoading(true);
    const location = mainReducer?.all_location_list?.find(
      (item: any) => item.id === data.location
    );
    const payload = {
      type: "userService",
      action: "update",
      payload: {
        id: userId,
        preferences: {
          locationCity: location?.city_name ? location?.city_name : null,
          locationArea: location?.area_name ? location?.area_name : null,
          locationSubarea: location?.subarea_name ? location?.subarea_name : null,
          locationId: data.location,
          category: Array.isArray(data?.category)
            ? data?.category?.map(Number)
            : data?.category
              ? [Number(data?.category)]
              : null,
          budget: data.budget || null,
          bedrooms: data.bedrooms?.map((bedroom) => Number(bedroom.replace("+", ""))) || null,
        },
      },
    };
    sendMessage("action", payload);
  };

  useEffect(() => {
    if (
      lastEvent?.data?.status &&
      lastEvent?.data?.request?.type === "userService" &&
      lastEvent?.data?.request?.action === "update"
    ) {
      form?.reset({});
      setPrefLoading(false)
      setPackageModal(true)
    }
  }, [lastEvent]);

  const handleSkip = () => {
    setPackageModal(true);
  };

  const handleResendOtp = () => {
    postData(App_url?.endpoint_url?.RESEND_OTP, { email })
      .then((res) => {
        toast.success(res?.message || "OTP resent successfully");
        setTimeLeft(OTP_TIME);
        setCanResend(false);
        form.setValue("otp", "");
        inputsRef.current[0]?.focus();
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message || "Failed to resend OTP"
        );
      });
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
    <>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <AuthLayout
        heading={showPreferences ? "Set Your Property Preferences" : "Verify OTP"}
        description={showPreferences ? "" : "We'll send a 6-digit OTP to your email."}
      >
        {!showPreferences ? (
          <Form {...form}>
            <form
              className="max-md:flex flex-col justify-center max-md:min-h-fit max-md:py-3"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <>
                        <div className="text-center my-7">
                          {!canResend ? (
                            <p className="text-black/60 flex flex-col items-center justify-center">
                              Resend OTP in{" "}
                              <span className="font-semibold text-brand-orange text-2xl ">
                                {formatTime(timeLeft)}
                              </span>
                            </p>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResendOtp}
                              className="text-primary font-semibold hover:underline"
                            >
                              Resend OTP
                            </button>
                          )}
                        </div>

                        <div className="flex justify-center gap-3">
                          {Array.from({ length: 6 }).map((_, index) => (
                            <input
                              key={index}
                              ref={(el) => {
                                inputsRef.current[index] = el;
                              }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={field.value[index] || ""}
                              onChange={(e) =>
                                handleChange(e, index, field.value, field.onChange)
                              }
                              onKeyDown={(e) =>
                                handleKeyDown(e, index, field.value, field.onChange)
                              }
                              onPaste={(e) => handlePaste(e, field.onChange)}
                              className="w-12 h-12 text-center text-xl rounded-[10px]
                                border border-indigo-50 shadow-lg bg-indigo-50 text-black
                                focus:outline-none focus:ring-2"
                            />
                          ))}
                        </div>
                      </>
                    </FormControl>
                    <FormMessage className="text-center mt-3" />
                  </FormItem>
                )}
              />
              <div className="flex justify-center items-center mt-4 mb-1 gap-5">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-[80%] capitalize bg-[#136AED] shadow-[#BFDBFE] h-12 my-4 text-white rounded-full shadow-md disabled:opacity-50"
                >
                  {loading && <Loader2 className="h-5 w-5 animate-spin" /> } Verify OTP
                </Button>
              </div>
            </form>

            {/* <div className="flex items-center px-8 mt-1">
              <Link
                href={App_url?.link?.SIGN_UP}
                className="w-full whitespace-nowrap font-inter font-medium text-center text-[#6B7280] text-md"
              >
                Don't have an account?
                <span className="text-[#3B82F6] font-bold font-inter text-base">
                  {" "}
                  Register
                </span>
              </Link>
            </div> */}
          </Form>
        ) : (
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
                  control={preferenceForm.control}
                  name="bedrooms"
                  label="Bedrooms"
                  options={bedroomRanges}
                  columns={5}
                />
              </div>
              <div className="flex items-center mt-4 gap-5">
                <Button
                  type="submit"
                  disabled={prefLoading}
                  className="w-full capitalize font-inter font-bold tracking-wider shadow-[#BFDBFE] bg-[#136AED] h-12 my-4 text-white border rounded-full shadow-md disabled:opacity-50"
                >
                  {prefLoading && <Loader2 className="h-5 w-5 animate-spin" /> } Save Preferences
                </Button>
                <Button
                  type="button"
                  onClick={handleSkip}
                  className="w-full capitalize font-inter font-bold tracking-wider shadow-md bg-gray-500 h-12 my-4 text-white border rounded-full"
                >
                  Skip
                </Button>
              </div>
            </form>
          </Form>
        )}
      </AuthLayout>

      {packageModal && (
        <PackagesModal
          userId={userId}
          // formValue={formValue ?? ({} as IFormValue)}
          onClose={() => {
            setPackageModal(false);
          }}
        />
      )}
    </>
  );
};

export default OtpVerification;
