"use client";

import React, { useState } from "react";
import Footer from "../Footer";
import Header from "../Header";
import Sidebar from "../sidebar";
import Breadcrumb from "../breadcrumbs";

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="w-full min-h-screen pb-3 bg-slate-50">
      <div className="fixed top-0 left-0 right-0 z-50 h-[72px]">
        <Header onProfileClick={() => setSidebarOpen(!sidebarOpen)} />
      </div>
      <div className="lg:px-16 px-3 sm:px-7">
        <div className="flex justify-between items-center  pt-[75px] gap-4">
          <Breadcrumb />
        </div>
        <div className="flex lg:mb-10 mb-20">
          <aside className="hidden lg:block lg:w-[260px]">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} desktopOnly />
          </aside>
          <section className="lg:flex-1 w-full lg:ml-4">{children}</section>
        </div>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} mobileOnly />
    </main>
  );
};

export default SidebarLayout;
