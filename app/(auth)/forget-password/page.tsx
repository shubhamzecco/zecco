"use client";

import { postData } from "@/api/rest/fetchData";
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
import { Input } from "@/components/ui/input";
import { App_url } from "@/constant/static";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import * as z from "zod";
import AuthLayout from "../layout/page";

const formSchema = z.object({
  email: z.string().min(1, "Email address is required").email({ message: "Please enter a valid email address" }),
});

const ForgetPassword = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    postData(App_url?.endpoint_url?.FORGET_PASSWORD, values)
      .then((response) => {
        try {
          if (response?.data?.success) {
            toast.success(response?.data?.message);
            sessionStorage.setItem("otp_email", values?.email);
            sessionStorage?.setItem("forget_password", "forget-password");
            router.push(App_url?.link?.OTP_VERIFICATION);
          } else {
            toast.error(response?.data?.message);
          }
        } catch (error) {
          toast.error("Something went wrong");
        }
      })
      .catch((error) => {
        console.log("API Error :::", error);
        const errorMessage =
          error?.response?.data?.error ||
          error?.message ||
          "An unexpected error occurred.";
        toast.error(errorMessage);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
    <AuthLayout heading="Forget Password" description="We'll send a 6-digit OTP to your email.">
      <Form {...form}>
        <form
          className="max-md:flex flex-col justify-center max-md:min-h-fit max-md:py-3"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    required
                    className="font-semibold font-inter text-[#101828] max-md:text-white"
                  >
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email address"
                      className="rounded-xl h-12 bg-white border-[#D1D5DB] text-black max-md:bg-white/90"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="max-md:text-red-300" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center mt-4 gap-5">
            <Button
              type="submit"
              disabled={loading}
              className="w-full capitalize bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF]  h-12 my-4 text-white rounded-xl shadow-md disabled:opacity-50"
            >
              {loading && <Loader2 className="h-5 w-5 animate-spin" />}  Send OTP
            </Button>
          </div>
        </form>

        <div className="flex items-center px-8">
          <Link
            href={App_url.link.SIGN_UP}
            className="w-full whitespace-nowrap font-inter font-medium text-center text-[#6B7280] text-md max-md:text-white/70"
          >
            Don&apos;t have an account?
            <span className="text-[#3B82F6] font-bold font-inter text-base">
              {" "}
              Register
            </span>
          </Link>
        </div>
      </Form>
    </AuthLayout>
    </>
  );
};

export default ForgetPassword;
