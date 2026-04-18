import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { RootState } from "../store";

const selectPosterReducers = createSelector(
  (state: RootState) => state?.combinedReducer,
  (combinedReducer) => ({
    ...combinedReducer?.usePosterReducers,
    access_token: combinedReducer?.user_data?.access_token,
    user_data: combinedReducer?.user_data,
    user_id: combinedReducer?.user_data?.user?.id,
    user: combinedReducer?.user_data?.user,
    column_permissions: combinedReducer?.user_data?.user?.column_permissions,
    role: combinedReducer?.user_data?.user?.role,
    isAdmin: combinedReducer?.user_data?.user?.role === "admin" ? true : false,
    ui : combinedReducer?.uiReducer,

    mainReducer : combinedReducer?.mainReducer
  })
);

export const usePosterReducers = () => {
  return useSelector(selectPosterReducers);
};
