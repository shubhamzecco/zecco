import { StatisticCard } from '@/components/cards/statistic-card'
import { usePosterReducers } from '@/redux/getdata/usePostReducer'
import { motion } from 'framer-motion'
import { Heart, Home, TrendingUp } from 'lucide-react'
import RecentSaved from './recent-saved'
import SavedSearches from './saved-searches'

const stats = [
    { label: 'Total Properties', value: 24, change: '+2 this week' },
    { label: 'Saved Searches', value: 58, change: '+8 this week' },
    { label: 'Messages', value: 3, change: 'Unread' },
]

export const getGreeting = (): string => {
    const hour = new Date().getHours();

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
    const { mainReducer , user_data} = usePosterReducers()
    
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
                        <p className="mt-2 text-white/60 font-manrope">
                            You&apos;ve got 3 new messages and 5 new property matches today
                        </p>
                    </div>
                </div>
            </motion.div>

            <div>
                <div className="grid gap-4 md:grid-cols-3">
                    {stats.map((stat, idx) => (
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
                                        <Home className="h-5 w-5 text-[#3b82f6]" />
                                    ) : idx === 1 ? (
                                        <TrendingUp className="h-5 w-5 text-[#3b82f6]" />
                                    ) : (
                                        <Heart className="h-5 w-5 text-red-500" />
                                    )
                                }
                            />
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch h-full">
                <RecentSaved properties={mainReducer?.favorite_property_list?.data?.slice(0, 4)} />
                <SavedSearches searches={mainReducer?.saved_searches?.data?.slice(0, 5)} />
            </div>
        </div>
    )
}

export default Greeting
