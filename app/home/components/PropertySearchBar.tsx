'use client'

import { ChevronDown, Search, Sparkles } from 'lucide-react'

export default function PropertySearchBar() {
  return (
    <div className="w-full max-w-[52rem] mx-auto">
      <div
        className="
          flex flex-col sm:flex-row
          sm:items-center
          gap-3 sm:gap-2
          rounded-full
          lg:border border-border-gray
          lg:bg-white
          px-2 py-3 sm:py-1.5
          shadow-sm
        "
      >
        <div className="flex gap-5 max-md:bg-white max-md:rounded-full max-md:p-1">
          <div className="flex items-center rounded-full bg-[#D6E0EC] p-1 gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none rounded-full font-manrope font-semibold text-sm bg-sky_blue_color px-5 py-3 text-white">
              Buy
            </button>
            <button className="flex-1 sm:flex-none rounded-full font-manrope px-5 py-3 text-sm font-semibold text-[#0F172A]">
              Rent
            </button>
          </div>

          {/* Housing */}
          <div className="flex items-center rounded-full bg-[#D6E0EC] p-2 w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-semibold font-manrope text-[#0F172A]">
              Housing
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        <div className="flex max-md:bg-white max-md:rounded-full max-md:p-[2px] lg:w-full ">
          <div className="flex max-md:flex-1 items-center gap-2 px-3 max-md:my-3 w-full">
            <Search size={18} className="text-slate-gray shrink-0" />
            <input
              type="text"
              placeholder="Search in Spain..."
              className="w-full bg-transparent text-md text-dark-navy placeholder-slate-gray outline-none"
            />
          </div>
          <button
            className="
            lg:w-[30%] whitespace-nowrap sm:w-auto
            flex items-center justify-center gap-2
            rounded-full
            bg-sky_blue_color
            px-9 py-4
            text-sm font-semibold font-manrope text-white
            hover:opacity-90 transition
          "
          >
            <Sparkles size={16} />
            Ask AI
          </button>
        </div>

      </div>
    </div>
  )
}
