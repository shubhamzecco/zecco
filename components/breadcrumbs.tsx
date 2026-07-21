"use client";

import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { cityName, generateBreadcrumbs } from "@/utils/common";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronsRight } from "lucide-react";
import { useState } from "react";
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
  const [mobileOpen, setMobileOpen] = useState(false);

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

  type BreadcrumbLink = { label: string; href?: string };
  let breadcrumbs: BreadcrumbLink[];

  const sanitizeBreadcrumbs = (items: Array<{ label: string; href?: string | null }>) =>
    items.map((item) => ({ label: item.label, href: item.href ?? undefined }));

  if (isDetailPage) {
    if (hasFilters) {
      breadcrumbs = buildFilterBreadcrumbs(city, area, subarea, bedroomText, bedroomsFrom, bedroomsTo, true);
      breadcrumbs.push({ label: propertyTitle || "Property Details" });
    } else {
      breadcrumbs = sanitizeBreadcrumbs(generateBreadcrumbs(pathname, propertyDetails));
    }
  } else if (hasFilters) {
    breadcrumbs = buildFilterBreadcrumbs(city, area, subarea, bedroomText, bedroomsFrom, bedroomsTo, false);
  } else {
    breadcrumbs = sanitizeBreadcrumbs(generateBreadcrumbs(pathname, propertyDetails));
  }

  const shouldCollapseMobile = breadcrumbs.length > 2;
  const shouldCollapseTablet = breadcrumbs.length > 3;
  const shouldCollapseDesktop = breadcrumbs.length > 4;

  const visibleBreadcrumbsMobile = shouldCollapseMobile
    ? [breadcrumbs[0], breadcrumbs[breadcrumbs.length - 1]]
    : breadcrumbs;
  const hiddenBreadcrumbsMobile = shouldCollapseMobile
    ? breadcrumbs.slice(1, -1)
    : [];

  const visibleBreadcrumbsTablet = shouldCollapseTablet
    ? [breadcrumbs[0], ...breadcrumbs.slice(-2)]
    : breadcrumbs;
  const hiddenBreadcrumbsTablet = shouldCollapseTablet
    ? breadcrumbs.slice(1, -2)
    : [];

  const visibleBreadcrumbsDesktop = shouldCollapseDesktop
    ? [breadcrumbs[0], ...breadcrumbs.slice(-2)]
    : breadcrumbs;
  const hiddenBreadcrumbsDesktop = shouldCollapseDesktop
    ? breadcrumbs.slice(1, -2)
    : [];

  const renderCrumb = (item: { label: string; href?: string }, isLast: boolean) => (
    <span className="flex items-center gap-1">
      {!isLast && item.href ? (
        <button
          onClick={() => router.push(item.href!)}
          className="capitalize transition hover:text-black"
        >
          {item.label}
        </button>
      ) : (
        <span className="capitalize text-[#000000]">{item.label}</span>
      )}
      {!isLast && (
        <ChevronsRight size={20} className="mt-[2px] text-[#000000]" />
      )}
    </span>
  );

  return (
    <nav
      aria-label="Breadcrumb"
      className="min-h-12 flex items-center gap-1 text-md font-manrope font-normal text-[#666666]"
    >
      {/* Desktop view */}
      <div className="hidden lg:flex items-center gap-1">
        {shouldCollapseDesktop ? (
          <>
            {renderCrumb(visibleBreadcrumbsDesktop[0], false)}
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="capitalize transition hover:text-black px-1">
                    ...
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <div className="flex flex-col gap-1">
                    {hiddenBreadcrumbsDesktop.map((item, i) =>
                      item.href ? (
                        <button
                          key={i}
                          onClick={() => router.push(item.href!)}
                          className="text-sm capitalize text-left hover:underline hover:text-black transition"
                        >
                          {item.label}
                        </button>
                      ) : (
                        <span key={i} className="text-sm capitalize">{item.label}</span>
                      )
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {visibleBreadcrumbsDesktop.slice(1).map((item, i) => {
              const realIndex = i + 1;
              const isLast = realIndex === visibleBreadcrumbsDesktop.length - 1;
              return (
                <span key={`desktop-${i}`} className="flex items-center gap-1">
                  {!isLast && item.href ? (
                    <button
                      onClick={() => router.push(item.href!)}
                      className="capitalize transition hover:text-black"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <span className="capitalize text-[#000000]">{item.label}</span>
                  )}
                  {!isLast && (
                    <ChevronsRight size={20} className="mt-[2px] text-[#000000]" />
                  )}
                </span>
              );
            })}
          </>
        ) : (
          breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <span key={index} className="flex items-center gap-1">
                {!isLast && item.href ? (
                  <button
                    onClick={() => router.push(item.href!)}
                    className="capitalize transition hover:text-black"
                  >
                    {item.label}
                  </button>
                ) : (
                  <span className="capitalize text-[#000000]">{item.label}</span>
                )}
                {!isLast && (
                  <ChevronsRight size={20} className="mt-[2px] text-[#000000]" />
                )}
              </span>
            );
          })
        )}
      </div>

      {/* Tablet view */}
      <div className="hidden md:flex lg:hidden items-center gap-1 flex-wrap">
        {shouldCollapseTablet ? (
          <>
            {renderCrumb(visibleBreadcrumbsTablet[0], false)}
            <Popover open={mobileOpen} onOpenChange={setMobileOpen}>
              <PopoverTrigger asChild>
                <button className="capitalize transition hover:text-black px-1">
                  ...
                </button>
              </PopoverTrigger>
              <PopoverContent side="bottom" className="max-w-xs w-auto p-2">
                <div className="flex flex-col gap-1">
                  {hiddenBreadcrumbsTablet.map((item, i) =>
                    item.href ? (
                      <button
                        key={i}
                        onClick={() => {
                          router.push(item.href!);
                          setMobileOpen(false);
                        }}
                        className="text-sm capitalize text-left hover:underline hover:text-black transition"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <span key={i} className="text-sm capitalize">{item.label}</span>
                    )
                  )}
                </div>
              </PopoverContent>
            </Popover>
            {visibleBreadcrumbsTablet.slice(1).map((item, i) => {
              const realIndex = i + 1;
              const isLast = realIndex === visibleBreadcrumbsTablet.length - 1;
              return (
                <span key={`tablet-${i}`} className="flex items-center gap-1">
                  {!isLast && item.href ? (
                    <button
                      onClick={() => router.push(item.href!)}
                      className="capitalize transition hover:text-black"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <span className="capitalize text-[#000000]">{item.label}</span>
                  )}
                  {!isLast && (
                    <ChevronsRight size={20} className="mt-[2px] text-[#000000]" />
                  )}
                </span>
              );
            })}
          </>
        ) : (
          breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <span key={index} className="flex items-center gap-1">
                {!isLast && item.href ? (
                  <button
                    onClick={() => router.push(item.href!)}
                    className="capitalize transition hover:text-black"
                  >
                    {item.label}
                  </button>
                ) : (
                  <span className="capitalize text-[#000000]">{item.label}</span>
                )}
                {!isLast && (
                  <ChevronsRight size={20} className="mt-[2px] text-[#000000]" />
                )}
              </span>
            );
          })
        )}
      </div>

      {/* Mobile view */}
      <div className="flex md:hidden items-center gap-1 flex-wrap">
        {shouldCollapseMobile ? (
          <>
            {renderCrumb(visibleBreadcrumbsMobile[0], false)}
            <Popover open={mobileOpen} onOpenChange={setMobileOpen}>
              <PopoverTrigger asChild>
                <button className="capitalize transition hover:text-black px-1">
                  ...
                </button>
              </PopoverTrigger>
              <PopoverContent side="bottom" className="max-w-xs w-auto p-2">
                <div className="flex flex-col gap-1">
                  {hiddenBreadcrumbsMobile.map((item, i) =>
                    item.href ? (
                      <button
                        key={i}
                        onClick={() => {
                          router.push(item.href!);
                          setMobileOpen(false);
                        }}
                        className="text-sm capitalize text-left hover:underline hover:text-black transition"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <span key={i} className="text-sm capitalize">{item.label}</span>
                    )
                  )}
                </div>
              </PopoverContent>
            </Popover>
            {visibleBreadcrumbsMobile.slice(1).map((item, i) => {
              const realIndex = i + 1;
              const isLast = realIndex === visibleBreadcrumbsMobile.length - 1;
              return (
                <span key={`mobile-${i}`} className="flex items-center gap-1">
                  {!isLast && item.href ? (
                    <button
                      onClick={() => router.push(item.href!)}
                      className="capitalize transition hover:text-black"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <span className="capitalize text-[#000000]">{item.label}</span>
                  )}
                  {!isLast && (
                    <ChevronsRight size={20} className="mt-[2px] text-[#000000]" />
                  )}
                </span>
              );
            })}
          </>
        ) : (
          breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <span key={index} className="flex items-center gap-1">
                {!isLast && item.href ? (
                  <button
                    onClick={() => router.push(item.href!)}
                    className="capitalize transition hover:text-black"
                  >
                    {item.label}
                  </button>
                ) : (
                  <span className="capitalize text-[#000000]">{item.label}</span>
                )}
                {!isLast && (
                  <ChevronsRight size={20} className="mt-[2px] text-[#000000]" />
                )}
              </span>
            );
          })
        )}
      </div>
    </nav>
  );
};

export default Breadcrumb;
