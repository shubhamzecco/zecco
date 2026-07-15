import CommonCard from '@/components/cards/common-card'
import { App_url } from '@/constant/static'
import { formatEuro } from '@/utils/common'
import { Heart } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const RecentSaved = ({ properties }: any) => {
    const router = useRouter()
    return (
        <CommonCard heading='Recent Saved Properties' description='Properties you saved recently'>
            <div className="">
                {properties?.map((item: any, index: number) => (
                    <div
                        key={item.id}
                        onClick={() => router.push(`${App_url.link.PROPERTY_DETAILS}/${item?._id}`)}
                        className={`flex items-center cursor-pointer justify-between gap-3 py-[7px] ${index !== properties.length - 1
                            ? "border-b border-[#F1F5F9]"
                            : ""
                            }`}
                    >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <Image
                                src={item?.propertyImages?.[0]?.url}
                                alt={item._id}
                                width={54}
                                height={54}
                                className="h-[54px] w-[54px] rounded-xl object-cover shrink-0"
                            />

                            <div className="min-w-0 flex-1">
                                <h4 className="text-[13px] truncate font-semibold text-[#1F2937]">
                                    {item?.bedrooms ? `${item?.bedrooms} Bedroom ` : ""}{" "}
                                    {item?.itemType
                                        ? item?.itemType?.name
                                        : item?.itemCategory?.name}{" "}
                                    for{" "}
                                    {item?.isSale && item?.isRent
                                        ? "Sale or Rent"
                                        : item?.isSale
                                            ? "Sale"
                                            : item?.isRent
                                                ? "Rent"
                                                : ""}{" "}
                                    in {item?.locationSubarea ? `${item?.locationSubarea},` : ""}{" "}
                                    {item?.locationArea ? `${item?.locationArea},` : ""}{" "}
                                    {item?.locationCity}, {item?.locationCountry}
                                </h4>

                                <p className="mt-1 whitespace-pre-line text-[11px] leading-4 text-[#9CA3AF] truncate">
                                    {item?.locationSubarea ? `${item?.locationSubarea},` : ""}{" "}
                                    {item?.locationArea ? `${item?.locationArea},` : ""}{" "}
                                    {item?.locationCity}, {item?.locationCountry}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0">
                            <span className="text-[12px] whitespace-nowrap font-semibold text-[#3B82F6]">
                                {formatEuro(item?.salePrice)}
                            </span>

                            <Heart
                                size={14}
                                className={`mt-3 cursor-pointer ${item?.favorite ? 'fill-red-500' : 'fill-none'} text-[#EF4444]`}
                                strokeWidth={2}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={() => router.push(App_url.link.FAVORITES)} className="mt-4 text-[13px] font-semibold text-[#2563EB] transition hover:translate-x-1">
                View All Saved →
            </button>
        </CommonCard>
    )
}

export default React.memo(RecentSaved)
