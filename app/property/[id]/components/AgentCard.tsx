'use client'
import { App_url } from '@/constant/static'
import { handleProtectedRoute } from '@/utils/common'
import { Lock, Mail, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface AgentCardProps {
  user_data?: {
    access_token?: string
  }
}

export function AgentCard({ user_data }: AgentCardProps) {
  const [contactMessage, setContactMessage] = useState('')

  const isLoggedIn = !!user_data?.access_token
  const router = useRouter()

  return (
    <div className="sticky top-24 bg-[#F7F8FC] border border-[#F3F4F6] rounded-lg p-6 mb-6 shadow-sm relative overflow-hidden">
      {!isLoggedIn && (
        <div className="absolute inset-0 z-20 backdrop-blur-sm bg-white/40 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>

            <h3 className="text-lg font-bold text-heading_text_color font-manrope mb-2">
              Login Required
            </h3>

            <p className="text-sm text-[#64748B] font-medium mb-5 max-w-[220px]">
              Please login to view agent details and contact advisor.
            </p>

            <div
              onClick={() => handleProtectedRoute(isLoggedIn, router)}
              className="inline-flex cursor-pointer items-center justify-center px-6 py-2 w-full bg-heading_text_color text-white rounded-full font-semibold transition hover:opacity-90"
            >
              LOGIN
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={!isLoggedIn ? 'pointer-events-none select-none' : ''}>
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
            <p className="text-xs text-[#64748B] font-manrope font-extrabold">
              Your appointed real estate agent
            </p>

            <p className="font-extrabold text-sm text-heading_text_color font-manrope">
              Walter Haus Madrid
            </p>
          </div>
        </div>

        <p className="text-sm text-heading_text_color font-inter mb-4 flex items-center gap-2">
          <Phone className="w-4 h-4" /> +44 7123 456789
        </p>

        <p className="text-sm text-heading_text_color font-inter mb-4 flex items-center gap-2">
          <Mail className="w-4 h-4" /> johnsingh@gamil.com
        </p>

        <div className="mb-4">
          <p className="text-lg font-semibold font-manrope text-heading_text_color mb-3">
            Ask to real estate agent
          </p>

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

        <button className="w-full mb-5 border flex items-center gap-2 justify-center border-[#DDDFE3] text-heading_text_color font-semibold py-2 rounded-full bg-white transition">
          <Phone className="w-4 h-4" /> CALL ADVISOR
        </button>

        <Link
          href={App_url.link.CONTACT_US}
          className="text-center flex justify-center items-center font-manrope font-medium underline text-xs text-muted-foreground hover:text-primary cursor-pointer transition"
        >
          CONTACT SUPPORT
        </Link>
      </div>
    </div>
  )
}