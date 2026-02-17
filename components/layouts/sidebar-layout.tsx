// import React from "react";
// import Header from "../Header";
// import Footer from "../Footer";
// import Sidebar from "../sidebar";

// const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
//     return (
//         <main className="w-full bg-white">
//             <div className="fixed top-0 left-0 right-0 z-50 h-[72px]">
//                 <Header />
//             </div>
//             <div className="pt-[72px] flex min-h-screen">
//                 <aside className="lg:w-[320px]">
//                     <Sidebar />
//                 </aside>

//                 <section className="lg:flex-1">
//                     {children}
//                 </section>
//             </div>
//             <Footer />
//         </main>
//     );
// };

// export default SidebarLayout;


"use client";

import React, { useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import Sidebar from "../sidebar";

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="w-full bg-white">
      <div className="fixed top-0 left-0 right-0 z-50 h-[72px]">
        <Header onProfileClick={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      <div className="pt-[72px] flex min-h-screen">
        <aside className="lg:w-[320px]">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </aside>

        <section className="lg:flex-1">{children}</section>
      </div>

      <Footer />
    </main>
  );
};

export default SidebarLayout;
