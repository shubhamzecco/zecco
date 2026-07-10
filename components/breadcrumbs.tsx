"use client";

import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { generateBreadcrumbs } from "@/utils/common";
import { ChevronsRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Breadcrumb = () => {
  const { mainReducer } = usePosterReducers()
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyDetails = mainReducer?.property_details ?? {}
  const breadcrumbs = generateBreadcrumbs(pathname, propertyDetails);

  const queryString = searchParams.toString();
  const qs = queryString ? `?${queryString}` : "";

  const callClickItem = (item: any) => {
    const href = item.href;

    if (href === "/" || href === "/costa-del-sol") {
      router.push(href);
      return;
    }

    router.push(`${href}${qs}`);
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className="min-h-12 max-md:flex-wrap flex items-center text-md gap-1 font-manrope font-normal text-[#666666]"
    >
      {breadcrumbs?.map((item, index) => {
        const isLast = index === breadcrumbs?.length - 1;

        return (
          <span key={index} className="flex items-center gap-1">
            {!isLast && item.href ? (
              <button
                onClick={() => callClickItem(item)}
                className="hover:text-black transition capitalize"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-[#000000] capitalize">{item.label}</span>
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
