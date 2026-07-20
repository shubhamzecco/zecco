import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

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
    labelClassName?: string;
    maxSelected?: number;
}

export function MultiSelectButtonGroup({
    control,
    name,
    label,
    options,
    columns = 3,
    className = "",
    labelClassName = "",
    maxSelected,
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
                const values: string[] = maxSelected === 1
                    ? (field.value ? [field.value] : [])
                    : Array.isArray(field.value) ? field.value : [];

                const toggleSelection = (value: string) => {
                    if (maxSelected === 1) {
                        field.onChange(values.includes(value) ? "" : value);
                        return;
                    }
                    if (values.includes(value)) {
                        field.onChange(values.filter((item) => item !== value));
                        return;
                    }
                    if (maxSelected && values.length >= maxSelected) {
                        field.onChange([value]);
                        return;
                    }
                    field.onChange([...values, value]);
                };

                return (
                    <FormItem>
                        <FormLabel className={`font-medium font-inter text-[#101828] ${labelClassName}`}>
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
                                            className={`
                                    h-10 rounded-2xl px-3 border text-sm font-medium transition-all
                                    ${isSelected
                                                    ? " bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] text-white shadow-md"
                                                    : "border-[#D1D5DB] bg-white text-[#374151] hover:border-[#136AED]"
                                                }
                              `}
                                        >
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
}