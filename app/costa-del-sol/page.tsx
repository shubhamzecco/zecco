"use client"
import { useWebSocket } from '@/api/socket/WebSocketContext'
import AreaCard from '@/components/cards/AreaCard'
import MainLayout from '@/components/layouts/main-layout'
import { usePosterReducers } from '@/redux/getdata/usePostReducer'
import { setBreadcrumbs } from '@/redux/modules/main/action'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'



const CostadelSol = () => {
    const { sendMessage, isConnected } = useWebSocket()
    const { mainReducer } = usePosterReducers()
    const dispatch = useDispatch()

    useEffect(() => {
        sendMessage('action', {
            type: "locationService",
            action: "list",
            payload: {
                search: "",
                limit: 0,
                page: 1,
            }
        })
    }, [isConnected])

    const handleSearch = (e: string) => {
        sendMessage('action', {
            type: "locationService",
            action: "list",
            payload: {
                search: e,
                limit: 0,
                page: 1,
            }
        })
    }

    console.log("mainReducer?.breadcrumbs?.length ::: " , mainReducer?.breadcrumbs?.length)
      useEffect(() => {
            if (mainReducer?.breadcrumbs?.length === 3) {
                const breadcrumbsWithoutLast = mainReducer.breadcrumbs?.slice(0, -1) || []
                dispatch(setBreadcrumbs(breadcrumbsWithoutLast))
            }
        }, [])

    return (
        <MainLayout isBreadcrumb isFilter handleSearch={(e) => handleSearch(e)}
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
