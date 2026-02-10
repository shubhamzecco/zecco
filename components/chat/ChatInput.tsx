"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  isLoading: boolean;
  onSend: (text: string) => void;
};

export default function ChatInput({ isLoading, onSend }: Props) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  return (
    <div className="shrink-0 p-4 bg-[#F3F8FF] border-t border-blue-100">
      <div className="relative">
        <input
          value={value}
          disabled={isLoading}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Talk with Zecco.es"
          className="w-full rounded-xl border border-blue-300 bg-white px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-lg bg-sky_blue_color text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </div>
  );
}
