"use client";

import SidebarLayout from "@/components/layouts/sidebar-layout";
import AiInsights from "./components/aiInsights";
import AIProcessingCard from "./components/analyzing-property-details";
import PropertyInsights from "./components/property-insights";
import { useEffect, useState } from "react";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { Property } from "@/redux/modules/main/types";
import { useParams } from "next/navigation";
import CommonApiRequest from "@/api/rest/fetchData";
import { App_url } from "@/constant/static";
import { useDispatch } from "react-redux";
import { setAiInsight } from "@/redux/modules/main/action";

const AIInsights = () => {
    const [step, setStep] = useState("intro");
    const { mainReducer } = usePosterReducers()
    const { sendMessage, isConnected } = useWebSocket()
    const params = useParams()
    const dispatch = useDispatch()

    useEffect(() => {
        sendMessage('action', {
            type: "propertyService",
            action: "list",
            payload: {
                limit: 10,
                page: 1,
                search: '',
                location_id: '69afc5c0cdb3ce6e5f5eccc4'
            }
        })
    }, [isConnected])

    const handleStarted = () => {
        setStep("processing")
        CommonApiRequest(
            "GET",
            `${App_url.endpoint_url?.AI_INSIGHT}/${params.id}`,
            {},
            {},
        )?.then((response: any) => {
            if (response?.status === 200) {
                dispatch(setAiInsight(response?.data));
            } else {
                dispatch(setAiInsight(response?.data));
            }
        });
    }

    return (
        <SidebarLayout>
            <div
                className="lg:px-12 px-5 pt-12 pb-4 mb-10
        bg-gradient-to-r
        from-[#60A5FA]/10
        via-[#fafafa] via-[70%]
        to-[#fafafa] to-[100%]"
            >
                {step === "intro" && (
                    <AiInsights property={mainReducer?.property_list_with_limit?.data?.[2] as Property} onGetStarted={handleStarted} />
                )}

                {step === "processing" && <AIProcessingCard onComplete={() => setStep("result")} />}

                {step === "result" && <PropertyInsights />}
            </div>
        </SidebarLayout>
    );
};

export default AIInsights;
