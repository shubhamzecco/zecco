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
import WaveText from "@/components/ui/WaveText";
import { App_url } from "@/constant/static";
import { zodResolver } from "@hookform/resolvers/zod";
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
            router?.push(App_url.link.signin);
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
    <section className="relative min-h-screen text-white  bg-white overflow-hidden">
      <div className="flex items-center">
        <div
          className="w-[65%] h-[100vh] fixed flex flex-col items-center justify-center
                 bg-gradient-to-b from-brand-custom-green-start to-brand-custom-green-end"
          style={{
            background: `
                linear-gradient(
                  to bottom,
                  #E5EFE6 0%,
                  #E5EFE6 45%,
                  #9ECCA1 85%,
                  #9ECCA1 100%
                )
              `,
          }}

        >
          {/* Logo */}
          <Image
            src={App_url.images.logo}
            alt="logo"
            className="mb-2"
            width={120}
            height={120}
            unoptimized
          />
          <WaveText text="We Are Everywhere" />
        </div>
        <div className="flex justify-end w-full">
          <div className="container relative w-[35%] mr-0 bg-white h-screen z-10 p-6 px-10">
            <div className="flex justify-center items-center mt-4">
              <Image
                src={App_url.images.logo}
                alt="logo"
                className="mb-2"
                width={70}
                height={70}
                unoptimized
              />
            </div>
            <div className="">
              <h1 className="text-black underline text-center text-2xl font-semibold mt-7">
                Reset Password
              </h1>
              <p className="text-black/50 text-center my-7">
                Your identity has been verified.
                <br />
                Set a new password to continue.
              </p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>

                {/* Inputs */}
                <div className="grid md:grid-cols-1 gap-5 px-2 sm:px-6 md:px-8 mx-auto">
                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required className="font-normal text-black">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="password"
                              required
                              placeholder="Enter password"
                              className="rounded-[10px] py-[20px] bg-white border-darkGray text-black"
                              {...field}
                            />
                          </div>
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
                        <FormLabel required className="font-normal text-black">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="password"
                              required
                              placeholder="Enter confirm password"
                              className="rounded-[10px] py-[20px] bg-white border-darkGray text-black"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </div>

                {/* Submit */}
                <div className="flex items-center lg:px-8 mt-6 mb-5">
                  <div className="mt-5 w-full  mx-auto">
                    <Button
                      type="submit"
                      className="w-full h-11 bg-brand-orange text-white rounded-[10px]"
                    >
                      Save Password
                    </Button>
                  </div>
                </div>

                {/* Sign Up */}
                <div className="flex items-center px-8 mt-3 mb-5">
                  <Link
                    href={App_url?.link?.signup}
                    className="w-full text-center text-[#878787] font-normal text-md"
                  >
                    Don`t have an account?
                    <span className="text-brand-blue font-semibold text-base"> Sign Up </span>
                  </Link>
                </div>

              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
