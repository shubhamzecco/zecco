"use client";

import { URL } from "@/api/rest/fetchData";
import { App_url } from "@/constant/static";
import { setLogout } from "@/redux/actions/action";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setAuthData } from "@/redux/modules/common/user_data/action";
import { setReduxClear } from "@/redux/modules/main/action";
import {
  CreditCard,
  Filter,
  Gem,
  Heart,
  Home,
  LogOut,
  MessageCircle,
  MoreHorizontal,
  Search,
  SlidersVertical,
  Sparkles,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import ProfileAvatar from "./profile";
import { useEffect, useRef, useState } from "react";

const allMenuItems = [
  { name: "Dashboard", href: App_url.link.DASHBOARD, icon: Home },
  { name: "My Profile", href: App_url.link.PROFILE, icon: User },
  { name: "Preferences", href: App_url.link.PREFERENCES, icon: SlidersVertical },
  { name: "Saved Properties", href: App_url.link.FAVORITES, icon: Heart },
  { name: "Saved Searches", href: App_url.link.SAVED_SEARCHES, icon: Search },
  { name: "AI Insights", href: App_url.link.AI_INSIGHTS, icon: Sparkles },
  { name: "Message", href: App_url.link.MESSAGE, icon: MessageCircle },
  { name: "Subscription", href: App_url.link.ACCOUNT_PACKAGE, icon: CreditCard },
];

const mobileMenu = [
  { name: "Dashboard", href: App_url.link.DASHBOARD, icon: Home },
  { name: "Preferences", href: App_url.link.PREFERENCES, icon: SlidersVertical },
  { name: "Properties", href: App_url.link.FAVORITES, icon: Heart },
  { name: "Searches", href: App_url.link.SAVED_SEARCHES, icon: Search },
  { name: "AI Insights", href: App_url.link.AI_INSIGHTS, icon: Sparkles },
  { name: "Message", href: App_url.link.MESSAGE, icon: MessageCircle },
  { name: "Subscription", href: App_url.link.ACCOUNT_PACKAGE, icon: CreditCard },
  { name: "My Profile", href: App_url.link.PROFILE, icon: User },
];

// Mobile: 3 main items + "More" overflow
const mobilePrimary = mobileMenu.slice(0, 4);
const mobileOverflow = mobileMenu.slice(4);

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  desktopOnly?: boolean;
  mobileOnly?: boolean;
};

export default function Sidebar({ isOpen, onClose, desktopOnly, mobileOnly }: SidebarProps) {
  const pathname = usePathname();
  const { user_data } = usePosterReducers();
  const dispatch = useDispatch();
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setShowMore(false);
      }
    };
    if (showMore) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMore]);

  const handleLogout = () => {
    dispatch(setLogout());
    localStorage.clear();
    dispatch(setAuthData({} as any));
    dispatch(setReduxClear());
    router.push(App_url.link.INITIAL_URL);
  };

  return (
    <>
      {/* ===== DESKTOP SIDEBAR ===== */}
      {!mobileOnly && (
        <aside className="hidden lg:flex w-full max-md:h-[calc(100vh-50px)] bg-white px-6 py-6 rounded-3xl flex-col overflow-y-scroll hide-scrollbar border shadow-xl">
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
              <ProfileAvatar
                name={`${user_data?.user?.first_name} ${user_data?.user?.last_name}`}
                className="!w-16 !h-16 !text-2xl border-4 border-[#EFF6FF] !text-white !bg-[#2563EB]"
              />
            )}
            <div className="text-center">
              <p className="text-md font-manrope font-semibold text-[#111827] leading-tight">
                {user_data?.user?.first_name} {user_data?.user?.last_name}
              </p>
              <p className="text-sm font-manrope font-medium text-[#A19F9F]">
                {user_data?.user?.email}
              </p>
            </div>
            <div className={`text-xs font-manrope shadow-md shadow-black/30 font-semibold leading-tight ${Number(user_data?.user?.package?.price) > 0 ? 'bg-gradient-to-r from-[#D4AF37] via-[#F7E27D] to-[#C99700] text-black' : 'bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF]  text-white '}  rounded-full px-3 py-1`}>
              <h2 className="flex items-center gap-1">
                <Gem className="w-5 h-5"/>
                {Number(user_data?.user?.package?.price) > 0
                  ? "Premium Member"
                  : "Standard Member"}
              </h2>
            </div>
          </div>

          <nav className="space-y-2">
            {allMenuItems?.map((item) => {
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
              onClick={handleLogout}
              className="group w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors hover:bg-red-50"
            >
              <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-600" />
              <span className="text-sm font-medium text-red-500 group-hover:text-red-600">
                Logout
              </span>
            </button>
          </div>
        </aside>
      )}

      {/* ===== MOBILE BOTTOM NAV (max-md) ===== */}
      {!desktopOnly && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-around px-2 py-2">
            {mobilePrimary.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all min-w-[64px]
                  ${isActive
                      ? "text-[#2563EB]"
                      : "text-[#94A3B8] hover:text-[#64748B]"
                    }`}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-manrope font-semibold leading-none">
                    {item.name}
                  </span>
                </Link>
              );
            })}

            {/* More button */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setShowMore(!showMore)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all min-w-[64px]
                ${showMore
                    ? "text-[#2563EB] bg-[#EFF6FF]"
                    : "text-[#94A3B8] hover:text-[#64748B]"
                  }`}
              >
                <MoreHorizontal size={22} strokeWidth={2} className="rotate-90" />
                <span className="text-[10px] font-manrope font-semibold leading-none">
                  More
                </span>
              </button>

              {/* Popup */}
              {showMore && (
                <div className="absolute bottom-full right-0 mb-3 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  {mobileOverflow.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setShowMore(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm font-manrope font-semibold transition
                        ${isActive
                            ? "text-[#2563EB] bg-[#EFF6FF]"
                            : "text-[#111827] hover:bg-[#F3F4F6]"
                          }`}
                      >
                        <Icon size={18} />
                        {item.name}
                      </Link>
                    );
                  })}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setShowMore(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-manrope font-semibold text-red-500 hover:bg-red-50 w-full"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      )}

      {/* ===== TABLET BOTTOM NAV (md to lg) ===== */}
      {!desktopOnly && (
        <nav className="hidden md:flex lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-around w-full px-2 py-2">
            {mobileMenu.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all
                  ${isActive
                      ? "text-[#2563EB]"
                      : "text-[#94A3B8] hover:text-[#64748B]"
                    }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[9px] font-manrope font-semibold leading-none whitespace-nowrap">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
