"use client"
import { useWebSocket } from '@/api/socket/WebSocketContext'
import AreaCard from '@/components/cards/AreaCard'
import MainLayout from '@/components/layouts/main-layout'
import { App_url } from '@/constant/static'
import { usePosterReducers } from '@/redux/getdata/usePostReducer'
import React, { useEffect } from 'react'



const CostadelSol = () => {
    type PropertyType = "buy" | "rent" | "new";
    const [propertyType, setPropertyType] = React.useState<PropertyType>("buy");
    const { sendMessage, isConnected } = useWebSocket()
    const { mainReducer } = usePosterReducers()

    useEffect(() => {
        sendMessage('action', {
            type: "locationService",
            action: "list",
            payload: {
                search: "",
                limit: 12,
                page: 1,
            }
        })
    }, [isConnected])
    return (
        <MainLayout isBreadcrumb isFilter
        >
            <div className="lg:mx-7 lg:pb-10 px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-3 grid-cols-1 gap-8">
                    {mainReducer?.location_list_with_limit?.data?.map((area) => (
                        <div
                            key={area._id}
                            className={`flex-shrink-0 w-full`}
                        >
                            <AreaCard {...area} />
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    )
}

export default CostadelSol
