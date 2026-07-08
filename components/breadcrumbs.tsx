"use client";

import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { generateBreadcrumbs } from "@/utils/common";
import { ChevronsRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const Breadcrumb = () => {
  const { mainReducer } = usePosterReducers()
  const pathname = usePathname();
  const router = useRouter();
  const propertyDetails = mainReducer?.property_details ?? {}
  const breadcrumbs = generateBreadcrumbs(pathname, propertyDetails);

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
                onClick={() => item.href && router.push(item.href)}
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
