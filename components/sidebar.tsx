"use client";

import { App_url } from "@/constant/static";
import {
    Archive,
    Heart,
    LayoutGrid,
    MessageSquare,
    MessagesSquare,
    Search,
    Sparkles
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    { name: "Favorites", href: "/favorites", icon: Heart },
    { name: "Account / Package", href: "/account", icon: Archive },
    { name: "Saved Searches", href: "/saved-searches", icon: Search },
    { name: "Messages", href: "/messages", icon: MessagesSquare },
    { name: "All Insights", href: "/insights", icon: Sparkles },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-full h-screen bg-white pl-14 px-10 py-6 mb-40 flex flex-col">
            {/* Profile */}
            <div className="flex items-center gap-3 border-b border-[#E2E9E0] pb-5 mt-8 mb-5">
                <Image
                    src={App_url.image.profile}
                    alt="User"
                    width={50}
                    height={50}
                    className="rounded-full"
                />
                <div>
                    <p className="text-lg font-manrope font-semibold text-[#111827] leading-tight">
                        Mr. Robbert
                    </p>
                    <p className="text-md font-manrope font-medium text-[#A19F9F]">
                        mr.robbert@appristine.in
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex font-manrope text-[1rem] font-semibold items-center gap-3 px-4 py-2.5 rounded-full  transition
                ${isActive
                                    ? "bg-[#2563EB] text-white"
                                    : "text-[#111827] hover:bg-[#F3F4F6]"
                                }
              `}
                        >
                            <Icon size={23} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Agent Card */}
            <div className="mt-auto pt-8">
                <p className=" font-inter text-lg whitespace-nowrap font-semibold text-[#111827] mb-3">
                    Appointed Real Estate Agent
                </p>

                <div className="bg-gradient-to-br from-[#E9EBEF] to-[#E9EBEF] rounded-2xl p-4 text-center">
                    <div className="border-2 border-white rounded-full w-16 h-16 mx-auto mb-4">
                        <Image
                            src={App_url.image.profile}
                            alt="Agent"
                            width={60}
                            height={60}
                            className="rounded-full mx-auto mb-2"
                        />
                    </div>
                    <p className="text-[15px] font-inter  font-semibold text-[#101828] my-1">
                        John Wick
                    </p>
                    <p className="text-[14px] font-inter font-semibold text-[#101828] my-1">
                        +34 612 345 678
                    </p>
                    <p className="text-[14px] font-inter font-semibold text-[#101828] my-1">
                        Website: <span className="underline cursor-pointer">zecco.es</span>
                    </p>
                    <button className="w-fit px-16 tracking-wider shadow-md my-4 bg-[#111827] text-white text-[15px] py-2.5 rounded-full font-medium">
                        Contact
                    </button>
                </div>
            </div>
        </aside>
    );
}
