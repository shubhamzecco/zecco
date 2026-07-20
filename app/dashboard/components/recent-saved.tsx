import CommonCard from '@/components/cards/common-card'
import { App_url } from '@/constant/static'
import { formatEuro } from '@/utils/common'
import { Heart } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const RecentSaved = ({ properties }: any) => {
    const router = useRouter()
    const isEmpty = !properties || properties.length === 0

    return (
        <CommonCard className="max-2xl:p-5" heading={isEmpty ? undefined : 'Recent Saved Properties'} description={isEmpty ? undefined : 'Properties you saved recently'}>
            {isEmpty ? (
                <div className="flex flex-col items-center justify-center h-[280px] lg:h-[365px] 2xl:h-[380px] px-4">
                    <div className="relative mb-6">
                        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                            <Heart size={30} className="text-red-400" strokeWidth={1.5} />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 font-manrope mb-2">
                        No Saved Properties Yet
                    </h2>
                    <p className="text-center text-sm text-gray-500 font-manrope max-w-sm mb-3">
                        Properties you save as favorites will appear here for quick access.
                    </p>
                    <button
                        onClick={() => router.push("/costa-del-sol/properties")}
                        className="relative w-fit mx-auto text-xs sm:text-sm whitespace-nowrap my-5 py-3.5 px-4 sm:px-10 rounded-full flex items-center bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] text-white font-manrope font-medium shadow-md disabled:opacity-50 "
                    >
                        Browse Properties
                    </button>
                </div>
            ) : (
                <div className="">
                    {properties?.map((item: any, index: number) => {
                        const itemIdentifier = item?.slug || item?._id;
                        return (
                            <div
                                key={item?._id || index}
                                onClick={() => router.push(`${App_url.link.COSTA_DEL_SOL}/properties/${itemIdentifier}`)}
                                className={`flex items-center cursor-pointer justify-between gap-3 px-2 py-[9px] ${index !== properties.length - 1
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

                                <div className="flex flex-col items-end shrink-0 px-2">
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
                        );
                    })}
                </div>
            )}

            {!isEmpty && (
                <button onClick={() => router.push(App_url.link.FAVORITES)} className="mt-2 text-[13px] px-2 font-semibold text-[#2563EB] transition hover:translate-x-1">
                    View All Saved →
                </button>
            )}
        </CommonCard>
    )
}

export default React.memo(RecentSaved)
