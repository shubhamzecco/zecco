import type { MetadataRoute } from "next";
import { generatePropertySlug } from "@/utils/common";
import { getSiteBaseUrl } from "@/utils/siteUrl";

export const revalidate = 3600; // Revalidate every hour

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_ENDPOINT_API_URL ||
  "https://zn.appristine.co.in";

const fallbackCities = [
  "marbella",
  "fuengirola",
  "estepona",
  "mijas",
  "benalmadena",
  "malaga",
  "torremolinos",
  "nerja",
  "casares",
  "manilva",
  "san-pedro-de-alcantara",
  "benahavis",
  "alhaurin-de-la-torre",
  "alhaurin-el-grande",
  "benadalid",
  "calahonda",
  "puerto-banus",
  "nueva-andalucia",
  "la-cala-de-mijas",
  "sotogrande",
];

const cleanSlug = (name?: string | null): string => {
  if (!name) return "";
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

async function fetchProperties(): Promise<any[]> {
  try {
    const res = await fetch(`${API_URL}/api/property/list`, {
      method: "POST",
      headers: { "Content-Type": "application/json", accept: "*/*" },
      body: JSON.stringify({
        limit: 500,
        page: 1,
        country: "Spain",
        status: true,
        forAll: true,
      }),
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch (err) {
    console.error("[sitemap] Failed to fetch properties:", err);
    return [];
  }
}

async function fetchLocations(): Promise<any[]> {
  try {
    const res = await fetch(`${API_URL}/api/location/search-area`, {
      method: "POST",
      headers: { "Content-Type": "application/json", accept: "*/*" },
      body: JSON.stringify({}),
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch (err) {
    console.error("[sitemap] Failed to fetch locations:", err);
    return [];
  }
}

async function fetchBlogSlugs(): Promise<string[]> {
  const strapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337";
  const token = process.env.NEXT_PUBLIC_STRAPI_TOKEN || "";
  try {
    const res = await fetch(
      `${strapiUrl}/api/articles?locale=en&pagination[page]=1&pagination[pageSize]=100&fields[0]=slug&fields[1]=updatedAt`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: AbortSignal.timeout(4000),
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return [];
    const json = await res.json();
    const articles = Array.isArray(json?.data) ? json.data : [];
    return articles
      .map((a: any) => a?.attributes?.slug || a?.slug)
      .filter((s: any): s is string => !!s);
  } catch {
    return [
      "buying-property-in-spain-complete-guide",
      "costa-del-sol-luxury-real-estate-trends",
      "spain-golden-visa-and-property-investment",
    ];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteBaseUrl();
  const [properties, locations, blogSlugs] = await Promise.all([
    fetchProperties(),
    fetchLocations(),
    fetchBlogSlugs(),
  ]);

  const sitemapUrls: MetadataRoute.Sitemap = [];
  const seenUrls = new Set<string>();

  const addUrl = (
    url: string,
    changeFrequency:
      | "always"
      | "hourly"
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly"
      | "never",
    priority: number,
    lastModified: Date = new Date(),
  ) => {
    if (!seenUrls.has(url)) {
      seenUrls.add(url);
      sitemapUrls.push({
        url,
        lastModified,
        changeFrequency,
        priority,
      });
    }
  };

  // 1. Static Core Pages (Priority 1.0 - 0.7)
  const staticRoutes: Array<{
    path: string;
    changeFrequency: "daily" | "weekly";
    priority: number;
  }> = [
    { path: "", changeFrequency: "daily", priority: 1.0 },
    { path: "/costa-del-sol", changeFrequency: "weekly", priority: 0.9 },
    { path: "/costa-del-sol/properties", changeFrequency: "daily", priority: 0.9 },
    { path: "/map-search", changeFrequency: "weekly", priority: 0.8 },
    { path: "/zecco-favorites", changeFrequency: "weekly", priority: 0.8 },
    { path: "/about-zecco", changeFrequency: "weekly", priority: 0.8 },
    { path: "/blogs", changeFrequency: "weekly", priority: 0.8 },
    { path: "/packages", changeFrequency: "weekly", priority: 0.8 },
    { path: "/contact-us", changeFrequency: "weekly", priority: 0.7 },
    { path: "/privacy-policy", changeFrequency: "weekly", priority: 0.6 },
    { path: "/terms-and-conditions", changeFrequency: "weekly", priority: 0.6 },
  ];

  staticRoutes.forEach((route) => {
    addUrl(`${baseUrl}${route.path}`, route.changeFrequency, route.priority);
  });

  // 2. City & Location Pages
  const citiesToAdd =
    locations.length > 0
      ? locations
          .filter((l) => l?.type === "city" || !l?.type)
          .map((l) => cleanSlug(l?.name_slug || l?.city_name || l?.name))
          .filter(Boolean)
      : fallbackCities;

  const uniqueCities = Array.from(new Set(citiesToAdd.concat(fallbackCities)));
  uniqueCities.forEach((city) => {
    addUrl(`${baseUrl}/costa-del-sol/properties?city=${city}`, "daily", 0.8);
  });

  // 3. Property Detail Pages (Priority 0.9)
  properties.forEach((prop) => {
    const propSlug = generatePropertySlug(prop);
    const lastModified = prop?.updatedAt ? new Date(prop.updatedAt) : new Date();

    if (propSlug) {
      addUrl(
        `${baseUrl}/costa-del-sol/properties/${propSlug}`,
        "daily",
        0.9,
        lastModified,
      );

      if (prop?._id) {
        addUrl(
          `${baseUrl}/zecco-favorites/${prop._id}`,
          "weekly",
          0.6,
          lastModified,
        );
      }
    }
  });

  // 4. Blog Posts (Priority 0.8)
  blogSlugs.forEach((slug) => {
    addUrl(`${baseUrl}/blogs/${slug}`, "weekly", 0.8);
  });

  return sitemapUrls;
}
