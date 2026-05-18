"use client"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { App_url } from '@/constant/static'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Input } from '@/components/ui/input';
import { usePosterReducers } from '@/redux/getdata/usePostReducer'
import { useWebSocket } from '@/api/socket/WebSocketContext'
import { postData, URL } from '@/api/rest/fetchData'
import { toast } from 'react-toastify'
import ProfileAvatar from '@/components/profile'


const formSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    contact_no: z.string().min(1, "Mobile number is required"),
    email: z.string().email("Invalid email address"),
    consultation: z.string().optional(),
    project_information: z.string().optional(),
});


const passwordSchema = z
    .object({
        current_password: z.string().min(6, "Current password is required"),
        new_password: z.string().min(6, "New password must be at least 6 characters"),
        confirm_password: z.string().min(6, "Confirm password is required"),
    })
    .refine((data) => data.new_password === data.confirm_password, {
        path: ["confirm_password"],
        message: "Passwords do not match",
    });

const UserForm = () => {
    const { user_data } = usePosterReducers();
    const { sendMessage, lastEvent } = useWebSocket();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            contact_no: "",
            email: "",
        },
    });

    const passwordForm = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            current_password: "",
            new_password: "",
            confirm_password: "",
        },
    });

    useEffect(() => {
        if (lastEvent?.data?.status && lastEvent?.data?.request?.type === 'userService' && (lastEvent?.data?.request?.action === 'update' || lastEvent?.data?.request?.action === 'updatePassword')) {
            const payload = {
                type: "userService",
                action: "get",
                payload: {},
            }
            sendMessage('action', payload)
        }
        if (lastEvent?.data?.request?.action === 'updatePassword') {
            form?.reset({})
        }
    }, [lastEvent])

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        const payload = {
            type: "userService",
            action: 'update',
            payload: {
                id: user_data?.user?._id,
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                status: true,
                contact_no: data.contact_no
            },
        }
        sendMessage('action', payload)
    };

    const onPasswordSubmit = (data: z.infer<typeof passwordSchema>) => {
        const payload = {
            type: "userService",
            action: 'updatePassword',
            payload: {
                id: user_data?.user?._id,
                current_password: data?.current_password,
                new_password: data?.new_password,
                confirm_password: data?.confirm_password
            },
        }
        sendMessage('action', payload)
    };

    useEffect(() => {
        form?.reset({
            first_name: user_data?.user?.first_name,
            last_name: user_data?.user?.last_name,
            contact_no: user_data?.user?.contact_no,
            email: user_data?.user?.email,
        })
    }, [user_data])

    const uploadAvatar = async (file: File) => {
        try {
            const endpoint = App_url.endpoint_url.UPLOAD_FILE;
            let response: any;
            const formData = new FormData();
            formData.append("file", file);

            response = await postData(
                endpoint,
                formData,
                user_data.access_token,
                "multipart/form-data"
            );
            if (response?.data?.success) {
                const payload = {
                    type: "userService",
                    action: 'update',
                    payload: {
                        id: user_data?.user?._id,
                        profile_image: response?.data?.data?.fileUrl
                    },
                }
                sendMessage('action', payload)
            } else {
                toast.error("Upload failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while uploading");
        } finally {
            // setIsUpload(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        uploadAvatar(file);
    };


    return (
        <section className=" mb-6">
            <h2 className="font-bold text-lg mb-4 font-inter text-[#111827]">Edit Profile</h2>

            <div className="bg-white p-8 rounded-lg ">
                <div className="flex items-center gap-3 ">
                    {user_data?.user?.profile_image ? (
                        <Image
                            src={URL + user_data?.user?.profile_image}
                            alt="AI Insights"
                            width={160}
                            height={100}
                            className="rounded-full object-cover w-20 h-20"
                        />
                    ) : (
                        <>
                            <ProfileAvatar name={`${user_data?.user?.first_name + " " + user_data?.user?.last_name}`} className='!w-20 !h-20 !text-2xl border-4 border-[#EFF6FF] !text-white !bg-[#2563EB]' />
                        </>
                    )}


                    <div className="">
                        <button type="button" onClick={handleCameraClick} className="w-fit  text-sm px-2 tracking-wider shadow-md my-3 bg-[#111827] text-white text-[15px] py-1 rounded-[5px] font-manrope font-normal flex items-center gap-2">
                            Update Photo
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <p className='text-[#64748B] font-manrope font-medium text-xs'>JPG, PNG or GIF (max. 5MB)</p>
                    </div>
                </div>


                <div className="my-5">
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
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </div>


                    <button onClick={form.handleSubmit(onSubmit)} type='submit' className="w-fit px-10 tracking-wider shadow-md my-4 bg-[#111827] text-white text-[12px] py-2.5 rounded-[10px] font-manrope font-extrabold flex items-center gap-2">
                        Update Profile
                    </button>
                </div>


                <div className="my-5">
                    <div className="p-8 bg-[#F2F3F6] rounded-lg my-5">
                        <Form {...passwordForm}>
                            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                                <div className="grid grid-cols-1 gap-5">

                                    <FormField
                                        control={passwordForm.control}
                                        name="current_password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-medium font-inter text-[#101828]">
                                                    Current Password
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="Enter current password"
                                                        className="rounded-[10px] h-12 bg-white border-[#D1D5DB]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                        <FormField
                                            control={passwordForm.control}
                                            name="new_password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-medium font-inter text-[#101828]">
                                                        New Password
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            placeholder="Enter new password"
                                                            className="rounded-[10px] h-12 bg-white border-[#D1D5DB]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={passwordForm.control}
                                            name="confirm_password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-medium font-inter text-[#101828]">
                                                        Confirm Password
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            placeholder="Confirm new password"
                                                            className="rounded-[10px] h-12 bg-white border-[#D1D5DB]"
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

                    <button
                        type="button"
                        onClick={passwordForm.handleSubmit(onPasswordSubmit)}
                        className="w-fit px-10 tracking-wider shadow-md my-4 bg-[#111827] text-white text-[12px] py-2.5 rounded-[10px] font-manrope font-extrabold"
                    >
                        Update Password
                    </button>
                </div>
            </div>

        </section>
    )
}

export default UserForm
