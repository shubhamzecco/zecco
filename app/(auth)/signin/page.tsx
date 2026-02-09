'use client';

import { AuthReq } from "@/api/rest/fetchData";
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
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});


const Signin = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    AuthReq(App_url?.endpoint_url?.USER_SIGN_IN, values)
      .then((response) => {
        try {
          if (response?.status === 200) {
            const payload = {
              ...response,
              user: {
                ...response?.data?.user,
              },
              access_token: response?.data?.access_token
            };
            localStorage.setItem("access_token", response?.data?.access_token);
            dispatch(setLogin(true));
            dispatch(setAuthData(payload));
            router?.push(App_url.link.INITIAL_URL);
          } else {
            toast.error(response?.message || "Login failed.");
          }
        } catch (error) {
          toast.error("Something went wrong.");
        }
      })
      .catch((error) => {
        console.log("API Error :::", error);
        // setLoader(false);
        const errorMessage =
          error?.response?.data?.error ||
          error?.message ||
          "An unexpected error occurred.";
        // toast({ description: errorMessage });
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
          <div className="container relative w-[35%] mr-0 bg-white h-screen z-10 p-6 px-10">
            <div className="flex justify-center items-center mt-4">
              <Image
                src={App_url.image.logo}
                alt="logo"
                className="mb-2"
                width={70}
                height={70}
                unoptimized
              />
            </div>
            <div className="">
              <h1 className="text-black text-center text-2xl font-semibold mt-7">
                Login
              </h1>
            </div>
            <Form {...form}>
              <form className="my-10" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel  className="font-normal text-black">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
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
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel  className="font-normal text-black">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            
                            placeholder="Enter password"
                            className="rounded-[10px] py-[20px] bg-white border-darkGray text-black"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-end  my-3">
                  <Link
                    href={App_url?.link?.FORGET_PASSWORD}
                    className="w-full text-end text-brand-blue underline font-normal text-md"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div className="flex items-center mt-4 mb-5 gap-5">
                  <Button
                    type="submit"
                    className="w-full uppercase bg-brand-orange h-11 my-2 text-white border rounded-[10px] shadow-md"
                  >
                    Log IN
                  </Button>
                </div>

                <div className="flex items-center px-8 mt-3 mb-5">
                  <Link
                    href={App_url?.link?.SIGN_UP}
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

export default Signin;
