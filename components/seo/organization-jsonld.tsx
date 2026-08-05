export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Zecco Real Estate",
    url: "https://zecco.es",
    logo: "https://zecco.es/assets/images/logo.png",
    areaServed: "Costa del Sol, Spain",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Malaga",
      addressCountry: "ES",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
