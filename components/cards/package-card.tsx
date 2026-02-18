"use client"
import { ArrowRight, Check } from 'lucide-react';
import React from 'react'

interface IPackageProps {
    index: number
    plan: {
        title: string;
        icon: React.ReactNode,
        features: string[],
        price?: string,
        price_description?: string,
        description?: string;
        btn_title?: string
    }
}

const PackageCard = ({ index, plan }: IPackageProps) => {
    return (
        <div
            key={index}
            className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 flex flex-col"
        >
            <div className="flex items-center gap-3 mb-5">
                <div className="w-7 h-7 text-primary_blue rounded-lg bg-soft_sky_blue flex items-center justify-center">
                    {plan?.icon}
                </div>
                <h3 className="font-manrope capitalize font-extrabold text-lg text-[#000000]">
                    {plan?.title}
                </h3>
            </div>
            <div className="flex items-end gap-2 mb-5">
                <h3 className="font-manrope capitalize font-bold text-2xl text-[#000000]">
                    {plan?.price?.toLocaleLowerCase() === 'vip' ? plan?.price : `€ ${plan?.price}`}
                </h3>
                <p className='font-manrope capitalize font-semibold text-sm  text-[#64748B]'>{plan?.price_description}</p>
            </div>
            <p className='font-manrope capitalize font-medium text-xs  text-[#475569] mb-5'>{plan?.description}</p>
            <ul className="space-y-3 mb-8 flex-1">
                {plan?.features?.map((feature, i) => (
                    <li
                        key={i}
                        className="flex items-center gap-2.5 text-[13px] font-manrope font-semibold text-[#475569]"
                    >
                        <div className="w-5">
                            <Check
                                className="text-white mt-0.5 bg-[#4A86E8] rounded-full p-1"
                                size={22}
                            />
                        </div>
                        {feature}
                    </li>
                ))}
            </ul>
            <button className="w-full  text-sm text-[#000000] py-3 rounded-full border border-[#4A86E8] hover:text-white hover:bg-[#4A86E8] flex items-center justify-center gap-2 font-manrope font-semibold tracking-wider transition">
                {plan?.btn_title}
            </button>
        </div>
    )
}

export default PackageCard
