"use client";

import React, { useState } from "react";
import Footer from "../Footer";
import Header from "../Header";
import Sidebar from "../sidebar";
import Breadcrumb from "../breadcrumbs";

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="w-full bg-slate-50">
      <div className="fixed top-0 left-0 right-0 z-50 h-[72px]">
        <Header onProfileClick={() => setSidebarOpen(!sidebarOpen)} />
      </div>
      <div className="lg:px-16">
        <div className="flex justify-between items-center  pt-[75px] gap-4">
          <Breadcrumb />
        </div>
        <div className="flex min-h-screen mb-10">
          <aside className="lg:w-[260px]">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          </aside>
          <section className="lg:flex-1 w-full lg:ml-4">{children}</section>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default SidebarLayout;
