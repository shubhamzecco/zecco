import { App_url } from '@/constant/static'
import { Bath, BedSingle, Expand, SparkleIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const AiInsights = () => {
    return (
        <section className="mt-10 mb-6">
            <h2 className="font-bold text-lg mb-4 font-inter text-[#111827]">AI Insights: Best Value Marbella</h2>
            <div className="flex flex-col gap-6">

                <div className="bg-white/70 rounded-2xl relative">
                    <div className=" bg-[#EEF2FF] border border-[#E0E7FF] rounded-full px-3 py-1 absolute top-3 right-4 flex items-center gap-1">
                        <p className='font-manrope font-semibold text-[#2828FF] text-xs'>+8.2% p.a.</p>
                    </div>
                    <div className="lg:flex items-start gap-3">
                        <div className="lg:h-[212px] lg:w-[280px]">
                            <Image
                                src={App_url.image.image_6}
                                alt="AI Insights"
                                width={220}
                                height={270}
                                className="lg:rounded-l-2xl max-md:rounded-t-2xl object-cover h-full w-full max-md:w-full"
                            />
                        </div>
                        <div className="">
                            <h1 className="font-bold text-lg font-inter px-4 pt-4 text-[#111827]">Example Modernist Penthouse</h1>
                            <div className="flex gap-5 items-center pt-2 px-4 text-sm">
                                <div className="flex font-inter font-medium items-center gap-1 text-[#4B5563]">
                                    €2,450,000
                                </div>
                                <div className="flex font-manrope font-normal items-center gap-1">
                                    <BedSingle size={18} className="text-gray-400" />
                                    <span>3 Bed</span>
                                </div>
                                <div className="flex font-manrope font-normal items-center gap-1">
                                    <Bath size={18} className="text-gray-400" />
                                    <span>2 Bath</span>
                                </div>
                            </div>

                            <div className="bg-[#F2F3F6] mt-4 p-3 mx-4 mb-3 rounded-lg border border-[#F3F4F6] max-w-2xl">
                                <h1 className='font-inter font-medium text-[#4B5563] flex items-center '>
                                    <Image
                                        src={App_url.image.chat_logo}
                                        alt="AI Insights"
                                        width={20}
                                        height={20}
                                        className=" object-cover mr-2"
                                    />
                                    AI Rationale
                                </h1>
                                <p className='font-manrope font-normal text-sm my-3'>
                                    “Located in the coveted ‘Cuadrat d’Or’, these historic assets benefit from architectural scarcity and high demand from international luxury buyers seeking heritage properties.”
                                </p>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="bg-white/70 rounded-2xl relative">
                    <div className=" bg-[#EEF2FF] border border-[#E0E7FF] rounded-full px-3 py-1 absolute top-3 right-4 flex items-center gap-1">
                        <p className='font-manrope font-semibold text-[#2828FF] text-xs'>+8.2% p.a.</p>
                    </div>
                    <div className="lg:flex items-start gap-3">
                        <div className="lg:h-[212px]">
                            <Image
                                src={App_url.image.image_3}
                                alt="AI Insights"
                                width={220}
                                height={170}
                                unoptimized
                                priority
                                className="lg:rounded-l-2xl max-md:rounded-t-2xl object-cover h-full w-full max-md:w-full"
                            />
                        </div>
                        <div className="">
                            <h1 className="font-bold text-lg font-inter px-4 pt-4 text-[#111827]">Example Modernist Penthouse</h1>
                            <div className="flex gap-5 items-center pt-2 px-4 text-sm">
                                <div className="flex font-inter font-medium items-center gap-1 text-[#4B5563]">
                                    €2,450,000
                                </div>
                                <div className="flex font-manrope font-normal items-center gap-1">
                                    <BedSingle size={18} className="text-gray-400" />
                                    <span>3 Bed</span>
                                </div>
                                <div className="flex font-manrope font-normal items-center gap-1">
                                    <Bath size={18} className="text-gray-400" />
                                    <span>2 Bath</span>
                                </div>
                            </div>

                            <div className="bg-[#F2F3F6] mt-4 p-3 mx-4 mb-3 rounded-lg border border-[#F3F4F6] max-w-2xl">
                                <h1 className='font-inter font-medium text-[#4B5563] flex items-center '>
                                    <Image
                                        src={App_url.image.chat_logo}
                                        alt="AI Insights"
                                        width={20}
                                        height={20}
                                        className=" object-cover mr-2"
                                    />
                                    AI Rationale
                                </h1>
                                <p className='font-manrope font-normal text-sm my-3'>
                                    “Located in the coveted ‘Cuadrat d’Or’, these historic assets benefit from architectural scarcity and high demand from international luxury buyers seeking heritage properties.”
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AiInsights
