"use client";

import { postData } from "@/api/rest/fetchData";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import PackagesModal from "../components/package-modal";
import AuthLayout from "../layout/page";

export interface IFormValue {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  contact_no: string;
  confirm_password: string;
}

const formSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

/* -------------------- CONSTANTS -------------------- */

const OTP_TIME = 300; // 5 minutes

/* -------------------- COMPONENT -------------------- */

const OtpVerification = () => {
  const router = useRouter();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [forgetPassword, setForgetPassword] = useState<string | null>(null);
  const [packageModal, setPackageModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(OTP_TIME);
  const [canResend, setCanResend] = useState(false);
  const [userId, setUserId] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: "" },
  });

  /* -------------------- EFFECTS -------------------- */

  useEffect(() => {
    setEmail(sessionStorage.getItem("otp_email"));
    setForgetPassword(sessionStorage.getItem("forget_password"));
  }, []);

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

  /* -------------------- HELPERS -------------------- */

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  /* -------------------- OTP HANDLERS -------------------- */

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

  /* -------------------- SUBMIT -------------------- */

  const onSubmit = (values: z.infer<typeof formSchema>) => {
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
          setUserId(response?.data?.data?._id);
          setPackageModal(true);
          // router.push(App_url?.link?.SIGN_IN);
        }
      }
    });
  };

  /* -------------------- RESEND -------------------- */

  const handleResendOtp = () => {
    postData(App_url?.endpoint_url?.RESEND_OTP, { email }).then(() => {
      setTimeLeft(OTP_TIME);
      setCanResend(false);
      form.setValue("otp", "");
      inputsRef.current[0]?.focus();
    });
  };

  /* -------------------- UI -------------------- */

  return (
    <>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <AuthLayout
      heading="Welcome Back to Zecco!"
      description="Sign in to Your Account"
    >
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
                    {/* TIMER / RESEND */}
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

                    {/* OTP INPUTS */}
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
          <div className="flex justify-center items-center mt-4 mb-5 gap-5">
            <Button
              type="submit"
              className="w-[80%] capitalize bg-[#136AED] shadow-[#BFDBFE] h-12 my-4 text-white rounded-full shadow-md"
            >
              Verify OTP
            </Button>
          </div>
        </form>

        <div className="flex items-center px-8 mt-1 mb-5">
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
        </div>
      </Form>

      {packageModal && (
        <PackagesModal
          userId={userId}
          // formValue={formValue ?? ({} as IFormValue)}
          onClose={() => setPackageModal(false)}
        />
      )}
    </AuthLayout>
    </>
  );
};
export default OtpVerification;
