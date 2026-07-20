import { URL } from "@/api/rest/fetchData";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProfileAvatar from "../profile";
import CommonCard from "./common-card";

function AgentCard() {
    const { user_data } = usePosterReducers();
    return (
        <>
            <CommonCard className="max-2xl:p-3.5">
                <div className="flex items-start gap-1">
                    <div className="rounded-full w-16 h-16">
                        <div className="relative overflow-hidden border-2 border-white rounded-full w-16 h-16 mb-1">
                            {user_data?.user?.agent?.agent?.profile_image ? (
                                <Image
                                    src={URL + (user_data?.user?.agent?.agent?.profile_image ?? "")}
                                    alt="Agent"
                                    fill
                                    priority
                                    className="object-cover"
                                />
                            ) : (
                                <ProfileAvatar
                                    name={`${user_data?.user?.agent?.agent?.first_name + " " + user_data?.user?.agent?.agent?.last_name}`}
                                    className="rounded-full w-full h-full !text-2xl border-4 border-[#EFF6FF] !text-white !bg-[#2563EB]"
                                />
                            )}
                        </div>
                    </div>
                    <div className="flex lg:flex-col 2xl:flex-row items-start justify-between w-full">
                        <div className=" ml-1">
                            <p className="text-[15px] text-left font-manrope font-semibold text-[#101828] mt-2">
                                {user_data?.user?.agent?.agent?.first_name +
                                    " " +
                                    user_data?.user?.agent?.agent?.last_name}
                            </p>
                            <p className="text-[15px] font-manrope font-medium text-[#64748B] my-1">Marbella Real Estate</p>
                        </div>
                        <div className="text-[#22C55E]  hidden 2xl:block text-xs mt-2 w-fit px-3 rounded-md py-1 bg-[#22C55E15] uppercase font-manrope font-bold tracking-wider">
                            Verified Agent
                        </div>
                    </div>
                </div>
                <div className=" ">
                    <div className="bg-[#edf0f7] p-2 my-2 rounded-2xl">
                        <p className="text-[14px] flex items-center gap-1 font-manrope font-semibold text-[#1A1C1E] my-1">
                            <Phone className="w-6 h-6 border-r border-gray-300 pr-2 mr-1" />  {user_data?.user?.agent?.agent?.contact_no}
                        </p>
                        <Link
                            href={`mailto:${user_data?.user?.agent?.agent?.email ?? ""}`}
                            className="text-[14px] mt-3 flex items-center gap-1 font-manrope font-semibold text-[#1A1C1E] my-1"
                        >
                            <Mail className="w-6 h-6 border-r border-gray-300 pr-2 mr-1" />
                            <span className="underline">
                                {user_data?.user?.agent?.agent?.email}
                            </span>
                        </Link>
                    </div>
                    <div className="text-[#22C55E] 2xl:hidden block text-xs mt-2 w-fit px-3 rounded-md py-1 bg-[#22C55E15] uppercase font-manrope font-bold tracking-wider">
                        Verified Agent
                    </div>
                    <button
                        onClick={() => window.location.href = `tel:${user_data?.user?.agent?.agent?.contact_no}`}
                        className="relative w-full mt-4 my-5 py-3.5 px-10 rounded-2xl bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] text-white text-sm font-manrope font-extrabold shadow-md disabled:opacity-50"
                    >
                        Contact Agent
                    </button>
                </div>
            </CommonCard>
        </>
    );
}

export default AgentCard