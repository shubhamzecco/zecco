'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, House } from 'lucide-react'
import { App_url } from '@/constant/static'

interface AuthImageLayoutProps {
  children: React.ReactNode
  bottomContent?: React.ReactNode
}

export default function AuthLayout({ children, bottomContent }: AuthImageLayoutProps) {
  return (
    <section className="h-screen overflow-hidden bg-white lg:p-10 w-full">
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

        <div className="w-full lg:w-[40%] flex items-center">
          <div className="w-full max-w-[560px] mx-auto px-10  h-full ">
            <Image
              src={App_url.image.logo}
              alt="logo"
              width={170}
              height={170}
              className="mb-2"
              unoptimized
            />

            {children}

            {bottomContent && (
              <div className="mt-6">{bottomContent}</div>
            )}
            <div className="mt-4 flex justify-center">
              <Link
                href={App_url.link.INITIAL_URL}
                className="w-full mx-auto flex justify-center items-center gap-2 font-inter font-medium text-heading_text_color text-md"
              >
                <ArrowLeft size={18} />
                Back to Home
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
