/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/prefer-as-const */
"use client";
import { postData, URL } from "@/api/rest/fetchData";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as z from "zod";
import { toast } from "react-toastify";

const formSchema = z.object({
  name: z.string().min(1, { message: "First name is " }),
  contact: z.string().min(1, { message: "Last name is " }),
  email: z.string().email({ message: "Invalid email address" }),
  postal_code: z.string().min(1, { message: "Phone number is " }),
});

const SignUpPage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contact: "",
      email: "",
      postal_code: ""
    },
  });
  const dispatch = useDispatch();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload = {
      ...values,
    };
    postData(App_url?.endpoint_url?.USER_LOGIN, payload)
      ?.then((response: any) => {
        if (response?.data?.status === 200) {
          sessionStorage.setItem("otp_email", values?.email)
          toast.success(response?.data?.message)
          router.push(App_url.link.OTP_VERIFICATION);
        } else {
          toast.error(response?.data?.message)
        }
      })
      ?.catch((error) => {
        toast.error(error)
        console.log("error ", error);
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
            src={App_url.image.logo}
            alt="logo"
            className="mb-2"
            width={120}
            height={120}
            unoptimized
          />
        </div>
        <div className="flex justify-end w-full">
          <div className="container relative w-[35%] mr-0 bg-white h-screen z-10 px-8 py-2">
            <div className="flex justify-center items-center mt-1">
              <Image
                src={App_url.image.logo}
                alt="logo"
                className="mb-2"
                width={70}
                height={70}
                unoptimized
              />
            </div>
            <Form {...form}>
              <form className="" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-normal text-black">
                          Charity Name
                        </FormLabel>
                        <FormControl>
                          <Input

                            placeholder="Charity Name"
                            className="rounded-[10px] py-[20px] bg-white border-darkGray text-black"
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
                        <FormLabel className="font-normal text-black">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input

                            placeholder="Enter email address"
                            className="rounded-[10px] py-[20px] bg-white border-darkGray text-black"
                            {...field}
                            value={typeof field.value === "string" ? field.value : ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="contact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-normal text-black">
                            Contact Number
                          </FormLabel>
                          <FormControl>
                            <Input

                              placeholder="Contact Number"
                              className="rounded-[10px] py-[20px] bg-white border-darkGray text-black"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="postal_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-normal text-black">
                            Postal Code
                          </FormLabel>
                          <FormControl>
                            <Input

                              placeholder="Postal Code"
                              className="rounded-[10px] py-[20px] bg-white border-darkGray text-black"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                </div>
                <div className="flex items-center mt-4 mb-5 gap-5">
                  <Button
                    onClick={() => router.back()}
                    className="w-full uppercase bg-brand-blue h-11 my-2 text-white border rounded-[10px] shadow-md"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-full uppercase bg-brand-orange h-11 my-2 text-white border rounded-[10px] shadow-md"
                  >
                    Register
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUpPage;
