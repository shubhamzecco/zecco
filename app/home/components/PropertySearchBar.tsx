'use client'

import { ChevronDown, MapPin, Search, Sparkles, Pencil } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function PropertySearchBar() {

  const [buttonActivate, setButtonActivate] = useState('buy')
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState("Housing")

  // 👇 search dropdown state
  const [searchDropdown, setSearchDropdown] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  const options = ["Homes", "Bungalow", "Apartment", "Villa"]

  // 👇 close dropdown outside click
  useEffect(() => {
    const handleClickOutside = (event : any) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current?.contains?.(event.target)
      ) {
        setSearchDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

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
          {/* Buy / Rent */}
          <div className="flex items-center rounded-full bg-[#D6E0EC] p-1 gap-2 w-full sm:w-auto">
            <button
              onClick={() => setButtonActivate('buy')}
              className={`flex-1 sm:flex-none rounded-full font-manrope font-semibold text-sm ${
                buttonActivate === 'buy'
                  ? 'bg-sky_blue_color text-white'
                  : 'text-[#0F172A]'
              } px-5 py-3 `}
            >
              Buy
            </button>

            <button
              onClick={() => setButtonActivate('rent')}
              className={`flex-1 sm:flex-none rounded-full font-manrope px-5 py-3 text-sm font-semibold ${
                buttonActivate !== 'buy'
                  ? 'bg-sky_blue_color text-white'
                  : 'text-[#0F172A]'
              }`}
            >
              Rent
            </button>
          </div>

          {/* Property Type Dropdown */}
          <div className="flex items-center rounded-full bg-[#D6E0EC] p-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <div className="flex items-center rounded-full bg-[#D6E0EC]">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex w-full sm:w-auto items-center justify-between gap-2 rounded-full px-3 py-2 text-sm font-semibold font-manrope text-[#0F172A] min-w-[120px]"
                >
                  {selected}

                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Dropdown */}
              {open && (
                <div className="absolute left-0 mt-2 w-full sm:w-44 rounded-xl bg-white shadow-lg border border-slate-200 z-50">
                  <ul className="py-1 text-sm text-slate-700">
                    {options.map((item) => (
                      <li key={item}>
                        <button
                          onClick={() => {
                            setSelected(item)
                            setOpen(false)
                          }}
                          className={`w-full px-4 py-2 text-left transition ${
                            selected === item
                              ? "bg-slate-100 font-semibold text-slate-900"
                              : "hover:bg-slate-100"
                          }`}
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div
          ref={dropdownRef}
          className="flex max-md:bg-white max-md:rounded-full max-md:p-[2px] lg:w-full relative"
        >
          {/* Search Input */}
          <div className="flex max-md:flex-1 items-center gap-2 px-3 max-md:my-3 w-full">
            <Search size={18} className="text-slate-gray shrink-0" />

            <input
              type="text"
              placeholder="Search in Spain..."
              onFocus={() => setSearchDropdown(true)}
              className="w-full bg-transparent text-md text-dark-navy placeholder-slate-gray outline-none"
            />
          </div>

          {/* Dropdown Options */}
          {searchDropdown && (
            <div className="absolute top-[110%] left-0 w-full bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
              
              <button
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition text-left"
              >
                <MapPin size={18} className="text-sky_blue_color" />

                <div>
                  <p className="font-semibold text-sm text-slate-800">
                    Select area on the map
                  </p>

                  <p className="text-xs text-slate-500">
                    Choose a location directly from the map
                  </p>
                </div>
              </button>

              <button
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition border-t"
              >
                <Pencil size={18} className="text-sky_blue_color" />

                <div className="text-left">
                  <p className="font-semibold text-sm text-slate-800">
                    Draw your area
                  </p>

                  <p className="text-xs text-slate-500">
                    Draw custom boundaries on the map
                  </p>
                </div>
              </button>

              <button
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition border-t"
              >
                <Search size={18} className="text-sky_blue_color" />

                <div className="text-left">
                  <p className="font-semibold text-sm text-slate-800">
                    Search nearby
                  </p>

                  <p className="text-xs text-slate-500">
                    Find properties close to your location
                  </p>
                </div>
              </button>
            </div>
          )}

          {/* Ask AI Button */}
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