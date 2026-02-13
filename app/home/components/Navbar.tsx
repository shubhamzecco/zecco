'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, User, UserPlus, X } from 'lucide-react'
import Image from 'next/image'
import { App_url } from '@/constant/static'
import { usePathname, useRouter } from 'next/navigation'
import { NAV_ITEMS } from '@/utils/common'
import { useDispatch } from 'react-redux'
import { clearBreadcrumbs, setBreadcrumbs } from '@/redux/modules/main/action'

export default function Navbar() {
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
    if (item.breadcrumbs) {
      dispatch(setBreadcrumbs(item.breadcrumbs))
    }
    router.push(item.href)
  }


  return (
    <nav className="absolute top-7 left-0 w-full z-50">
      <div className=" lg:mx-20 px-4 sm:px-6 lg:px-8 bg-white/20 border border-white/70 rounded-full">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={App_url.image.logo}
                alt="logo"
                width={160}
                height={100}
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS?.map((item) => (
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

          {/* Right Side Buttons */}
          <div className="hidden md:flex items-center gap-3 -mr-3">
            <Link href={App_url.link.SIGN_IN} className="px-5 py-3 text-sm font-medium text-black rounded-full flex items-center gap-2">
              <User className="w-5 h-5" /> Login
            </Link>

            <Link href={App_url.link.SIGN_UP} className="px-5 py-3 text-sm font-medium text-white bg-sky_blue_color rounded-full flex items-center gap-2 tracking-wider">
              <UserPlus className="w-5 h-5" /> Registration
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              Buy
            </Link>
            <Link href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              Rent
            </Link>
            <Link href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              Invest
            </Link>
            <Link href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              About
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
