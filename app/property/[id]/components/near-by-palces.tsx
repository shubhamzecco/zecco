import { App_url } from '@/constant/static'
import Image from 'next/image'
import React from 'react'

const NearByPlaces = () => {


    const nearByPlaces = [
        {
            title: 'Ebenezer Christian Academy II',
            address: '3925 Northwest 2nd Avenue Miami, FL 33127',
            building_type: 'Private',
            away: '0.5 miles away',
            grade: '1st Grade to 12th Grade',
            total: 'Total 72 students'
        },
        {
            title: 'Dade Prep Academy',
            address: '3925 Northwest 2nd Avenue Miami, FL 33127',
            building_type: 'Private',
            away: '0.5 miles away',
            grade: '1st Grade to 12th Grade',
            total: 'Total 72 students'
        },
        {
            title: 'Ebenezer Christian School',
            address: '3925 Northwest 2nd Avenue Miami, FL 33127',
            building_type: 'Private',
            away: '0.5 miles away',
            grade: '1st Grade to 12th Grade',
            total: 'Total 72 students'
        },
        {
            title: 'Ebenezer Christian Academy IIl',
            address: '3925 Northwest 2nd Avenue Miami, FL 33127',
            building_type: 'Private',
            away: '0.5 miles away',
            grade: '1st Grade to 12th Grade',
            total: 'Total 72 students'
        }
    ]

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
