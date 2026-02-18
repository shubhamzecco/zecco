// import { App_url } from '@/constant/static'
// import { PenSquare, Search } from 'lucide-react'
// import Image from 'next/image'
// import React from 'react'

// const UserList = () => {

//     const userList = [
//         {
//             id: 1,
//             name: 'Carlos Martínez',
//             email: 'MV-MB-2401 (Modern Villa, ZECCO.es)',
//             image: App_url.image.image_6,
//             messageCount: 0
//         },
//         {
//             id: 2,
//             name: 'Sofia García',
//             email: 'MV-MB-2401 (Modern Villa, ZECCO.es)',
//             image: App_url.image.image_2,
//             messageCount: 2
//         },
//         {
//             id: 3,
//             name: 'Miguel Rodríguez',
//             email: 'MV-MB-2401 (Modern Villa, ZECCO.es)',
//             image: App_url.image.image_3,
//             messageCount: 1
//         },
//         {
//             id: 4,
//             name: 'Lucía Fernández',
//             email: 'MV-MB-2401 (Modern Villa, ZECCO.es)',
//             image: App_url.image.image_1,
//             messageCount: 1
//         },
//     ]

//     return (
//         <div className="bg-[#F5F7FA] p-4 px-6 rounded-lg">
//             <h2 className="font-bold text-md mb-4 font-inter text-[#111827]">Online Now</h2>
//             <div className="relative w-16 h-16">
//                 <Image
//                     src={App_url.image.image_6}
//                     alt="User Placeholder"
//                     className='object-cover rounded-full'
//                     width={60}
//                     height={60}
//                 />
//                 <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
//             </div>
//             <div className="mt-4">
//                 <div className="flex items-center justify-between mb-3">
//                     <h2 className="font-bold text-md  font-inter text-[#111827]">Messages</h2>
//                     <Image
//                         src={App_url.image.edit}
//                         alt="User Placeholder"
//                         className='object-cover'
//                         width={20}
//                         height={20}
//                     />
//                 </div>
//                 <div className="relative gap-3 w-full  rounded-[7px]">
//                     <Search
//                         className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A19791]"
//                         size={18}
//                     />
//                     <input
//                         type="text"
//                         placeholder="Search"
//                         className="w-full bg-white placeholder:font-manrope font-normal placeholder:text-[#999999] h-12 pl-10 pr-4 rounded-[15px] 
//                            focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                 </div>

//                 <div className="">
//                     {userList.map((user) => (
//                         <div className="mt-5 flex items-center gap-3 relative">
//                             <div className="relative w-[3.5rem] h-[3.5rem]">
//                                 <Image
//                                     src={user.image}
//                                     alt={user.name}
//                                     className='object-cover rounded-full'
//                                     width={50}
//                                     height={50}
//                                 />
//                                 <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
//                             </div>
//                             <div className="">
//                                 <h1 className="font-semibold text-[0.90rem] font-inter text-[#111827] mb-1">{user.name}</h1>
//                                 <p className="text-xs text-[#9391A1]  font-inter font-normal">{user.email}</p>
//                             </div>
//                             {user.messageCount > 0 && (
//                                 <div className="ml-auto absolute right-0 top-1/2 -translate-y-1/2">
//                                     <p className="bg-[#111827] text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold font-sans">{user.messageCount}</p>
//                                 </div>
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default UserList



import { App_url } from "@/constant/static"
import { Search } from "lucide-react"
import Image from "next/image"

const UserList = ({ onSelect }: { onSelect?: (user: any) => void }) => {
  const userList = [
    {
      id: 1,
      name: "Carlos Martínez",
      email: "MV-MB-2401 (Modern Villa, ZECCO.es)",
      image: App_url.image.image_6,
      messageCount: 0,
    },
    {
      id: 2,
      name: "Sofia García",
      email: "MV-MB-2401 (Modern Villa, ZECCO.es)",
      image: App_url.image.image_2,
      messageCount: 2,
    },
    {
      id: 3,
      name: "Miguel Rodríguez",
      email: "MV-MB-2401 (Modern Villa, ZECCO.es)",
      image: App_url.image.image_3,
      messageCount: 1,
    },
    {
      id: 4,
      name: "Lucía Fernández",
      email: "MV-MB-2401 (Modern Villa, ZECCO.es)",
      image: App_url.image.image_1,
      messageCount: 1,
    },
  ]

  return (
    <div className="bg-[#F5F7FA] p-4 px-6 rounded-lg h-full">
      <h2 className="font-bold text-md mb-4 text-[#111827]">Online Now</h2>

      <div className="relative w-16 h-16 mb-4">
        <Image
          src={App_url.image.image_6}
          alt="User"
          className="rounded-full h-full w-full object-cover"
          width={60}
          height={60}
        />
        <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-md text-[#111827]">Messages</h2>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          placeholder="Search"
          className="w-full bg-white h-11 pl-10 pr-4 rounded-xl text-sm outline-none"
        />
      </div>

      {userList.map((user) => (
        <div
          key={user.id}
          onClick={() => onSelect?.(user)}
          className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-white transition mt-3"
        >
          <div className="relative w-12 h-12">
            <Image
              src={user.image}
              alt={user.name}
              width={48}
              height={48}
              className="rounded-full h-full w-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#111827]">
              {user.name}
            </h3>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>

          {user.messageCount > 0 && (
            <span className="ml-auto bg-[#111827] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
              {user.messageCount}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

export default UserList
