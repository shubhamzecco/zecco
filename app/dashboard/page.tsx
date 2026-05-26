"use client";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import React, { useEffect } from "react";
import DashboardCard from "./components/dashboard-cards";
import Favorite from "./components/favorite";
import AiInsights from "./components/aiInsights";
import SavedSearches from "./components/saved-searches";
import { useDispatch } from "react-redux";
import { setAiInsight } from "@/redux/modules/main/action";
import { IPropertyResponse } from "@/redux/modules/main/types";

const DashboardPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setAiInsight({} as IPropertyResponse));
  }, []);
  return (
    <SidebarLayout>
      <div
        className="px-5 lg:px-12  pt-12 pb-4 mb-10
                            bg-gradient-to-r
                        from-[#60A5FA]/10
                        via-[#fafafa] via-[70%]
                        to-[#fafafa] to-[100%]"
      >
        <SavedSearches />
        <Favorite />
        <AiInsights />
      </div>
    </SidebarLayout>
  );
};

export default DashboardPage;
