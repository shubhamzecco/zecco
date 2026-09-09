export function getSiteBaseUrl(): string {
  const fromEnv =
    process.env.NEXT_FRONTEND_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "";
  return (fromEnv || "https://zw.appristine.co.in").replace(/\/+$/, "");
}