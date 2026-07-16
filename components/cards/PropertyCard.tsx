"use client";

import { useWebSocket } from "@/api/socket/WebSocketContext";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import {
  setLoginPopup,
  setUpdatePropertyLike,
} from "@/redux/modules/main/action";
import { IProperty } from "@/redux/modules/main/types";
import {
  Bath,
  BedSingle,
  ChevronLeft,
  ChevronRight,
  Expand,
  Heart,
  ShieldCheck,
  Sparkles,
  Tag,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LoginPopup from "../login-popup";
import { citySlug, formatEuro } from "@/utils/common";

interface PropertyCardProps {
  featured?: boolean;
  aiInsights?: boolean;
  isLiked?: boolean;
  property: IProperty;
  onLikeToggle?: () => void;
  onNavigate?: (property: IProperty) => void;
}
const PropertyCard = ({
  aiInsights = false,
  property,
  onNavigate,
}: PropertyCardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isZeccoFaviourite = pathname === "/zecco-favorites"
  const dispatch = useDispatch();
  const { mainReducer, user_data } = usePosterReducers();
  const { sendMessage, lastEvent } = useWebSocket();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const getIsFavoriteFromStore = () =>
    mainReducer?.property_list_with_limit?.favorite_property?.includes(
      String(property?._id),
    ) ||
    mainReducer?.zecco_favorite?.favorite_property?.includes(
      String(property?._id),
    ) ||
    mainReducer?.favorite_property_list?.data?.some(
      (item) => String(item._id) === String(property?._id),
    );

  const [isFavorite, setIsFavorite] = useState(getIsFavoriteFromStore);

  useEffect(() => {
    setIsFavorite(getIsFavoriteFromStore());
  }, [
    mainReducer?.property_list_with_limit?.favorite_property,
    mainReducer?.zecco_favorite?.favorite_property,
    mainReducer?.favorite_property_list?.data,
    property?._id,
    property?.favorite,
  ]);
  
  const propertyIdentifier = property?.slug || property?._id;
  const propertyDetailUrl = `${pathname.replace(/\/$/, "")}/${propertyIdentifier}${window.location.search || ""}`;

  const handleNavigate = () => {
    router.push(propertyDetailUrl);
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
          prev === property?.propertyImages.length - 1 ? 0 : prev + 1,
        );
      } else {
        setCurrentIndex((prev) =>
          prev === 0 ? property?.propertyImages.length - 1 : prev - 1,
        );
      }
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  const handleCardClick = () => {
    if (!isSwiping) {
      if (onNavigate) {
        onNavigate(property);
      } else handleNavigate(); // tap only
    }
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === property?.propertyImages?.length - 1 ? 0 : prev + 1,
    );
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === 0 ? property?.propertyImages?.length - 1 : prev - 1,
    );
  };

  const handleFavoriteAdd = () => {
    if (!user_data?.access_token) {
      dispatch(setLoginPopup(true));
      return;
    }

    const nextFavorite = !isFavorite;
    setIsFavorite(nextFavorite);
    dispatch(
      setUpdatePropertyLike({
        property_id: property?._id,
        isFavorite: nextFavorite,
      }),
    );

    sendMessage("action", {
      type: "userService",
      action: nextFavorite ? "addFavorite" : "removeFavorite",
      payload: {
        property_id: property?._id,
      },
    });
  };

  return (
    <div
      onClick={handleCardClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`${property?.isSold || property?.zeccoSold || property?.isRented || property?.zeccoRented ? "pointer-events-none select-none cursor-not-allowed" : "cursor-pointer"} group bg-white shadow-md border rounded-2xl overflow-hidden transition-all`}
    >
      <div className="relative h-64 rounded-t-2xl bg-gray-200 overflow-hidden">
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {property?.propertyImages?.slice(0, 3).map((img, index) => (
            <div
              key={index}
              className="relative min-w-full h-full overflow-hidden"
            >
              <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                <Image
                  src={img?.url || "/placeholder.svg"}
                  alt={`${"property"}-${index}`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {property?.propertyImages?.length > 1 && (
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 opacity-0 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:pointer-events-auto"
            aria-label="up"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        {property?.propertyImages?.length > 1 && (
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 opacity-0 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:pointer-events-auto"
            aria-label="up"
          >
            <ChevronRight size={18} />
          </button>
        )}

        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {property?.property_tags?.map((tag: any) => {
            const tagName = tag?.name?.trim() || "";
            const normalizedTag = tagName?.toLowerCase();

            let Icon = null;
            let className =
              "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-white text-[11px] font-manrope";

            if (["ai verified"].includes(normalizedTag)) {
              Icon = Sparkles;
              className += " bg-[#1466EC]";
            } else if (["verified seller"].includes(normalizedTag)) {
              Icon = ShieldCheck;
              className += " bg-[#5BA55A]";
            } else if (["zecco favourites"].includes(normalizedTag)) {
              Icon = Heart;
              className += " bg-[#F59E0B]";
            } else {
              Icon = Tag;
              className += " bg-gray-500";
            }

            return (
              <div key={tag?._id} className={className}>
                <Icon size={12} />
                <span>{tagName}</span>
              </div>
            );
          })}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFavoriteAdd?.();
          }}
          className="absolute top-4 right-4 w-10 h-10 backdrop-blur-md bg-white/80 rounded-full flex items-center justify-center hover:bg-red-50"
          aria-label="up"
        >
          {isFavorite ? (
            <Heart size={20} className="text-red-500 fill-red-500" />
          ) : (
            <Heart size={20} className="text-white hover:text-red-500" />
          )}
        </button>

        <div className="absolute bottom-4 left-3 bg-white/90 px-3 py-1 rounded-lg text-sm text-[#0A0915] font-manrope">
          {property?.isSale && property?.isRent
            ? "Rent / Sale"
            : property?.isSale
              ? "For Sale"
              : property?.isRent
                ? "For Rent"
                : ""}
        </div>
        {property?.propertyImages?.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <div className="flex gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm">
              {property?.propertyImages?.slice(0, 3).map((_, i) => (
                <span
                  key={i}
                  className={`h-2 rounded-full transition-all ${i === currentIndex ? "w-4 bg-white" : "w-2 bg-white/50"
                    }`}
                />
              ))}
            </div>
          </div>
        )}
        {(property?.isSold ||
          property?.zeccoSold ||
          property?.isRented ||
          property?.zeccoRented) && (
            <>
              <div className="absolute inset-0 bg-black/45 z-20" />
              <div className="absolute inset-0 z-30 flex items-center justify-center">
                <div className="relative w-full flex items-center justify-center">
                  <div className="absolute w-full h-[2px]" />
                  <div className="relative w-full text-center px-8 py-3 bg-white/20 text-white text-xl font-bold tracking-[0.3em] uppercase rounded-sm shadow-2xl">
                    {property?.isSold || property?.zeccoSold
                      ? "Sold Out"
                      : "Rent Out"}
                  </div>
                </div>
              </div>
            </>
          )}
      </div>
      <div className="space-y-1 py-3 px-4">
        <div className="flex items-center justify-between">
          {property?.isSale && property?.isRent ? (
            <div className="text-md font-manrope font-bold text-[#727272] w-full">
              {property?.isSale && property?.isRent ? (
                <div className="items-center w-full">
                  <p className="text-md font-manrope font-bold text-[#727272]">
                    Sale : {formatEuro(property?.salePrice ?? 0)}
                  </p>
                  <p className="text-md font-manrope font-bold text-[#727272]">
                    Rent :{" "}
                    {formatEuro(
                      property?.rentalPrice ??
                      property?.rentalPriceLong ??
                      property?.rentalPriceShort ??
                      0,
                    )}
                  </p>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-md font-manrope font-black text-[#0F172A]">
              {property?.isRent
                ? formatEuro(
                  property?.rentalPrice ??
                  property?.rentalPriceLong ??
                  property?.rentalPriceShort ??
                  0,
                )
                : formatEuro(property?.salePrice ?? 0)}
            </p>
          )}
          {aiInsights && (
            <p className="underline text-[#2563EB] font-manrope font-bold text-sm">
              AI Insights
            </p>
          )}
        </div>

        <h3 className="text-[0.9rem] text-[#0A0915] font-manrope font-medium max-w-[85%] pb-1">
          {property?.bedrooms ? `${property?.bedrooms} Bedroom ` : ""}{" "}
          {property?.propertyType
            ? property?.propertyType?.name
            : property?.propertyCategory?.name}{" "}
          for{" "}
          {property?.isSale && property?.isRent
            ? "Sale or Rent"
            : property?.isSale
              ? "Sale"
              : property?.isRent
                ? "Rent"
                : ""}{" "}
          in {property?.locationSubarea ? `${property?.locationSubarea},` : ""}{" "}
          {property?.locationArea ? `${property?.locationArea},` : ""}{" "}
          {property?.locationCity}, {property?.locationCountry}
        </h3>

        <div className="flex gap-5 justify-between items-center pt-2.5 text-sm border-t">
          {property?.mtsBuild !== null && property?.mtsBuild !== undefined && (
            <div className="flex font-manrope font-normal items-center gap-1">
              <Expand size={18} className="text-gray-400" />
              <span>{property?.mtsBuild} m²</span>
            </div>
          )}

          {property?.bedrooms !== null && property?.bedrooms !== undefined && (
            <div className="flex font-manrope font-normal items-center gap-1">
              <BedSingle size={18} className="text-gray-400" />
              <span>{property?.bedrooms} Bed</span>
            </div>
          )}

          {property?.bathrooms !== null &&
            property?.bathrooms !== undefined && (
              <div className="flex font-manrope font-normal items-center gap-1">
                <Bath size={18} className="text-gray-400" />
                <span>{property?.bathrooms} Bath</span>
              </div>
            )}
        </div>
      </div>

      <LoginPopup />
    </div>
  );
};

export default React.memo(PropertyCard);
