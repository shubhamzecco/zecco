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
                <h3 className={`flex items-center gap-2 text-base 2xl:text-base whitespace-nowrap font-manrope font-medium text-[#64748B] `}>
                  {icon}  {label}
                </h3>
            </div>
            <div className="flex items-center justify-between mt-3 ">
                <p className="text-xl font-bold leading-none text-[#0F172A]">
                    {value}
                </p>
                {(label === 'Messages' && Number(value) > 0) && (
                    <div className={`px-2 py-1 rounded-lg  text-xs font-semibold leading-none ${(label === 'Messages' && Number(value) > 0) ? 'text-blue-500 bg-blue-100' : 'hidden'}`}>
                        {change}
                    </div>
                )}
            </div>
        </CommonCard>
    )
}
