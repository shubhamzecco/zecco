'use client'

import { X, Sparkles, ArrowUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ZecooAIChat({
    isOpen = true,
    onClose,
}: {
    isOpen?: boolean
    onClose?: () => void
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 40, scale: 0.98 }}
                    transition={{
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1], // smooth SaaS easing
                    }}
                    className="fixed bottom-1 right-6 z-50"
                >
                    <div className="w-[400px] max-h-[95vh] rounded-3xl bg-[#F3F8FF] shadow-2xl border border-blue-100 overflow-hidden flex flex-col">

                        {/* Header – FIXED */}
                        <div className="relative shrink-0 flex flex-col items-center px-6 pt-6 pb-4 bg-[#F3F8FF] z-10">
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow hover:bg-gray-100"
                            >
                                <X size={16} />
                            </button>

                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
                                <Sparkles size={22} />
                            </div>

                            <h2 className="mt-3 text-lg font-semibold text-gray-900">
                                Zecco.es AI
                            </h2>

                            <p className="mt-1 text-center text-sm text-gray-600 leading-relaxed">
                                Meet Zecco AI by Zecco.es, your guide to finding and buying your perfect home.
                            </p>
                        </div>

                        {/* SCROLLABLE CONTENT */}
                        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin scrollbar-thumb-blue-200">

                            {/* Assistant Message */}
                            <div className="rounded-2xl bg-white p-4 shadow-sm border border-blue-50">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles size={14} className="text-blue-600" />
                                    <span className="text-sm font-semibold text-gray-900">
                                        Zecco.es AI
                                    </span>
                                </div>

                                <p className="text-sm text-gray-700 leading-relaxed">
                                    I’m Zecco, your AI onboarding assistant with Zecco.es. I can help you explore homes, look at financing and pre-approval, or set up tours.
                                    <br /><br />
                                    What would you like to focus on today—finding a place, understanding your budget, or learning more about how Zecco.es works?
                                </p>
                            </div>

                            {/* Quick Actions */}
                            {[
                                'I have a property in mind and I want to book a tour',
                                'I want to get pre-approved',
                                'Explore homes',
                            ].map((text, i) => (
                                <button
                                    key={i}
                                    className="w-full rounded-xl bg-white border border-gray-200 px-4 py-3 text-left text-sm text-gray-800 hover:bg-gray-50 transition"
                                >
                                    {text}
                                </button>
                            ))}
                        </div>

                        {/* INPUT – FIXED */}
                        <div className="shrink-0 p-4 bg-[#F3F8FF] border-t border-blue-100">
                            <div className="relative">
                                <input
                                    placeholder="Talk with Zecco.es"
                                    className="w-full rounded-xl border border-blue-300 bg-white px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                                    <ArrowUp size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
