"use client"
import { ArrowRight, Check } from 'lucide-react';
import React from 'react'

interface IPackageProps {
    index: number
    plan: {
        title: string;
        icon: React.ReactNode,
        features: string[],
    }
}

const PackageCard = ({ index, plan}: IPackageProps) => {
    return (
        <div
            key={index}
            className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 flex flex-col"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 text-primary_blue rounded-lg bg-soft_sky_blue flex items-center justify-center">
                    {plan?.icon}
                </div>
                {/* <div className="pb-5">
                  <CreditCard className="text-[#EBEDF2]" size={50} />
                </div> */}
            </div>
            <h3 className="font-manrope capitalize font-extrabold text-2xl text-[#000000] mb-4">
                {plan?.title}
            </h3>
            <ul className="space-y-3 mb-8 flex-1">
                {plan?.features?.map((feature, i) => (
                    <li
                        key={i}
                        className="flex items-start gap-2 text-[13px] font-manrope font-bold text-[#475569]"
                    >
                        <Check
                            className="text-primary_blue mt-0.5 bg-soft_sky_blue rounded-full p-1"
                            size={22}
                        />
                        {feature}
                    </li>
                ))}
            </ul>
            <button className="w-full bg-[#0F172A] text-sm text-white py-3 rounded-xl flex items-center justify-center gap-2 font-manrope font-semibold tracking-wider transition">
                Choose Package
                <ArrowRight size={20} />
            </button>
        </div>
    )
}

export default PackageCard
