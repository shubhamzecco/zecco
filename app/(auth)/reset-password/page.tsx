"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";
import AuthLayout from "../layout/page";

const formSchema = z.object({
  confirm_password: z.string({
    required_error: "Confirm password is required",
  }),
  password: z.string({
    required_error: "Password is required",
  }),
});

const ResetPassword = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confirm_password: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    postData(App_url?.endpoint_url?.RESET_PASSWORD, {
      password: values?.password,
      confirm_password: values?.confirm_password,
      email: sessionStorage.getItem("otp_email"),
      otp: String(sessionStorage.getItem("otp") || 0),
    })
      .then((response) => {
        try {
          if (response?.status === 200) {
            toast.success(response?.message);
            router?.push(App_url.link.SIGN_IN);
            sessionStorage.setItem("otp_email", "");
            sessionStorage.setItem("otp", "");
            sessionStorage.setItem("forget_password", "");
            toast.success(response?.data?.message);
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
    <AuthLayout
      heading="Welcome Back to Zecco!"
      description="Sign in to Your Account"
    >
      <Form {...form}>
        <form
          className="max-md:flex flex-col justify-center max-md:min-h-fit max-md:py-3"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 gap-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    required
                    className="font-semibold font-inter text-[#101828]"
                  >
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
                  <FormLabel
                    required
                    className="font-semibold font-inter text-[#101828]"
                  >
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
    </AuthLayout>
  );
};

export default ResetPassword;
