import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: [
          'GPTBot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'Googlebot',
          'Google-Extended',
          'Bingbot',
          'ClaudeBot',
          'Claude-Web',
          'PerplexityBot',
          'Amazonbot',
          'Applebot',
          'Applebot-Extended',
          'meta-externalagent',
          'FacebookBot',
          'DuckDuckBot',
          'YandexBot',
          'Baiduspider',
          'LinkedInBot',
          'Twitterbot',
          'Pinterestbot',
          'Bytespider',
          'CCBot',
          'CommonCrawl',
          'YouBot'
        ],
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
    sitemap: "https://zw.appristine.co.in/sitemap.xml",
  };
}
