import type { MetadataRoute } from "next";

const routes = [
  "/",
  "/about-zecco",
  "/blogs",
  "/contact-us",
  "/privacy-policy",
  "/terms-and-conditions",
  "/packages",
  "/costa-del-sol",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://zecco.es";

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
