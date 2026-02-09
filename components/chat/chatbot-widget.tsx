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
              <Image src={App_url.image.chat_logo} alt="chat" width={25} height={25} />
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

      {/* Floating Button */}
      <button
        onClick={openChat}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full animate-pulse
        bg-gradient-to-b from-[#1466EC] to-[#04ADF7]
        flex items-center justify-center shadow-lg
        hover:scale-110 transition z-40 text-white"
      >
        <Sparkles size={24} />
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <ZecooAIChat isOpen = {isOpen} onClose={() => setIsOpen(false)}/>
        // <div className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-8">
        //   <div className="absolute inset-0 bg-black/50" onClick={closeChat} />

        //   <div
        //     className={`relative bg-white rounded-lg shadow-xl
        //     w-full md:w-[40vw]
        //     max-h-[60vh] md:min-h-[85vh] md:max-h-[95vh]
        //     flex flex-col transition-all duration-300
        //     ${isAnimating
        //         ? 'translate-y-0 opacity-100 scale-100'
        //         : 'translate-y-10 opacity-0 scale-95'
        //       }`}
        //   >
        //     {/* Close */}
        //     <div className="absolute -right-3 -top-3 z-30">
        //       <button
        //         onClick={closeChat}
        //         className="w-6 h-6 flex items-center justify-center rounded-full bg-white shadow"
        //       >
        //         <X size={16} />
        //       </button>
        //     </div>

        //     {/* Logo + Description */}
        //     <div
        //       className={`absolute transition-all duration-[800ms] ease-in-out ${isAnimated
        //         ? 'top-6 left-6 flex-row items-center gap-3'
        //         : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6'
        //         } flex`}
        //     >
        //       {/* Logo */}
        //       <div
        //         className={`transition-all duration-[800ms] ease-in-out ${isAnimated ? 'w-8 h-8' : 'w-24 h-24'
        //           }`}
        //       >
        //         <Image
        //           src={App_url.image.chat_logo}
        //           alt="logo"
        //           width={isAnimated ? 40 : 70}
        //           height={isAnimated ? 40 : 70}
        //           className="transition-all duration-700"
        //         />

        //       </div>

        //       <div className={` ${isAnimated ? 'flex-col flex' : ''}`}>
        //         <h1
        //           className={`font-bold text-[#000] transition-all duration-[800ms] ease-in-out ${isAnimated ? 'text-xl' : 'text-4xl'
        //             }`}
        //         >
        //           ZECCO.AI
        //         </h1>

        //         {/* Slogan */}
        //         <p
        //           className={`text-[#94A3B8] transition-all duration-[800ms] ease-in-out ${isAnimated ? 'text-xs' : 'text-lg'
        //             }`}
        //         >
        //           Meet Zecco — your AI search agent, working for you to find the best property listings that match your criteria.
        //         </p>
        //       </div>
        //     </div>

        //     {/* Messages */}
        //     <div className="flex-1 overflow-y-auto p-4 pt-40 space-y-4">
        //       {messages.map(msg => (
        //         <div
        //           key={msg.id}
        //           className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'
        //             }`}
        //         >
        //           {msg.sender === 'bot' && (
        //             <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
        //               <Image
        //                 src={App_url.image.chat_logo}
        //                 alt="bot"
        //                 width={18}
        //                 height={18}
        //               />
        //             </div>
        //           )}

        //           <div
        //             className={`px-4 py-2 rounded-2xl max-w-xs text-sm
        //             ${msg.sender === 'user'
        //                 ? 'bg-blue-500 text-white rounded-tr-none'
        //                 : 'bg-cyan-100 text-gray-800 rounded-tl-none'
        //               }`}
        //           >
        //             {msg.text}
        //           </div>
        //         </div>
        //       ))}
        //     </div>

        //     {/* Input */}
        //     <div className="p-4 border-t flex gap-2">
        //       <Input
        //         placeholder="Type your message..."
        //         value={inputValue}
        //         onChange={e => setInputValue(e.target.value)}
        //         onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
        //       />
        //       <Button className="bg-btn_color" onClick={handleSendMessage}>
        //         <Send className="w-4 h-4" />
        //       </Button>
        //     </div>
        //   </div>
        // </div>
      )}
    </>
  )
}
