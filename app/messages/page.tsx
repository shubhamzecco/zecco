// import SidebarLayout from '@/components/layouts/sidebar-layout'
// import UserList from './components/user-list'
// import UserMessage from './components/user-message'

// const MessagePage = () => {

//     return (
//         <SidebarLayout>
//             <div className="px-12  py-8 h-full
//                             bg-gradient-to-r
//                         from-[#60A5FA]/10
//                         via-[#fafafa] via-[70%]
//                         to-[#fafafa] to-[100%]">
//                 <section className="mt-5 mb-6">
//                     <div className="flex justify-between items-center mb-1">
//                         <h2 className="font-bold text-lg mb-4 font-inter text-[#111827]">Messages</h2>
//                     </div>
//                     <div className="bg-white p-5 rounded-xl shadow-md grid grid-cols-[0.9fr_1fr] gap-4">
//                         <UserList />
//                         <UserMessage/>
//                     </div>
//                 </section>
//             </div>
//         </SidebarLayout>
//     )
// }

// export default MessagePage


"use client"

import { useState } from "react"
import SidebarLayout from "@/components/layouts/sidebar-layout"
import UserList from "./components/user-list"
import UserMessage from "./components/user-message"

const MessagePage = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null)

  return (
    <SidebarLayout>
      <div
        className="px-4 md:px-12 py-8 h-full
        bg-gradient-to-r
        from-[#60A5FA]/10
        via-[#fafafa] via-[70%]
        to-[#fafafa]"
      >
        <section className="mt-5 mb-6">
          <h2 className="font-bold text-lg mb-4 font-inter text-[#111827]">
            Messages
          </h2>

          <div className="bg-white p-4 md:p-5 rounded-xl shadow-md">
            {/* DESKTOP */}
            <div className="hidden md:grid grid-cols-[0.9fr_1fr] gap-4">
              <UserList onSelect={setSelectedUser} />
              <UserMessage />
            </div>

            {/* MOBILE */}
            <div className="md:hidden">
              {!selectedUser ? (
                <UserList onSelect={setSelectedUser} />
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
      </div>
    </SidebarLayout>
  )
}

export default MessagePage
