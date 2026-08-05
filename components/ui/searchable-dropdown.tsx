"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";

interface SearchableDropdownProps {
  items: Array<{ id: string | number; name: string; [key: string]: any }>;
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
  value?: string | number | null;
  onChange?: (item: any | string) => void;
  onSearch?: (searchValue: string) => void;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
  dropdownClassName?: string;
  renderItem?: (item: any) => React.ReactNode;
  showArrowIcon?: boolean;
  maxHeight?: string;
  labelClassname?: string;
}

export function SearchableDropdown({
  items,
  placeholder = "Search...",
  label,
  icon,
  value,
  onChange,
  onSearch,
  searchable = true,
  clearable = true,
  disabled = false,
  className = "",
  dropdownClassName = "",
  renderItem,
  showArrowIcon = true,
  maxHeight = "300px",
  labelClassname = "",
}: SearchableDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Filter items based on search
  const filteredItems = searchable
    ? items.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase()),
      )
    : items;

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setIsOpen(true);
      setHighlightedIndex(0);
      return;
    }

    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredItems.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredItems[highlightedIndex]) {
          selectItem(filteredItems[highlightedIndex]);
        } else if (searchValue.trim()) {
          onChange?.(searchValue);
          setIsOpen(false);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Handle item selection
  const selectItem = (item: any) => {
    setSelectedItem(item);
    setSearchValue(item.name);
    onChange?.(item);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  // Handle search input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch?.(value);
    setIsOpen(value.trim().length > 0);
    setHighlightedIndex(-1);
  };

  // Handle clear
  const handleClear = () => {
    setSearchValue("");
    setSelectedItem(null);
    onChange?.(null);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full" ref={dropdownRef}>
      {label && <label className={`block ${labelClassname}`}>{label}</label>}

      <div className="relative">
        {/* Input Container */}
        <div
          className={`relative flex items-center w-full h-12 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition ${
            disabled ? "bg-gray-100 cursor-not-allowed" : ""
          } ${className}`}
        >
          {/* Icon on the left */}
          {icon ? (
            <div className="absolute left-3 text-gray-600 pointer-events-none">
              {icon}
            </div>
          ) : searchable ? (
            <Search
              className="absolute left-3 text-gray-600 pointer-events-none"
              size={18}
            />
          ) : null}

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            placeholder={placeholder}
            disabled={disabled}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            className={`w-full h-full bg-transparent text-gray-900 placeholder:text-text_gray_color placeholder:text-md placeholder:font-medium placeholder:font-manrope placeholder:tracking-wide focus:outline-none ${
              icon || searchable ? "pl-10" : "pl-4"
            } pr-10`}
          />

          {/* Clear button */}
          {clearable && searchValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-10 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={18} />
            </button>
          )}

          {/* Arrow icon */}
          {showArrowIcon && (
            <button
              type="button"
              onClick={() => {
                if (!disabled) {
                  setIsOpen((prev) => !prev);
                }
              }}
              className={`absolute right-3 text-gray-600 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            >
              <ChevronDown size={18} />
            </button>
          )}
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className={`absolute left-0 top-full mt-2 w-full rounded-lg bg-white shadow-lg border border-slate-200 z-50 overflow-hidden ${dropdownClassName}`}
            style={{ maxHeight }}
          >
            <div className="overflow-y-auto max-h-[250px]">
              {filteredItems.length > 0 ? (
                <ul className="py-1">
                  {filteredItems.map((item, index) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => selectItem(item)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={`w-full text-left text-sm px-4 py-3 transition ${
                          highlightedIndex === index
                            ? "bg-blue-50 text-blue-600"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        {renderItem ? renderItem(item) : item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-4 text-center text-sm text-gray-500">
                  No items found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
