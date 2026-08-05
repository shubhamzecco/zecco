"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import PackageCard from "@/components/cards/package-card";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { CircleStar, CircleUserRound, Crown, Gem } from "lucide-react";
import { useEffect } from "react";

interface IPricePlans {
  heading: string;
  description: string;
}

export default function PricingPlans({ heading, description }: IPricePlans) {
  const { sendMessage, isConnected } = useWebSocket();
  const { mainReducer } = usePosterReducers();

  useEffect(() => {
    sendMessage("action", {
      type: "packageService",
      action: "list",
      payload: {
        search: "",
        limit: 12,
        page: 1,
        status: true,
      },
    });
  }, [isConnected]);

  const sortPackagesByPrice = (packages: any[] = []) => {
    return packages.slice().sort((a, b) => {
      const getNumericPrice = (price: string) => {
        const cleaned = price?.replace(/[^\d]/g, "");
        return cleaned ? Number(cleaned) : NaN;
      };

      const priceA = getNumericPrice(a?.price);
      const priceB = getNumericPrice(b?.price);

      const isANumber = !isNaN(priceA);
      const isBNumber = !isNaN(priceB);

      if (isANumber && isBNumber) {
        return priceA - priceB;
      }

      if (isANumber && !isBNumber) {
        return -1;
      }

      if (!isANumber && isBNumber) {
        return 1;
      }

      return 0;
    });
  };

  return (
    <section className="bg-[#F8FAFC] py-14">
      <div className="lg:mx-10 px-6">
        <div className="flex flex-col lg:flex-row md:justify-between mb-14">
          <h2 className="text-3xl capitalize font-manrope font-bold text-[#000000]">
            {heading}
          </h2>
          <p className="text-slate_gray font-medium font-manrope text-md max-w-xl mt-4 md:mt-0">
            {description}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortPackagesByPrice(mainReducer?.package_list_with_limit?.data)?.map(
            (plan, index) => (
              <PackageCard
                key={plan?._id || index}
                plan={plan}
                index={index}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}
