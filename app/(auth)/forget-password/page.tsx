'use client';

import { postData } from "@/api/rest/fetchData";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { App_url } from "@/constant/static";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, House } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";
import AuthLayout from "../layout/page";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

const ForgetPassword = () => {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    postData(App_url?.endpoint_url?.FORGET_PASSWORD, values)
      .then((response) => {
        try {
          if (response?.data?.status === 200) {
            toast.success(response?.data?.message)
            sessionStorage.setItem("otp_email", values.email);
            sessionStorage?.setItem('forget_password', 'forget-password')
            // router.push(App_url?.link?.verification);
          } else {
            toast.error(response?.data?.message);
          }
        } catch (error) {
          toast.error('Something went wrong');
        }
      })
      .catch((error) => {
        console.log("API Error :::", error);
        // setLoader(false);
        const errorMessage =
          error?.response?.data?.error ||
          error?.message ||
          "An unexpected error occurred.";
        toast.error(errorMessage);
      });
  };

  return (
    <AuthLayout>
      <div className="my-6 mt-10 flex flex-col gap-5">
        <h1 className="capitalize font-inter font-bold text-[#101828] text-2xl max-md:text-center">Forget Password</h1>
        <p className="font-inter font-medium text-[#6B7280] capitalize max-md:text-center">Verify your email</p>
      </div>
      <Form {...form}>
        <form className="" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required className="font-semibold font-inter text-[#101828]">
                    Your Email
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
              type="submit"
              className="w-full capitalize bg-[#136AED] shadow-[#BFDBFE] h-12 my-4 text-white rounded-full shadow-md"
            >
              Send OTP
            </Button>
          </div>
        </form>

        <div className="flex items-center px-8 mt-1 mb-5">
          <Link
            href={App_url?.link?.SIGN_UP}
            className="w-full whitespace-nowrap font-inter font-medium text-center text-[#6B7280] text-md"
          >
            Don't have an account?
            <span className="text-[#3B82F6] font-bold font-inter text-base">  Register</span>
          </Link>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default ForgetPassword;
