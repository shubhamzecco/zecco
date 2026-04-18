import { App_url } from '@/constant/static'
import { Infrastructure } from '@/redux/modules/main/types'
import Image from 'next/image'
import React from 'react'

interface INearByPlacesProps {
    near_places: Infrastructure
}

const NearByPlaces = ({ near_places }: INearByPlacesProps) => {


    const nearByPlaces = Object.entries(near_places || {}).flatMap(
        ([key, places]) =>
            places.map((place: any) => ({
                title: place.name,
                address: key.replace("_", " ").toUpperCase(),
                building_type: key.replace("_", " "),
                away: `${place.distance} km`,
                grade: "-",
                total: "-",
            }))
    );

    return (
        <section className=" bg-white mt-5 mb-10">
            <div className="">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl sm:text-xl font-bold font-manrope text-[#00000]">Nearby Places</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {nearByPlaces?.map((item) => {
                        return (
                            <div className="p-4 border shadow-lg rounded-xl" key={item?.title}>
                                <h2 className='font-manrope font-semibold text-heading_text_color text-lg mb-4 max-w-xs'>{item?.title}</h2>
                                <p className='font-manrope font-medium text-[#374151] mb-5 max-w-xs'>{item?.address}</p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="">
                                            <Image
                                                src={App_url.image.building_icon}
                                                alt='private'
                                                width={25}
                                                height={25}
                                            />
                                        </div>
                                        <p className='font-manrope font-medium text-[#64748B] text-md'>{item?.building_type}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="">
                                            <Image
                                                src={App_url.image.away_icon}
                                                alt='private'
                                                width={25}
                                                height={25}
                                            />
                                        </div>
                                        <p className='font-manrope font-medium text-[#64748B] text-md'>{item?.away}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="">
                                            <Image
                                                src={App_url.image.cap}
                                                alt='private'
                                                width={25}
                                                height={25}
                                            />
                                        </div>
                                        <p className='font-manrope font-medium text-[#64748B] text-md'>{item?.grade}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="">
                                            <Image
                                                src={App_url.image.user_cap}
                                                alt='private'
                                                width={25}
                                                height={25}
                                            />
                                        </div>
                                        <p className='font-manrope font-medium text-[#64748B] text-md'>{item?.total}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}


                </div>
            </div>
        </section>
    )
}

export default NearByPlaces
