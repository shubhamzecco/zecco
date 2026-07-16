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
import { useState } from "react";
import AuthLayout from "../layout/page";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  contact_no: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^((\+91|0)?[6-9]\d{9}|(\+34)?[67]\d{8})$/, "Invalid mobile number"),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(6, "Password must be at least 6 characters long.")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Password must contain both letters and numbers."
    ),
  confirm_password: z.string().min(1, "Confirm password is required"),
  email: z.string().min(1, "Email address is required").email("Please enter a valid email address"),
});

const SignUpPage = () => {
  const router = useRouter();
  const [signupLoading, setSignupLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      contact_no: "",
      email: "",
      password: "",
      confirm_password: "",
    },
    mode: "onChange"
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSignupLoading(true);
    const payload = { ...values, user_type: "client" };
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
      })
      ?.finally(() => setSignupLoading(false));
  };

  return (
    <>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <AuthLayout heading="Create Your Zecco Account" description="">
        <Form {...form}>
          <form
            className="max-md:flex flex-col justify-center max-md:min-h-fit max-md:py-3"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required className="font-semibold font-inter text-[#101828]">First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First name" className="rounded-full h-12 bg-white border-[#D1D5DB] text-black" {...field} />
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
                      <FormLabel required className="font-semibold font-inter text-[#101828]">Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last name" className="rounded-full h-12 bg-white border-[#D1D5DB] text-black" {...field} />
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
                    <FormLabel required className="font-semibold font-inter text-[#101828]">Mobile Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Mobile number" className="rounded-full h-12 bg-white border-[#D1D5DB] text-black" {...field} />
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
                    <FormLabel required className="font-semibold font-inter text-[#101828]">Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Email address" className="rounded-full h-12 bg-white border-[#D1D5DB] text-black" {...field} />
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
                      <FormLabel required className="font-semibold font-inter text-[#101828]">Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Password" className="rounded-full h-12 bg-white border-[#D1D5DB] text-black" {...field} />
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
                      <FormLabel required className="font-semibold font-inter text-[#101828]">Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirm password" className="rounded-full h-12 bg-white border-[#D1D5DB] text-black" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex items-center mt-2 gap-5">
              <Button type="submit" disabled={signupLoading} className="w-full capitalize font-inter font-bold tracking-wider shadow-[#BFDBFE] bg-[#136AED] h-12 my-4 text-white border rounded-full shadow-md disabled:opacity-50">
                {signupLoading && <Loader2 className="h-5 w-5 animate-spin" /> } Sign Up
              </Button>
            </div>
          </form>

          <div className="flex items-center px-8">
            <Link href={App_url?.link?.SIGN_IN} className="w-full whitespace-nowrap font-inter font-medium text-center text-[#6B7280] text-md">
              Already have an account?
              <span className="text-[#3B82F6] font-bold font-inter text-base"> Log In</span>
            </Link>
          </div>
        </Form>
      </AuthLayout>
    </>
  );
};

export default SignUpPage;
