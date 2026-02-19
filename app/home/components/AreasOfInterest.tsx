'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import AreaCard from '../../../components/cards/AreaCard'
import { Button } from '@/components/ui/button'
import { App_url } from '@/constant/static'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { clearBreadcrumbs, setBreadcrumbs } from '@/redux/modules/main/action'

const areasData = [
  {
    id: '1',
    title: 'Marbella',
    image: App_url.image.marbella,
    description: 'The Luxury Coastal Icon',
  },
  {
    id: '2',
    title: 'Malaga',
    image: App_url.image.malaga,
    description: 'The Cultural Capital of the Costa',
  },
  {
    id: '3',
    title: 'Costa del Sol',
    image: App_url.image.costa_del_sol,
    description: 'The Garden of the Costa del Sol',
  }
]

export default function AreasOfInterest() {
  const dispatch = useDispatch()
  const router = useRouter()

  const handleNavigate = () => {
    dispatch(clearBreadcrumbs())
    dispatch(setBreadcrumbs([
      { label: "Home", href: "/" },
      { label: "Costa del Sol areas and Cities", href: App_url.link.COSTA_DEL_SOL },
    ]))
    router.push(`${App_url.link.COSTA_DEL_SOL}`)
  }
  return (
    <section className="bg-white  px-4 sm:px-6 lg:px-8">
      <div className="lg:mx-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-manrope text-[#00000]">
            Costa del Sol Areas Of Interest
          </h2>
          <div className=" gap-2 hidden sm:flex">
            <button onClick={handleNavigate} className='rounded-full font-manrope bg-btn_color font-medium  px-7  py-2 text-sm shadow-sm  text-white '>
              View All Cities
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="relative">
          <div
            id="areas-scroll"
            className="overflow-x-auto scrollbar-hide"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="grid lg:grid-cols-3 grid-cols-1 gap-5">
              {areasData?.map((area) => (
                <div
                  key={area.id}
                  className={`flex-shrink-0 w-full`}
                >
                  <AreaCard {...area} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Scroll Buttons */}
        <div className="flex gap-2 sm:hidden mt-4 justify-center">
          <button onClick={handleNavigate} className='rounded-full font-manrope bg-btn_color font-medium  px-7  py-2 text-sm shadow-sm  text-white '>
              View All Cities
            </button>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}
