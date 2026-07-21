"use client";

import { AuthReq } from "@/api/rest/fetchData";
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
import { setAuthData, setLogin } from "@/redux/modules/common/user_data/action";
import { setPropertyFilter } from "@/redux/modules/main/action";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as z from "zod";
import AuthLayout from "../layout/page";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().min(1, "Email address is required").email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(6, "Password must be at least 6 characters long.")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Password must contain both letters and numbers."
    ),
});

const Signin = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange"
  });

  useEffect(() => {
    dispatch(setPropertyFilter({}));
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      const response = await AuthReq(App_url.endpoint_url.USER_SIGN_IN, {
        ...values,
        user_type: "client",
      });

      if (response?.success) {
        const payload = {
          ...response?.data,
          user: response?.data?.user,
          access_token: response?.data?.accessToken,
        };
        localStorage.setItem("access_token", response?.data?.accessToken || "");

        dispatch(setLogin(true));
        dispatch(setAuthData(payload));

        const redirectUrl = localStorage.getItem("redirect_after_login");

        toast.success(response.message);

        if (redirectUrl) {
          localStorage.removeItem("redirect_after_login");
          router.push(redirectUrl);
        } else {
          router.push(App_url.link.INITIAL_URL);
        }
      } else {
        toast.error(response?.message || "Login failed.");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
        error?.message ||
        "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <AuthLayout
        heading="Welcome Back to Zecco!"
        description="Sign in to Your Account"
        backToHome
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 max-md:flex max-md:flex-col max-md:justify-center max-md:min-h-fit max-md:py-3"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required className="font-semibold text-[#101828] max-md:text-white">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email address"
                      className="h-12 rounded-xl bg-white border-[#D1D5DB] max-md:bg-white/90 max-md:text-black"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="max-md:text-red-300" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required className="font-semibold text-[#101828] max-md:text-white">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      className="h-12 bg-white rounded-xl border-[#D1D5DB] max-md:bg-white/90 max-md:text-black"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="max-md:text-red-300" />
                </FormItem>
              )}
            />

            {/* REMEMBER + FORGOT */}
            <div className="my-2 mt-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="h-4 w-4 rounded border-gray-300 text-[#136AED] focus:ring-[#136AED]"
                />
                <label
                  htmlFor="rememberMe"
                  className="font-inter text-sm font-medium text-[#344054] cursor-pointer max-md:text-white/80"
                >
                  Remember me
                </label>
              </div>

              <Link
                href={App_url?.link?.FORGET_PASSWORD}
                className="font-inter text-sm font-medium text-[#9CA3AF] hover:underline max-md:text-white/70"
              >
                Forgot password?
              </Link>
            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full capitalize font-inter font-bold tracking-wider  bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] h-12 my-4 text-white border rounded-xl shadow-md disabled:opacity-50"
            >
              {loading && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
              Login
            </Button>
          </form>
        </Form>

        {/* REGISTER */}
        <div className="w-full my-3 font-inter font-medium text-center text-[#6B7280] text-md max-md:text-white/70">
          Don&apos;t have an account?
          <Link
            href={App_url.link.SIGN_UP}
            className="text-[#3B82F6] font-bold font-inter text-base ml-2"
          >
            Register
          </Link>
        </div>
      </AuthLayout>
    </>
  );
};

export default Signin;
