"use client";

import { Check, Clock } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  isCompleted: boolean;
  onComplete: () => void;
  heading?: string;
};

export default function AIProcessingCard({
  isCompleted,
  onComplete,
  heading,
}: Props) {
  const TOTAL_TIME = 50;
  const INTERVAL = 500;

  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Analyzing Property Profile",
      desc: "Processing location, price, size, amenities, and property specifications",
    },
    {
      title: "Comparing with Market Data",
      desc: "Analyzing historical prices, demand trends, and comparable properties",
    },
    {
      title: "AI Property Insights Generation",
      desc: "Generating valuation, rental yield, ROI, and growth forecasts",
    },
    {
      title: "Finalizing Property Report",
      desc: "Preparing your personalized property analysis report",
    },
  ];

  useEffect(() => {
    if (isCompleted) {
      setProgress(100);
      setActiveStep(steps.length - 1);

      setTimeout(() => {
        onComplete();
      }, 800);

      return;
    }
    const increment = 100 / TOTAL_TIME;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        const stepIndex = Math.min(
          steps.length - 1,
          Math.floor((next / 100) * steps.length),
        );
        setActiveStep(stepIndex);

        return next > 95 ? 95 : next;
      });
    }, INTERVAL);

    return () => clearInterval(timer);
  }, [isCompleted]);

  return (
    <section className="mb-6">
      <h2 className="font-bold text-lg mb-4 font-inter text-[#111827]">
        {heading ? heading : "Analyzing Property Details"}
      </h2>

      <div className="w-full mx-auto bg-white/90 rounded-2xl p-4 lg:p-14 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold tracking-wide text-blue-600 uppercase">
            Processing...
          </span>
          <span className="text-xl font-manrope font-semibold text-gray-900">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="bg-white rounded-xl p-7 mt-10 border">
          <p className="text-sm tracking-widest text-gray-400 font-semibold mb-4">
            AI ANALYSIS STEPS
          </p>

          <div className="space-y-4">
            {steps?.map((step, index) => {
              const isDone = index < activeStep;
              const isActive = index === activeStep;

              return (
                <div key={index} className="flex gap-3 items-start">
                  <div className="mt-0.5 bg-indigo-50 rounded-full p-1">
                    {isDone && (
                      <span className="w-5 h-5 rounded-full text-green-500 border-2 border-green-500 p-[1px] flex items-center justify-center text-xs">
                        <Check size={20} />
                      </span>
                    )}

                    {isActive && (
                      <div className="relative w-5 h-5">
                        <div className="absolute inset-0 rounded-full border-2 border-blue-600 opacity-30" />
                        <div className="absolute inset-0 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                      </div>
                    )}

                    {!isDone && !isActive && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center">
                        <Clock className="text-gray-300" size={20} />
                      </div>
                    )}
                  </div>
                  <div>
                    <p
                      className={`text-lg font-manrope font-bold ${
                        isActive
                          ? "text-blue-600"
                          : isDone
                            ? "text-gray-600"
                            : "text-gray-200"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p
                      className={`text-sm font-manrope font-semibold  leading-relaxed mt-0.5 ${
                        isActive
                          ? "text-gray-500"
                          : isDone
                            ? "text-gray-400"
                            : "text-gray-200"
                      }`}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
