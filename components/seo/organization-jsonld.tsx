const SITE_URL = "https://zw.appristine.co.in";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateAgent",
        name: "Zecco Real Estate",
        url: SITE_URL,
        logo: `${SITE_URL}/assets/images/logo.png`,
        image: `${SITE_URL}/assets/images/logo.png`,
        description:
          "Zecco is an AI-powered Costa del Sol real estate agency and marketplace listing villas, apartments, townhouses and new builds across Marbella, Estepona, Fuengirola, Mijas and Malaga, Spain.",
        areaServed: [
          { "@type": "Place", name: "Costa del Sol" },
          { "@type": "Place", name: "Malaga" },
          { "@type": "Place", name: "Marbella" },
          { "@type": "Place", name: "Estepona" },
          { "@type": "Place", name: "Fuengirola" },
          { "@type": "Place", name: "Mijas" },
          { "@type": "Place", name: "Benalmadena" },
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Malaga",
          addressCountry: "ES",
        },
        telephone: "+34 600 000 000",
        email: "info@zecco.es",
        priceRange: "$$$",
        currenciesAccepted: "EUR",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+34 600 000 000",
          contactType: "customer service",
          email: "info@zecco.es",
          availableLanguage: ["English", "Spanish"],
        },
        sameAs: [
          "https://www.facebook.com/zecco",
          "https://x.com/zecco_es",
          "https://www.instagram.com/zecco.es",
        ],
      },
      {
        "@type": "WebSite",
        name: "Zecco Real Estate",
        url: SITE_URL,
        inLanguage: "en",
        publisher: {
          "@type": "RealEstateAgent",
          name: "Zecco Real Estate",
          url: SITE_URL,
          logo: `${SITE_URL}/assets/images/logo.png`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate:
              `${SITE_URL}/costa-del-sol/properties?city={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}