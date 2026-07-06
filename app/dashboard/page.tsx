"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import Head from "next/head";
import { PreferenceSection } from "../preferences/page";
import PreferenceProperty from "./components/preference";

const DashboardPage = () => {
  const { mainReducer } = usePosterReducers();
  const { sendMessage, isConnected } = useWebSocket();

  return (
    <SidebarLayout>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div
        className="px-5 lg:px-12  pt-2 pb-4 mb-10
                            bg-gradient-to-r
                        from-[#60A5FA]/10
                        via-[#fafafa] via-[70%]
                        to-[#fafafa] to-[100%]"
      >
        <PreferenceSection />
        <PreferenceProperty />
      </div>
    </SidebarLayout>
  );
};

export default DashboardPage;
