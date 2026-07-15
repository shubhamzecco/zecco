"use client";

import { Trash2 } from "lucide-react";

interface SavedSearchCardProps {
    item: any;
    title?: string
    onApplySearch: (item: any) => void;
    handleDelete: (item: any) => void;

}

export default function SavedSearchCard({ item, title, onApplySearch, handleDelete }: SavedSearchCardProps) {
    const chips: string[] = [];

    if (item?.city?.name) chips.push(item.city.name);

    if (item?.priceFrom || item?.priceTo) {
        chips.push(
            `€${item?.priceFrom ?? "0"} - €${item?.priceTo ?? "Any"}`
        );
    }

    if (item?.bedroomsFrom || item?.bedroomsTo) {
        chips.push(
            `${item?.bedroomsFrom ?? "Any"} - ${item?.bedroomsTo ?? "+"} Bedrooms`
        );
    }

    if (item?.types?.length) {
        chips.push(...item.types);
    }

    if (item.forSale) chips.push("For Sale");

    if (item.forRent) chips.push("For Rent");

    if (item.isNewDev) chips.push("New Development");

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 md:flex-row md:justify-between">
                <div className="flex-1">
                    <h3 className="font-bold text-lg font-manrope text-[#0F172A]">
                        {title}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-2">
                        {chips.map((chip, index) => (
                            <span
                                key={index}
                                className="rounded-md border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium font-manrope text-slate-600"
                            >
                                {chip}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={() => onApplySearch(item)} className="h-10 rounded-xl bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] px-3 text-sm font-semibold text-white hover:bg-blue-700">
                        View Results
                    </button>
                    <button
                        onClick={() => handleDelete(item?._id)}
                        className=" text-red-600 transition-all "
                        aria-label="delete"
                    >
                        <Trash2 size={23} />
                    </button>
                </div>
            </div>
        </div >
    );
}