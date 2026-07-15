"use client";

import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { generateBreadcrumbs } from "@/utils/common";
import { ChevronsRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Breadcrumb = () => {
  const { mainReducer } = usePosterReducers();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const propertyDetails = mainReducer?.property_details ?? {};

  const type = searchParams.get("type");
  const city = searchParams.get("cities");
  const bedrooms = searchParams.get("bedrooms");

  const capitalize = (text: string) =>
    text.replace(/\b\w/g, (char) => char.toUpperCase());

  const breadcrumbs =
    type === "slug" && city
      ? [
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Costa del Sol areas and Cities",
            href: "/costa-del-sol",
          },
          {
            label: bedrooms
              ? `${bedrooms} Bedroom${bedrooms === "1" ? "" : "s"} in ${capitalize(
                  city
                )}`
              : capitalize(city),
          },
        ]
      : generateBreadcrumbs(pathname, propertyDetails);

  const queryString = searchParams.toString();
  const qs = queryString ? `?${queryString}` : "";

  const callClickItem = (item: any) => {
    const href = item.href;

    if (!href) return;

    if (href === "/" || href === "/costa-del-sol") {
      router.push(href);
      return;
    }

    router.push(`${href}${qs}`);
  };

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
                onClick={() => callClickItem(item)}
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