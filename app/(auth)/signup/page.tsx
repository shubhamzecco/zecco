/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import PackagesModal from "../components/package-modal";
import AuthLayout from "../layout/page";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  mobile_no: z.string().min(1, "Mobile number is required"),
  email: z.string().email("Invalid email address"),
});

const SignUpPage = () => {
  const router = useRouter();
  const [packageModal, setPackageModal] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      mobile_no: "",
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    postData(App_url.endpoint_url.USER_LOGIN, values)
      ?.then((response: any) => {
        if (response?.data?.status === 200) {
          sessionStorage.setItem("otp_email", values.email);
          toast.success(response.data.message);
          router.push(App_url.link.OTP_VERIFICATION);
        } else {
          toast.error(response?.data?.message);
        }
      })
      ?.catch((error) => {
        toast.error("Something went wrong");
        console.error(error);
      });
  };

  return (

    <>
      <AuthLayout
        heading="Create Your Zecco Account"
        description="Register new account">
        <Form {...form}>
          <form className="max-md:flex flex-col justify-center max-md:min-h-fit max-md:py-3" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required className="font-semibold font-inter text-[#101828]">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input

                          placeholder="Enter first name"
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
                      <FormLabel required className="font-semibold font-inter text-[#101828]">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input

                          placeholder="Enter last name"
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
                name="mobile_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required className="font-semibold font-inter text-[#101828]">
                      Mobile Number
                    </FormLabel>
                    <FormControl>
                      <Input

                        placeholder="Enter mobile number"
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
                    <FormLabel required className="font-semibold font-inter text-[#101828]">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input

                        placeholder="Enter email"
                        className="rounded-full h-12 bg-white border-[#D1D5DB] text-black"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center mt-3  gap-5">
              <Button
                // type="submit"
                onClick={() => setPackageModal(true)}
                className="w-full capitalize font-inter font-bold tracking-wider shadow-[#BFDBFE] bg-[#136AED] h-12 my-4 text-white border rounded-full shadow-md"
              >
                Sign Up
              </Button>
            </div>
          </form>

          <div className="flex items-center px-8 mt-2">
            <Link
              href={App_url?.link?.SIGN_IN}
              className="w-full whitespace-nowrap font-inter font-medium text-center text-[#6B7280] text-md"
            >
              Already have an account?
              <span className="text-[#3B82F6] font-bold font-inter text-base">  Log In</span>
            </Link>
          </div>
        </Form>
      </AuthLayout>
      {packageModal && (
        <PackagesModal onClose={() => setPackageModal(false)} />
      )}
    </>

  );
};

export default SignUpPage;

