import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { StatisticCard } from '@/components/cards/statistic-card'
import { Heart, Home, TrendingUp } from 'lucide-react'
import CommonCard from '@/components/cards/common-card'
import { Badge } from '@/components/ui/badge'
import PropertyCard from '@/components/cards/PropertyCard'
import RecentSaved from './recent-saved'
import SavedSearches from './saved-searches'
import { usePosterReducers } from '@/redux/getdata/usePostReducer'

const savedProperties = [
    {
        id: 1,
        image:
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop',
        title: 'Modern Villa in Marbella',
        price: '€1,250,000',
        location: 'Marbella, Spain',
        bedrooms: 5,
        bathrooms: 4,
    },
    {
        id: 2,
        image:
            'https://images.unsplash.com/photo-1600585154245-85461f6a0e1d?w=500&h=300&fit=crop',
        title: 'Luxury Penthouse',
        price: '€860,000',
        location: 'Valencia, Spain',
        bedrooms: 3,
        bathrooms: 2,
    },
    {
        id: 3,
        image:
            'https://images.unsplash.com/photo-1600573472550-8090b5e9e8c0?w=500&h=300&fit=crop',
        title: 'Heritage Estate',
        price: '€1,800,000',
        location: 'Barcelona, Spain',
        bedrooms: 6,
        bathrooms: 5,
    },
]

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

const properties = [
    {
        id: 1,
        title: "Luxury Villa...",
        location: "Nueva\nAndalucía",
        price: "€1,250,000",
        image: "/images/property1.jpg",
    },
    {
        id: 2,
        title: "Sea View...",
        location: "Estepona",
        price: "€850,000",
        image: "/images/property2.jpg",
    },
    {
        id: 3,
        title: "Modern P...",
        location: "Málaga\nCenter",
        price: "€1,100,000",
        image: "/images/property3.jpg",
    },
    {
        id: 4,
        title: "Golf Villa...",
        location: "La Zagaleta",
        price: "€2,400,000",
        image: "/images/property4.jpg",
    },
];

const searches = [
    {
        title: "Marbella Villas",
        filters: "€2M+",
        date: "Today",
        badge: "New 3",
    },
    {
        title: "Estepona Sea View",
        filters: "",
        date: "Yesterday",
        badge: "New 1",
    },
    {
        title: "Málaga Penthouse",
        filters: "",
        date: "Jul 15",
        badge: "",
    },
    {
        title: "Benahavis Golf",
        filters: "",
        date: "Aug 1",
        badge: "New 3",
    },
];

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

            {/* Statistics Grid */}
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
