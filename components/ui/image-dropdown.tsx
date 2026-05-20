'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, User } from 'lucide-react'

type MenuItem = {
  label: string
  path?: string
  onClick?: () => void
}

type ProfileDropdownProps = {
  name: string
  avatar: string
  items: MenuItem[]
  onNavigate?: (path: string) => void
}

export default function ImageDropdown({
  name,
  avatar,
  items,
  onNavigate,
}: ProfileDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-full bg-[#136AED] px-2 py-2 text-sm font-semibold text-[#0F172A]"
      >
        <User size={20} className='text-white'/>

        <span className="hidden sm:block text-white font-inter">{name}</span>

        <ChevronDown
          size={16}
          className={`transition-transform duration-300 text-white ${
            open ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      {/* Dropdown */}
      <div
        className={`absolute right-0 mt-2 w-48 rounded-xl bg-white border border-slate-200 shadow-lg z-50
        transition-all duration-200 origin-top
        ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
        `}
      >
        <ul className="py-2 text-sm text-slate-700">
          {items.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => {
                  if (item.path && onNavigate) {
                    onNavigate(item.path)
                  }
                  item.onClick?.()
                  setOpen(false)
                }}
                className="w-full text-left px-4 py-2 hover:bg-slate-100 transition"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}