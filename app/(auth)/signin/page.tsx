"use client";

import { AuthReq } from "@/api/rest/fetchData";
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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as z from "zod";
import AuthLayout from "../layout/page";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});

const Signin = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    dispatch(setPropertyFilter({}));
  }, []);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    AuthReq(App_url.endpoint_url.USER_SIGN_IN, {
      ...values,
      user_type: "client",
    })
      .then((response) => {
        if (response?.success) {
          const payload = {
            ...response?.data,
            user: response.data.user,
            access_token: response.data.accessToken,
          };
          localStorage.setItem("access_token", response.data.accessToken);
          dispatch(setLogin(true));
          dispatch(setAuthData(payload));
          const redirectUrl = localStorage.getItem("redirect_after_login");
          toast.success(response?.message);
          if (redirectUrl) {
            router.push(redirectUrl);
            localStorage.removeItem("redirect_after_login");
          } else {
            router.push(App_url.link.INITIAL_URL);
          }
        } else {
          toast.error(response?.message || "Login failed.");
        }
      })
      .catch((error) => {
        toast.error(
          error?.response?.data?.error ||
            error?.message ||
            "An unexpected error occurred.",
        );
      });
  };

  return (
    <>
      <AuthLayout
        heading="Welcome Back to Zecco!"
        description=" Sign in to Your Account"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 max-md:flex flex-col justify-center max-md:min-h-fit max-md:py-3"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required className="font-semibold text-[#101828]">
                    Your Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email"
                      className="h-12 rounded-full bg-white border-[#D1D5DB]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required className="font-semibold  text-[#101828]">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      className="h-12 bg-white rounded-full border-[#D1D5DB]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* REMEMBER + FORGOT */}
            <div className="my-2 mt-5 flex items-center justify-between">
              {/* Left: Remember Me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="h-4 w-4 rounded border-gray-300 text-[#136AED] focus:ring-[#136AED]"
                />
                <label
                  htmlFor="rememberMe"
                  className="font-inter text-sm font-medium text-[#344054] cursor-pointer"
                >
                  Remember me
                </label>
              </div>

              {/* Right: Forgot Password */}
              <Link
                href={App_url?.link?.FORGET_PASSWORD}
                className="font-inter text-sm font-medium text-[#9CA3AF] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              className="w-full capitalize font-inter font-bold tracking-wider shadow-[#BFDBFE] bg-[#136AED] h-12 my-4 text-white border rounded-full shadow-md"
            >
              Login
            </Button>
          </form>
        </Form>

        {/* REGISTER */}
        <div className="w-full my-3 font-inter font-medium text-center text-[#6B7280] text-md">
          Don’t have an account?
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
