"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, placeholder, required, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <textarea
        ref={ref}
        className={cn(
          `peer flex min-h-[100px] w-full rounded-[20px] border border-input 
           bg-transparent px-3 py-2 text-base text-black
           placeholder:text-transparent
           focus:outline-none
           md:text-sm`,
          className
        )}
        placeholder={placeholder}
        required={required}
        {...props}
      />

      {/* Custom placeholder */}
      {placeholder && (
        <span
          className={cn(
            `pointer-events-none absolute left-3 top-3
             text-[#a1a0a0] transition-opacity
             peer-focus:opacity-0
             peer-[&:not(:placeholder-shown)]:opacity-0
             peer-placeholder-shown:opacity-100`
          )}
        >
          {placeholder}
        </span>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export { Textarea };