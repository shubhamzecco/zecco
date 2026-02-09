"use client";

import { Provider } from "react-redux";
import { Suspense } from "react";
import { store } from "@/redux/store";
import { ToastContainer } from "react-toastify";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import "react-toastify/dist/ReactToastify.css";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {/* <WebSocketProvider> */}
        <Suspense>
          {children}
        </Suspense>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      {/* </WebSocketProvider> */}
    </Provider>
  );
}
