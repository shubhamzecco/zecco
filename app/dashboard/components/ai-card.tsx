import CommonCard from '@/components/cards/common-card'
import { App_url } from '@/constant/static'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const AiCard = () => {
    const router = useRouter()
    return (
        <div>
            <CommonCard heading="AI Concierge" className="max-xl:h-full 2xl:h-[27.5vh] !py-4 max-2xl:!p-3.5">
                <p className="bg-[#edf0f7] p-2  2xl:my-4 m-1.5 tracking-wide  rounded-xl font-manrope text-[#64748B] font-medium text-xs xl:text-sm">
                    Based on your preferences, I've found new properties that match your budget and lifestyle. I continuously monitor the market to bring you personalized recommendations and notify you when the right opportunity appears.
                </p>
                <button
                    onClick={() => router.push(App_url.link.CONTACT_US)}
                    className="relative justify-center flex items-center gap-2 w-full mt-[16px]  py-3.5 px-10 rounded-2xl bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] text-white text-sm font-manrope font-extrabold shadow-md disabled:opacity-50"
                >
                    Chat with AI <ArrowRight className="w-4 h-4" />
                </button>
            </CommonCard>
        </div>
    )
}

export default AiCard
