"use client";

import { App_url } from "@/constant/static";
import { isPrivateRoute } from "@/constant/routeConfig";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user_data } = usePosterReducers();
  const [mounted, setMounted] = useState(false);

  const isLoggedIn = !!user_data?.is_Login || !!user_data?.access_token;
  const shouldGuard = !!pathname && isPrivateRoute(pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !shouldGuard) return;

    if (!isLoggedIn) {
      router.replace(App_url.link.SIGN_IN);
    }
  }, [isLoggedIn, mounted, router, shouldGuard]);

  if (!mounted) return null;
  if (shouldGuard && !isLoggedIn) return null;

  return <>{children}</>;
}
