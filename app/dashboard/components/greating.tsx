import { StatisticCard } from '@/components/cards/statistic-card'
import { usePosterReducers } from '@/redux/getdata/usePostReducer'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Search } from 'lucide-react'
import { useMediaQuery } from "react-responsive"
import RecentSaved from './recent-saved'
import SavedSearches from './saved-searches'

export const getGreeting = (): string => {
    const hour = Number(
        new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            hour12: false,
            timeZone: "Europe/Madrid",
        }).format(new Date())
    );

    if (hour >= 5 && hour < 12) {
        return "Good Morning";
    }

    if (hour >= 12 && hour < 17) {
        return "Good Afternoon";
    }

    if (hour >= 17 && hour < 21) {
        return "Good Evening";
    }

    return "Good Night";
};


const Greeting = () => {
    const { mainReducer, user_data } = usePosterReducers()
    const totalUnreadCount = mainReducer?.chat_user_list?.reduce(
        (total, chat) => total + Number(chat?.unread_count || 0),
        0
    );

    const stats = [
        { label: 'Saved Properties', value: mainReducer?.favorite_property_list?.data?.length ?? 0 },
        { label: 'Saved Searches', value: mainReducer?.saved_searches?.data?.length ?? 0 },
        { label: 'Messages', value: totalUnreadCount ?? 0, change: 'New Message' },
    ]

    const is2XL = useMediaQuery({ minWidth: 1536 });

    const favoriteLimit = is2XL ? 4 : 5;
    const savedSearchLimit = is2XL ? 5 : 7;

    return (
        <div className="space-y-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl bg-gradient-to-r from-[#3b82f6] to-[#1e40af] p-6 text-white md:p-8"
            >
                <div className="flex flex-col text-manrope justify-between md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold font-manrope">
                            {getGreeting()}, {user_data?.user?.first_name} 👋
                        </h1>
                        <p className="mt-2 text-white/60 font-manrope max-2xl:text-sm">
                            Still wandering through your property search? Let the AI do the work for you. Use our AI Concierge.
                        </p>
                    </div>
                </div>
            </motion.div>

            <div>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 items-stretch h-full">
                    {stats?.map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                        >
                            <StatisticCard
                                label={stat.label}
                                value={stat.value}
                                change={stat.change}
                                icon={
                                    idx === 0 ? (
                                        <Heart className="h-5 w-5 text-red-500" />
                                    ) : idx === 1 ? (
                                        <Search className="h-5 w-5 text-[#3b82f6]" />
                                    ) : (
                                        <MessageCircle className="h-5 w-5" />
                                    )
                                }
                            />
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch h-full">
                <RecentSaved
                    properties={mainReducer?.favorite_property_list?.data?.slice(0, favoriteLimit)}
                />

                <SavedSearches
                    searches={mainReducer?.saved_searches?.data?.slice(0, savedSearchLimit)}
                />
            </div>
        </div>
    )
}

export default Greeting
