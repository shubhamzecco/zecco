"use client"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { App_url } from '@/constant/static'
import Image from 'next/image'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Input } from '@/components/ui/input';


const formSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    mobile_no: z.string().min(1, "Mobile number is required"),
    email: z.string().email("Invalid email address"),
    consultation: z.string().optional(),
    project_information: z.string().optional(),
});


const UserForm = () => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            mobile_no: "",
            email: "",
        },
    });


    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values);
    };


    return (
        <section className=" mb-6">
            <h2 className="font-bold text-lg mb-4 font-inter text-[#111827]">Edit Profile</h2>

            <div className="bg-white p-8 rounded-lg ">
                <div className="flex items-center gap-3 ">
                    <Image
                        src={App_url.image.image_6}
                        alt="AI Insights"
                        width={160}
                        height={100}
                        className="rounded-full object-cover w-20 h-20"
                    />

                    <div className="">
                        <button className="w-fit  text-sm px-2 tracking-wider shadow-md my-3 bg-[#111827] text-white text-[15px] py-1 rounded-[5px] font-manrope font-normal flex items-center gap-2">
                            Update Photo
                        </button>
                        <p className='text-[#64748B] font-manrope font-medium text-xs'>JPG, PNG or GIF (max. 5MB)</p>
                    </div>
                </div>


                <div className="p-8 bg-[#F2F3F6] rounded-lg my-5">
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

                                    <FormField
                                        control={form.control}
                                        name="mobile_no"
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
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>


                <button className="w-fit px-10 tracking-wider shadow-md my-4 bg-[#111827] text-white text-[12px] py-2.5 rounded-[10px] font-manrope font-extrabold flex items-center gap-2">
                    Update Profile
                </button>
            </div>

        </section>
    )
}

export default UserForm
