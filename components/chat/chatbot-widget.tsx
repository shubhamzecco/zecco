'use client'

import { useEffect, useState } from 'react'
import { X, Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { App_url } from '@/constant/static'
import ZecooAIChat from './zecco-chat-modal'

interface Message {
  id: number
  text: string
  sender: string
  avatar: string
  senderName: string
  time: string
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // NEW STATES
  const [logoCentered, setLogoCentered] = useState(false)
  const [logoAtTop, setLogoAtTop] = useState(false)
  const [logoTopFinal, setLogoTopFinal] = useState(false) // ✅ will be true only after logo finished moving

  const [showNotification, setShowNotification] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')


  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Trigger animation after 2 seconds
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isOpen]);


  const openChat = () => {
    setIsOpen(true)

    setTimeout(() => setIsAnimating(true), 50)

    // 1️⃣ show in center
    setTimeout(() => setLogoCentered(true), 300)

    // 2️⃣ move diagonally to top-left
    setTimeout(() => setLogoAtTop(true), 1300)
  }

  const closeChat = () => {
    setIsAnimating(false)
    setLogoAtTop(false)
    setLogoCentered(false)
    setLogoTopFinal(false) // reset final state
    setTimeout(() => setIsOpen(false), 200)
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        text: inputValue,
        sender: 'user',
        avatar: '',
        senderName: '',
        time: ''
      }
    ])

    setInputValue('')

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          text: 'Thanks for your message! How can I help you today?',
          sender: 'bot',
          avatar: '',
          senderName: 'Zecco AI',
          time: '09.20 PM'
        }
      ])
    }, 600)
  }

  return (
    <>
      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-28 right-8 z-40 animate-in fade-in slide-in-from-bottom-10 duration-300">
          <div className="bg-white rounded-lg shadow-xl p-4 w-72 border-l-4 border-blue-500">
            <div className="flex items-start gap-3">
              <Image
                src={App_url.image.chat_logo}
                alt="chat"
                width={25}
                height={25}
              />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">Zecco AI</h3>
                <p className="text-sm text-gray-600">
                  Hey, you can also chat & explore homes with me!
                </p>
              </div>
              <button onClick={() => setShowNotification(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={openChat}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full animate-pulse
        bg-gradient-to-b from-[#1466EC] to-[#04ADF7]
        flex items-center justify-center shadow-lg
        hover:scale-110 transition z-40 text-white"
      >
        <Sparkles size={24} />
      </button>

      {isOpen && (
        <ZecooAIChat isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
