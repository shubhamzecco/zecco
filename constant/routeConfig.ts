import { App_url } from "./static";

export const privateRoutes = [
  App_url.link.DASHBOARD,
  App_url.link.FAVORITES,
  App_url.link.SAVED_SEARCHES,
  App_url.link.ACCOUNT_PACKAGE,
  App_url.link.AI_INSIGHTS,
  App_url.link.PROFILE,
  App_url.link.MESSAGE,
  App_url.link.PREFERENCES,
];

export const publicRoutes = [
  App_url.link.INITIAL_URL,
  App_url.link.SIGN_IN,
  App_url.link.SIGN_UP,
  App_url.link.FORGET_PASSWORD,
  App_url.link.RESET_PASSWORD,
  App_url.link.OTP_VERIFICATION,
  App_url.link.CONTACT_US,
  App_url.link.ABOUT_ZECCO,
  App_url.link.PRIVACY_POLICY,
  App_url.link.TERMS_CONDITION,
];

export const isPrivateRoute = (pathname: string) =>
  privateRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

export const isPublicRoute = (pathname: string) =>
  publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
