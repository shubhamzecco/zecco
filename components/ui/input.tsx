"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react"; // ⬅ using lucide icons

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, placeholder, required, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const isPassword = type === "password";
    const finalType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="relative w-full">
        {/* Input */}
        <input
          type={finalType}
          ref={ref}
          className={cn(
            `peer flex h-11 w-full rounded-[20px] border border-input bg-transparent 
             px-3 py-1 text-base text-black
             placeholder:text-transparent
             focus:outline-none 
             md:text-sm`,
            isPassword && "pr-10", // add space for the eye icon
            className
          )}
          placeholder={placeholder}
          required={required}
          {...props}
        />

        {/* Custom mixed-color placeholder */}
        {placeholder && (
          <span
            className={cn(
              `pointer-events-none absolute left-3 inset-y-0 flex items-center
                text-[#a1a0a0] transition-opacity
                peer-focus:opacity-0
                peer-[&:not(:placeholder-shown)]:opacity-0
                peer-placeholder-shown:opacity-100`
            )}
          >
            {placeholder}
            {/* {required && <span className="text-red-500 ml-1">*</span>} */}
          </span>
        )}

        {/* Show/Hide Password Button */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 inset-y-0 flex items-center text-[#9CA3AF] hover:text-brand-blue"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
