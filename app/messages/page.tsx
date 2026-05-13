"use client"

import { useWebSocket } from "@/api/socket/WebSocketContext"
import SidebarLayout from "@/components/layouts/sidebar-layout"
import { useEffect, useState } from "react"
import UserList from "./components/user-list"
import UserMessage from "./components/user-message"
import { usePosterReducers } from "@/redux/getdata/usePostReducer"
import { App_url } from "@/constant/static"

const MessagePage = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const { sendMessage, isConnected, lastEvent } = useWebSocket()
  const { mainReducer } = usePosterReducers()
  useEffect(() => {
    sendMessage('action', {
      type: "chatService",
      action: "list",
      payload: {}
    })
  }, [isConnected])

  useEffect(() => {
    if (lastEvent?.data?.status && lastEvent?.data?.request?.type === 'chatService' && (lastEvent?.data?.request?.action === 'send_message' || lastEvent?.data?.request?.action === 'mark_as_read')) {
      sendMessage('action', {
        type: "chatService",
        action: "list",
        payload: {}
      })
    }
    if (lastEvent?.event === 'new_message') {
      sendMessage('action', {
        type: "chatService",
        action: "get_messages",
        payload: {
          chat_id: selectedUser?._id,
        },
      })
      sendMessage('action', {
        type: "chatService",
        action: "list",
        payload: {}
      })
    }
  }, [lastEvent])

  return (
    <SidebarLayout>
      <div
        className="px-4 md:px-7 py-2 h-full
        bg-gradient-to-r
        from-[#60A5FA]/10
        via-[#fafafa] via-[70%]
        to-[#fafafa]"
      >
        <section className="mt-5 mb-6">
          <h2 className="font-bold text-lg mb-4 font-inter text-[#111827]">
            Messages
          </h2>

          <div className="bg-white p-4 md:p-5 rounded-xl shadow-md">
            {/* DESKTOP */}
            <div className="hidden md:grid grid-cols-[0.9fr_1fr] gap-4">
              <UserList selectedUser={selectedUser} userList={mainReducer?.chat_user_list ?? []} onSelect={setSelectedUser} />
              {/* <UserMessage user={selectedUser} /> */}
              {
                selectedUser ? (
                  <UserMessage
                    user={selectedUser}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-white rounded-3xl overflow-hidden relative">
                    <div className="absolute w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30 animate-pulse" />
                    <div className="absolute w-52 h-52 bg-blue-200 rounded-full blur-3xl opacity-20 animate-bounce" />
                    <div className="relative z-10 flex flex-col items-center text-center px-6">
                      <div className="relative mb-6">
                        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
                          <img
                            src={App_url.image.image_6}
                            alt="chat"
                            className="w-14 h-14 object-contain opacity-80"
                          />
                        </div>
                        {/* <span className="absolute inset-0 rounded-full border-4 border-blue-300 animate-ping" /> */}
                      </div>
                      <h2 className="text-2xl font-bold text-[#111827]">
                        Select a Conversation
                      </h2>
                      <p className="text-gray-400 mt-2 max-w-sm text-sm leading-6">
                        Choose a user from the left panel to start chatting and view messages.
                      </p>
                      <div className="flex items-center gap-1 mt-6">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                        <span
                          className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                        <span
                          className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        />
                      </div>
                    </div>
                  </div>
                )
              }
            </div>

            {/* MOBILE */}
            <div className="md:hidden">
              {!selectedUser ? (
                <UserList selectedUser={selectedUser} userList={mainReducer?.chat_user_list ?? []} onSelect={setSelectedUser} />
              ) : (
                <UserMessage
                  isMobile
                  user={selectedUser}
                  onBack={() => setSelectedUser(null)}
                />
              )}
            </div>
          </div>
        </section>
      </div>
    </SidebarLayout>
  )
}

export default MessagePage
