"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import MainLayout from "@/components/layouts/main-layout";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { App_url } from "@/constant/static";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  contact_no: z.string().min(1, "Mobile number is required"),
  email: z.string().email("Invalid email address"),
  consultation: z.string().optional(),
  project_information: z.string().optional(),
});

const ContactUs = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      contact_no: "",
      email: "",
      consultation: "",
      project_information: "",
    },
  });
  const { sendMessage, lastEvent } = useWebSocket();

  useEffect(() => {
    if (
      lastEvent?.data?.status &&
      lastEvent?.data?.request?.type === "inquiryService" &&
      lastEvent?.data?.request?.action === "add"
    ) {
      form?.reset({});
      toast.success(lastEvent?.data?.msg);
    }
  }, [lastEvent]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    sendMessage("action", {
      type: "inquiryService",
      action: "add",
      payload: {
        first_name: values?.first_name,
        last_name: values?.last_name,
        contact_no: values?.contact_no,
        email: values?.email,
        consultation: values?.consultation,
        project_information: values?.project_information,
      },
    });
  };

  return (
    <MainLayout>
      <section className="py-10 -mt-7">
        <div className="lg:mx-10 px-6">
          <div className="flex flex-col md:flex-row md:justify-between mb-10">
            <h2 className="text-3xl capitalize font-manrope font-bold text-[#000000]">
              Connect with Us
            </h2>
            <p className="text-slate_gray font-medium font-manrope text-md max-w-xl mt-4 md:mt-0">
              Get in touch with our local experts for personalized guidance and
              find the right property with confidence.
            </p>
          </div>
          <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr] gap-6">
            <div className="p-8 bg-[#F2F3F6] rounded-lg">
              <Form {...form}>
                <form className="" onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 gap-5">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium font-inter text-[#101828]">
                              First Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter first name"
                                className="rounded-[10px] h-12 bg-white border-[#D1D5DB] text-black"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium font-inter text-[#101828]">
                              Last Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter last name"
                                className="rounded-[10px] h-12 bg-white border-[#D1D5DB] text-black"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="contact_no"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium font-inter text-[#101828]">
                            Phone
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your phone"
                              className="rounded-[10px] h-12 bg-white border-[#D1D5DB] text-black"
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
                          <FormLabel className="font-medium font-inter text-[#101828]">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter email"
                              className="rounded-[10px] h-12 bg-white border-[#D1D5DB] text-black"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="consultation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium font-inter text-[#101828]">
                            Consultation
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="What would you like to consult about"
                              className="rounded-[10px] h-12 bg-white border-[#D1D5DB] text-black"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="project_information"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium font-inter text-[#101828]">
                            Project Information
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              rows={10}
                              placeholder="What would you like to consult about"
                              className="rounded-[10px] h-28 bg-white border-[#D1D5DB] text-black"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex items-center mt-3  gap-5">
                    <button className="w-fit px-10 tracking-wider shadow-md my-4 bg-[#136AED] text-white text-[15px] py-2.5 rounded-full font-inter font-medium flex items-center gap-2">
                      Submit
                    </button>
                  </div>
                </form>
              </Form>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <div className="p-8 bg-[#F2F3F6] rounded-lg">
                <div className="space-y-4 text-sm flex gap-4 items-center">
                  <div className="">
                    <MapPin size={25} className="text-[#0B5394] mt-0.5" />
                  </div>
                  <div className="">
                    <h1 className="font-manrope font-bold text-[#000000] text-lg">
                      Location
                    </h1>
                    <span className="font-manrope text-[#475569] font-normal">
                      2600<span className="font-semibold"> ZECCO.es</span>,
                      Malaga, Spain
                    </span>
                  </div>
                </div>

                <div className="space-y-4 text-sm flex gap-4 items-center">
                  <div className="">
                    <Mail size={25} className="text-[#0B5394] mt-0.5" />
                  </div>
                  <div className="">
                    <h1 className="font-manrope font-bold text-[#000000] text-lg">
                      Email
                    </h1>
                    <span className="font-manrope text-[#475569] font-normal">
                      info@zecco.es
                    </span>
                  </div>
                </div>

                <div className="space-y-4 text-sm flex gap-4 items-center">
                  <div className="">
                    <Phone size={25} className="text-[#0B5394] mt-0.5" />
                  </div>
                  <div className="">
                    <h1 className="font-manrope font-bold text-[#000000] text-lg">
                      Phone
                    </h1>
                    <span className="font-manrope text-[#475569] font-normal">
                      <span className="font-semibold"> Mobile :</span> +34 600
                      000 000
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <Image
                  src={App_url.image.contact_us}
                  alt="Contact Us"
                  className="rounded-[10px] object-cover w-full h-full"
                  width={400}
                  height={300}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ContactUs;
