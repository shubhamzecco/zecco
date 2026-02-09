'use client';

import { postData } from "@/api/rest/fetchData";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import WaveText from "@/components/ui/WaveText";
import { App_url } from "@/constant/static";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as z from "zod";

/* -------------------- VALIDATION -------------------- */

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
  const dispatch = useDispatch();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [forgetPassword, setForgetPassword] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState(OTP_TIME);
  const [canResend, setCanResend] = useState(false);

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
    onChange: (val: string) => void
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
    onChange: (val: string) => void
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
    onChange: (val: string) => void
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
    postData(forgetPassword === 'forget-password' ? App_url?.endpoint_url?.FORGET_PASSWORD_VERIFY_OTP : App_url?.endpoint_url?.VERIFY_OTP, {
      code: String(values.otp),
      email,
    }).then((response) => {
      if (response?.status === 200) {
        sessionStorage.setItem("otp_email", email || "");
        sessionStorage.setItem("otp", values.otp);
         toast.success(response?.data?.message);
        if(forgetPassword === 'forget-password'){
          router.push(App_url?.link?.rest_password);
        }else{
          router.push(App_url?.link?.signin);
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
    <section className="relative min-h-screen bg-white overflow-hidden">
      <div className="flex">
        {/* LEFT SIDE */}
        <div className="w-[65%] fixed h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#E5EFE6] to-[#9ECCA1]">
          <Image src={App_url.images.logo} alt="logo" width={120} height={120} />
          <WaveText text="We Are Everywhere" />
        </div>

        {/* RIGHT SIDE */}
        <div className="ml-auto w-[35%] h-screen p-6 bg-white z-10">
          <div className="flex justify-center mt-4">
            <Image src={App_url.images.logo} alt="logo" width={70} height={70} />
          </div>

          <h1 className="text-black text-center text-2xl font-semibold mt-7">
            Verify Your Account
          </h1>

          <p className="text-black/50 text-center my-7">
            Charity registered successfully. <br />
            Please check registered email & verify account.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                              className="text-brand-orange font-semibold hover:underline"
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
                                handleChange(
                                  e,
                                  index,
                                  field.value,
                                  field.onChange
                                )
                              }
                              onKeyDown={(e) =>
                                handleKeyDown(
                                  e,
                                  index,
                                  field.value,
                                  field.onChange
                                )
                              }
                              onPaste={(e) =>
                                handlePaste(e, field.onChange)
                              }
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
              <div className="mt-10 max-w-xs mx-auto">
                <Button
                  type="submit"
                  className="w-full h-11 bg-brand-orange text-white rounded-[10px]"
                >
                  Verify OTP
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default OtpVerification;
