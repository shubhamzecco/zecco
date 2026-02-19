import { App_url } from '@/constant/static'
import { clearBreadcrumbs, setBreadcrumbs } from '@/redux/modules/main/action'
import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useDispatch } from 'react-redux'



type ListingType = "buy" | "rent" | "new";

interface Region {
  name: string;
  count: string;
  items?: Record<ListingType, string[][]>;
}

const regions: Region[] = [
  {
    name: "Marbella",
    count: "9,282 Properties",
    // items: [
    //   ["Golden Mile Residences", "9,282"],
    //   ["Marbella Pearl Villas", "10,376"],
    //   ["Costa Azul Heights", "7,252"],
    //   ["La Brisa Luxury Homes", "13,868"],
    //   ["Marbella Bay Gardens", "3,705"],
    //   ["Sierra Blanca Retreat", "5,321"],
    // ],

    items: {
      buy: [
        ["Golden Mile Residences", "9,282"],
        ["Marbella Pearl Villas", "10,376"],
        ["Costa Azul Heights", "7,252"],
        ["La Brisa Luxury Homes", "13,868"],
        ["Marbella Bay Gardens", "3,705"],
        ["Sierra Blanca Retreat", "5,321"],
      ],
      rent: [
        ["Golden Mile Residences", "11,282"],
        ["Marbella Pearl Villas", "12,376"],
        ["Costa Azul Heights", "8,252"],
        ["La Brisa Luxury Homes", "13,868"],
        ["Marbella Bay Gardens", "2,705"],
        ["Sierra Blanca Retreat", "1,321"],
      ],
      new: [
        ["Golden Mile Residences", "28,202"],
        ["Marbella Pearl Villas", "10,376"],
        ["Costa Azul Heights", "18,252"],
        ["La Brisa Luxury Homes", "13,868"],
        ["Marbella Bay Gardens", "2,705"],
        ["Sierra Blanca Retreat", "1,321"],
      ],
    },
  },
  {
    name: "Malaga",
    count: "9,282 Properties",
    items: {
      buy: [
        ["Golden Mile Residences", "9,282"],
        ["Marbella Pearl Villas", "10,376"],
        ["Costa Azul Heights", "7,252"],
        ["La Brisa Luxury Homes", "13,868"],
        ["Marbella Bay Gardens", "3,705"],
        ["Sierra Blanca Retreat", "5,321"],
      ],
      rent: [
        ["Golden Mile Residences", "11,282"],
        ["Marbella Pearl Villas", "12,376"],
        ["Costa Azul Heights", "8,252"],
        ["La Brisa Luxury Homes", "13,868"],
        ["Marbella Bay Gardens", "2,705"],
        ["Sierra Blanca Retreat", "1,321"],
      ],
      new: [
        ["Golden Mile Residences", "28,202"],
        ["Marbella Pearl Villas", "10,376"],
        ["Costa Azul Heights", "18,252"],
        ["La Brisa Luxury Homes", "13,868"],
        ["Marbella Bay Gardens", "2,705"],
        ["Sierra Blanca Retreat", "1,321"],
      ],
    },
  },
  {
    name: "Fuengirola",
    count: "9,282 Properties",
    items: {
      buy: [
        ["Golden Mile Residences", "9,282"],
        ["Marbella Pearl Villas", "10,376"],
        ["Costa Azul Heights", "7,252"],
        ["La Brisa Luxury Homes", "13,868"],
        ["Marbella Bay Gardens", "3,705"],
        ["Sierra Blanca Retreat", "5,321"],
      ],
      rent: [
        ["Golden Mile Residences", "11,282"],
        ["Marbella Pearl Villas", "12,376"],
        ["Costa Azul Heights", "8,252"],
        ["La Brisa Luxury Homes", "13,868"],
        ["Marbella Bay Gardens", "2,705"],
        ["Sierra Blanca Retreat", "1,321"],
      ],
      new: [
        ["Golden Mile Residences", "28,202"],
        ["Marbella Pearl Villas", "10,376"],
        ["Costa Azul Heights", "18,252"],
        ["La Brisa Luxury Homes", "13,868"],
        ["Marbella Bay Gardens", "2,705"],
        ["Sierra Blanca Retreat", "1,321"],
      ],
    },
  },
  {
    name: "Benalmadena",
    count: "9,282 Properties",
    items: {
      buy: [
        ["Golden Mile Residences", "9,282"],
        ["Marbella Pearl Villas", "10,376"],
        ["Costa Azul Heights", "7,252"],
        ["La Brisa Luxury Homes", "13,868"],
        ["Marbella Bay Gardens", "3,705"],
        ["Sierra Blanca Retreat", "5,321"],
      ],
      rent: [
        ["Golden Mile Residences", "11,282"],
        ["Marbella Pearl Villas", "12,376"],
        ["Costa Azul Heights", "8,252"],
        ["La Brisa Luxury Homes", "13,868"],
        ["Marbella Bay Gardens", "2,705"],
        ["Sierra Blanca Retreat", "1,321"],
      ],
      new: [
        ["Golden Mile Residences", "28,202"],
        ["Marbella Pearl Villas", "10,376"],
        ["Costa Azul Heights", "18,252"],
        ["La Brisa Luxury Homes", "13,868"],
        ["Marbella Bay Gardens", "2,705"],
        ["Sierra Blanca Retreat", "1,321"],
      ],
    },
  },
]

export default function ExploreRegions() {
  const [selectedButton, setSelectedButton] = useState<ListingType>("buy");

  const dispatch = useDispatch()
  const router = useRouter()

  const handleNavigate = (region: string) => {
    dispatch(clearBreadcrumbs())
    dispatch(setBreadcrumbs([
      { label: "Home", href: "/" },
      { label: "Costa del Sol areas and Cities", href: App_url.link.COSTA_DEL_SOL },
      { label: region, href: `${App_url.link.COSTA_DEL_SOL}/${region}` },
    ]))
    router.push(`${App_url.link.COSTA_DEL_SOL}/${region}`)
  }

  const TABS: { label: string; value: ListingType }[] = [
    { label: "Buy", value: "buy" },
    { label: "Rent", value: "rent" },
    { label: "New", value: "new" },
  ];

  return (
    <section className="bg-[#F8FAFC] py-14">
      <div className=" lg:mx-10 px-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between mb-10 pb-5 border-b border-white/6">
          <h2 className="text-3xl capitalize font-manrope font-bold text-[#000000]">
            Explore homes by area
          </h2>

          <p className="text-slate_gray font-medium font-manrope text-md max-w-lg mt-4 md:mt-0">
            Navigate through Spain's most iconic provinces and find the municipality that fits your lifestyle.
          </p>
        </div>

        {/* TABS */}
        <div className="inline-flex gap-1 mb-10 rounded-lg bg-white p-1">
          {TABS.map((tab, i) => (
            <button
              key={i}
              onClick={() => setSelectedButton(tab?.value)}
              className={`px-4 py-2 font-manrope font-bold uppercase text-sm rounded-md  ${tab?.value === selectedButton
                ? "bg-[#0F172A] text-white"
                : "text-slate-500 hover:bg-slate-100"
                }`}
            >
              {tab?.label}
            </button>
          ))}
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {regions.map((region, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm flex flex-col"
            >
              <h3 className="font-manrope font-extrabold text-lg text-[#111827] mb-2">
                {region.name}
              </h3>

              <span className="inline-block text-xs font-medium text-[#64748B] tracking-wider w-fit uppercase bg-[#F3F4F6] px-3 py-1 rounded-md mb-4">
                {region.count}
              </span>

              <ul className="space-y-3 flex-1">
                {region?.items?.[selectedButton]?.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between text-sm text-[#64748B]"
                  >
                    <span className="flex items-center gap-2 font-manrope font-medium">
                      <ChevronRight className="w-4 h-4 text-[#64748B]" />
                      {item[0]?.length > 23 ? `${item[0]?.slice(0, 23)}...` : item[0]}
                    </span>
                    <span className="text-[#64748B] font-manrope font-medium">{item[1]}</span>
                  </li>
                ))}
              </ul>

              <button onClick={() => handleNavigate(region?.name)} className="mt-6 bg-[#4A86E8] text-white py-2 font-manrope font-bold rounded-full text-sm transition">
                View all listings
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
