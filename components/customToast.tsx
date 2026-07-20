"use client";
import clsx from "clsx";
import { AlertCircle, AlertTriangle, Check, Info, X } from "lucide-react";
import { createRoot } from "react-dom/client";

let container: HTMLDivElement | null = null;

const createContainer = () => {
  if (!container) {
    container = document.createElement("div");
    container.className =
      "fixed top-6 left-0 right-0 z-[9999] flex flex-col items-center gap-4 pointer-events-none px-4";
    document.body.appendChild(container);
  }
  return container;
};

const normalizeToastMessage = (message: unknown): string => {
  if (typeof message === "string") {
    return message;
  }

  if (message instanceof Error) {
    return message.message;
  }

  if (message === null || message === undefined) {
    return "Something went wrong";
  }

  if (Array.isArray(message)) {
    return message.map((item) => normalizeToastMessage(item)).join(", ");
  }

  if (typeof message === "object") {
    const detail = (message as { detail?: unknown }).detail;
    if (detail !== undefined) {
      return normalizeToastMessage(detail);
    }

    const msg = (message as { msg?: unknown }).msg;
    if (typeof msg === "string") {
      return msg;
    }

    const text = (message as { message?: unknown }).message;
    if (typeof text === "string") {
      return text;
    }

    try {
      return JSON.stringify(message);
    } catch {
      return String(message);
    }
  }

  return String(message);
};

const typeConfig = {
  success: {
    gradient: "from-emerald-500 via-green-500 to-teal-500",
    glow: "shadow-emerald-400/30",
    iconBg: "bg-emerald-500/20",
    label: "Success",
  },
  error: {
    gradient: "from-rose-500 via-red-500 to-pink-500",
    glow: "shadow-red-400/30",
    iconBg: "bg-red-500/20",
    label: "Error",
  },
  info: {
    gradient: "from-blue-500 via-indigo-500 to-violet-500",
    glow: "shadow-blue-400/30",
    iconBg: "bg-blue-500/20",
    label: "Info",
  },
  warning: {
    gradient: "from-amber-500 via-orange-500 to-yellow-500",
    glow: "shadow-amber-400/30",
    iconBg: "bg-amber-500/20",
    label: "Warning",
  },
};

const icons = {
  success: <Check size={20} strokeWidth={3} />,
  error: <AlertCircle size={20} strokeWidth={3} />,
  info: <Info size={20} strokeWidth={3} />,
  warning: <AlertTriangle size={20} strokeWidth={3} />,
};

const showToast = (
  message: unknown,
  type: "success" | "error" | "info" | "warning",
) => {
  const safeMessage = normalizeToastMessage(message);
  const toast = document.createElement("div");
  const root = createRoot(toast);
  const config = typeConfig[type];

  const close = () => {
    toast.classList.add("atlas-toast-exit");
    setTimeout(() => toast.remove(), 450);
  };

  root.render(
    <div className="atlas-toast-enter pointer-events-auto w-full max-w-[400px] mx-auto">
      <div className={clsx(
        "relative overflow-hidden rounded-2xl bg-[#0F172A] shadow-2xl",
        config.glow,
      )}>
        <div className={clsx("h-1 w-full bg-gradient-to-r", config.gradient)} />

        <div className="flex items-start gap-3.5 px-5 py-4">
          <div className="relative shrink-0 mt-0.5">
            <div className={clsx(
              "absolute inset-0 rounded-full animate-pulse-ring",
              config.iconBg,
            )} />
            <div className={clsx(
              "relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br text-white",
              config.gradient,
            )}>
              {icons[type]}
            </div>
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <p className="text-white/90 font-manrope font-bold text-xs uppercase tracking-widest mb-1">
              {config.label}
            </p>
            <p className="text-white/70 font-manrope text-sm leading-relaxed">
              {safeMessage}
            </p>
          </div>

          <button
            onClick={close}
            className="shrink-0 p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white/80 mt-0.5"
          >
            <X size={16} />
          </button>
        </div>

        <div className="h-[3px] w-full bg-white/5">
          <div className={clsx(
            "h-full rounded-full bg-gradient-to-r animate-toast-progress",
            config.gradient,
          )} />
        </div>
      </div>
    </div>,
  );

  const toastContainer = createContainer();
  toastContainer.appendChild(toast);

  setTimeout(close, 3500);
};

export const customToast = {
  success: (msg: unknown) => showToast(msg, "success"),
  error: (msg: unknown) => showToast(msg, "error"),
  info: (msg: unknown) => showToast(msg, "info"),
  warning: (msg: unknown) => showToast(msg, "warning"),
};
