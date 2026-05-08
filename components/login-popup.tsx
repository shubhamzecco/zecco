import React from "react";

interface LoginPopupProps {
  isOpen: boolean;
  onClose: (e:any) => void;
  onLogin: (e : any) => void;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-6 animate-scaleIn">
        
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 mx-auto bg-red-100 rounded-full mb-4">
          <span className="text-2xl">🔒</span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center text-gray-800">
          Login Required
        </h2>

        {/* Message */}
        <p className="mt-3 text-sm text-gray-500 text-center leading-relaxed">
          You need to be logged in to add this property to your favorites.
          <br />
          Log in now to save and access your favorite properties anytime.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="w-1/2 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={onLogin}
            className="w-1/2 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
      </div>

      {/* Animation */}
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
};

export default LoginPopup;