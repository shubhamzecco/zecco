"use client"

import { usePosterReducers } from "@/redux/getdata/usePostReducer"
import { ChevronsRight } from "lucide-react"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { setBreadcrumbs } from "@/redux/modules/main/action"

const Breadcrumb = () => {
  const { mainReducer } = usePosterReducers()
  const dispatch = useDispatch()
  const router = useRouter()

  const breadcrumbs = mainReducer?.breadcrumbs || []

  const handleClick = (index: number, href?: string | null) => {
    const updatedBreadcrumbs = breadcrumbs.slice(0, index + 1)
    dispatch(setBreadcrumbs(updatedBreadcrumbs))

    if (href) router.push(href)
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="min-h-12 max-md:flex-wrap flex items-center text-md gap-1 font-manrope font-normal text-[#666666]"
    >
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1

        return (
          <span key={index} className="flex items-center gap-1">
            {!isLast && item.href ? (
              <button
                onClick={() => handleClick(index, item.href)}
                className="hover:text-black transition"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-[#000000]">{item.label}</span>
            )}

            {!isLast && (
              <ChevronsRight
                size={20}
                className="mt-[2px] text-[#000000]"
              />
            )}
          </span>
        )
      })}
    </nav>
  )
}

export default Breadcrumb
