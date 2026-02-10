/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, House } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { toast } from "react-toastify";

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
import { postData } from "@/api/rest/fetchData";
import { App_url } from "@/constant/static";
import PackagesModal from "../components/package-modal";
import { useState } from "react";

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
    <section className="min-h-screen bg-white p-10 w-full mx-auto">
      <div className="flex min-h-screen gap-10">
        <div className="w-[53%] hidden lg:block relative">
          <Image
            src={App_url.image.sign_up_image}
            alt="Signup"
            className="h-full w-full object-cover rounded-[40px]"
            width={1200}
            height={1800}
            priority
            unoptimized
          />
          <div className="absolute rounded-[40px] inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute top-7 left-7 z-30 bg-white/20 border border-white/30 rounded-full px-3 py-2 flex items-center gap-2.5 ">
            <div className="bg-white/40 p-1 w-7 h-7 rounded-lg flex justify-center items-center">
              <House className="text-white" size={20} />
            </div>
            <h1 className="font-inter font-semibold text-white tracking-wider">Real Estate</h1>
          </div>
        </div>

        {/* RIGHT IMAGE + FORM */}
        <div className="w-full lg:w-[42%] px-10 py-4">
          <div className="">
            <Image
              src={App_url.image.logo}
              alt="logo"
              className="mb-2"
              width={170}
              height={170}
              unoptimized
            />
          </div>
          <div className="my-6 mt-10 flex flex-col gap-5">
            <h1 className="capitalize font-inter font-bold text-[#101828] text-2xl">Create Your Zecco Account</h1>
            <p className="font-inter font-medium text-[#6B7280] capitalize">Register new account</p>
          </div>
          <Form {...form}>
            <form className="" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold font-inter text-[#101828]">
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
                        <FormLabel className="font-semibold font-inter text-[#101828]">
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
                      <FormLabel className="font-semibold font-inter text-[#101828]">
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
                      <FormLabel className="font-semibold font-inter text-[#101828]">
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
              <div className="flex items-center mt-4 mb-5 gap-5">
                <Button
                  // type="submit"
                  onClick={() => setPackageModal(true)}
                  className="w-full capitalize font-inter font-bold tracking-wider shadow-[#BFDBFE] bg-[#136AED] h-12 my-4 text-white border rounded-full shadow-md"
                >
                  Sign Up
                </Button>
              </div>
            </form>

            <div className="flex items-center px-8 mt-3 mb-5">
              <Link
                href={App_url?.link?.SIGN_IN}
                className="w-full font-inter font-medium text-center text-[#6B7280] text-md"
              >
                Already have an account?
                <span className="text-[#3B82F6] font-bold font-inter text-base">  Log In</span>
              </Link>
            </div>

            <div className="flex justify-center text-center items-center px-8 mt-4 mb-5 w-full mx-auto">
              <Link
                href={App_url?.link?.INITIAL_URL}
                className="w-full mx-auto flex justify-center items-center gap-2 font-inter font-medium text-center text-heading_text_color text-md"
              >
                <ArrowLeft className="mt-[3px]" />
                <span className="text-heading_text_color font-manrope font-bold text-base"> Back to Home </span>
              </Link>
            </div>
          </Form>
        </div>
      </div>

      {packageModal && (
        <PackagesModal onClose={() => setPackageModal(false)} />
      )}
    </section>
  );
};

export default SignUpPage;

