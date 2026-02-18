import PackageCard from '@/components/cards/package-card';
import SidebarLayout from '@/components/layouts/sidebar-layout';
import { CircleStar, CircleUserRound, Crown, Gem, ShieldCheck, Zap } from 'lucide-react';

const AccountPackagePage = () => {
    const plans = [
  {
    title: "Zecco Free",
    icon: <CircleUserRound className=" text-[#4A86E8]" size={20} />,
    price: '0',
    price_description: 'Free Forever',
    features: [
      "Free profile to search",
      "Safe searches",
      "Create favorites",
      "Respond and get in touch",
      "Advanced AI search / Report per month",
      "Getting ready for Zecco Go"
    ],
    description: 'Perfect for initial exploration and getting a feel for the market.',
    btn_title: 'Start Free'
  },
  {
    title: "Zecco Go",
    icon: <CircleStar className=" text-[#4A86E8]" size={20} />,
    features: [
      "Unlimited AI Searches and report",
      "AI Advisor at your disposal 24/7",
      "Personal property advisor",
      "Financial feasibility study based on financial situation",
      "Getting ready for Zecco Plus"
    ],
    price: '499',
    price_description: 'One time fee',
    description: 'For serious searchers who want the full power of AI advisor.',
    btn_title: 'Start Go'
  },
  {
    title: "Zecco Plus",
    icon: <Gem className=" text-[#4A86E8]" size={20} />,
    features: [
      "Execution plan: Viewing to purchase",
      "Planned visit to Spain with advisor",
      "Full purchase execution",
      "Registration, Taxation & Due Diligence",
      "Zecco Go fee deducted"
    ],
    price: '4,950',
    price_description: 'One-time payment',
    description: 'Complete guidance from orientation to the notary keys in hand.',
    btn_title: 'Full Execution Plan'
  },
  {
    title: "Zecco vip",
    icon: <Crown className=" text-[#4A86E8]" size={20} />,
    features: [
      "Refurbishment possibilities",
      "Land purchase to new build",
      "Deep due diligence",
      "Tailored specifically to you",
    ],
    price: 'VIP',
    price_description: 'For properties €2M+',
    description: 'Tailored service for high-net-worth individuals and bespoke needs.',
    btn_title: 'Enquire Now'
  },
];
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
                                    <h1 className="font-extrabold uppercase text-xl lg:text-2xl font-inter text-white">Zecco Go</h1>
                                    <p className='font-inter font-bold text-[#BFDBFE] text-[0.7rem] lg:text-sm tracking-wider'>Renewing on April 12, 2026 • €199/mo</p>
                                </div>
                            </div>
                            <div className="font-inter flex items-center gap-2 rounded-full px-4 py-3 max-md:mt-2 uppercase border-white/30 font-bold text-[0.7rem] max-md:justify-center  lg:text-sm tracking-wider backdrop-blur-md border   text-white">
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
