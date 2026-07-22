"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import AgentCard from "@/components/cards/agent-card";
import CommonCard from "@/components/cards/common-card";
import ChatbotWidget from "@/components/chat/chatbot-widget";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setChatBadgeOpen } from "@/redux/modules/main/action";
import { ArrowRight } from "lucide-react";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Greeting from "./components/greating";

const DashboardPage = () => {
  const { user_data } = usePosterReducers();
  const { sendMessage, isConnected } = useWebSocket();
  const dispatch = useDispatch()

  useEffect(() => {
    if (!isConnected) return
    sendMessage("action", {
      type: "savedSearchService",
      action: "list",
      payload: {},
    });
    sendMessage("action", {
      type: "userService",
      action: "favoritePropertyList",
      payload: {},
    });
    sendMessage("action", {
      type: "chatService",
      action: "list",
      payload: {},
    });
  }, [])

  console.log("user_data ::: " , user_data)

  return (
    <SidebarLayout>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="lg:flex items-start gap-3  ">
        <div className="lg:w-[70%]">
          <Greeting />
        </div>
        <div className="lg:w-[30%] lg:block max-lg:mt-5 sm:grid grid-cols-2 items-stretch gap-5">
          <div>
            <CommonCard heading="AI Concierge" className="max-lg:h-full 2xl:h-[27vh] !py-4 max-2xl:!px-[14.3px]">
              <p className="bg-[#edf0f7] p-[14.5px]  2xl:my-3  tracking-wide  rounded-xl font-manrope text-[#64748B] font-medium max-sm:text-xs sm:text-[15px] lg:text-xs xl:text-sm">
               Your personal AI property assistant is always searching for homes that fit your preferences. Discover curated recommendations, market insights, and new listings tailored just for you.
              </p>
              <button
                onClick={() => dispatch(setChatBadgeOpen(true))}
                className="relative justify-center flex items-center gap-2 w-full mt-[16px] sm:mt-7 lg:mt-2 2xl:mt-[16px]  py-3.5 px-10 rounded-2xl bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] text-white text-sm font-manrope font-extrabold shadow-md disabled:opacity-50"
              >
                Chat with AI <ArrowRight className="w-4 h-4" />
              </button>
            </CommonCard>
          </div>
          <div className="lg:mt-4 max-sm:mt-5">
            {user_data?.user?.agent?.agent && (
              <AgentCard />
            )}
          </div>
        </div>
      </div>
     <ChatbotWidget />
    </SidebarLayout>
  );
};

export default DashboardPage;
