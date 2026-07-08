"use client";

import { useWebSocket } from "@/api/socket/WebSocketContext";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AreaCard from "../../../components/cards/AreaCard";


export default function AreasOfInterest() {
  const router = useRouter();
  const { sendMessage, isConnected } = useWebSocket();
  const { mainReducer } = usePosterReducers();

  const handleNavigate = () => {
    router.push(`${App_url.link.COSTA_DEL_SOL}`);
  };

  useEffect(() => {
    sendMessage("action", {
      type: "locationService",
      action: "list",
      payload: {
        search: "",
        limit: 12,
        page: 1,
        status: true,
      },
    });
  }, [isConnected]);
  return (
    <section className="bg-white  px-4 sm:px-6 lg:px-8">
      <div className="lg:mx-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold font-manrope text-[#00000]">
            Costa del Sol Areas of Interest
          </h2>
          <div className=" gap-2 hidden sm:flex">
            <button
              onClick={handleNavigate}
              className="rounded-full font-manrope bg-btn_color font-medium  px-7  py-2 text-sm shadow-sm  text-white "
            >
              View All Cities
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="relative">
          <div
            id="areas-scroll"
            className="overflow-x-auto scrollbar-hide"
            style={{ scrollBehavior: "smooth" }}
          >
            <div className="grid lg:grid-cols-3 grid-cols-1 gap-5">
              {(mainReducer?.location_list_with_limit?.data &&
              mainReducer?.location_list_with_limit?.data?.length > 3
                ? mainReducer?.location_list_with_limit?.data?.slice(0, 3)
                : mainReducer?.location_list_with_limit?.data
              )?.map((area) => (
                <div key={area._id} className="flex-shrink-0 w-full">
                  <AreaCard {...area} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Scroll Buttons */}
        <div className="flex gap-2 sm:hidden mt-4 justify-center">
          <button
            onClick={handleNavigate}
            className="rounded-full font-manrope bg-btn_color font-medium  px-7  py-2 text-sm shadow-sm  text-white "
          >
            View All Cities
          </button>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
