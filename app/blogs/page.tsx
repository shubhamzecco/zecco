"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import BlogCards from "@/components/cards/blog-Card";
import MainLayout from "@/components/layouts/main-layout";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { useEffect } from "react";

const Blogs = () => {
  const { mainReducer } = usePosterReducers();
  const { sendMessage, isConnected } = useWebSocket();

  useEffect(() => {
    sendMessage("action", {
      type: "blogService",
      action: "list",
      payload: {
        search: "",
        limit: 0,
        page: 1,
        status: true,
      },
    });
  }, [isConnected]);

  return (
    <MainLayout isBreadcrumb>
      <div className="lg:mx-7 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <BlogCards data={mainReducer?.blogs_list_with_limit?.data || []} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Blogs;
