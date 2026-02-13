"use client"
import { App_url } from '@/constant/static'
import { ChevronDown, Search, Share2, TriangleAlert } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import Footer from '../Footer'
import Header from '../Header'
import Breadcrumb from '../breadcrumbs'

interface MainLayoutProps {
    children: React.ReactNode
    isBreadcrumb?: boolean
    isFilter?: boolean
    isPropertyDetails?: boolean;
    isPropertyType?: boolean;
    isProperty?: boolean;
    propertyCount?: number;
}

const HEADER_HEIGHT = 100       // h-16 (64px) + top spacing
const BREADCRUMB_HEIGHT = 10  // py-3
const FILTER_HEIGHT = 20    // search bar height

const MainLayout = ({
    children,
    isBreadcrumb = false,
    isFilter = false,
    isPropertyDetails = false,
    isPropertyType = false,
    isProperty = false,
    propertyCount = 0
}: MainLayoutProps) => {
    const pathname = usePathname()
    const router = useRouter()
    const topOffset =
        HEADER_HEIGHT +
        (isBreadcrumb ? BREADCRUMB_HEIGHT : 0) +
        (isFilter ? FILTER_HEIGHT : 0)
    return (
        <main className="w-full bg-white">
            <Header />
            <div style={{ height: HEADER_HEIGHT }} />
            <div className="lg:mx-7 px-4 sm:px-6 lg:px-8">
                {isBreadcrumb && (
                    <div className="flex justify-between items-center mb-3 gap-4">
                        <Breadcrumb />
                    </div>

                )}
                {isFilter && (
                    <div className="flex justify-between items-start mb-8 mt-8 gap-4">
                        <div className="relative flex-1 flex  items-center gap-3 w-1/2  rounded-[7px]">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder="Search by area"
                                className="w-full max-w-[22rem] bg-[#fcfcfc] placeholder:font-manrope font-normal placeholder:text-[#999999] h-9 pl-10 pr-4 rounded-[7px] border border-gray-300 
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {propertyCount !== 0 && (
                                <div className="">
                                    <p className='font-manrope font-semibold text-black'>{propertyCount} results in drawn area</p>
                                </div>
                            )}
                        </div>
                        {isPropertyType && (
                            <div className="inline-flex gap-1 rounded-lg bg-[#E5E7EB] p-1 shrink-0">
                                {["Buy", "Rent", "New"].map((tab, i) => (
                                    <button
                                        key={i}
                                        className={`px-4 py-1.5 font-manrope font-semibold uppercase text-xs rounded-md
                                        ${tab === "Buy"
                                                ? "bg-white text-black"
                                                : "text-[#6B7280] hover:bg-slate-100"
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        )}

                        {isProperty && (
                            <div className="space-y-3">
                                <div className="relative">
                                    <select
                                        // onChange={(e) => handleInputChange('propertyType', e.target.value)}
                                        className="w-full font-manrope font-bold text-[#000000] px-3 py-1.5 border border-gray-300 rounded-sm appearance-none bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                    >
                                        <option>Relevance</option>
                                        <option>House</option>
                                        <option>Villa</option>
                                        <option>Commercial</option>
                                    </select>
                                    <ChevronDown className="absolute right-1 top-2.5 w-4 h-4 text-[#000000] pointer-events-none" />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div
                style={{ minHeight: `calc(100vh - ${topOffset}px)` }}
                className={pathname === App_url?.link.PACKAGE ? '' : 'mt-2 mb-5'}
            >
                {children}
            </div>

            <Footer />
        </main>
    )
}

export default MainLayout
