import { ArrowRight, Box, Check, CircleCheck, CreditCard, LockKeyholeOpen, ShieldCheck } from "lucide-react"

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
    icon: <CircleCheck className=" text-primary_blue" size={25} />,
    features: [
      "Same as Start but also including",
      "The full registration",
      "Contractual process finishing",
      "Transaction of purchase",
      "Verified Seller Priority",
    ],
  },
]

export default function PricingPlans() {
  return (
    <section className="bg-[#F8FAFC] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:justify-between mb-14">
          <h2 className="text-3xl font-manrope font-bold text-[#000000]">
            Choose your Zecco plan
          </h2>
          <p className="text-slate_gray font-medium font-manrope text-md max-w-xl mt-4 md:mt-0">
            Unlock the full power of our AI-driven distribution network and dominate the Spanish property market.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 text-primary_blue rounded-lg bg-soft_sky_blue flex items-center justify-center">
                  {plan.icon}
                </div>
                {/* <div className="pb-5">
                  <CreditCard className="text-[#EBEDF2]" size={50} />
                </div> */}
              </div>
              <h3 className="font-manrope uppercase font-extrabold text-2xl text-[#000000] mb-4">
                {plan.title}
              </h3>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] font-manrope font-bold text-[#475569]">
                    <Check className="text-primary_blue mt-0.5 bg-soft_sky_blue rounded-full p-1" size={22} />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-[#0F172A] text-sm text-white py-3 rounded-xl flex items-center justify-center gap-2 font-manrope font-semibold tracking-wider transition">
                Choose Package
                <ArrowRight size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
