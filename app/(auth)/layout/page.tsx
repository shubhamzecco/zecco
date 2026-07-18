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
  backToHome?: boolean
}

export default function AuthLayout({
  children,
  bottomContent,
  heading,
  description,
  backToHome
}: AuthImageLayoutProps) {
  return (
    <section className="lg:h-screen h-screen overflow-hidden bg-white lg:p-10 w-full">
      <div className="flex h-full items-center gap-10">
        {/* LEFT IMAGE */}
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
        <div className="relative w-full lg:w-[40%] h-fit flex flex-col   max-md:py-10  max-md:rounded-xl">
          <div
            className="absolute inset-0 bg-center bg-cover opacity-20 md:hidden max-md:rounded-xl"
            style={{
              backgroundImage: "url('/assets/images/signup-image.png')",
            }}
          />
          <div className="absolute inset-0 bg-black/10 md:hidden max-md:rounded-xl" />

          <div className="relative z-10 w-full h-full px-10 flex flex-col max-md:justify-center">
            <div className="flex justify-center cursor-pointer">
              <Link href="/">
                <Image
                  src={App_url.image.logo}
                  alt="logo"
                  width={170}
                  height={170}
                  unoptimized
                />
              </Link>
            </div>
            <div className="mt-4 my-3 flex flex-col gap-2 text-center mb-4">
              <h1 className="capitalize font-inter font-bold text-[#101828] text-xl max-md:text-center lg:text-2xl">
                {heading}
              </h1>
              <p className="font-inter font-medium text-[#6B7280] capitalize max-md:text-center">
                {description}
              </p>
            </div>

            <div className="flex-1 lg:flex lg:flex-col lg:justify-center overflow-y-auto lg:overflow-visible">
              {children}
            </div>

            {bottomContent && <div className="mt-6">{bottomContent}</div>}

            {backToHome && (
              <div className="mt-2 flex justify-center">
                <Link
                  href={App_url.link.INITIAL_URL}
                  className="w-full mx-auto flex justify-center items-center gap-2 font-inter font-medium text-heading_text_color text-md"
                >
                  <ArrowLeft size={18} />
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
