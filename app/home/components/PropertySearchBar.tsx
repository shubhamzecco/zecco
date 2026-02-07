'use client'

import { useState } from 'react'
import { Search, MapPin, Home, DollarSign, Sparkles, ChevronDown } from 'lucide-react'

export default function PropertySearchBar() {
  const [location, setLocation] = useState('')
  const [propertyType, setPropertyType] = useState('all')
  const [budget, setBudget] = useState('any')

  const handleSearch = () => {
    console.log('Search:', { location, propertyType, budget })
  }

  return (
    <div className="w-full max-w-[52rem] mx-auto">
      <div className="flex items-center gap-2 rounded-full border border-border-gray bg-white px-2 py-1.5 shadow-sm">

        {/* Segmented buttons */}
        <div className="flex items-center rounded-full bg-[#D6E0EC] p-1 gap-2">
          <button className="rounded-full font-manrope font-semibold text-sm bg-sky_blue_color px-5 py-3  text-white">
            Buy
          </button>
          <button className="rounded-full font-manrope px-5 py-3 text-sm font-semibold text-[#0F172A] ">
            Rent
          </button>
        </div>
        <div className="flex items-center rounded-full bg-[#D6E0EC] p-2">
          <button className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold font-manrope text-[#0F172A] ">
            Housing
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Search input */}
        <div className="flex flex-1 items-center gap-2 px-3">
          <Search size={18} className="text-slate-gray" />
          <input
            type="text"
            placeholder="Search in Spain..."
            className="w-full bg-transparent text-md text-dark-navy placeholder-slate-gray outline-none"
          />
        </div>

        {/* Ask AI button */}
        <button className="flex items-center gap-2 rounded-full bg-gradient-to-b from-[#1466EC] to-[#04ADF7] px-9 py-4 text-sm font-semibold font-manrope text-white hover:opacity-90 transition">
          <Sparkles size={16} />
          Ask AI
        </button>
      </div>
    </div>
  )
}
