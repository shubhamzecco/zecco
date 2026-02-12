'use client'
import { App_url } from '@/constant/static'
import { usePosterReducers } from '@/redux/getdata/usePostReducer'
import { setBreadcrumbs } from '@/redux/modules/main/action'
import mainReducer from '@/redux/modules/main/reducer'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'

interface AreaCardProps {
  id: string
  title: string
  image: string
  description: string
  onNavigate?: () => void;
}

export default function AreaCard({
  id,
  title,
  image,
  description,
  onNavigate
}: AreaCardProps) {
  const router = useRouter()
  const dispatch = useDispatch()
  const { mainReducer } = usePosterReducers() // Access the mainReducer state
  const handleClick = () => {
    if (onNavigate) {
      onNavigate()
    } else {
      dispatch(setBreadcrumbs([
        ...mainReducer.breadcrumbs,
        { label: title, href: `${App_url.link.COSTA_DEL_SOL}/${id}` },
      ]))
      router.push(`${App_url.link.COSTA_DEL_SOL}/${id}`)
    }
  }


  return (
    <div
      className={`relative group rounded-2xl overflow-hidden shadow-md hover:shadow-xl h-[500px] transition-all cursor-pointer`}
      onClick={handleClick}
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
            <ArrowUpRight size={20} />
          </button>
        </div>
        <p className="text-sm text-white/50 font-manrope font-normal">{description}</p>
      </div>
    </div>
  )
}
