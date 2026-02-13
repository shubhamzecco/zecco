import PackageCard from '@/components/cards/package-card';
import SidebarLayout from '@/components/layouts/sidebar-layout'
import { Box, Crown, LockKeyholeOpen, Shield, ShieldCheck, Zap } from 'lucide-react'

const AccountPackagePage = () => {
    const plans = [
        {
            title: "Zecco Free",
            icon: <LockKeyholeOpen className=" text-primary_blue" size={25} />,
            features: ["Free profile to search"],
        },
        {
            title: "Zecco Go",
            icon: <ShieldCheck className=" text-primary_blue" size={25} />,
            features: [
                "Paid package",
                "Availability of advanced AI agents",
                "Personal property advisor",
            ],
        },
        {
            title: "Zecco Plus",
            icon: <Box className=" text-primary_blue" size={25} />,
            features: [
                "Paid package",
                "Same as Go",
                "But then including Spain visit",
                "Viewings with local specialist",
            ],
        },
        {
            title: "Zecco vip",
            icon: <Crown className=" text-primary_blue" size={25} />,
            features: [
                "Same as Start but also including",
                "The full registration",
                "Contractual process finishing",
                "Transaction of purchase",
                "Verified Seller Priority",
            ],
        },
    ];
    return (
        <SidebarLayout>
            <div className="px-12  py-12 h-full
                            bg-gradient-to-r
                        from-[#60A5FA]/10
                        via-[#fafafa] via-[70%]
                        to-[#fafafa] to-[100%]">
                <section className="mt-5 mb-6">
                    <div className="flex justify-between items-center mb-1">
                        <h2 className="font-bold text-xl mb-4 font-inter text-[#111827]">Account Protocol</h2>
                    </div>
                    <div className="mb-8 rounded-lg bg-gradient-to-r from-[#1466EC]  from-[20%] to-[#02B8F9] w-full p-8 flex items-center gap-6">
                        <div className="flex items-center gap-6 justify-between w-full">
                            <div className="flex items-center gap-6">
                                <div className="bg-[#00004B]/20 p-4 rounded-full flex items-center justify-center">
                                    <ShieldCheck size={48} className="text-white" />
                                </div>
                                <div className="flex items-start flex-col gap-3">
                                    <div className="font-inter flex items-center gap-2 rounded-full px-3 py-1 font-bold text-sm tracking-wider backdrop-blur-md border  border-white/30 text-white">
                                        <Zap size={18} className="text-[#60A5FA] fill-[#60A5FA]" />
                                        Active Authorization
                                    </div>
                                    <h1 className="font-extrabold uppercase text-2xl font-inter text-white">Zecco Go</h1>
                                    <p className='font-inter font-bold text-[#BFDBFE] text-sm tracking-wider'>Renewing on April 12, 2026 • €199/mo</p>
                                </div>
                            </div>
                            <div className="font-inter flex items-center gap-2 rounded-full px-4 py-3 uppercase border-white/30 font-bold text-sm tracking-wider backdrop-blur-md border   text-white">
                                Billing Dashboard
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {plans?.splice(0, 3).map((plan, index) => (
                            <PackageCard plan={plan} index={index} />
                        ))}
                    </div>
                </section>
            </div>
        </SidebarLayout>
    )
}

export default AccountPackagePage
