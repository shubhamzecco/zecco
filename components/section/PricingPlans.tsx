import PackageCard from "@/components/cards/package-card";
import {
  Box,
  Crown,
  LockKeyholeOpen,
  Shield,
  ShieldCheck,
  Zap
} from "lucide-react";

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
    <section className="bg-[#F8FAFC] py-20">
      <div className="lg:mx-10 px-6">
        <div className="flex flex-col md:flex-row md:justify-between mb-14">
          <h2 className="text-3xl capitalize font-manrope font-bold text-[#000000]">
            {heading}
          </h2>
          <p className="text-slate_gray font-medium font-manrope text-md max-w-xl mt-4 md:mt-0">
            {description}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans?.map((plan, index) => (
            <PackageCard plan={plan} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
