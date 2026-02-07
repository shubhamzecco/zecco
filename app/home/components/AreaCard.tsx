import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'

interface AreaCardProps {
  id: string
  title: string
  image: string
  description: string
}

export default function AreaCard({
  title,
  image,
  description,
}: AreaCardProps) {
  return (
    <div
      className={`relative group rounded-2xl overflow-hidden shadow-md hover:shadow-xl h-[85vh] transition-all cursor-pointer`}
    >
      {/* Image */}
      <Image
        src={image || "/placeholder.svg"}
        alt={title}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-500"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex items-center justify-between ">
          <h3 className="text-xl sm:text-2xl  mb-1 font-manrope font-semibold">{title}</h3>
          <button className='text-white backdrop-blur-md bg-white/20 rounded-full p-2'>
            <ArrowUpRight size={20}/>
          </button>
        </div>
        <p className="text-sm text-white/50 font-manrope font-normal">{description}</p>
      </div>
    </div>
  )
}
