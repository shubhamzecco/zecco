import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import posterReducer from "./modules/common/reducers/posterReducer";
import uiReducer from "./modules/common/reducers/uiReducer";
import { userDataReducers } from "./modules/common/user_data";
import mainReducer from "./modules/main/reducer";

const combinedReducer = combineReducers({
  user_data: userDataReducers,
  usePosterReducers: posterReducer,
  uiReducer: uiReducer,
  mainReducer : mainReducer
});

const rootReducer = combineReducers({
  combinedReducer: persistReducer(
    { key: "chathub-store", storage, blacklist: ["uiReducer"] },
    combinedReducer
  ),
});

export function makeStore() {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // serializableCheck: {
        //   ignoredActions: ["persist/PERSIST"], // Ignore serializability check for specific actions
        // },
        serializableCheck: false,
        immutableCheck: false,
      }),
  });

  const persistor = persistStore(store);
  return { store, persistor };
}

const { store, persistor } = makeStore();
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { persistor, store };

