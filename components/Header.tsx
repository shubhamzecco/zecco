"use client";

import { App_url } from "@/constant/static";
import { setLogout } from "@/redux/actions/action";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setAuthData } from "@/redux/modules/common/user_data/action";
import {
  clearBreadcrumbs,
  setAiInsight,
  setBreadcrumbs,
  setPropertyFilter,
  setReduxClear,
} from "@/redux/modules/main/action";
import { IPropertyResponse } from "@/redux/modules/main/types";
import { NAV_ITEMS } from "@/utils/common";
import { Menu, User, UserPlus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import ImageDropdown from "./ui/image-dropdown";

type HeaderProps = {
  onProfileClick?: () => void;
};

export default function Header({ onProfileClick }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const { user_data } = usePosterReducers();

  const isActive = (href: string) => {
    if (href === "#") return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleNavClick = (item: any) => {
    dispatch(clearBreadcrumbs());
    dispatch(setPropertyFilter({}));
    dispatch(setAiInsight({} as IPropertyResponse));
    if (item.breadcrumbs) dispatch(setBreadcrumbs(item.breadcrumbs));
    router.push(item.href);
    setIsOpen(false); // ✅ close menu on click
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white w-full shadow-sm">
        <div className="lg:mx-7 px-4 sm:px-6 lg:px-8 border border-white/70 rounded-full backdrop-blur-md">
          <div className="grid grid-cols-2 lg:grid-cols-[1fr_auto_1fr] items-center w-full h-[4rem] mt-3">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={App_url.image.chat_logo}
                alt="logo"
                width={35}
                height={35}
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8 w-full">
              {NAV_ITEMS?.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className={`relative ${isActive(item.href) ? "text-[#1466EC]" : "text-[#0B5394]"}  font-inter text-sm font-medium`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-[3px] w-5 bg-[#1466EC] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Desktop Buttons */}
            {user_data?.user ? (
              <div className="hidden md:flex justify-end items-center gap-2">
                <ImageDropdown
                  name={user_data?.user?.first_name}
                  avatar={App_url.image.image_1}
                  onNavigate={(path) => router.push(path)}
                  items={[
                    { label: "Profile", path: App_url?.link.PROFILE },
                    { label: "Dashboard", path: App_url.link.DASHBOARD },
                    {
                      label: "Logout",
                      onClick: () => {
                        dispatch(setLogout());
                        localStorage.clear();
                        dispatch(setAuthData({} as any));
                        dispatch(setReduxClear());
                        router.push(App_url.link.INITIAL_URL);
                      },
                    },
                  ]}
                />
              </div>
            ) : (
              <div className="hidden md:flex justify-end items-center gap-3 -mr-3">
                <Link
                  href={App_url.link.SIGN_IN}
                  className="px-5 py-3 text-sm font-medium flex items-center gap-2"
                >
                  <User className="w-5 h-5" /> Login
                </Link>

                <Link
                  href={App_url.link.SIGN_UP}
                  className="px-5 py-2 text-sm font-medium text-white bg-sky_blue_color rounded-full flex items-center gap-2"
                >
                  <UserPlus className="w-5 h-5" /> Registration
                </Link>
              </div>
            )}

            <div className="flex items-center max-md:justify-end  gap-3">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden max-md:flex justify-end items-center p-2 rounded-lg text-gray-700"
                aria-label="menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* {
              (pathname === App_url.link.DASHBOARD || pathname === App_url.link.FAVORITES || pathname === App_url.link.ACCOUNT_PACKAGE
                || pathname === App_url.link.SAVED_SEARCHES || pathname === App_url.link.MESSAGE || pathname === App_url.link.AI_INSIGHTS) && ( */}
              <button
                onClick={onProfileClick}
                className="md:hidden w-10 h-10 rounded-full overflow-hidden border"
                aria-label="profile"
              >
                <Image
                  src={App_url.image.profile}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </button>
              {/* )} */}
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed top-[5.5rem] left-0 right-0 z-40 md:hidden bg-white shadow-lg transition-all duration-300 overflow-hidden
        ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-6 py-4 space-y-4">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item)}
              className={`block relative w-full text-left ${isActive(item.href) ? "text-[#0B5394]" : "text-gray-800"}  font-inter text-sm font-medium`}
            >
              {item.label}
            </button>
          ))}

          {user_data?.access_token ? (
            <div className="hidden md:flex justify-end items-center gap-2">
              <ImageDropdown
                name={user_data?.user?.first_name ?? ""}
                avatar={App_url.image.image_1}
                onNavigate={(path) => router.push(path)}
                items={[
                  { label: "Profile", path: App_url?.link.PROFILE },
                  { label: "Dashboard", path: App_url.link.DASHBOARD },
                  {
                    label: "Logout",
                    onClick: () => {
                      dispatch(setLogout());
                      localStorage.clear();
                      dispatch(setAuthData({} as any));
                      dispatch(setReduxClear());
                      router.push(App_url.link.INITIAL_URL);
                    },
                  },
                ]}
              />
            </div>
          ) : (
            <div className="border-t pt-4 space-y-3">
              <Link
                href={App_url.link.SIGN_IN}
                className="block text-gray-700 font-inter text-sm"
              >
                Login
              </Link>
              <Link
                href={App_url.link.SIGN_UP}
                className="block text-sky_blue_color text-sm font-inter font-semibold"
              >
                Registration
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
