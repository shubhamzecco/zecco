import PackageCard from "@/components/cards/package-card";
import {
  CircleStar,
  CircleUserRound,
  Crown,
  Gem
} from "lucide-react";

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

interface IPlan {
  title: string;
  icon: React.ReactNode,
  features: string[],
}

interface IPricePlans {
  heading: string,
  description: string;
}

export default function PricingPlans({ heading, description }: IPricePlans) {
  return (
    <section className="bg-[#F8FAFC] py-14">
      <div className="lg:mx-10 px-6">
        <div className="flex flex-col md:flex-row md:justify-between mb-14">
          <h2 className="text-3xl capitalize font-manrope font-bold text-[#000000]">
            {heading}
          </h2>
          <p className="text-slate_gray font-medium font-manrope text-md max-w-xl mt-4 md:mt-0">
            {description}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans?.map((plan, index) => (
            <PackageCard plan={plan} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
