"use client";

import { useWebSocket } from "@/api/socket/WebSocketContext";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import UserList from "./components/user-list";
import UserMessage from "./components/user-message";

const MessagePage = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { sendMessage, isConnected, lastEvent } = useWebSocket();
  const { mainReducer, user_data } = usePosterReducers();

  useEffect(() => {
    if ( user_data?.user?.chatId === undefined && user_data?.user?.agent?.agent?._id) {
      sendMessage("action", {
        type: "chatService",
        action: "create",
        payload: {
          participants: user_data?.user?.agent?.agent?._id,
        },
      });
    }
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
    }
  }, [lastEvent]);

  

  return (
    <SidebarLayout>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <section className="lg:h-[calc(100vh-130px)] h-[calc(100vh-220px)]">
        <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] h-full overflow-hidden">
          <div className="hidden lg:grid grid-cols-[0.6fr_1.2fr] gap-3 h-full">
            <UserList
              selectedUser={selectedUser}
              userList={mainReducer?.chat_user_list ?? []}
              onSelect={setSelectedUser}
            />
            {selectedUser ? (
              <UserMessage user={selectedUser} />
            ) : (
              <div className="flex items-center justify-center  overflow-hidden relative min-h-[600px]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#EFF6FF] via-white to-[#F0FDF4]" />
                <div className="absolute top-10 right-10 w-32 h-32 bg-[#2F80FF]/5 rounded-full blur-2xl" />
                <div className="absolute bottom-10 left-10 w-40 h-40 bg-[#22C55E]/5 rounded-full blur-2xl" />

                <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-lg">
                  <Image
                    src={App_url.image.chat_image}
                    alt="City skyline right"
                    width={300}
                    height={400}
                    unoptimized
                    className="object-cover"
                  />

                  <h2 className="text-2xl font-bold font-manrope text-[#0F172A] mb-3">
                    Connect with our expert agent
                  </h2>
                  <p className="text-gray-500 max-w-sm text-sm leading-6 font-manrope">
                    Find your dream property in Costa del Sol.
                  </p>

                  {/* <div className="flex items-center gap-1.5 mt-8">
                      <span className="w-2 h-2 rounded-full bg-[#2F80FF] animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-bounce" style={{ animationDelay: "0.15s" }} />
                      <span className="w-2 h-2 rounded-full bg-[#F97316] animate-bounce" style={{ animationDelay: "0.3s" }} />
                    </div> */}
                </div>
              </div>
            )}
          </div>

          <div className="lg:hidden h-full">
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
