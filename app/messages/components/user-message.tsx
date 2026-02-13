import { App_url } from '@/constant/static'
import { Phone } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const UserMessage = () => {
    return (
        <div className="p-4 px-6 rounded-lg">
            <div className="mt-5 flex items-center gap-3 relative border-b border-[#DADADA] pb-5">
                <div className="relative w-16 h-16 border-2 rounded-full border-[#D9D8E1] p-1">
                    <Image
                        src={App_url.image.image_6}
                        alt="User Placeholder"
                        className='object-cover rounded-full'
                        width={70}
                        height={70}
                    />
                    {/* <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div> */}
                </div>
                <div className="">
                    <h1 className="font-semibold text-md font-inter text-[#111827] mb-1">Carlos Martínez</h1>
                    <p className="text-sm text-[#9391A1] font-inter font-normal">Agent</p>
                </div>
                <div className="ml-auto absolute right-0 top-1/2 -translate-y-1/2">
                    <div className="bg-[#111827] text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold font-sans">
                        <Phone size={20}/>
                    </div>
                </div>
            </div>
            <div className="mt-3">
                <p className='font-inter font-normal text-[#111827] text-center text-sm'>Yesterday</p>
            </div>
        </div>
    )
}

export default UserMessage
