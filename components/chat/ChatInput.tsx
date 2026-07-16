"use client";

import { ArrowUp } from "lucide-react";
import { forwardRef, useEffect, useRef, useState } from "react";

type Props = {
  isLoading: boolean;
  disabled?: boolean;
  onSend: (text: string) => void;
  maxLength?: number;
};

const ChatInput = forwardRef<HTMLInputElement, Props>(
  function ChatInput({ isLoading, disabled, onSend, maxLength }, ref) {
    const [value, setValue] = useState("");
    const internalRef = useRef<HTMLInputElement>(null);

    const inputRef = (ref ||
      internalRef) as React.RefObject<HTMLInputElement>;

    const isDisabled = isLoading || disabled;

    const handleSend = () => {
      if (!value.trim() || isDisabled) return;
      onSend(value);
      setValue("");
    };

    useEffect(() => {
      if (!isDisabled) {
        inputRef.current?.focus();
      }
    }, [isDisabled, inputRef]);

    return (
      <div className="shrink-0 p-4 bg-[#F3F8FF] border-t border-blue-100">
        {disabled ? (
          <p className="text-center text-xs text-gray-400 py-3">
            Sign in to continue the conversation
          </p>
        ) : (
          <div className="relative">
            <input
              maxLength={maxLength}
              ref={inputRef}
              value={value}
              disabled={isDisabled}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Talk with Zecco.es"
              className="w-full rounded-xl border border-blue-300 bg-white px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSend}
              disabled={isDisabled}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-lg bg-sky_blue_color text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send"
            >
              <ArrowUp size={16} />
            </button>
            {value.length > 0 && (
              <div className="absolute -bottom-4 right-4 text-[11px] font-medium text-gray-600">
                {value.length}/{maxLength}
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

export default ChatInput;
