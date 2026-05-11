import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setLoginPopup } from "@/redux/modules/main/action";
import { handleProtectedRoute } from "@/utils/common";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
const LoginPopup = () => {
  const { mainReducer, user_data } = usePosterReducers();
  if (!mainReducer.login_popup) return null;
  const dispatch = useDispatch()
  const router = useRouter()
  const isLoggedIn = !!user_data?.access_token
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-xsm"
        onClick={(e) => {
          e.stopPropagation();
          dispatch(setLoginPopup(false))
        }}
      />
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-6 animate-scaleIn">
        <div className="flex items-center justify-center w-14 h-14 mx-auto bg-red-100 rounded-full mb-4">
          <span className="text-2xl">🔒</span>
        </div>

        <h2 className="text-xl font-semibold text-center text-gray-800">
          Login Required
        </h2>

        <p className="mt-3 text-sm text-gray-500 text-center leading-relaxed max-w-xs mx-auto">
          Login to continue and enjoy a personalized experience across the platform.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(setLoginPopup(false))
            }}
            className="w-1/2 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleProtectedRoute(isLoggedIn, router)
              dispatch(setLoginPopup(false))
            }}
            className="w-1/2 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Login
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
};

export default LoginPopup;