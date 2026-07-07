import { App_url } from "@/constant/static";
import { BreadcrumbItem } from "@/redux/modules/main/types";

const breadcrumbMap: Record<string, string> = {
  areas: "Costa del Sol areas and Cities",
  property: "Property Detail",
};

export const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split("/").filter(Boolean);

  let path = "";
  const crumbs: BreadcrumbItem[] = segments.map((segment) => {
    path += `/${segment}`;

    return {
      label:
        breadcrumbMap[segment] ||
        segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      href: path,
    };
  });

  return [{ label: "Home", href: "/" }, ...crumbs];
};

export const savedSearchesData = [];

export const NAV_ITEMS = [
  {
    label: "Find Property",
    href: "/",
    breadcrumbs: [{ label: "Home", href: "/" }],
  },
  {
    label: "Costa del Sol",
    href: App_url.link.COSTA_DEL_SOL,
    breadcrumbs: [
      { label: "Home", href: "/" },
      {
        label: "Costa del Sol areas and Cities",
        href: App_url.link.COSTA_DEL_SOL,
      },
    ],
  },
  {
    label: "Zecco's Favorites",
    href: App_url.link.ZECCO_FAVORITES,
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Zecco's Favorites", href: App_url.link.ZECCO_FAVORITES },
    ],
  },
  {
    label: "About Zecco.es",
    href: App_url.link.ABOUT_ZECCO,
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "About Zecco.es", href: App_url.link.ABOUT_ZECCO },
    ],
  },
  {
    label: "Packages",
    href: App_url.link.PACKAGE,
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Packages", href: App_url.link.PACKAGE },
    ],
  },
  {
    label: "Blogs & Insights",
    href: App_url.link.BLOGS,
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Blogs & Insights", href: App_url.link.BLOGS },
    ],
  },
];

export const handleProtectedRoute = (
  isLoggedIn: boolean,
  router: any,
  redirectUrl: string = App_url.link.SIGN_IN,
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
    label: "1",
    value: "1",
  },
  {
    label: "2",
    value: "2",
  },
  {
    label: "3",
    value: "3",
  },
  {
    label: "4",
    value: "4",
  },
  {
    label: "5+",
    value: "5+",
  },
];