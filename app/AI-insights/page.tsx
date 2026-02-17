"use client";

import SidebarLayout from "@/components/layouts/sidebar-layout";
import AiInsights from "./components/aiInsights";
import AIProcessingCard from "./components/analyzing-property-details";
import PropertyInsights from "./components/property-insights";
import { useEffect, useState } from "react";

const AIInsights = () => {
    const [step, setStep] = useState("intro");
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
                    <AiInsights onGetStarted={() => setStep("processing")} />
                )}

                {step === "processing" && <AIProcessingCard onComplete={() => setStep("result")} />}

                {step === "result" && <PropertyInsights />}
            </div>
        </SidebarLayout>
    );
};

export default AIInsights;
