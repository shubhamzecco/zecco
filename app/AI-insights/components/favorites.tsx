"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import PropertyCard from "@/components/cards/PropertyCard";
import PropertyCardSkeleton from "@/app/costa-del-sol/properties/components/PropertyCardSkeleton";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setAiSelectedProperty } from "@/redux/modules/main/action";
import { IProperty } from "@/redux/modules/main/types";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Heart } from "lucide-react";

type AiInsightsProps = {
  onGetStarted: (property: IProperty | null) => void;
};

const FavoritesPage = ({ onGetStarted }: AiInsightsProps) => {
  const { isConnected, sendMessage } = useWebSocket();
  const { mainReducer } = usePosterReducers();
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState<string | null>(
    mainReducer?.ai_selected_property?._id || null,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (mainReducer?.ai_selected_property) {
      onGetStarted(mainReducer.ai_selected_property);
      dispatch(setAiSelectedProperty(null));
    }
  }, [mainReducer?.ai_selected_property]);

  const properties = mainReducer?.favorite_property_list?.data;

  useEffect(() => {
    if (isConnected) {
      sendMessage("action", {
        type: "userService",
        action: "favoritePropertyList",
        payload: {},
      });
    }
  }, [isConnected]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const update = () => {
      const w = container.clientWidth;
      if (w >= 1024) setCardsPerPage(3);
      else if (w >= 640) setCardsPerPage(2);
      else setCardsPerPage(1);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, [properties?.length]);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container || !properties?.length) return;

    const atEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;
    if (atEnd) {
      setActiveIndex(properties.length - 1);
      return;
    }

    const atStart = container.scrollLeft <= 1;
    if (atStart) {
      setActiveIndex(0);
      return;
    }

    const center = container.scrollLeft + container.clientWidth / 2;
    let closestIdx = 0;
    let closestDist = Infinity;
    Array.from(container.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const childCenter = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(center - childCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    });
    setActiveIndex(closestIdx);
  };

  const totalPages = Math.ceil((properties?.length ?? 0) / cardsPerPage);
  const activePage = Math.min(Math.floor(activeIndex / cardsPerPage), totalPages - 1);

  const scrollToPage = (pageIdx: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const card = container.children[0] as HTMLElement;
    if (!card) return;
    const cardWidth = card.offsetWidth + 16;
    const targetIdx = Math.min(cardsPerPage * pageIdx, (properties?.length ?? 1) - 1);
    container.scrollTo({ left: cardWidth * targetIdx, behavior: "smooth" });
    setActiveIndex(targetIdx);
  };

  const cardContent = (property: IProperty) => {
    const isSelected = selectedId === property._id;
    return (
      <PropertyCard
        property={property}
        {...property}
        isSelected={isSelected}
        onNavigate={() => onGetStarted(property)}
      />
    );
  };

  return (
    <section className="mt-4 w-full">
      {!mainReducer?.favorite_property_list ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      ) : (properties?.length ?? 0) > 0 ? (
        <>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory
             py-3 !px-1 ml-2 lg:max-w-[70vw]
             [-ms-overflow-style:none]
             [scrollbar-width:none]
             [&::-webkit-scrollbar]:hidden"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {properties?.map((property) => {
              const isSelected = selectedId === property._id;
              return (
                <div
                  key={property._id}
                  onClick={() => {
                    setSelectedId(isSelected ? null : property._id)
                    onGetStarted(isSelected ? null : property)
                  }}
                  className={`relative snap-center flex-none max-sm:w-[80vw] max-sm:max-w-[280px] sm:max-w-none sm:w-[calc((100%-16px)/2)] lg:w-[calc((100%-32px)/3)] cursor-pointer transition-all duration-300`}
                >
                  {cardContent(property)}
                </div>
              );
            })}
          </div>

          {properties && totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-5">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToPage(idx)}
                  className={`rounded-full transition-all duration-300 ${idx === activePage
                    ? "w-7 h-2.5 bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] shadow-[0_0_8px_#5DAEFF]"
                    : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
                    }`}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-14 px-4">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center">
              <Heart size={48} className="text-red-400" strokeWidth={1.5} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 font-manrope mb-2">
            No Favorite Properties Yet
          </h2>
          <p className="text-center text-sm text-gray-500 font-manrope max-w-md mb-6">
            Explore properties, save your favorites, and unlock AI-powered insights to make smarter decisions.
          </p>
          <button
            onClick={() => router.push("/costa-del-sol/properties?select=true")}
            className="relative w-fit mx-auto mt-8 text-xs sm:text-sm whitespace-nowrap my-5 py-3.5 px-4 sm:px-10 rounded-full flex items-center bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] text-white font-manrope font-medium shadow-md disabled:opacity-50 "
          >
            Browse Properties
          </button>
        </div>
      )}
    </section>
  );
};

export default FavoritesPage;
