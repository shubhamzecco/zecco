"use client";

import { App_url } from "@/constant/static";
import { ArrowLeft, House } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AuthImageLayoutProps {
  children: React.ReactNode;
  bottomContent?: React.ReactNode;
  heading?: string;
  description?: string;
  backToHome?: boolean;
}

export default function AuthLayout({
  children,
  bottomContent,
  heading,
  description,
  backToHome,
}: AuthImageLayoutProps) {
  return (
    <section className="min-h-screen w-full bg-white lg:h-screen lg:p-10">
      <div className="flex h-full items-center gap-10">
        <div className="w-[53%] hidden lg:block relative h-full">
          <Image
            src={App_url.image.sign_up_image}
            alt="Auth"
            className="h-full w-full object-cover rounded-[40px]"
            width={1200}
            height={1600}
            priority
            unoptimized
          />
          <div className="absolute inset-0 rounded-[40px] bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute top-7 left-7 z-30 bg-white/20 border border-white/30 rounded-full px-3 py-2 flex items-center gap-2">
            <div className="bg-white/40 p-1 w-7 h-7 rounded-lg flex items-center justify-center">
              <House className="text-white" size={18} />
            </div>
            <span className="font-inter font-semibold text-white tracking-wider">
              Real Estate
            </span>
          </div>
        </div>

        {/* FORM PANEL — responsive: glass card on mobile, white panel on desktop */}
        <div className="relative w-full lg:w-[40%] h-screen flex items-center justify-center ">
          {/* MOBILE/TABLET: Full-screen background image behind the card */}
          <div
            className="absolute inset-0 bg-cover bg-center lg:hidden"
            style={{
              backgroundImage: `url('${App_url.image.sign_up_image}')`,
            }}
          />
          {/* <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50 lg:hidden" /> */}

          {/* GLASS CARD (mobile/tablet) / WHITE PANEL (desktop) */}
          <div
            className="
              relative z-10
              w-[92%] max-w-[420px] max-h-[90vh] overflow-y-auto
              lg:w-full lg:max-w-none lg:h-full lg:overflow-visible
              rounded-3xl lg:rounded-none
              lg:flex justify-center
              border border-white/30 lg:border-none
              bg-white/20 backdrop-blur-xl lg:bg-white lg:backdrop-blur-none
              shadow-[0_8px_32px_rgba(0,0,0,0.25)] lg:shadow-none
              p-6 lg:p-10
              flex flex-col
              lg:py-10
            "
          >
            {/* Logo */}
            <div className="flex justify-center cursor-pointer mb-4 lg:mb-0">
              <Link href="/">
                <Image
                  src={App_url.image.logo}
                  alt="logo"
                  width={150}
                  height={150}
                  unoptimized
                />
              </Link>
            </div>

            {/* Heading */}
            <div className="text-center my-3 lg:mb-4">
              <h1 className="font-inter font-bold text-white lg:text-[#101828] text-xl lg:text-2xl lg:capitalize">
                {heading}
              </h1>
              {description && (
                <p className="font-inter font-medium text-white/80 lg:text-[#6B7280] text-sm lg:text-base mt-1 lg:capitalize">
                  {description}
                </p>
              )}
            </div>

            {/* Form content — rendered once */}
            <div className="max-lg:flex-1 lg:flex lg:flex-col overflow-y-auto lg:overflow-visible">
              {children}
            </div>

            {bottomContent && <div className="mt-4 lg:mt-6">{bottomContent}</div>}

            {backToHome && (
              <div className="mt-4 flex justify-center">
                <Link
                  href={App_url.link.INITIAL_URL}
                  className="flex items-center gap-2 font-inter font-medium text-white/80 lg:text-heading_text_color text-sm lg:text-md hover:text-white lg:hover:text-heading_text_color transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back to Home
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
