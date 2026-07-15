"use client";

import { URL } from "@/api/rest/fetchData";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import {
  Archive,
  CreditCard,
  Heart,
  House,
  LayoutGrid,
  LogOut,
  Logs,
  MessageCircle,
  MessagesSquare,
  Search,
  Sparkles,
  User
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ProfileAvatar from "./profile";
import { useDispatch } from "react-redux";
import { setLogout } from "@/redux/actions/action";
import { setAuthData } from "@/redux/modules/common/user_data/action";
import { setReduxClear } from "@/redux/modules/main/action";

const menuItems = [
  { name: "Dashboard", href: App_url.link.DASHBOARD, icon: House },
  { name: "My Profile", href: App_url.link.PROFILE, icon: User },
  { name: "Preferences", href: App_url.link.PREFERENCES, icon: Logs },
  { name: "Saved Properties", href: App_url.link.FAVORITES, icon: Heart },
  { name: "Saved Searches", href: App_url.link.SAVED_SEARCHES, icon: Search },
  { name: "AI Insights", href: App_url.link.AI_INSIGHTS, icon: Sparkles },
  { name: "Message", href: App_url.link.MESSAGE, icon: MessageCircle },
  {
    name: "Subscription",
    href: App_url.link.ACCOUNT_PACKAGE,
    icon: CreditCard,
  },
];
type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user_data } = usePosterReducers();
  const dispatch = useDispatch()
  const router = useRouter()
  return (
    <>
      <aside className="hidden lg:flex w-full max-md:h-[calc(100vh-50px)] bg-white px-6 py-6 rounded-3xl flex-col overflow-y-scroll hide-scrollbar shadow-xl">
        <div className="flex flex-col items-center gap-3 border-b border-[#E2E9E0] pb-5 mt-1 mb-5">
          {user_data?.user?.profile_image ? (
            <Image
              src={URL + user_data?.user?.profile_image}
              alt="Profile"
              width={70}
              height={70}
              className="rounded-full object-cover w-16 h-16"
            />
          ) : (
            <>
              <ProfileAvatar
                name={`${user_data?.user?.first_name + " " + user_data?.user?.last_name}`}
                className="!w-16 !h-16 !text-2xl border-4 border-[#EFF6FF] !text-white !bg-[#2563EB]"
              />
            </>
          )}
          <div className="text-center">
            <p className="text-md font-manrope font-semibold text-[#111827] leading-tight">
              {user_data?.user?.first_name + " " + user_data?.user?.last_name}
            </p>
            <p className="text-sm font-manrope font-medium text-[#A19F9F]">
              {user_data?.user?.email}
            </p>
          </div>
          <div className="text-sm font-manrope font-semibold text-[#2F80FF] leading-tight">
            <h2>Premium Member</h2>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex font-manrope text-[0.9rem] font-semibold items-center gap-3 px-4 py-3 rounded-2xl transition
                  ${isActive
                    ? "bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] text-white shadow-lg shadow-blue-100"
                    : "text-[#64748B] hover:bg-[#F3F4F6]"
                  }`}
              >
                <Icon size={23} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="mt-2">
          <button
            onClick={() => {
              dispatch(setLogout());
              localStorage.clear();
              dispatch(setAuthData({} as any));
              dispatch(setReduxClear());
              router.push(App_url.link.INITIAL_URL);
            }}
            className="group w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-600" />
            <span className="text-sm font-medium text-red-500 group-hover:text-red-600">
              Logout
            </span>
          </button>
        </div>

        {/* Agent Card */}
        {/* <div className="mt-auto pt-8">
          {user_data?.user?.agent?.agent && <AgentCard />}
        </div> */}
      </aside>

      <div
        className={`lg:hidden fixed inset-0 z-40 mb-28  transition ${isOpen ? "visible" : "invisible"
          }`}
      >
        <div
          onClick={onClose}
          className={`absolute inset-0  transition-opacity ${isOpen ? "opacity-100" : "opacity-0"
            }`}
        />
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute right-0 bottom-0 top-[4.4rem] w-[85%] mb-28  min-h-[100vh] overflow-y-scroll max-w-sm bg-white shadow-xl transition-transform duration-300
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
                  {user_data?.user?.first_name +
                    " " +
                    user_data?.user?.last_name}
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
              {menuItems?.map((item) => {
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
            <div className="p-4 max-lg:py-0  hidden max-lg:block">
              <button
                onClick={() => {
                  dispatch(setLogout());
                  localStorage.clear();
                  dispatch(setAuthData({} as any));
                  dispatch(setReduxClear());
                  router.push(App_url.link.INITIAL_URL);
                }}
                className="group w-full flex items-center gap-3  py-2 rounded transition-colors hover:bg-red-50"
              >
                <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-600" />
                <span className="text-sm font-medium text-red-500 group-hover:text-red-600">
                  Logout
                </span>
              </button>
            </div>
            {/* <div className="lg:mt-auto pt-8 max-sm:pb-36">
              {user_data?.user?.agent?.agent && <AgentCard />}
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
