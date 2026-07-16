"use client";

import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { cityName, generateBreadcrumbs } from "@/utils/common";
import { ChevronsRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const slugToLabel = (slug: string) =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function buildFilterBreadcrumbs(
  city: string,
  area: string,
  subarea: string,
  bedroomText: string,
  bedroomsFrom: string,
  bedroomsTo: string,
  lastClickable = false,
) {
  const crumbs: { label: string; href?: string }[] = [
    { label: "Home", href: "/" },
    { label: "Costa del Sol Areas and Cities", href: "/costa-del-sol" },
  ];

  const cityLabel = city ? slugToLabel(city) : "";
  const areaLabel = area ? slugToLabel(area) : "";
  const subareaLabel = subarea ? slugToLabel(subarea) : "";
  const levels: { label: string; href?: string }[] = [];

  if (city) {
    const deeper = !!(area || subarea);
    const extra = !!(area || subarea || bedroomText);
    levels.push({
      label: `Properties in ${cityLabel}${extra ? " City" : ""}`,
      href: deeper ? `/costa-del-sol/properties?city=${city}` : undefined,
    });
  }

  if (area) {
    const deeper = !!subarea;
    levels.push({
      label: `Properties in ${areaLabel}${deeper ? " Area" : ""}`,
      href: deeper ? `/costa-del-sol/properties?city=${city}&area=${area}` : undefined,
    });
  }

  if (subarea) {
    levels.push({ label: `Properties in ${subareaLabel}` });
  }

  if (bedroomText && levels.length > 0) {
    const last = levels[levels.length - 1];
    const location = last.label.replace(/^Properties in /, "");
    last.label = `${bedroomText} in ${location}`;
  }

  if (lastClickable && levels.length > 0) {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (area) params.set("area", area);
    if (subarea) params.set("subarea", subarea);
    if (bedroomsFrom) params.set("bedroomsFrom", bedroomsFrom);
    if (bedroomsTo) params.set("bedroomsTo", bedroomsTo);
    levels[levels.length - 1].href = `/costa-del-sol/properties?${params.toString()}`;
  }

  crumbs.push(...levels);
  return crumbs;
}

const Breadcrumb = () => {
  const { mainReducer } = usePosterReducers();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const propertyDetails: any = mainReducer?.property_details ?? {};
  const propertyTitle = cityName(propertyDetails?.slug) || "";
  const isDetailPage = pathname.startsWith("/costa-del-sol/properties/");

  const city = searchParams.get("city") || "";
  const area = searchParams.get("area") || "";
  const subarea = searchParams.get("subarea") || "";
  const bedroomsFrom = searchParams.get("bedroomsFrom") || "";
  const bedroomsTo = searchParams.get("bedroomsTo") || "";
  const hasFilters = city || area || subarea || bedroomsFrom || bedroomsTo;

  const bedroomText = (() => {
    if (!bedroomsFrom && !bedroomsTo) return "";
    if (bedroomsFrom === bedroomsTo) {
      const n = bedroomsFrom;
      return n === "1" ? "1 Bedroom Property" : `${n} Bedroom Properties`;
    }
    if (bedroomsFrom && bedroomsTo) return `${bedroomsFrom}-${bedroomsTo} Bedroom Properties`;
    if (bedroomsFrom) return `${bedroomsFrom}+ Bedroom Properties`;
    return `Up to ${bedroomsTo} Bedroom Properties`;
  })();

  let breadcrumbs: { label: string; href?: string }[];

  if (isDetailPage) {
    if (hasFilters) {
      breadcrumbs = buildFilterBreadcrumbs(city, area, subarea, bedroomText, bedroomsFrom, bedroomsTo, true);
      breadcrumbs.push({ label: propertyTitle || "Property Details" });
    } else {
      breadcrumbs = generateBreadcrumbs(pathname, propertyDetails);
    }
  } else if (hasFilters) {
    breadcrumbs = buildFilterBreadcrumbs(city, area, subarea, bedroomText, bedroomsFrom, bedroomsTo, false);
  } else {
    breadcrumbs = generateBreadcrumbs(pathname, propertyDetails);
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="min-h-12 max-md:flex-wrap flex items-center gap-1 text-md font-manrope font-normal text-[#666666]"
    >
      {breadcrumbs.map((item: any, index: number) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <span key={index} className="flex items-center gap-1">
            {!isLast && item.href ? (
              <button
                onClick={() => router.push(item.href)}
                className="capitalize transition hover:text-black"
              >
                {item.label}
              </button>
            ) : (
              <span className="capitalize text-[#000000]">
                {item.label}
              </span>
            )}

            {!isLast && (
              <ChevronsRight size={20} className="mt-[2px] text-[#000000]" />
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
