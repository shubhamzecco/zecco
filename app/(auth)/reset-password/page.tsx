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
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as z from "zod";

const formSchema = z.object({
  confirm_password: z.string({ required_error: "Confirm password is required" }),
  password: z.string({
    required_error: "Password is required",
  }),
});

const ResetPassword = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confirm_password: "",
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    postData(App_url?.endpoint_url?.RESET_PASSWORD, {
      password: values.password,
      confirm_password: values.confirm_password,
      email: sessionStorage.getItem("otp_email"),
      code: String(sessionStorage.getItem("otp") || 0),
    })
      .then((response) => {
        try {
          if (response?.status === 200) {
            toast.success(response?.message);
            router?.push(App_url.link.SIGN_IN);
            sessionStorage.setItem("otp_email", '')
            sessionStorage.setItem("otp", '')
            sessionStorage.setItem("forget_password", '')
          } else {
            toast.error(response?.message);
          }
        } catch (error) {
          toast.error(response?.message);
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
    <section className="min-h-screen bg-white p-10 w-full mx-auto">
      <div className="flex h-[86vh] gap-10">
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
        <div className="w-full lg:w-[40%] px-10 py-4">
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
            <h1 className="capitalize font-inter font-bold text-[#101828] text-2xl">Welcome Back to Zecco!</h1>
            <p className="font-inter font-medium text-[#6B7280] capitalize">Sign in to Your Account</p>
          </div>
          <Form {...form}>
            <form className="" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold font-inter text-[#101828]">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter new password"
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
                      <FormLabel className="font-semibold font-inter text-[#101828]">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter confirm password"
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
                  Save Password
                </Button>
              </div>
            </form>

            <div className="flex items-center px-8 mt-1 mb-5">
              <Link
                href={App_url?.link?.SIGN_UP}
                className="w-full font-inter font-medium text-center text-[#6B7280] text-md"
              >
                Don't have an account?
                <span className="text-[#3B82F6] font-bold font-inter text-base">  Register</span>
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
    </section>
  );
};

export default ResetPassword;
