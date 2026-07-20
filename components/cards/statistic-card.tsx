import CommonCard from "./common-card"

export function StatisticCard({
    label,
    value,
    icon,
    change,
}: {
    label: string
    value: string | number
    icon?: React.ReactNode
    change?: string
}) {
    return (
        <CommonCard className="xl:!p-6 max-2xl:!p-3.5">
            <div className="flex justify-between  items-center">
                <h3 className={`text-xs xl:text-sm 2xl:text-base whitespace-nowrap font-manrope font-medium text-[#64748B] `}>
                    {label}
                </h3>
                <div className={`px-2 py-2 rounded-lg  text-xs font-semibold leading-none ${label === 'Messages' ? 'text-red-500 bg-red-100' : 'bg-[#ECFDF5] text-[#10B981]'}`}>
                    {change}
                </div>
            </div>
            <div>
                <p className="mt-3 text-xl font-bold leading-none text-[#0F172A]">
                    {value}
                </p>
            </div>
        </CommonCard>
    )
}
