import { BreadcrumbItem } from "@/redux/modules/main/types";

const breadcrumbMap: Record<string, string> = {
  "costa-del-sol": "Costa del Sol areas and Cities",
  areas: "Costa del Sol areas and Cities",
  property: "Property Details",
  "zecco-favorites": "Zecco's Favorites",
  "about-zecco": "About Zecco.es",
  blogs: "Blogs & Insights",
  packages: "Packages",
  "saved-searches": "Saved Searches",
  "AI-insights": "AI Insights",
  favorites: "Favorites",
  "map-search": "Map Search",
  messages: "Messages",
  preferences: "Preferences",
  "contact-us": "Contact Us",
  "privacy-policy": "Privacy Policy",
  "terms-and-conditions": "Terms & Conditions",
};

const isPropertyId = (s: string) => /^[a-f0-9]{24}$/i.test(s);

export const generateBreadcrumbs = (pathname: string, propertyDetails?: any): BreadcrumbItem[] => {
  const segments = pathname.split("/").filter(Boolean);

  let path = "";
  const crumbs: BreadcrumbItem[] = segments.map((segment, index) => {
    path += `/${segment}`;
    const isLast = index === segments.length - 1;

    let label: string;
    if (isPropertyId(segment)) {
      label = "Property Details";
    } else if (breadcrumbMap[segment]) {
      label = breadcrumbMap[segment];
    } else {
      label = segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }

    return {
      label,
      href: isLast ? null : path,
    };
  });

  return [{ label: "Home", href: "/" }, ...crumbs];
};

export const slugToLabel = (slug: string) =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

export const getCostaDelSolLocationBreadcrumbs = (
  locationSlug: string,
  locationLabel?: string,
): BreadcrumbItem[] => [
    { label: "Home", href: "/" },
    {
      label: "Costa del Sol areas and Cities",
      href: "/costa-del-sol",
    },
    {
      label: locationLabel || slugToLabel(locationSlug),
      href: `/costa-del-sol/${locationSlug}`,
    },
  ];

export const savedSearchesData = [];

export const NAV_ITEMS = [
  {
    label: "Find Property",
    href: "/",
  },
  {
    label: "Costa del Sol",
    href: "/costa-del-sol",
  },
  {
    label: "Zecco's Favorites",
    href: "/zecco-favorites",
  },
  {
    label: "About Zecco.es",
    href: "/about-zecco",
  },
  {
    label: "Packages",
    href: "/packages",
  },
  {
    label: "Blogs & Insights",
    href: "/blogs",
  },
];

export const handleProtectedRoute = (
  isLoggedIn: boolean,
  router: any,
  redirectUrl: string = "/signin",
) => {
  if (!isLoggedIn) {
    localStorage.setItem(
      "redirect_after_login",
      window.location.pathname + window.location.search,
    );
    router.push(redirectUrl);
    return false;
  }

  return true;
};

export const formatDateMonth = (
  date: string | Date,
  locale: string = "en-US",
): string => {
  if (!date) return "";

  return new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

export const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};


export const camelCase = (text: string = "") => {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const citySlug = (city_name: any) => {
  return city_name?.trim().toLowerCase().replace(/\s+/g, "-");
};

export const cityName = (slug: string) => {
  return slug?.trim().toLowerCase().replace(/-/g, " ");
};

export const formatEuro = (amount: number | string) => {
  const formatted = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

  return `€${" "}${formatted}`;
};


export const priceRanges = [
  {
    label: "Under €1M",
    value: "0-1000000",
  },
  {
    label: "€1M - €2M",
    value: "1000000-2000000",
  },
  {
    label: "€2M - €3.5M",
    value: "2000000-3500000",
  },
  {
    label: "€3.5M+",
    value: "3500000+",
  },
];

export const investmentType = [
  {
    label: "Wealth Preservation",
    value: "wealth_preservation",
  },
  {
    label: "Return",
    value: "return",
  },
  {
    label: "Growth",
    value: "growth",
  },
];

export const propertyTypes = [
  {
    label: "New Property",
    value: "new_property",
  },
  {
    label: "Existing Property",
    value: "existing_property",
  },
  {
    label: "Rental Property",
    value: "rental_property",
  },
];

export const bedroomRanges = [
  {
    label: "1+",
    value: "1",
  },
  {
    label: "2+",
    value: "2",
  },
  {
    label: "3+",
    value: "3",
  },
  {
    label: "4+",
    value: "4",
  },
  {
    label: "5+",
    value: "5",
  },
];

export const parsePrice = (value: string): number | "" => {
  if (!value) return "";

  // Remove spaces
  let formatted = value.trim().replace(/\s/g, "");

  const hasComma = formatted.includes(",");
  const hasDot = formatted.includes(".");

  if (hasComma && hasDot) {
    // European: 1.320.000,00
    if (formatted.lastIndexOf(",") > formatted.lastIndexOf(".")) {
      formatted = formatted.replace(/\./g, "").replace(",", ".");
    }
    // US: 1,320,000.00
    else {
      formatted = formatted.replace(/,/g, "");
    }
  } else if (hasComma) {
    // 1320000,00
    formatted = formatted.replace(",", ".");
  } else {
    // 1.320.000 -> remove thousand separators if multiple dots
    const dotCount = (formatted.match(/\./g) || []).length;
    if (dotCount > 1) {
      formatted = formatted.replace(/\./g, "");
    }
  }

  const number = Number(formatted);

  return isNaN(number) ? "" : number;
};


export const formatMessageDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();

  // Remove time for comparison
  const current = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const target = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const diffInDays =
    (current.getTime() - target.getTime()) / (1000 * 60 * 60 * 24);

  if (diffInDays === 0) {
    return "Today";
  }

  if (diffInDays === 1) {
    return "Yesterday";
  }

  const options: Intl.DateTimeFormatOptions =
    date.getFullYear() === today.getFullYear()
      ? {
        month: "short",
        day: "numeric",
      }
      : {
        month: "short",
        day: "numeric",
        year: "numeric",
      };

  return new Intl.DateTimeFormat("en-US", options).format(date);
};