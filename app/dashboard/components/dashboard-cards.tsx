import React from 'react'

const DashboardCard = () => {

    const cardData = [
        {
            title: 'Saved Properties',
            count: 3,
            description: 'In this week',
        },
         {
            title: 'New Matches',
            count: 3,
            description: 'In Barcelona',
        },
         {
            title: 'Messages',
            count: 3,
            description: 'From Agent',
        }
    ]

    return (
        <section className="mb-6">
            <h2 className="font-bold text-xl mb-4 font-inter text-[#111827]">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cardData?.map((card, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-md p-6">
                        <h1 className="text-lg font-inter font-medium text-[#111827] mb-1">{card.title}</h1>
                        <p className="text-[#111827] font-inter font-bold text-3xl">{card.count} <span className='text-[#64748B] font-inter font-normal text-sm '> {card.description}</span></p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default DashboardCard
