"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import Head from "next/head";
import Greeting from "./components/greating";
import { useRouter } from "next/navigation";
import AgentCard from "@/components/cards/agent-card";
import CommonCard from "@/components/cards/common-card";
import { App_url } from "@/constant/static";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import AiCard from "./components/ai-card";

const DashboardPage = () => {
  const { mainReducer, user_data } = usePosterReducers();
  const { sendMessage, isConnected } = useWebSocket();
  const router = useRouter()

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
            <CommonCard heading="AI Concierge" className="max-lg:h-full 2xl:h-[27.5vh] !py-4 max-2xl:!p-3.5">
              <p className="bg-[#edf0f7] p-2  2xl:my-4 m-1.5 tracking-wide  rounded-xl font-manrope text-[#64748B] font-medium text-xs xl:text-sm">
                Based on your preferences, I've found new properties that match your budget and lifestyle. I continuously monitor the market to bring you personalized recommendations and notify you when the right opportunity appears.
              </p>
              <button
                onClick={() => router.push(App_url.link.CONTACT_US)}
                className="relative justify-center flex items-center gap-2 w-full mt-[16px]  py-3.5 px-10 rounded-2xl bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] text-white text-sm font-manrope font-extrabold shadow-md disabled:opacity-50"
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
    </SidebarLayout>
  );
};

export default DashboardPage;
