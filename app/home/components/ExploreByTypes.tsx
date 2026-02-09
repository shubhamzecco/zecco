import { App_url } from '@/constant/static'
import { Home, Building2, TrendingUp, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'

const typeCards = [
  {
    id: 'residential',
    icon: <Home size={48} className="text-white mb-4" />,
    title: 'Residential',
    description: 'Luxury homes, apartments, and villas for your dream lifestyle',
    propertiesCount: 2450,
  },
  {
    id: 'commercial',
    icon: <Building2 size={48} className="text-white mb-4" />,
    title: 'Commercial',
    description: 'Prime business spaces, offices, and retail opportunities',
    propertiesCount: 380,
  },
  {
    id: 'investment',
    icon: <TrendingUp size={48} className="text-white mb-4" />,
    title: 'Investment',
    description: 'High-ROI properties and portfolio opportunities',
    propertiesCount: 645,
  },
]

export default function ExploreByTypes() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#111C3A] to-[#16213E] py-20">

      {/* BACKGROUND BUILDING IMAGE */}
      <div className="absolute inset-0 -top-52 -left-72 w-full">
        <Image
          src={App_url.image.building}
          alt="Buildings"
          fill
          className="object-contain scale-125 brightness-0 invert opacity-30"
        />
      </div>

      {/* CONTENT */}
      <div className="relative lg:mx-10 px-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <h2 className="text-3xl font-manrope font-semibold text-white">
            Explore By Types
          </h2>

          <p className="text-white/50 font-manrope text-lg max-w-md mt-4 md:mt-0">
            Discover properties tailored to your lifestyle, business needs, and investment goals across Spain.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* CARD */}
          {[
            {
              title: "Residential",
              desc: "Apartments, villas, and townhouses for everyday living.",
              action: "Browse Residential",
            },
            {
              title: "Commercial",
              desc: "Offices, retail spaces, and business-ready properties.",
              action: "Browse Commercial",
            },
            {
              title: "Investment",
              desc: "High-yield properties with strong rental appreciation.",
              action: "Browse Investment",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="relative rounded-2xl border border-white/10 bg-white/5 p-6 text-white hover:bg-white/10 transition"
            >
              <h3 className="text-lg font-manrope font-semibold tracking-wider mb-4">
                {item.title}
              </h3>

              <p className="text-md font-manrope font-medium text-slate_gray max-w-[15rem] mb-8">
                {item.desc}
              </p>

              <button className="flex items-center gap-2 text-sm font-manrope tracking-wider font-bold text-white hover:text-[#38BDF8] transition">
                {item.action}
                <ArrowUpRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
