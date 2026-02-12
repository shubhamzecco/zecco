'use client'

import { App_url } from '@/constant/static'
import { Phone, Mail } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export function AgentCard() {
  const [contactMessage, setContactMessage] = useState('')

  return (
    <div className="sticky top-24 bg-[#F7F8FC] border border-[#F3F4F6] rounded-lg p-6 mb-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold">
          <Image
            src={App_url.image.profile}
            alt="Agent Profile"
            width={44}
            height={44}
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <p className="text-xs text-[#64748B] font-manrope font-extrabold">Your appointed real estate agent</p>
          <p className="font-extrabold text-sm text-heading_text_color font-manrope ">Walter Haus Madrid</p>
        </div>
      </div>
      <p className="text-sm text-heading_text_color font-inter mb-4 flex items-center gap-2">
        <Phone className="w-4 h-4" /> +44 7123 456789
      </p>
      <p className="text-sm text-heading_text_color font-inter mb-4 flex items-center gap-2">
        <Mail className="w-4 h-4" /> johnsingh@gamil.com
      </p>
      <div className="mb-4">
        <p className="text-lg font-semibold font-manrope text-heading_text_color mb-3">Ask to real estate agent</p>
        <textarea
          value={contactMessage}
          onChange={(e) => setContactMessage(e.target.value)}
          placeholder="State your strategic interest for personal acquisition..."
          className="w-full p-3 border border-border rounded-lg placeholder:font-manrope placeholder:font-medium placeholder:text-[#64748B] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          rows={4}
        />
      </div>
      <button className="w-full bg-heading_text_color text-white font-semibold py-3 rounded-full transition mb-4">
        SUBMIT
      </button>
      <button className="w-full mb-5 border flex items-center gap-2 justify-center border-[#DDDFE3] text-heading_text_color font-semibold py-2 rounded-full bg-white  transition ">
        <Phone className="w-4 h-4" /> CALL ADVISOR
      </button>
      <p className="text-center font-manrope font-medium underline text-xs text-muted-foreground hover:text-primary cursor-pointer transition">
        CONTACT SUPPORT
      </p>
    </div>
  )
}
