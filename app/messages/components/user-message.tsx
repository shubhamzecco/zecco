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
            className="rounded-full w-full h-full object-cover"
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
