// 'use client';

// import { AuthReq } from "@/api/rest/fetchData";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { App_url } from "@/constant/static";
// import { setAuthData, setLogin } from "@/redux/modules/common/user_data/action";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { ArrowLeft, House } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { useDispatch } from "react-redux";
// import { toast } from "react-toastify";
// import * as z from "zod";

// const formSchema = z.object({
//   email: z.string().email({ message: "Invalid email address" }),
//   password: z
//     .string({ required_error: "Password is required" })
//     .min(6, { message: "Password must be at least 6 characters" }),
// });


// const Signin = () => {
//   const router = useRouter()
//   const dispatch = useDispatch()
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       password: '',
//     },
//   });

//   const onSubmit = (values: z.infer<typeof formSchema>) => {
//     AuthReq(App_url?.endpoint_url?.USER_SIGN_IN, values)
//       .then((response) => {
//         try {
//           if (response?.status === 200) {
//             const payload = {
//               ...response,
//               user: {
//                 ...response?.data?.user,
//               },
//               access_token: response?.data?.access_token
//             };
//             localStorage.setItem("access_token", response?.data?.access_token);
//             dispatch(setLogin(true));
//             dispatch(setAuthData(payload));
//             router?.push(App_url.link.INITIAL_URL);
//           } else {
//             toast.error(response?.message || "Login failed.");
//           }
//         } catch (error) {
//           toast.error("Something went wrong.");
//         }
//       })
//       .catch((error) => {
//         console.log("API Error :::", error);
//         // setLoader(false);
//         const errorMessage =
//           error?.response?.data?.error ||
//           error?.message ||
//           "An unexpected error occurred.";
//         // toast({ description: errorMessage });
//       });
//   };

//   return (
//     <section className="min-h-screen bg-white p-10 w-full mx-auto">
//       <div className="flex min-h-screen gap-10">
//         <div className="w-[53%] hidden lg:block relative">
//           <Image
//             src={App_url.image.sign_up_image}
//             alt="Signup"
//             className="h-full w-full object-cover rounded-[40px]"
//             width={800}
//             height={800}
//             priority
//             unoptimized
//           />
//           <div className="absolute rounded-[40px] inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
//           <div className="absolute top-7 left-7 z-30 bg-white/20 border border-white/30 rounded-full px-3 py-2 flex items-center gap-2.5 ">
//             <div className="bg-white/40 p-1 w-7 h-7 rounded-lg flex justify-center items-center">
//               <House className="text-white" size={20} />
//             </div>
//             <h1 className="font-inter font-semibold text-white tracking-wider">Real Estate</h1>
//           </div>
//         </div>

//         {/* RIGHT IMAGE + FORM */}
//         <div className="w-full lg:w-[40%] px-10 py-4">
//           <div className="">
//             <Image
//               src={App_url.image.logo}
//               alt="logo"
//               className="mb-2"
//               width={170}
//               height={170}
//               unoptimized
//             />
//           </div>
//           <div className="my-6 mt-5 flex flex-col gap-5">
//             <h1 className="capitalize font-inter font-bold text-[#101828] text-2xl">Welcome Back to Zecco!</h1>
//             <p className="font-inter font-medium text-[#6B7280] capitalize">Sign in to Your Account</p>
//           </div>
//           <Form {...form}>
//             <form className="" onSubmit={form.handleSubmit(onSubmit)}>
//               <div className="grid grid-cols-1 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="font-semibold font-inter text-[#101828]">
//                         Your Email
//                       </FormLabel>
//                       <FormControl>
//                         <Input

//                           placeholder="Enter email"
//                           className="rounded-full h-12 bg-white border-[#D1D5DB] text-black"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="password"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="font-semibold font-inter text-[#101828]">
//                         Password
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="password"
//                           placeholder="Enter password"
//                           className="rounded-full h-12 bg-white border-[#D1D5DB] text-black"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//               </div>

//               <div className="my-2 mt-5 flex items-center justify-between">
//                 {/* Left: Remember Me */}
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     id="rememberMe"
//                     className="h-4 w-4 rounded border-gray-300 text-[#136AED] focus:ring-[#136AED]"
//                   />
//                   <label
//                     htmlFor="rememberMe"
//                     className="font-inter text-sm font-medium text-[#344054] cursor-pointer"
//                   >
//                     Remember me
//                   </label>
//                 </div>

//                 {/* Right: Forgot Password */}
//                 <Link
//                   href={App_url?.link?.FORGET_PASSWORD}
//                   className="font-inter text-sm font-medium text-[#9CA3AF] hover:underline"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>


//               <div className="flex items-center mt-2 mb-2 gap-5">
//                 <Button
//                   type="submit"
//                   className="w-full capitalize bg-[#136AED] shadow-[#BFDBFE] h-12 my-4 text-white rounded-full shadow-md"
//                 >
//                   Login
//                 </Button>
//               </div>
//             </form>

//             <div className="flex items-center px-8 mt-1 mb-4">
//               <Link
//                 href={App_url?.link?.SIGN_UP}
//                 className="w-full font-inter font-medium text-center text-[#6B7280] text-md"
//               >
//                 Don't have an account?
//                 <span className="text-[#3B82F6] font-bold font-inter text-base">  Register</span>
//               </Link>
//             </div>

//             <div className="flex justify-center text-center items-center px-8 mt-2 mb-5 w-full mx-auto">
//               <Link
//                 href={App_url?.link?.INITIAL_URL}
//                 className="w-full mx-auto flex justify-center items-center gap-2 font-inter font-medium text-center text-heading_text_color text-md"
//               >
//                 <ArrowLeft className="mt-[3px]" />
//                 <span className="text-heading_text_color font-manrope font-bold text-base"> Back to Home </span>
//               </Link>
//             </div>
//           </Form>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Signin;



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
import { ArrowLeft, House } from "lucide-react";
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
  const router = useRouter();
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    AuthReq(App_url.endpoint_url.USER_SIGN_IN, values)
      .then((response) => {
        if (response?.status === 200) {
          const payload = {
            ...response,
            user: response.data.user,
            access_token: response.data.access_token,
          };

          localStorage.setItem("access_token", response.data.access_token);
          dispatch(setLogin(true));
          dispatch(setAuthData(payload));
          router.push(App_url.link.INITIAL_URL);
        } else {
          toast.error(response?.message || "Login failed.");
        }
      })
      .catch((error) => {
        toast.error(
          error?.response?.data?.error ||
          error?.message ||
          "An unexpected error occurred."
        );
      });
  };

  return (
    <section className="h-screen overflow-hidden bg-white p-10 w-full">
      <div className="flex h-full items-center gap-10">

        {/* LEFT IMAGE */}
        <div className="w-[53%] hidden lg:block relative h-full">
          <Image
            src={App_url.image.sign_up_image}
            alt="Signin"
            className="h-full w-full object-cover rounded-[40px]"
            width={1200}
            height={1600}
            priority
            unoptimized
          />

          <div className="absolute inset-0 rounded-[40px] bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

          <div className="absolute top-7 left-7 z-30 bg-white/20 border border-white/30 rounded-full px-3 py-2 flex items-center gap-2">
            <div className="bg-white/40 p-1 w-7 h-7 rounded-lg flex items-center justify-center">
              <House className="text-white" size={18} />
            </div>
            <span className="font-inter font-semibold text-white tracking-wider">
              Real Estate
            </span>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="w-full lg:w-[40%] flex items-center h-full">
          <div className="w-full max-w-[460px] mx-auto px-10 py-6">

            {/* LOGO */}
            <Image
              src={App_url.image.logo}
              alt="logo"
              width={170}
              height={170}
              className="mb-4"
              unoptimized
            />

            {/* HEADING */}
            <div className="mb-6">
              <h1 className="font-inter font-bold text-[#101828] text-2xl">
                Welcome Back to Zecco!
              </h1>
              <p className="font-inter font-medium text-[#6B7280]">
                Sign in to Your Account
              </p>
            </div>

            {/* FORM */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-[#101828]">
                        Your Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter email"
                          className="h-12 rounded-full border-[#D1D5DB]"
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
                      <FormLabel className="font-semibold text-[#101828]">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter password"
                          className="h-12 rounded-full border-[#D1D5DB]"
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
                className="text-[#3B82F6] font-bold font-inter text-base"
              >
                Register
              </Link>
            </div>

            {/* BACK HOME */}
            <div className="mt-3 flex justify-center">
              <Link
                href={App_url.link.INITIAL_URL}
                className="w-full mx-auto flex justify-center items-center gap-2 font-inter font-medium text-center text-heading_text_color text-md"
              >
                <ArrowLeft size={18} />
                Back to Home
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Signin;
