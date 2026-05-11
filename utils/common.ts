import { App_url } from "@/constant/static"
import { BreadcrumbItem } from "@/redux/modules/main/types"

const breadcrumbMap: Record<string, string> = {
    areas: "Costa del Sol areas and Cities",
    property: "Property Detail",
}

export const generateBreadcrumbs = (
    pathname: string
): BreadcrumbItem[] => {
    const segments = pathname.split("/").filter(Boolean)

    let path = ""
    const crumbs: BreadcrumbItem[] = segments.map((segment) => {
        path += `/${segment}`

        return {
            label:
                breadcrumbMap[segment] ||
                segment
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase()),
            href: path,
        }
    })

    return [
        { label: "Home", href: "/" },
        ...crumbs,
    ]
}


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
            { label: "Costa del Sol areas and Cities", href: App_url.link.COSTA_DEL_SOL },
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
]


export const handleProtectedRoute = (
    isLoggedIn: boolean,
    router: any,
    redirectUrl: string = App_url.link.SIGN_IN
) => {
    if (!isLoggedIn) {
        localStorage.setItem(
            'redirect_after_login',
            window.location.pathname + window.location.search
        )
        router.push(redirectUrl)
        return false
    }

    return true
}