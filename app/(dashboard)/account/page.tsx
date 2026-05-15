"use client"
import { useWebSocket } from '@/api/socket/WebSocketContext';
import PackageCard from '@/components/cards/package-card';
import SidebarLayout from '@/components/layouts/sidebar-layout';
import { usePosterReducers } from '@/redux/getdata/usePostReducer';
import { formatDateMonth } from '@/utils/common';
import { CircleStar, CircleUserRound, Crown, Gem, ShieldCheck, Zap } from 'lucide-react';
import { useEffect } from 'react';

const AccountPackagePage = () => {
    const { user_data, mainReducer } = usePosterReducers()
    const { sendMessage, isConnected } = useWebSocket()
    const purchaseDate = user_data?.user?.package?.purchasedAt ? new Date(user_data.user.package.purchasedAt) : undefined

    useEffect(() => {
        sendMessage('action', {
            type: "paymentService",
            action: "payment_history",
            payload: {}
        })
    }, [isConnected])


    return (
        <SidebarLayout>
            <div className="lg:px-12 px-5  py-8 h-full
                            bg-gradient-to-r
                        from-[#60A5FA]/10
                        via-[#fafafa] via-[70%]
                        to-[#fafafa] to-[100%]">
                <section className="mt-5 mb-6">
                    <div className="flex justify-between items-center mb-1">
                        <h2 className="font-bold text-lg mb-4 font-inter text-[#111827]">Account Protocol</h2>
                    </div>
                    <div className="mb-8 rounded-lg bg-gradient-to-r from-[#1466EC]  from-[20%] to-[#02B8F9] w-full p-8 flex items-center gap-6">
                        <div className="lg:flex items-center gap-6 justify-between w-full">
                            <div className="flex items-center gap-6">
                                <div className="bg-[#00004B]/20 lg:p-4 p-2 rounded-full flex items-center justify-center">
                                    <ShieldCheck size={48} className="text-white" />
                                </div>
                                <div className="flex items-start flex-col gap-3">
                                    <div className="font-inter flex items-center gap-2 rounded-full px-3 py-1 font-bold text-[0.6rem] lg:text-sm tracking-wider backdrop-blur-md border  border-white/30 text-white">
                                        <Zap size={18} className="text-[#60A5FA] fill-[#60A5FA]" />
                                        Active Authorization
                                    </div>
                                    <h1 className="font-extrabold uppercase text-xl lg:text-2xl font-inter text-white">{user_data?.user?.package?.name}</h1>
                                    <p className='font-inter font-bold text-[#BFDBFE] text-[0.7rem] lg:text-sm tracking-wider'>Date Of Purchase {purchaseDate ? formatDateMonth(purchaseDate) : ''} • €{user_data?.user?.package?.price}</p>
                                </div>
                            </div>
                            <div className="font-inter flex items-center gap-2 rounded-full px-4 py-3 max-md:mt-2 uppercase border-white/30 font-bold text-[0.7rem] max-md:justify-center  lg:text-sm tracking-wider backdrop-blur-md border   text-white">
                                Billing Dashboard
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {mainReducer?.user_package_list?.map((plan, index) => (
                            <PackageCard plan={plan?.package} index={index} />
                        ))}
                    </div>
                </section>
            </div>
        </SidebarLayout>
    )
}

export default AccountPackagePage
