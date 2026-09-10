"use client";
import CommonApiRequest from "@/api/rest/fetchData";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import AIProcessingCard from "@/app/AI-insights/components/analyzing-property-details";
import MainLayout from "@/components/layouts/main-layout";
import LoginPopup from "@/components/login-popup";
import { Button } from "@/components/ui/button";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setAiInsight, setLoginPopup, setPropertyDetails } from "@/redux/modules/main/action";
import {
  IFeature,
  IImage,
  IProperty,
  IPropertyDescription,
  IPropertyResponse,
  PropertyAnalysis,
} from "@/redux/modules/main/types";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { AIMarketIntelligence } from "./components/AIMarketIntelligence";
import { AgentCard } from "./components/AgentCard";
import BasicFeatures from "./components/BasicFeatures";
import PropertyGallery from "./components/ImageGallery";
import { MapSection } from "./components/MapSection";
import { PropertyDescription } from "./components/PropertyDescription";
import { PropertyInfo } from "./components/PropertyInfo";
import PropertyStats from "./components/PropertyStats";
import ZeccoFavorites from "./components/ZeccoFavorites";

export default function PropertyDetailClient({
  initialProperty,
}: {
  initialProperty?: any;
}) {
  const { sendMessage, isConnected, lastEvent } = useWebSocket();
  const { mainReducer, user_data } = usePosterReducers();
  const params = useParams();
  const propertyId = params.id || params.propertyId || (Array.isArray(params.slug) ? params.slug[params.slug.length - 1] : params.slug);
  const dispatch = useDispatch();
  const pathname = usePathname()
  const [step, setStep] = useState("intro");
  const [isCompleted, setIsCompleted] = useState(false);
  const isLoggedIn = !!user_data?.access_token;
  const propertyDetails = mainReducer?.property_details || initialProperty;
  const hasInitialPropertyRef = useRef(!!initialProperty?._id);

  useEffect(() => {
    if (initialProperty) {
      dispatch(setPropertyDetails(initialProperty));
    }
  }, []);

  const ai_insight = useMemo(() => {
    return mainReducer?.stored_aiInsight?.data?.find(
      (item) => item?.property?._id === propertyDetails?._id
    );
  }, [
    mainReducer?.stored_aiInsight?.data,
    propertyDetails?._id,
  ]);

  useEffect(() => {
    if (!isConnected || !propertyId) return;
    if (hasInitialPropertyRef.current) {
      hasInitialPropertyRef.current = false;
      return;
    }
    const idToFetch =
      propertyDetails?._id ||
      (typeof propertyId === "string"
        ? propertyId.match(/[a-f0-9]{24}/i)?.[0] || propertyId
        : propertyId);
    sendMessage("action", {
      type: "propertyService",
      action: "get",
      payload: {
        id: idToFetch,
      },
    });
  }, [isConnected, propertyId]);

  useEffect(() => {
    sendMessage("action", {
      type: "aiInsightService",
      action: "list",
      payload: {
        search: "",
        limit: 0,
        page: 1,
      },
    });
  }, [])

  useEffect(() => {
    if (
      lastEvent?.data?.status &&
      lastEvent?.data?.request?.type === "userService" &&
      (lastEvent?.data?.request?.action === "addFavorite" ||
        lastEvent?.data?.request?.action === "removeFavorite")
    ) {
      sendMessage("action", {
        type: "propertyService",
        action: "get",
        payload: {
          id: propertyId,
        },
      });
    }
  }, [lastEvent]);

  useEffect(() => {
    if (mainReducer?.ai_insight && Object.keys(mainReducer?.ai_insight || {}).length > 0) {
      setStep("complete");
      setIsCompleted(true);
    } else if (ai_insight) {
      setStep("complete");
      setIsCompleted(true);
      dispatch(setAiInsight(ai_insight?.data as unknown as IPropertyResponse));
    }
  }, [mainReducer?.ai_insight, ai_insight]);

  const handleAIInsight = () => {
    setStep("processing");
    setIsCompleted(false);
    CommonApiRequest(
      "GET",
      `${App_url.endpoint_url?.AI_INSIGHT}/${propertyDetails?._id}/${user_data?.user?._id}`,
      {},
      {},
    )?.then((response: any) => {
      if (response?.status === 200) {
        dispatch(setAiInsight(response?.data));
        setStep("complete");
        setIsCompleted(true);
      } else {
        setStep("intro");
        dispatch(setAiInsight({} as IPropertyResponse));
        toast.error(response?.data?.message);
      }
    });
  };

  const property = propertyDetails as IProperty | null;

  const jsonLd = property
    ? buildPropertyJsonLd(property, Array.isArray(propertyId) ? propertyId[propertyId.length - 1] : propertyId ?? '', pathname)
    : null;


  return (
    <MainLayout isBreadcrumb isPropertyDetails chatBotWidget={true}>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <div className="lg:mx-7 px-4 sm:px-6 lg:px-8">
        <div className="lg:col-span-1">
          <PropertyGallery
            property={propertyDetails?.propertyImages as IImage[]}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PropertyInfo
              property={propertyDetails as IProperty}
            />
            <PropertyStats
              property={propertyDetails as IProperty}
            />
            <div className="flex items-center gap-5 mb-2">
              <Button
                type="submit"
                onClick={() =>
                  isLoggedIn ? handleAIInsight() : dispatch(setLoginPopup(true))
                }
                className="w-full capitalize bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF]  h-11 my-4 text-white rounded-full shadow-md"
              >
                AI Market Intelligence
              </Button>
            </div>
            {step === "processing" && (
              <AIProcessingCard
                isPropertyDetail
                isCompleted={isCompleted}
                onComplete={() => setStep("complete")}
                heading="AI Market Intelligence"
              />
            )}
            {step === "complete" && (mainReducer?.ai_insight &&
              Object.keys(mainReducer?.ai_insight || {}).length > 0) && (
                <AIMarketIntelligence
                  isPropertyDetail
                  ai_insight={mainReducer?.ai_insight as PropertyAnalysis}
                />
              )}
            <PropertyDescription
              propertyDescriptions={
                propertyDetails
                  ?.propertyDescriptions as IPropertyDescription[]
              }
            />
            {(propertyDetails?.features?.length ?? 0) > 0 && (
              <BasicFeatures
                features={propertyDetails?.features as IFeature[]}
              />
            )}
            <MapSection />
          </div>

          <div className="lg:col-span-1">
            {(propertyDetails?.agent_assigned || user_data?.user?.agent?.agent) && (
              <AgentCard
                agent_details={propertyDetails?.agent_assigned}
                user_data={user_data}
              />
            )}
          </div>
        </div>
        <div className="lg:col-span-1">
          {propertyDetails?.locationCity && (
            <ZeccoFavorites
              property={propertyDetails as IProperty}
            />
          )}
        </div>
      </div>
      <LoginPopup />
    </MainLayout>
  );
}

const SITE_URL = "https://zw.appristine.co.in";

const cleanSegment = (value?: string | null): string =>
  (value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function buildPropertyJsonLd(
  property: any,
  propertyId: string,
  pathname: string,
) {
  const typeName =
    property?.propertyType?.name ||
    property?.propertyCategory?.name ||
    "Property";
  const listingMode = property?.isRent ? "Rent" : "Sale";
  const city = property?.locationCity || "Costa del Sol";
  const name =
    property?.title ||
    property?.name ||
    `${property?.bedrooms ? `${property.bedrooms} Bedroom ` : ""}${typeName} for ${listingMode} in ${city}, Costa del Sol`;
  const description =
    property?.description ||
    property?.propertyDescriptions?.[0]?.description;

  const price =
    property?.salePrice ||
    property?.salePriceShow ||
    property?.rentalPrice ||
    property?.rentalPriceShow;
  const currency =
    property?.currency?.isoCode || property?.currency?.symbol || "EUR";

  const availability = property?.isSold
    ? "https://schema.org/SoldOut"
    : property?.isUnderOffer
      ? "https://schema.org/OutOfStock"
      : "https://schema.org/InStock";

  const images = (property?.propertyImages || [])
    .map((img: any) => img?.url || img?.image)
    .filter(Boolean);

  const agent = property?.agent_assigned;
  const seller = agent?.first_name || agent?.last_name || agent?.name
    ? {
      "@type": "Person",
      name: [agent?.first_name, agent?.last_name].filter(Boolean).join(" "),
      ...(agent?.email ? { email: agent.email } : {}),
      ...(agent?.contact_no ? { telephone: agent.contact_no } : {}),
    }
    : {
      "@type": "Organization",
      name: "Zecco Real Estate",
    };

  // Breadcrumbs: Home > Costa del Sol > Properties > {Area/City} > {title}
  const breadcrumbs = [
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Costa del Sol", url: `${SITE_URL}/costa-del-sol` },
    { name: "Properties", url: `${SITE_URL}/costa-del-sol/properties` },
  ];
  if (property?.locationArea) {
    breadcrumbs.push({
      name: property.locationArea,
      url: `${SITE_URL}/costa-del-sol/properties?city=${cleanSegment(city)}&area=${cleanSegment(property.locationArea)}`,
    });
  }
  breadcrumbs.push({ name, url: `${SITE_URL}${pathname}` });

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Product", "RealEstateListing"],
        name,
        description,
        url: `${SITE_URL}${pathname}`,
        image: images,
        sku: property?.reference || property?._id || propertyId,
        brand: { "@type": "Brand", name: "Zecco Real Estate" },
        category: typeName,
        datePosted:
          property?.dateListed || property?.dateCreated || property?.dateModified,
        address: {
          "@type": "PostalAddress",
          addressLocality: city || undefined,
          ...(property?.locationArea
            ? { addressRegion: property.locationArea }
            : {}),
          addressCountry: property?.locationCountry || "ES",
        },
        ...(property?.latitude && property?.longitude
          ? {
            geo: {
              "@type": "GeoCoordinates",
              latitude: property.latitude,
              longitude: property.longitude,
            },
          }
          : {}),
        ...(property?.bedrooms ? { numberOfRooms: property.bedrooms } : {}),
        ...(property?.bathrooms
          ? { numberOfBathroomsTotal: property.bathrooms }
          : {}),
        ...(property?.mtsBuild
          ? {
            floorSize: {
              "@type": "QuantitativeValue",
              value: property.mtsBuild,
              unitCode: "MTK",
            },
          }
          : {}),
        offers: price
          ? {
            "@type": "Offer",
            price,
            priceCurrency: currency,
            availability,
            url: `${SITE_URL}${pathname}`,
            itemCondition: "https://schema.org/UsedCondition",
            ...(property?.salePriceReduced
              ? { priceValidUntil: property.dateModified }
              : {}),
          }
          : undefined,
        seller,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      },
    ],
  };
}
