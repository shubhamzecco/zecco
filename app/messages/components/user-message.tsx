// "use client";

// import { App_url } from '@/constant/static'
// import { Phone, Send } from 'lucide-react'
// import Image from 'next/image'
// import React, { useState } from 'react'

// const UserMessage = () => {
//     const [message, setMessage] = useState("")

//     const handleSend = () => {
//         if (!message.trim()) return
//         console.log("Send message:", message)
//         setMessage("")
//     }

//     return (
//         <div className="p-4 px-6 rounded-lg h-full flex flex-col">

//             {/* Header */}
//             <div className="mt-5 flex items-center gap-3 relative border-b border-[#DADADA] pb-5">
//                 <div className="relative w-16 h-16 border-2 rounded-full border-[#D9D8E1] p-1">
//                     <Image
//                         src={App_url.image.image_6}
//                         alt="User Placeholder"
//                         className="object-cover rounded-full"
//                         width={70}
//                         height={70}
//                     />
//                 </div>

//                 <div>
//                     <h1 className="font-semibold text-md font-inter text-[#111827] mb-1">
//                         Carlos Martínez
//                     </h1>
//                     <p className="text-sm text-[#9391A1] font-inter font-normal">
//                         Agent
//                     </p>
//                 </div>

//                 <div className="ml-auto absolute right-0 top-1/2 -translate-y-1/2">
//                     <div className="bg-[#111827] text-white rounded-full w-10 h-10 flex items-center justify-center">
//                         <Phone size={20} />
//                     </div>
//                 </div>
//             </div>

//             {/* Messages */}
//             <div className="flex-1 overflow-y-auto mt-3">
//                 <p className="font-inter text-[#111827] text-center text-sm mb-4">
//                     Yesterday
//                 </p>

//                 {/* Agent Message */}
//                 <div className="flex items-start gap-3 mb-6">
//                     <div className="w-10 h-10 shrink-0 rounded-full bg-[#E6ECFF] flex items-center justify-center font-semibold text-[#2F63F1]">
//                         CM
//                     </div>

//                     <div>
//                         <div className="min-w-0">
//                             <div className="flex items-center gap-2 mb-1">
//                                 <span className="font-semibold text-gray-900">
//                                     Carlos Martínez
//                                 </span>
//                                 <span className="text-xs text-gray-400">
//                                     09:03 pm
//                                 </span>
//                             </div>
//                         </div>

//                         <div className="bg-[#F7F9FC] text-sm text-gray-800 px-4 py-3 rounded-xl rounded-tl-sm max-w-md">
//                             <span className="text-[#3B82F6]">
//                                 Hello macrum,
//                             </span>{" "}
//                             this <span className="font-semibold text-gray-900">ZECCO.es</span>{" "}
//                             villa matches your requirements perfectly.
//                         </div>
//                     </div>
//                 </div>

//                 {/* User Message */}
//                 <div className="flex justify-end">
//                     <div className="bg-[#2F63F1] text-white text-sm px-4 py-3 rounded-xl rounded-br-sm max-w-md">
//                         Great! Can I schedule a viewing this week?
//                     </div>
//                 </div>
//             </div>

//             {/* INPUT BOX */}
//             <div className="mt-4 border-t border-[#E5E7EB] pt-4">
//                 <div className="flex items-center gap-3 bg-[#F9FAFB] rounded-full px-4 py-2">

//                     <input
//                         type="text"
//                         placeholder="Type your message..."
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                         onKeyDown={(e) => e.key === "Enter" && handleSend()}
//                         className="flex-1 bg-transparent outline-none text-sm font-inter text-[#111827] placeholder:text-[#9CA3AF]"
//                     />

//                     <button
//                         onClick={handleSend}
//                         className="w-10 h-10 rotate-45 rounded-full bg-[#2F63F1] text-white flex items-center justify-center hover:bg-[#1E4ED8] transition"
//                     >
//                         <Send size={18} />
//                     </button>

//                 </div>
//             </div>

//         </div>
//     )
// }

// export default UserMessage


"use client"

import { App_url } from "@/constant/static"
import { ArrowLeft, Phone, Send } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const UserMessage = ({
  isMobile = false,
  onBack,
  user,
}: {
  isMobile?: boolean
  onBack?: () => void
  user?: any
}) => {
  const [message, setMessage] = useState("")

  const handleSend = () => {
    if (!message.trim()) return
    setMessage("")
  }

  return (
    <div className="p-4 lg:px-6 h-full flex flex-col">

      {/* HEADER */}
      <div className="flex items-center gap-3 border-b pb-4">

        {isMobile && (
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <div className="relative w-14 h-14 border rounded-full p-1">
          <Image
            src={user?.image || App_url.image.image_6}
            alt="User"
            width={56}
            height={56}
            className="rounded-full object-cover"
          />
        </div>

        <div>
          <h2 className="font-semibold text-[#111827]">
            {user?.name || "Carlos Martínez"}
          </h2>
          <p className="text-sm text-gray-400">Agent</p>
        </div>

        {!isMobile && (
          <div className="ml-auto bg-black text-white w-10 h-10 rounded-full flex items-center justify-center">
            <Phone size={18} />
          </div>
        )}
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-6 min-h-[50vh]">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
            CM
          </div>
          <div className="bg-gray-100 px-4 py-2 rounded-xl max-w-md max-md:w-[65vw] text-sm">
            Hello! This ZECCO.es villa matches your requirements perfectly.
          </div>
        </div>

        <div className="flex justify-end">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-xl max-w-md text-sm">
            Great! Can I schedule a viewing?
          </div>
        </div>
      </div>

      {/* INPUT */}
      <div className="border-t pt-4 max-md:w-full">
        <div className="flex items-center bg-gray-100 rounded-full lg:px-4 py-2 gap-3">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none text-sm px-2"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white w-10 h-10 rounded-full rotate-45 flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

    </div>
  )
}

export default UserMessage
