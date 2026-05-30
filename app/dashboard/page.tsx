"use client";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setAiInsight } from "@/redux/modules/main/action";
import { IPropertyResponse } from "@/redux/modules/main/types";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AiInsights from "./components/aiInsights";
import Favorite from "./components/favorite";
import SavedSearches from "./components/saved-searches";
import { Search } from "lucide-react";
import { useWebSocket } from "@/api/socket/WebSocketContext";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { mainReducer } = usePosterReducers();
  const { sendMessage, isConnected } = useWebSocket();

  useEffect(() => {
    dispatch(setAiInsight({} as IPropertyResponse));
  }, []);

  useEffect(() => {
    sendMessage("action", {
      type: "aiInsightService",
      action: "list",
      payload: {
        search: "",
        limit: 3,
        page: 1,
      },
    });
    sendMessage("action", {
      type: "userService",
      action: "favoritePropertyList",
      payload: {},
    });
    sendMessage("action", {
      type: "savedSearchService",
      action: "list",
      payload: {},
    });
  }, [isConnected]);

  const hasSavedSearches = (mainReducer?.saved_searches?.data?.length ?? 0) > 0;
  const hasFavorites =
    (mainReducer?.favorite_property_list?.data?.length ?? 0) > 0;
  const hasInsights = (mainReducer?.stored_aiInsight?.data?.length ?? 0) > 0;
  const isDashboardEmpty = !hasSavedSearches && !hasFavorites && !hasInsights;

  return (
    <SidebarLayout>
      <div
        className="px-5 lg:px-12  pt-12 pb-4 mb-10
                            bg-gradient-to-r
                        from-[#60A5FA]/10
                        via-[#fafafa] via-[70%]
                        to-[#fafafa] to-[100%]"
      >
        {isDashboardEmpty ? (
          <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-5">
              <Search className="text-blue-600 w-10 h-10" />
            </div>

            <h1 className="text-2xl font-bold text-[#111827] mb-2">
              Your dashboard is empty
            </h1>

            <p className="text-gray-500 max-w-md">
              Save searches, favorite properties, and explore AI insights to
              personalize your property experience.
            </p>
          </div>
        ) : (
          <>
            <SavedSearches />
            <Favorite />
            <AiInsights />
          </>
        )}
      </div>
    </SidebarLayout>
  );
};

export default DashboardPage;
