"use client";

import { useState } from "react";
import { App_url } from "@/constant/static";
import {
  Archive,
  Heart,
  LayoutGrid,
  MessagesSquare,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import ProfileAvatar from "./profile";
import { URL } from "@/api/rest/fetchData";

const menuItems = [
  { name: "Dashboard", href: App_url.link.DASHBOARD, icon: LayoutGrid },
  { name: "Favorites", href: App_url.link.FAVORITES, icon: Heart },
  {
    name: "Account / Package",
    href: App_url.link.ACCOUNT_PACKAGE,
    icon: Archive,
  },
  { name: "Saved Searches", href: App_url.link.SAVED_SEARCHES, icon: Search },
  { name: "Chat with Agent", href: App_url.link.MESSAGE, icon: MessagesSquare },
  { name: "AI Insights", href: App_url.link.AI_INSIGHTS, icon: Sparkles },
];
type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user_data } = usePosterReducers();
  return (
    <>
      <aside className="hidden md:flex w-full max-md:h-[calc(100vh-50px)] bg-white pl-14 px-10 py-6 flex-col overflow-y-scroll hide-scrollbar">
        <div className="flex items-center gap-3 border-b border-[#E2E9E0] pb-5 mt-1 mb-5">
          {user_data?.user?.profile_image ? (
            <Image
              src={URL + user_data?.user?.profile_image}
              alt="Profile"
              width={70}
              height={70}
              className="rounded-full object-cover w-12 h-12"
            />
          ) : (
            <>
              <ProfileAvatar
                name={`${user_data?.user?.first_name + " " + user_data?.user?.last_name}`}
                className="!w-12 !h-12 !text-2xl border-4 border-[#EFF6FF] !text-white !bg-[#2563EB]"
              />
            </>
          )}
          <div>
            <p className="text-md font-manrope font-semibold text-[#111827] leading-tight">
              {user_data?.user?.first_name + " " + user_data?.user?.last_name}
            </p>
            <p className="text-sm font-manrope font-medium text-[#A19F9F]">
              {user_data?.user?.email}
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
                className={`flex font-manrope text-[0.9rem] font-semibold items-center gap-3 px-4 py-2.5 rounded-full transition
                  ${isActive
                    ? "bg-[#2563EB] text-white"
                    : "text-[#111827] hover:bg-[#F3F4F6]"
                  }`}
              >
                <Icon size={23} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Agent Card */}
        <div className="mt-auto pt-8">
          {user_data?.user?.agent?.agent && <AgentCard />}
        </div>
      </aside>

      <div
        className={`md:hidden fixed inset-0 z-40 mb-28  transition ${isOpen ? "visible" : "invisible"
          }`}
      >
        <div
          onClick={onClose}
          className={`absolute inset-0  transition-opacity ${isOpen ? "opacity-100" : "opacity-0"
            }`}
        />
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute right-0 bottom-0 top-[4.4rem] w-[85%] mb-28 min-h-[100vh] overflow-y-scroll max-w-sm bg-white shadow-xl transition-transform duration-300
            ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              {user_data?.user?.profile_image ? (
                <Image
                  src={URL + user_data?.user?.profile_image}
                  alt="Profile"
                  width={70}
                  height={70}
                  className="rounded-full object-cover w-12 h-12"
                />
              ) : (
                <>
                  <ProfileAvatar
                    name={`${user_data?.user?.first_name + " " + user_data?.user?.last_name}`}
                    className="!w-12 !h-12 !text-2xl border-4 border-[#EFF6FF] !text-white !bg-[#2563EB]"
                  />
                </>
              )}
              <div>
                <p className="text-sm font-manrope font-semibold text-[#111827]">
                  {user_data?.user?.first_name + " " + user_data?.user?.last_name}
                </p>
                <p className="text-xs font-manrope font-medium text-[#A19F9F]">
                  {user_data?.user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="p-6 flex flex-col h-full">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={`flex font-manrope text-[0.9rem] font-semibold items-center gap-3 px-4 py-2.5 rounded-full transition
                      ${isActive
                        ? "bg-[#2563EB] text-white"
                        : "text-[#111827] hover:bg-[#F3F4F6]"
                      }`}
                  >
                    <Icon size={23} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Agent Card */}
            <div className="mt-auto pt-8">
              {user_data?.user?.agent?.agent && <AgentCard />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ================= AGENT CARD (UNCHANGED) ================= */
function AgentCard() {
  const router = useRouter();
  const { user_data } = usePosterReducers();
  return (
    <>
      <p className="font-inter max-md:text-md text-[0.95rem] font-semibold text-[#111827] mb-3">
        Appointed Real Estate Agent
      </p>

      <div className="bg-gradient-to-br from-[#E9EBEF] to-[#E9EBEF] rounded-2xl p-4 text-center">
        <div className="relative overflow-hidden border-2 border-white rounded-full w-16 h-16 mx-auto mb-4">
          {user_data?.user?.agent?.agent?.profile_image ? (<Image
            src={URL + (user_data?.user?.agent?.agent?.profile_image ?? "")}
            alt="Agent"
            fill
            priority
            className="object-cover"
          />) : (
            <>
              <ProfileAvatar
                name={`${user_data?.user?.agent?.agent?.first_name+ " " + user_data?.user?.agent?.agent?.last_name}`}
                className="!w-12 !h-12 !text-2xl border-4 border-[#EFF6FF] !text-white !bg-[#2563EB]"
              />
            </>
          )}
        </div>
        <p className="text-[15px] font-inter font-semibold text-[#101828] my-1">
          {user_data?.user?.agent?.agent?.first_name +
            " " +
            user_data?.user?.agent?.agent?.last_name}
        </p>
        <p className="text-[14px] font-inter font-semibold text-[#101828] my-1">
          {user_data?.user?.agent?.agent?.contact_no}
        </p>
        <p className="text-[14px] font-inter font-semibold text-[#101828] my-1">
          Website: <span className="underline cursor-pointer">zecco.es</span>
        </p>
        <button
          onClick={() => router.push(App_url.link.CONTACT_US)}
          className="w-fit px-16 tracking-wider shadow-md my-4 bg-[#111827] text-white text-[15px] py-2.5 rounded-full font-medium"
        >
          Contact
        </button>
      </div>
    </>
  );
}
