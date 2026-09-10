import type { MetadataRoute } from "next";

const AI_BOTS = [
  "PerplexityBot",
  "Perplexity-ai",
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "Google-Extended",
  "GoogleOther",
  "Applebot-Extended",
  "Applebot",
  "Meta-ExternalAgent",
  "FacebookBot",
  "cohere-ai",
  "Bytespider",
  "Amazonbot",
  "Diffbot",
  "CCBot",
];

const DISALLOWED_PATHS = [
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
  "/api/",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Explicit rules welcoming AI agents and search engines (Perplexity, OpenAI, Anthropic, etc.)
      ...AI_BOTS.map((bot) => ({
        userAgent: bot,
        allow: "/",
        disallow: DISALLOWED_PATHS,
      })),
      // Default rule for all search engine web crawlers
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
    ],

    sitemap: "https://zw.appristine.co.in/sitemap.xml",
  };
}