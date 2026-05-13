"use client"

import { URL } from "@/api/rest/fetchData"
import { useWebSocket } from "@/api/socket/WebSocketContext"
import { usePosterReducers } from "@/redux/getdata/usePostReducer"
import { formatTime } from "@/utils/common"
import { ArrowLeft, Check, CheckCheck, Phone, Send } from "lucide-react"
import { useEffect, useRef, useState } from "react"

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
  const { user_data, mainReducer } = usePosterReducers()
  const { sendMessage, isConnected, lastEvent } = useWebSocket()

  const messagesContainerRef = useRef<HTMLDivElement | null>(null)

  const findParticipant = user?.participants?.find(
    (p: any) => p._id !== user_data?.user?._id
  )

  useEffect(() => {
    if (user?._id) {
      sendMessage('action', {
        type: "chatService",
        action: "get_messages",
        payload: {
          chat_id: user?._id,
        },
      })
    }
  }, [isConnected, user?._id])

  useEffect(() => {
    if (lastEvent?.data?.status && lastEvent?.data?.request?.type === 'chatService' && (lastEvent?.data?.request?.action === 'send_message')) {
      sendMessage('action', {
        type: "chatService",
        action: "get_messages",
        payload: {
          chat_id: user?._id,
        },
      })
      setMessage("")
    }
  }, [lastEvent])

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight
      sendMessage('action', {
        type: "chatService",
        action: "mark_as_read",
        payload: {
          chat_id: user?._id,
        },
      })
    }
  }, [mainReducer?.chat_messages_by_user])

  const handleSend = () => {
    if (!message.trim()) return

    sendMessage('action', {
      type: "chatService",
      action: "send_message",
      payload: {
        id: user?._id,
        message: message,
      },
    })
  }

  return (
    <div className="flex flex-col bg-white rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 lg:px-6 py-4 bg-white shrink-0">
        {isMobile && (
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <div className="relative">
          <div className="w-14 h-14 border rounded-full p-1 bg-white shadow-sm">
            <img
              src={URL + findParticipant?.profile_image}
              alt={findParticipant?.first_name}
              className="rounded-full w-full h-full object-cover"
            />
          </div>

          {/* online dot */}
          {/* <div className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white" /> */}
        </div>

        <div>
          <h2 className="font-semibold text-[#111827] text-[15px]">
            {findParticipant?.first_name} {findParticipant?.last_name}
          </h2>

          <p className="text-xs text-gray-400 font-medium">
            Agent
          </p>
        </div>

        {!isMobile && (
          <button
            onClick={() => {
              window.location.href = `tel:${findParticipant?.contact_no}`
            }}
            className="ml-auto bg-black text-white w-11 h-11 rounded-full flex items-center justify-center hover:scale-105 transition">
            <Phone size={18} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto min-h-[60vh] max-h-[60vh] px-4 lg:px-6 py-5 space-y-4 bg-[#fafafa] scroll-smooth">
        {mainReducer?.chat_messages_by_user?.map(
          (msg: any, index: number) => {
            const isSender =
              msg?.sender?._id === user_data?.user?._id
            return (
              <div key={index}>
                {!isSender ? (
                  <div className="flex items-end gap-2">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm shrink-0">
                      {msg?.sender?.first_name?.[0]}
                      {msg?.sender?.last_name?.[0]}
                    </div>

                    <div className="max-w-[75%]">
                      <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md text-sm shadow-sm border border-gray-100 text-gray-700">
                        {msg?.message}
                      </div>

                      <p className="text-[10px] text-gray-400 mt-1 ml-1">
                        {formatTime(msg?.createdAt)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <div className="max-w-[75%]">
                      <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-br-md text-sm shadow-md">
                        {msg?.message}
                      </div>

                      <div className="flex items-center justify-end gap-1 mt-1 pr-1">
                        <p className="text-[10px] text-gray-400">
                          {formatTime(msg?.createdAt)}
                        </p>

                        {/* single tick = sent */}
                        {/* double tick = seen */}

                        {/* {msg?.is_read ? (
                          <CheckCheck
                            size={14}
                            className="text-blue-500"
                          />
                        ) : (
                          <Check
                            size={14}
                            className="text-gray-400"
                          />
                        )} */}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          }
        )}
      </div>

      {/* Input */}
      <div className="border-t bg-white px-4 lg:px-6 py-4 shrink-0">
        <div className="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-2 shadow-sm">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none text-sm px-3"
            onKeyDown={(e) =>
              e.key === "Enter" && handleSend()
            }
          />

          <button
            onClick={handleSend}
            className="bg-blue-600 text-white min-w-[44px] h-11 rounded-full flex items-center justify-center hover:scale-105 transition-all duration-200 shadow-md"
          >
            <Send size={18} className="rotate-45 ml-[2px]" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserMessage