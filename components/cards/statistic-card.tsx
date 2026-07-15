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
        <CommonCard className="!p-4">
            <div className="flex justify-end">
                <div className="px-3 py-2 rounded-lg bg-[#ECFDF5] text-[#10B981] text-xs font-semibold leading-none">
                    {change}
                </div>
            </div>
            <div>
                <h3 className="text-base font-manrope mt-2 font-medium text-[#64748B]">
                    {label}
                </h3>

                <p className="mt-2 text-xl font-bold leading-none text-[#0F172A]">
                    {value}
                </p>
            </div>
        </CommonCard>
    )
}
