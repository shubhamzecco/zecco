import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/favorites/",
          "/messages/",
          "/saved-searches/",
          "/AI-insights/",
          "/signin",
          "/signup",
          "/reset-password",
          "/forget-password",
          "/otp-verification",
        ],
      },
    ],
    sitemap: "https://zecco.es/sitemap.xml",
  };
}
