"use client";

import { LogOut, X } from "lucide-react";

type ConfirmPopupProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

export default function ConfirmPopup({
  open,
  onClose,
  onConfirm,
  title = "Confirm Logout",
  message = "Are you sure you want to logout?",
  confirmLabel = "Logout",
  cancelLabel = "Cancel",
}: ConfirmPopupProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-sm:m-3 w-full max-w-md bg-white rounded-2xl p-6 animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          aria-label="close"
        >
          <X size={16} />
        </button>

        <div className="flex items-center justify-center w-14 h-14 mx-auto bg-red-100 rounded-full mb-4">
          <LogOut className="w-6 h-6 text-red-500" />
        </div>

        <h2 className="text-xl font-semibold text-center text-gray-800 font-manrope">
          {title}
        </h2>

        <p className="mt-3 text-sm text-gray-500 text-center leading-relaxed max-w-xs mx-auto font-inter">
          {message}
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="w-1/2 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition font-medium text-sm"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="w-1/2 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition font-medium text-sm"
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes scaleIn {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-scaleIn {
            animation: scaleIn 0.2s ease-out;
          }
        `}
      </style>
    </div>
  );
}
