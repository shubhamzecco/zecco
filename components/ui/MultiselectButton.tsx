import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

interface Option {
    label: string;
    value: string;
}

interface MultiSelectButtonGroupProps {
    control: any;
    name: string;
    label: string;
    options: Option[];
    columns?: 2 | 3 | 4 | 5 | 6;
    className?: string;
}

export function MultiSelectButtonGroup({
    control,
    name,
    label,
    options,
    columns = 3,
    className = "",
}: MultiSelectButtonGroupProps) {
    const getGridColumns = () => {
        switch (columns) {
            case 2:
                return "grid-cols-2";
            case 3:
                return "grid-cols-3";
            case 4:
                return "grid-cols-4";
            case 5:
                return "grid-cols-5";
            case 6:
                return "grid-cols-6";
            default:
                return "grid-cols-3";
        }
    };

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                const values: string[] = Array.isArray(field.value)
                    ? field.value
                    : [];

                const toggleSelection = (value: string) => {
                    const updatedValues = values.includes(value)
                        ? values.filter((item) => item !== value)
                        : [...values, value];

                    field.onChange(updatedValues);
                };

                return (
                    <FormItem>
                        <FormLabel className="font-medium font-inter text-[#101828]">
                            {label}
                        </FormLabel>

                        <FormControl>
                            <div
                                className={`grid ${getGridColumns()} gap-2 ${className}`}
                            >
                                {options.map((item) => {
                                    const isSelected = values.includes(item.value);

                                    return (
                                        <button
                                            key={item.value}
                                            type="button"
                                            onClick={() => toggleSelection(item.value)}
                                            className={`h-11 rounded-[10px] border text-sm white max-sm:text-xs font-medium transition-all duration-200
                        ${isSelected
                                                    ? "border-[#136AED] bg-[#136AED] text-white shadow-md"
                                                    : "border-[#D1D5DB] bg-white text-[#374151] hover:border-[#136AED] hover:bg-[#F8FAFF]"
                                                }`}
                                        >
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </FormControl>
                    </FormItem>
                );
            }}
        />
    );
}