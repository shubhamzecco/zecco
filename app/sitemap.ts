import type { MetadataRoute } from "next";
import { io } from "socket.io-client";
import { generatePropertySlug } from "@/utils/common";
import { strapiGet } from "@/app/blogs/strapi/strapiClient";

export const revalidate = 3600; // Revalidate every hour

const baseUrl = "https://zw.appristine.co.in";

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

async function fetchSitemapData(): Promise<{ locations: any[]; properties: any[] }> {
  const url = process.env.NEXT_PUBLIC_ENDPOINT_API_URL || "https://zn.appristine.co.in";

  try {
    const socket = io(url, { transports: ["websocket"], timeout: 10000 });

    return new Promise((resolve) => {
      let locations: any[] = [];
      let properties: any[] = [];
      let receivedLocs = false;
      let receivedProps = false;

      const timer = setTimeout(() => {
        try {
          socket.disconnect();
        } catch (_) {}
        resolve({ locations, properties });
      }, 15000);

      const checkDone = () => {
        if (receivedLocs && receivedProps) {
          clearTimeout(timer);
          try {
            socket.disconnect();
          } catch (_) {}
          resolve({ locations, properties });
        }
      };

      socket.on("connect", () => {
        socket.emit("action", {
          type: "locationService",
          action: "searchLocationArea",
          payload: {},
        });
        socket.emit("action", {
          type: "propertyService",
          action: "list",
          payload: { limit: 100, page: 1 },
        });
      });

      socket.onAny((_event, res) => {
        if (
          res?.request?.type === "locationService" &&
          res?.request?.action === "searchLocationArea"
        ) {
          locations = Array.isArray(res?.data) ? res.data : [];
          receivedLocs = true;
          checkDone();
        }
        if (
          res?.request?.type === "propertyService" &&
          res?.request?.action === "list"
        ) {
          properties = Array.isArray(res?.data?.data)
            ? res.data.data
            : Array.isArray(res?.data)
            ? res.data
            : [];
          receivedProps = true;
          checkDone();
        }
      });

      socket.on("connect_error", () => {
        clearTimeout(timer);
        resolve({ locations, properties });
      });
    });
  } catch (err) {
    return { locations: [], properties: [] };
  }
}

async function fetchBlogSlugs(): Promise<string[]> {
  try {
    const res = await strapiGet<any>(
      `/api/articles?locale=en&pagination[page]=1&pagination[pageSize]=100&fields[0]=slug&fields[1]=updatedAt`,
    );
    const articles = Array.isArray(res?.data) ? res?.data : [];
    return articles
      .map((a: any) => a?.attributes?.slug)
      .filter((s: any): s is string => !!s);
  } catch (err) {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { locations, properties, blogSlugs } = await getCachedSitemapData();

  const sitemapUrls: MetadataRoute.Sitemap = [];
  const seenUrls = new Set<string>();

  const addUrl = (
    url: string,
    changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never",
    priority: number,
    lastModified: Date = new Date()
  ) => {
    // XML requires '&' in URLs to be escaped as '&amp;'
    const xmlSafeUrl = url.replace(/&/g, "&amp;");
    if (!seenUrls.has(xmlSafeUrl)) {
      seenUrls.add(xmlSafeUrl);
      sitemapUrls.push({
        url: xmlSafeUrl,
        lastModified,
        changeFrequency,
        priority,
      });
    }
  };

  // 1. Static core routes
  const staticRoutes: Array<{
    path: string;
    changeFrequency: "daily" | "weekly";
    priority: number;
  }> = [
    { path: "/", changeFrequency: "daily", priority: 1.0 },
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

  // 2. Location filter routes (/costa-del-sol/properties?city=... / area=...)
  // if (locations.length > 0) {
  //   locations.forEach((loc) => {
  //     const city = cleanSlug(loc?.city_name || loc?.name_slug || loc?.name);
  //     const area = cleanSlug(loc?.area_name);
  //     const subarea = cleanSlug(loc?.subarea_name);

  //     if (loc?.type === "city" && city) {
  //       addUrl(`${baseUrl}/costa-del-sol/properties?city=${city}`, "daily", 0.8);
  //     } else if (loc?.type === "area" && city && area) {
  //       addUrl(`${baseUrl}/costa-del-sol/properties?city=${city}&area=${area}`, "daily", 0.7);
  //     } else if (loc?.type === "subarea" && city && subarea) {
  //       addUrl(`${baseUrl}/costa-del-sol/properties?city=${city}&subarea=${subarea}`, "daily", 0.7);
  //     } else if (city) {
  //       addUrl(`${baseUrl}/costa-del-sol/properties?city=${city}`, "daily", 0.8);
  //     }
  //   });
  // } else {
  //   // Fallback cities
  //   fallbackCities.forEach((city) => {
  //     addUrl(`${baseUrl}/costa-del-sol/properties?city=${city}`, "daily", 0.8);
  //   });
  // }

  // 3. Property detail pages
  // e.g. /costa-del-sol/properties/3-bedroom-apartments-for-sale-in-fuengirola-spain-154?city=fuengirola
  // and /costa-del-sol/properties/3-bedroom-apartments-for-sale-in-fuengirola-spain-154
  properties.forEach((prop) => {
    const propSlug = generatePropertySlug(prop);
    const city = cleanSlug(prop?.locationCity || prop?.locationArea || prop?.city);
    const lastModified = prop?.updatedAt ? new Date(prop.updatedAt) : new Date();

    if (propSlug) {
      

      // Canonical clean property detail URL
      addUrl(
        `${baseUrl}/costa-del-sol/properties/${propSlug}`,
        "daily",
        0.9,
        lastModified
      );

      // Zecco favorites detail URL (by _id)
      if (prop?._id) {
        addUrl(
          `${baseUrl}/zecco-favorites/${prop._id}`,
          "weekly",
          0.6,
          lastModified
        );
      }
    }
  });

  // 4. Blog articles
  blogSlugs.forEach((slug) => {
    addUrl(`${baseUrl}/blogs/${slug}`, "weekly", 0.7);
  });

  return sitemapUrls;
}

// In-process cache so the slow socket + Strapi calls re-run at most once per TTL.
const SITEMAP_CACHE_TTL = 60 * 60 * 1000; // 1 hour

let cachedData: { locations: any[]; properties: any[]; blogSlugs: string[] } | null = null;
let cachedAt = 0;
let inFlight: Promise<{ locations: any[]; properties: any[]; blogSlugs: string[] }> | null = null;

async function getCachedSitemapData(): Promise<{
  locations: any[];
  properties: any[];
  blogSlugs: string[];
}> {
  const now = Date.now();
  if (cachedData && now - cachedAt < SITEMAP_CACHE_TTL) {
    return cachedData;
  }

  if (!inFlight) {
    inFlight = (async () => {
      const [socketRes, blogSlugs] = await Promise.all([
        fetchSitemapData(),
        fetchBlogSlugs(),
      ]);
      // Only cache when the socket actually returned data — otherwise the next
      // request retries instead of serving a stale empty fallback.
      const hasData =
        (Array.isArray(socketRes.locations) && socketRes.locations.length > 0) ||
        (Array.isArray(socketRes.properties) && socketRes.properties.length > 0);
      const result = {
        locations: socketRes.locations,
        properties: socketRes.properties,
        blogSlugs,
      };
      if (hasData) {
        cachedData = result;
        cachedAt = Date.now();
      }
      inFlight = null;
      return result;
    })().catch((err) => {
      inFlight = null;
      return { locations: [], properties: [], blogSlugs: [] };
    });
  }

  return inFlight;
}
