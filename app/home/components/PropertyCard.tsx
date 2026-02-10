import Image from 'next/image'
import {
  Heart,
  Bed,
  Bath,
  Maximize2,
  BedSingle,
  Expand,
  Sparkle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface PropertyCardProps {
  id: string
  title: string
  price: string
  location: string
  image: string
  beds: number
  baths: number
  area: number
  featured?: boolean
}

export default function PropertyCard({
  title,
  price,
  location,
  image,
  beds,
  baths,
  area,
  featured = false,
}: PropertyCardProps) {
  return (
    <div className="group bg-white overflow-hidden shadow-card transition-all">
      <div className="relative h-64 rounded-lg bg-gray-200 overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover  group-hover:scale-110 transition-transform duration-500"
        />

        <div className="absolute top-4 left-4 flex gap-2">
          <div className="inline-flex items-center gap-1.5 px-2 py-2 rounded-md bg-[#1466EC] text-white text-[11px] font-manrope font-medium leading-none backdrop-blur-md">
            <Sparkles size={12} className="text-white" />
            <span>AI Verified</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2 py-2 rounded-md bg-[#5BA55A] text-white text-[11px] font-manrope font-medium leading-none backdrop-blur-md">
            <ShieldCheck size={12} className="text-white" />
            <span>Verified Seller</span>
          </div>
        </div>

        <button className="absolute top-4 right-4 w-10 h-10 backdrop-blur-md bg-white/30 rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors">
          <Heart
            size={20}
            className="text-white hover:text-red-500 transition-colors"
          />
        </button>
        <div className="absolute bottom-4 left-4 font-manrope font-normal backdrop-blur-md bg-white/90 px-3 py-1 rounded-lg text-sm text-[#0A0915]">
          For Sale
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-md font-manrope font-bold  mt-2 text-[#727272]">
          {price}
        </p>
        <h3 className="text-[0.90rem] text-[#0A0915] font-manrope font-medium max-w-[85%]">
          {title}
        </h3>
        <div className="flex gap-5 items-center pt-2 text-gray-600 text-sm">
          <div className="flex items-center gap-1">
            <Expand size={18} className="text-gray-400" />
            <span className="font-manrope font-normal text-[#0A0915]">
              {area} sq. ft.
            </span>
          </div>
          <div className="flex items-center gap-1">
            <BedSingle size={18} className="text-gray-400" />
            <span className="font-manrope font-normal text-[#0A0915]">
              {beds} Bed
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Bath size={18} className="text-gray-400" />
            <span className="font-manrope font-normal text-[#0A0915]">
              {baths} Bath
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
