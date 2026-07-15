import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ProfileAvatar from "../profile";
import { App_url } from "@/constant/static";
import { Globe, Phone } from "lucide-react";

function AgentCard() {
    const router = useRouter();
    const { user_data } = usePosterReducers();
    return (
        <>
            <div className="bg-white rounded-2xl p-4 text-center">
                <div className="flex items-start gap-1">
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
                    <div className="">
                        <p className="text-[15px] text-left font-manrope font-semibold text-[#101828] mt-2">
                            {user_data?.user?.agent?.agent?.first_name +
                                " " +
                                user_data?.user?.agent?.agent?.last_name}
                        </p>
                        <p className="text-[15px] font-manrope font-medium text-[#64748B] my-1">Marbella Real Estate</p>
                    </div>
                </div>
                <div className="px-4">
                    <p className="text-[14px] flex items-center gap-1 font-manrope font-semibold text-[#1A1C1E] my-1">
                        <Phone className="w-4 h-4" />  {user_data?.user?.agent?.agent?.contact_no}
                    </p>
                    <p className="text-[14px] mt-3 flex items-center gap-1 font-manrope font-semibold text-[#1A1C1E] my-1">
                        <Globe className="w-4 h-4" />  <span className="underline cursor-pointer">zecco.es</span>
                    </p>
                    <div className="text-[#22C55E] text-xs mt-3 w-fit px-3 rounded-md py-1 bg-[#22C55E15] uppercase font-manrope font-bold tracking-wider">
                        Verified Agent
                    </div>
                    <button
                        onClick={() => router.push(App_url.link.CONTACT_US)}
                        className="relative w-full mt-4 my-5 py-3.5 px-10 rounded-[10px] bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] text-white text-sm font-manrope font-extrabold shadow-md disabled:opacity-50"
                    >
                        Contact Agent
                    </button>
                </div>
            </div>
        </>
    );
}

export default AgentCard