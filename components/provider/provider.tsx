"use client";

import { makeStore } from "@/redux/store";
import { Suspense, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { WebSocketProvider } from "@/api/socket/WebSocketContext";
import RouteGuard from "@/components/auth/route-guard";
import "react-toastify/dist/ReactToastify.css";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [store] = useState(() => makeStore().store);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Provider store={store}>
      <WebSocketProvider>
        <RouteGuard>
          <Suspense>{children}</Suspense>
        </RouteGuard>
        {mounted && (
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            toastClassName="custom-toast-body"
            className="custom-toast-container"
            progressClassName="custom-toast-progress"
          />
        )}
      </WebSocketProvider>
    </Provider>
  );
}
