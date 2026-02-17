// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'
// import { Menu, User, UserPlus, X } from 'lucide-react'
// import Image from 'next/image'
// import { usePathname, useRouter } from 'next/navigation'
// import { App_url } from '@/constant/static'
// import { useDispatch } from 'react-redux'
// import { clearBreadcrumbs, setBreadcrumbs } from '@/redux/modules/main/action'
// import { NAV_ITEMS } from '@/utils/common'

// export default function Header() {
//   const [isOpen, setIsOpen] = useState(false)
//   const pathname = usePathname()
//   const dispatch = useDispatch()
//   const router = useRouter()

//   const isActive = (href: string) => {
//     if (href === '#') return false
//     return pathname === href || pathname.startsWith(`${href}/`)
//   }

//   const handleNavClick = (item: any) => {
//     dispatch(clearBreadcrumbs())
//     console.log("item ::: ", item)
//     if (item.breadcrumbs) {
//       dispatch(setBreadcrumbs(item.breadcrumbs))
//     }
//     router.push(item.href)
//   }


//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 bg-white w-full shadow-sm">
//       <div className="lg:mx-7 px-4 sm:px-6 lg:px-8 border border-white/70 rounded-full backdrop-blur-md">
//         <div className="flex justify-between items-center h-[5.5rem]">
//           <Link href="/" className="flex items-center gap-2">
//             <Image
//               src={App_url.image.logo}
//               alt="logo"
//               width={160}
//               height={100}
//             />
//           </Link>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center gap-8">
//             {NAV_ITEMS?.map((item) => (
//               <button
//                 key={item.label}
//                 onClick={() => handleNavClick(item)}
//                 className="relative text-[#0B5394] font-inter text-sm font-medium"
//               >
//                 {item.label}

//                 {isActive(item.href) && (
//                   <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-[3px] w-5 bg-[#0B5394] rounded-full" />
//                 )}
//               </button>
//             ))}
//           </div>

//           {/* Right Buttons */}
//           <div className="hidden md:flex items-center gap-3 -mr-3">
//             <Link
//               href={App_url.link.SIGN_IN}
//               className="px-5 py-3 text-sm font-medium flex items-center gap-2"
//             >
//               <User className="w-5 h-5" /> Login
//             </Link>

//             <Link
//               href={App_url.link.SIGN_UP}
//               className="px-5 py-3 text-sm font-medium text-white bg-sky_blue_color rounded-full flex items-center gap-2"
//             >
//               <UserPlus className="w-5 h-5" /> Registration
//             </Link>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="md:hidden p-2 rounded-lg"
//           >
//             {isOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>
//       </div>
//     </nav>
//   )
// }


'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, User, UserPlus, X } from 'lucide-react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { App_url } from '@/constant/static'
import { useDispatch } from 'react-redux'
import { clearBreadcrumbs, setBreadcrumbs } from '@/redux/modules/main/action'
import { NAV_ITEMS } from '@/utils/common'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const dispatch = useDispatch()
  const router = useRouter()

  const isActive = (href: string) => {
    if (href === '#') return false
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const handleNavClick = (item: any) => {
    dispatch(clearBreadcrumbs())
    if (item.breadcrumbs) dispatch(setBreadcrumbs(item.breadcrumbs))
    router.push(item.href)
    setIsOpen(false) // ✅ close menu on click
  }

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white w-full shadow-sm">
        <div className="lg:mx-7 px-4 sm:px-6 lg:px-8 border border-white/70 rounded-full backdrop-blur-md">
          <div className="flex justify-between items-center h-[5.5rem]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={App_url.image.logo}
                alt="logo"
                width={160}
                height={100}
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className="relative text-[#0B5394] font-inter text-sm font-medium"
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-[3px] w-5 bg-[#0B5394] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-3 -mr-3">
              <Link
                href={App_url.link.SIGN_IN}
                className="px-5 py-3 text-sm font-medium flex items-center gap-2"
              >
                <User className="w-5 h-5" /> Login
              </Link>

              <Link
                href={App_url.link.SIGN_UP}
                className="px-5 py-3 text-sm font-medium text-white bg-sky_blue_color rounded-full flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" /> Registration
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed top-[5.5rem] left-0 right-0 z-40 md:hidden bg-white shadow-lg transition-all duration-300 overflow-hidden
        ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 py-4 space-y-4">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item)}
              className={`block relative w-full text-left ${isActive(item.href) ? 'text-[#0B5394]' : 'text-gray-800'}  font-inter text-sm font-medium`}
            >
              {item.label}
            </button>
          ))}

          <div className="border-t pt-4 space-y-3">
            <Link href={App_url.link.SIGN_IN} className="block text-gray-700 font-inter text-sm">
              Login
            </Link>
            <Link href={App_url.link.SIGN_UP} className="block text-sky_blue_color text-sm font-inter font-semibold">
              Registration
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
