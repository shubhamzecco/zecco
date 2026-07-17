import React from 'react'

interface ICommonCard {
    children: React.ReactNode;
    heading?: string;
    description?: string;
    className?:string
}

const CommonCard = ({ children, heading, description , className }: ICommonCard) => {
    return (
        <div className={`bg-white p-8 rounded-3xl border shadow-xl ${className}`}>
            {heading && (
                <h2 className="font-bold text-lg font-manrope text-[#0F172A]">
                    {heading}
                </h2>
            )}
            {description && (
                <p className="font-normal text-sm mb-4 font-manrope text-[#64748B]">{description}</p>
            )}
            {children}
        </div>
    )
}

export default CommonCard
