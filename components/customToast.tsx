"use client";
import clsx from "clsx";
import { AlertCircle, AlertTriangle, Check, Info } from "lucide-react";
import { createRoot } from "react-dom/client";

let container: HTMLDivElement | null = null;

const createContainer = () => {
  if (!container) {
    container = document.createElement("div");
    container.className =
      "fixed top-4 left-0 right-0 z-[9999] flex flex-col items-center justify-center gap-3 pointer-events-none px-3";
    document.body.appendChild(container);
  }
  return container;
};

const showToast = (
  message: string,
  type: "success" | "error" | "info" | "warning",
) => {
  const toast = document.createElement("div");
  const root = createRoot(toast);

  const close = () => {
    toast.classList.add("animate-slideUpFade");
    setTimeout(() => toast.remove(), 400);
  };

  const icons = {
    success: (
      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white">
        <Check size={16} />
      </div>
    ),
    error: <AlertCircle size={20} className="flex-shrink-0" />,
    info: <Info size={20} className="flex-shrink-0" />,
    warning: <AlertTriangle size={20} className="flex-shrink-0" />,
  };

  root.render(
    <div
      className={clsx(
        "px-4 py-3 rounded-xl shadow-lg text-sm sm:text-base flex items-center gap-3 w-full sm:w-auto max-w-[calc(100%-1.5rem)] sm:max-w-[420px] mx-auto transition-all duration-300 pointer-events-auto animate-slideDownFade",
        {
          "bg-emerald-50 text-emerald-700 border border-emerald-200":
            type === "success",
          "bg-red-50 text-red-800 border border-red-200": type === "error",
          "bg-blue-50 text-blue-800 border border-blue-200": type === "info",
          "bg-yellow-50 text-yellow-800 border border-yellow-200":
            type === "warning",
        },
      )}
    >
      {icons[type]}
      <span className="flex-1 font-opensans-semibold text-[12px] lg:text-[15px]">
        {message}
      </span>
    </div>,
  );

  const toastContainer = createContainer();
  toastContainer.appendChild(toast);

  setTimeout(close, 3000);
};

export const customToast = {
  success: (msg: string) => showToast(msg, "success"),
  error: (msg: string) => showToast(msg, "error"),
  info: (msg: string) => showToast(msg, "info"),
  warning: (msg: string) => showToast(msg, "warning"),
};
