"use client";

import { Button } from "@/components/ui/button";
import { App_url } from "@/constant/static";
import { X } from "lucide-react";
import Image from "next/image";

export default function CheckInboxModal({
  onClose,
  onReturn,
}: {
  onClose?: () => void;
  onReturn?: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm max-md:p-4">
      <div className="relative w-[420px] rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-b from-[#CFE0FF] via-[#EAF1FF] to-white px-10 pt-10 pb-16 text-center">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-500 shadow hover:bg-gray-100"
          >
            <X size={16} />
          </button>

          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md">
            <div className="flex h-8 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#172131] via-[#2C3E66] to-[#9FC4FF]">
              <Image
                src={App_url.image.email}
                alt="email"
                className=""
                width={25}
                height={20}
                unoptimized
              />
            </div>
          </div>

          <h2 className="text-xl font-bold font-manrope text-[#000] tracking-wide">
            CHECK YOUR INBOX
          </h2>
          <p className="mt-3 text-md font-instrument_sans font-normal text-text_gray_color leading-relaxed max-w-sm mx-auto">
            We've sent a magic link to your email address. Please click it to
            verify your account and start exploring properties.
          </p>
          <Button
            onClick={onReturn}
            className="mt-8 w-full font-instrument_sans rounded-full bg-[#136AED] h-12  py-3.5 text-sm font-normal tracking-wider text-white shadow-lg transition"
          >
            Return to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
}
