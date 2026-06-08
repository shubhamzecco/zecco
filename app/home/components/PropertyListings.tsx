"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { clearBreadcrumbs, setBreadcrumbs } from "@/redux/modules/main/action";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import PropertyCard from "../../../components/cards/PropertyCard";

export default function PropertyListings() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { mainReducer } = usePosterReducers();
  const { sendMessage, isConnected, lastEvent } = useWebSocket();

  const handleNavigate = () => {
    dispatch(clearBreadcrumbs());
    dispatch(
      setBreadcrumbs([
        { label: "Home", href: "/" },
        { label: "Zecco's Favorites", href: App_url.link.ZECCO_FAVORITES },
      ]),
    );
    router.push(`${App_url.link.ZECCO_FAVORITES}`);
  };

  useEffect(() => {
    sendMessage("action", {
      type: "propertyService",
      action: "list",
      payload: {
        limit: 10,
        page: 1,
        search: "",
        location_id: null,
        favorite: true,
      },
    });
  }, [isConnected]);

  useEffect(() => {
    if (
      lastEvent?.data?.status &&
      lastEvent?.data?.request?.type === "userService" &&
      (lastEvent?.data?.request?.action === "addFavorite" ||
        lastEvent?.data?.request?.action === "removeFavorite")
    ) {
      sendMessage("action", {
        type: "propertyService",
        action: "list",
        payload: {
          limit: 10,
          page: 1,
          search: "",
          location_id: null,
          favorite: true,
        },
      });
    }
  }, [lastEvent]);

  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-10 bg-white  lg:mx-10 mb-10">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold font-manrope text-[#00000]">
            Zecco's Favorites
          </h2>
          <button
            onClick={handleNavigate}
            className="rounded-full font-manrope bg-btn_color font-medium  px-3 lg:px-7   py-2 text-xs lg:text-sm shadow-sm  text-white "
          >
            View All Properties
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mainReducer?.zecco_favorite?.data?.slice(0, 8)?.map((property) => (
            <PropertyCard key={property._id} {...property} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}
