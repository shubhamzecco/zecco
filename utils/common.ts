import { App_url } from "@/constant/static"
import { BreadcrumbItem } from "@/redux/modules/main/types"

// utils/breadcrumb.ts
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


export const propertyData = [
    {
        id: '1',
        title: 'Modern 2-Bedroom Apartment in Marbella, Spain',
        price: '€545,000',
        location: 'Marbella, Málaga, Spain',
        images: [App_url.image.image_1, App_url.image.image_2, App_url.image.image_3],
        beds: 2,
        baths: 2,
        area: 3900,
        featured: true,
    },
    {
        id: '2',
        title: 'Luxury 2-Bedroom Apartment in Marbella, Spain',
        price: '€545,000',
        location: 'Costa del Sol, Spain',
        images: [App_url.image.image_6],
        beds: 2,
        baths: 2,
        area: 3900,
    },
    {
        id: '3',
        title: 'Stylish 2-Bedroom Apartment in Marbella, Spain',
        price: '€545,000',
        location: 'Estepona, Spain',
        images: [App_url.image.image_5],
        beds: 2,
        baths: 2,
        area: 3900,
    },
    {
        id: '4',
        title: 'Contemporary 2-Bedroom Apartment in Marbella, Spain',
        price: '€545,000',
        location: 'Benalmádena, Spain',
        images: [App_url.image.image_4],
        beds: 2,
        baths: 2,
        area: 3900,
    },
    {
        id: '5',
        title: 'Premium 2-Bedroom Apartment in Marbella, Spain',
        price: '€545,000',
        location: 'Marbella, Spain',
        images: [App_url.image.image_3],
        beds: 2,
        baths: 2,
        area: 3900,
    },
    {
        id: '6',
        title: 'Spacious 2-Bedroom Apartment in Marbella, Spain',
        price: '€545,000',
        location: 'Nerja, Spain',
        images: [App_url.image.image_2],
        beds: 2,
        baths: 2,
        area: 3900,
    },
    {
        id: '7',
        title: 'Spacious 2-Bedroom Apartment in Marbella, Spain',
        price: '€545,000',
        location: 'Nerja, Spain',
        images: [App_url.image.costa_del_sol],
        beds: 2,
        baths: 2,
        area: 3900,
    },
    {
        id: '8',
        title: 'Spacious 2-Bedroom Apartment in Marbella, Spain',
        price: '€545,000',
        location: 'Nerja, Spain',
        images: [App_url.image.your_search],
        beds: 2,
        baths: 2,
        area: 3900,
    },
]


export const savedSearchesData = [
    {
        id: '1',
        title: '€ 300,000 – € 500,000',
        description: '2BHK in Madrid under €500K',
        location: 'Madrid, Spain',
        image: App_url.image.image_6,
    },
    {
        id: '2',
        title: '€ 300,000 – € 500,000',
        description: 'Stylish 2-Bedroom ApartmentK',
        location: 'Madrid, Spain',
        image: App_url.image.image_2,
    },
    {
        id: '3',
        title: '€ 300,000 – € 500,000',
        description: 'Elegant 2-Bedroom Apartment',
        location: 'Madrid, Spain',
        image: App_url.image.image_5,
    },
    {
        id: '4',
        title: '€ 300,000 – € 500,000',
        description: 'Contemporary 2-Bedroom Apartment',
        location: 'Madrid, Spain',
        image: App_url.image.image_6,
    },

    {
        id: '5',
        title: '€ 300,000 – € 500,000',
        description: 'Elegant 3-Bedroom Apartment',
        location: 'Madrid, Spain',
        image: App_url.image.image_3,
    },
    {
        id: '6',
        title: '€ 300,000 – € 500,000',
        description: 'Contemporary 2-Bedroom Apartment',
        location: 'Madrid, Spain',
        image: App_url.image.image_1,
    },
]


