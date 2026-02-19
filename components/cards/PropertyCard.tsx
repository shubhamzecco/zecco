"use client";

import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setBreadcrumbs } from "@/redux/modules/main/action";
import {
  Bath,
  BedSingle,
  ChevronLeft,
  ChevronRight,
  Expand,
  Heart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

interface PropertyCardProps {
  id: string;
  title: string;
  price: string;
  location: string;
  images: string[];
  beds: number;
  baths: number;
  area: number;
  featured?: boolean;
  aiInsights?: boolean;
  isLiked?: boolean;
  onLikeToggle?: () => void;
}

export default function PropertyCard({
  id,
  title,
  price,
  location,
  images,
  beds,
  baths,
  area,
  featured = false,
  aiInsights = false,
  isLiked = false,
  onLikeToggle
}: PropertyCardProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { mainReducer } = usePosterReducers();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleNavigate = () => {
    dispatch(
      setBreadcrumbs([
        ...mainReducer?.breadcrumbs,
        { label: title, href: `${App_url.link.PROPERTY_DETAILS}/${id}` },
      ])
    );
    router.push(`${App_url.link.PROPERTY_DETAILS}/${id}`);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsSwiping(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;

    const distance = touchStartX - touchEndX;

    if (Math.abs(distance) > 50) {
      if (distance > 0) {
        setCurrentIndex((prev) =>
          prev === images.length - 1 ? 0 : prev + 1
        );
      }
      else {
        setCurrentIndex((prev) =>
          prev === 0 ? images.length - 1 : prev - 1
        );
      }
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  const handleCardClick = () => {
    if (!isSwiping) {
      handleNavigate(); // tap only
    }
  };


  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div
      onClick={handleCardClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="group bg-white overflow-hidden shadow-card transition-all cursor-pointer"
    >
      <div className="relative h-64 rounded-lg bg-gray-200 overflow-hidden">
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img, index) => (
            <div key={index} className="relative min-w-full h-full overflow-hidden">
              <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`${title}-${index}`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 opacity-0 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:pointer-events-auto"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        {images.length > 1 && (
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 opacity-0 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:pointer-events-auto"
          >
            <ChevronRight size={18} />
          </button>
        )}

        <div className="absolute top-4 left-4 flex gap-2">
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#1466EC] text-white text-[11px] font-manrope">
            <Sparkles size={12} />
            AI Verified
          </div>

          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#5BA55A] text-white text-[11px] font-manrope">
            <ShieldCheck size={12} />
            Verified Seller
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent navigation
            onLikeToggle?.();
          }}
          className="absolute top-4 right-4 w-10 h-10 backdrop-blur-md bg-white/30 rounded-full flex items-center justify-center hover:bg-red-50"
        >
          {isLiked ? (
            <Heart size={20} className="text-red-500 fill-red-500" />
          ) : (
            <Heart size={20} className="text-white hover:text-red-500" />
          )}
        </button>

        <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-lg text-sm text-[#0A0915] font-manrope">
          For Sale
        </div>

        {/* {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === currentIndex ? "w-4 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        )} */}

        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <div className="flex gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 rounded-full transition-all ${i === currentIndex
                    ? "w-4 bg-white"
                    : "w-2 bg-white/50"
                    }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-1 py-3">
        <div className="flex items-center justify-between">
          <p className="text-md font-manrope font-bold text-[#727272]">
            {price}
          </p>
          {aiInsights && (
            <p className="underline text-[#2563EB] font-manrope font-bold text-sm">
              AI Insights
            </p>
          )}
        </div>

        <h3 className="text-[0.9rem] text-[#0A0915] font-manrope font-medium max-w-[85%]">
          {title}
        </h3>

        <div className="flex gap-5 items-center pt-4 text-sm">
          <div className="flex font-manrope font-normal items-center gap-1">
            <Expand size={18} className="text-gray-400" />
            <span>{area} sq. ft.</span>
          </div>

          <div className="flex font-manrope font-normal items-center gap-1">
            <BedSingle size={18} className="text-gray-400" />
            <span>{beds} Bed</span>
          </div>

          <div className="flex font-manrope font-normal items-center gap-1">
            <Bath size={18} className="text-gray-400" />
            <span>{baths} Bath</span>
          </div>
        </div>
      </div>
    </div>
  );
}
