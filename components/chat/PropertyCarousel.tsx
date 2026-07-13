"use client";

import { ChevronLeft, ChevronRight, Bed, Bath, Maximize2, MapPin } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface Property {
  _id: string;
  uID?: string;
  slug?: string;
  salePrice?: number;
  rentalPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  mtsBuild?: number;
  locationCity?: string;
  locationArea?: string;
  propertyType?: { id: number; name: string };
  isSale?: boolean;
  isRent?: boolean;
  imageUrl?: string | null;
}

interface Props {
  properties: Property[];
}

function formatPrice(p: Property): string {
  if (p.isSale && p.salePrice) return `€${p.salePrice.toLocaleString()}`;
  if (p.isRent && p.rentalPrice) return `€${p.rentalPrice.toLocaleString()}/mo`;
  if (p.salePrice) return `€${p.salePrice.toLocaleString()}`;
  if (p.rentalPrice) return `€${p.rentalPrice.toLocaleString()}/mo`;
  return "Price N/A";
}

export default function PropertyCarousel({ properties }: Props) {
  const [current, setCurrent] = useState(0);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = properties.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrent(((index % total) + total) % total);
    },
    [total],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next]);

  const p = properties[current];

  const location = [p.locationCity, p.locationArea].filter(Boolean).join(", ");
  const typeName = p.propertyType?.name || "Property";
  const hasImage = p.imageUrl && !imgErrors.has(current);

  return (
    <div className="relative w-full mt-3">
      {/* Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300">
        {/* Image */}
        <div className="relative h-44 sm:h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {hasImage ? (
            <Image
              key={p.imageUrl}
              src={p.imageUrl!}
              alt={location || typeName}
              fill
              className="object-cover transition-opacity duration-300"
              sizes="(max-width: 480px) 100vw, 480px"
              onError={() => setImgErrors((s) => new Set(s).add(current))}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <MapPin size={28} className="text-blue-400" />
              </div>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

          {/* Price badge */}
          <div className="absolute top-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm">
            <span className="text-sm font-bold text-blue-600">
              {formatPrice(p)}
            </span>
          </div>

          {/* Type badge */}
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm">
            <span className="text-[11px] font-medium text-gray-600">
              {typeName}
            </span>
          </div>

          {/* Nav arrows */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all"
                aria-label="Previous property"
              >
                <ChevronLeft size={18} className="text-gray-700" />
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all"
                aria-label="Next property"
              >
                <ChevronRight size={18} className="text-gray-700" />
              </button>
            </>
          )}
        </div>

        {/* Details */}
        <div className="p-3.5 space-y-2.5">
          {/* Location */}
          <div className="flex items-start gap-1.5">
            <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400" />
            <span className="text-[13px] text-gray-600 leading-tight line-clamp-1">
              {location || "Spain"}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4">
            {p.bedrooms != null && (
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Bed size={14} className="text-blue-500" />
                </div>
                <span className="text-[13px] font-medium text-gray-700">
                  {p.bedrooms}
                </span>
              </div>
            )}
            {p.bathrooms != null && (
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Bath size={14} className="text-teal-500" />
                </div>
                <span className="text-[13px] font-medium text-gray-700">
                  {p.bathrooms}
                </span>
              </div>
            )}
            {p.mtsBuild != null && (
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Maximize2 size={14} className="text-amber-500" />
                </div>
                <span className="text-[13px] font-medium text-gray-700">
                  {p.mtsBuild}m²
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dots */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {properties.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 h-2 bg-blue-600"
                  : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to property ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
