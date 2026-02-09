'use client';

import { AuthReq, postData } from "@/api/rest/fetchData";
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
import { GRADIENT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { setAuthData, setLogin } from "@/redux/modules/common/user_data/action";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as z from "zod";

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
            router.push(App_url?.link?.verification);
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
                Forget Password
              </h1>
              <p className="text-black/50 text-center my-7">
                Enter your registered email address.
                <br />
                We’ll send you a one-time password (OTP) to verify your identity.
              </p>
            </div>
            <Form {...form}>
              <form className="my-10" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required className="font-normal text-black">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            required
                            placeholder="Enter email"
                            className="rounded-[10px] py-[20px] bg-white border-darkGray text-black"
                            {...field}
                            value={typeof field.value === "string" ? field.value : ""}
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
                    className="w-full uppercase bg-brand-orange h-11 my-2 text-white border rounded-[10px] shadow-md"
                  >
                    Send OTP
                  </Button>
                </div>

                <div className="flex items-center px-8 mt-3 mb-5">
                  <Link
                    href={App_url?.link?.signin}
                    className="w-full text-center text-[#878787] font-normal text-md"
                  >
                    Do you have an account?
                    <span className="text-brand-blue font-semibold text-base"> Sign in </span>
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

export default ForgetPassword;
