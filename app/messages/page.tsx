"use client";

import { useWebSocket } from "@/api/socket/WebSocketContext";
import Head from "next/head";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { useEffect, useState } from "react";
import UserList from "./components/user-list";
import UserMessage from "./components/user-message";
import Image from "next/image";
import { MessageCircle } from "lucide-react";

const MessagePage = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { sendMessage, isConnected, lastEvent } = useWebSocket();
  const { mainReducer, user_data } = usePosterReducers();

  useEffect(() => {
    if (!user_data?.user?.chatId && user_data?.user?.agent?.agent?._id) {
      sendMessage("action", {
        type: "chatService",
        action: "create",
        payload: {
          participants: user_data?.user?.agent?.agent?._id,
        },
      });
    }
    sendMessage("action", {
      type: "chatService",
      action: "list",
      payload: {},
    });
    const userFind = mainReducer?.chat_user_list?.find((user) => {
      return user?._id === user_data?.user?.chatId;
    });
    setSelectedUser(userFind);
  }, [isConnected]);

  useEffect(() => {
    if (
      lastEvent?.data?.status &&
      lastEvent?.data?.request?.type === "chatService" &&
      (lastEvent?.data?.request?.action === "send_message" ||
        lastEvent?.data?.request?.action === "mark_as_read")
    ) {
      sendMessage("action", {
        type: "chatService",
        action: "list",
        payload: {},
      });
    }
    if (lastEvent?.event === "new_message") {
      sendMessage("action", {
        type: "chatService",
        action: "get_messages",
        payload: {
          chat_id: selectedUser?._id,
        },
      });
      sendMessage("action", {
        type: "chatService",
        action: "list",
        payload: {},
      });
    }
  }, [lastEvent]);

  return (
    <SidebarLayout>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
        <section className="h-full">
          <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0]">
            <div className="hidden md:grid grid-cols-[0.6fr_1.2fr] gap-3">
              <UserList
                selectedUser={selectedUser}
                userList={mainReducer?.chat_user_list ?? []}
                onSelect={setSelectedUser}
              />
              {selectedUser ? (
                <UserMessage user={selectedUser} />
              ) : (
                <div className="flex items-center justify-center bg-white rounded-2xl overflow-hidden relative">
                  <div className="absolute w-80 h-80 bg-[#2F80FF]/5 rounded-full blur-3xl" />
                  <div className="absolute w-52 h-52 bg-[#2F80FF]/10 rounded-full blur-3xl" />
                  <div className="relative z-10 flex flex-col items-center text-center px-6">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 rounded-full bg-[#EFF6FF] flex items-center justify-center">
                        <Image
                          src={App_url.image.image_6}
                          alt="chat"
                          width={56}
                          height={56}
                          className="w-14 h-14 object-contain"
                        />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold font-manrope text-[#0F172A]">
                      Select a Conversation
                    </h2>
                    <p className="text-gray-400 mt-2 max-w-sm text-sm leading-6 font-manrope">
                      Choose a user from the left panel to start chatting and
                      view messages.
                    </p>
                    <div className="flex items-center gap-1.5 mt-6">
                      <span className="w-2 h-2 rounded-full bg-[#2F80FF] animate-bounce" />
                      <span
                        className="w-2 h-2 rounded-full bg-[#2F80FF] animate-bounce"
                        style={{ animationDelay: "0.15s" }}
                      />
                      <span
                        className="w-2 h-2 rounded-full bg-[#2F80FF] animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="md:hidden">
              {!selectedUser ? (
                <UserList
                  selectedUser={selectedUser}
                  userList={mainReducer?.chat_user_list ?? []}
                  onSelect={setSelectedUser}
                />
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
    </SidebarLayout>
  );
};

export default MessagePage;
