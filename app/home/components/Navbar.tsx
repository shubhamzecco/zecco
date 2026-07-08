"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, User, UserPlus, X } from "lucide-react";
import Image from "next/image";
import { App_url } from "@/constant/static";
import { usePathname, useRouter } from "next/navigation";
import { NAV_ITEMS } from "@/utils/common";
import { useDispatch } from "react-redux";
import { setReduxClear } from "@/redux/modules/main/action";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import ImageDropdown from "@/components/ui/image-dropdown";
import { setAuthData } from "@/redux/modules/common/user_data/action";
import { setLogout } from "@/redux/actions/action";
import { toast } from "react-toastify";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const { user_data } = usePosterReducers();

  const isActive = (href: string) => {
    if (href === "#") return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    setMounted(true);
  }, [])

  const handleNavClick = (item: any) => {
    router.push(item?.href);
  };

  return (
    <nav className="absolute top-7 left-0 w-full z-50">
      {/* Top Bar */}
      <div className="sm:mx-5 px-4 sm:px-6 lg:px-8">
        {/* <div className="bg-white/20 border border-white/70 rounded-full"> */}
          <div className="bg-[#e3dfdf5c] border border-[#b8dbf7] rounded-full">
          <div className="max-sm:grid grid-cols-2 lg:grid sm:flex justify-between lg:grid-cols-[1fr_auto_1fr] items-center w-full h-[3.2rem] px-4">
            <Link href="/" className="flex items-center gap-2 w-[25%]">
              <Image
                src={App_url.image.chat_logo}
                alt="logo"
                width={35}
                height={35}
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {NAV_ITEMS?.map((item) => (
                <button
                  key={item?.label}
                  onClick={() => handleNavClick(item)}
                  className={`relative ${isActive(item?.href) ? "text-[#1466EC]" : "text-[#0B5394]"} font-inter text-sm font-medium`}
                >
                  {item?.label}
                  {isActive(item?.href) && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-[3px] w-5 bg-[#1466EC] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Desktop Buttons */}
            {mounted ? (
              user_data?.user ? (
                <div className="hidden lg:flex justify-end items-center gap-2">
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
                          toast.success("Logout successfully");
                        },
                      },
                    ]}
                  />
                </div>
              ) : (
                <div className="hidden lg:flex justify-end items-center gap-2">
                  <Link
                    href={App_url.link.SIGN_IN}
                    className="px-5 py-2 text-sm flex items-center gap-2"
                  >
                    <User className="w-5 h-5" /> Login
                  </Link>

                  <Link
                    href={App_url.link.SIGN_UP}
                    className="px-5 py-2 text-sm text-white bg-[#136AED] rounded-full flex items-center gap-2"
                  >
                    <UserPlus className="w-5 h-5" /> Registration
                  </Link>
                </div>
              )
            ) : (
              <div className="hidden md:flex justify-end items-center gap-2">
                {/* keep markup stable until client mounts */}
              </div>
            )}

            {/* Mobile Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden max-md:flex justify-end items-center p-2 rounded-lg text-gray-700"
              aria-label="close"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Mobile Menu (OUTSIDE rounded container) */}
      <div
        className={`lg:hidden mx-4 mt-3 bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {NAV_ITEMS?.map((item) => (
          <button
            key={item?.label}
            onClick={() => {
              handleNavClick(item);
              setIsOpen(false);
            }}
            className={`block relative w-full text-left px-5 py-3 space-y-2 ${isActive(item?.href) ? "text-[#0B5394]" : "text-gray-800"}  font-inter text-sm font-medium`}
          >
            {item?.label}
          </button>
        ))}

        {user_data?.user ? (
          <div className="border-t px-5 py-3 space-y-2">
            <Link href={App_url.link.DASHBOARD} className="block text-gray-700">
              Dashboard
            </Link>
          </div>
        ) : (
          <div className="border-t px-5 py-3 space-y-2">
            <Link href={App_url.link.SIGN_IN} className="block text-gray-700">
              Login
            </Link>
            <Link
              href={App_url.link.SIGN_UP}
              className="block text-sky_blue_color font-medium"
            >
              Registration
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
