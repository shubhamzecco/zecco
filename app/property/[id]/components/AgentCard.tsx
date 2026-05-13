'use client'
import { useWebSocket } from '@/api/socket/WebSocketContext'
import { App_url } from '@/constant/static'
import { setLoginPopup } from '@/redux/modules/main/action'
import { Mail, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

interface AgentCardProps {
  user_data?: {
    access_token?: string
  }
}

export function AgentCard({ user_data }: AgentCardProps) {
  const [contactMessage, setContactMessage] = useState('')
  const dispatch = useDispatch()
  const { sendMessage, isConnected , lastEvent } = useWebSocket()
  const { id } = useParams()

  const isLoggedIn = !!user_data?.access_token
  const router = useRouter()


  const handleCreateChat = () => {
    sendMessage('action', {
      type: "chatService",
      action: "create",
      payload: {
        participants: '699ee20168b60e1beef07b22',
        property_id: id,
        message: contactMessage
      }
    })
  }

  useEffect(() => {
    if (lastEvent?.data?.status && lastEvent?.data?.request?.type === 'chatService' && (lastEvent?.data?.request?.action === 'create')) {
      console.log('Chat Created with ID:', lastEvent);
      router.push(`${App_url.link.MESSAGE}`)
    }
  }, [lastEvent])

  return (
    <div className="sticky top-24 bg-[#F7F8FC] border border-[#F3F4F6] rounded-lg p-6 mb-6 shadow-sm relative overflow-hidden">
      <div>
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
          <Phone className="w-4 h-4" /> {isLoggedIn ? "+44 7123 456789" : "+44*******789"}
        </p>

        <p className="text-sm text-heading_text_color font-inter mb-4 flex items-center gap-2">
          <Mail className="w-4 h-4" /> {isLoggedIn ? "johnsingh@gmail.com" : "*******@gmail.com"}
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

        <button onClick={() => isLoggedIn ? handleCreateChat() : dispatch(setLoginPopup(true))} className="w-full cursor-pointer bg-heading_text_color text-white font-semibold py-3 rounded-full transition mb-4">
          SUBMIT
        </button>

        <button onClick={() => isLoggedIn ? '' : dispatch(setLoginPopup(true))} className="w-full cursor-pointer mb-5 border flex items-center gap-2 justify-center border-[#DDDFE3] text-heading_text_color font-semibold py-2 rounded-full bg-white transition">
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