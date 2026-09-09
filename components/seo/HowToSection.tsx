const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to buy a property in Spain on the Costa del Sol",
  description:
    "The step-by-step process to find and buy a home in Malaga province, Spain, from search to notary signing.",
  totalTime: "P3M",
  estimatedCost: { "@type": "MonetaryAmount", currency: "EUR", value: "10000" },
  supply: {
    "@type": "HowToSupply",
    name: "Valid passport or national ID and a NIE number",
  },
  tool: {
    "@type": "HowToTool",
    name: "Spanish bank account",
  },
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Obtain your NIE number",
      text: "Apply for your NIE (foreigner identification number) at the Spanish police or consulate. It is required for any property purchase and bank account in Spain.",
      url: "https://zw.appristine.co.in/costa-del-sol",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Define your budget and area",
      text: "Choose a location on the Costa del Sol (e.g. Marbella, Estepona, Fuengirola, Mijas instead of one broad search) and set a budget that includes stamp/transfer tax of around 8-10% for resale homes in Andalusia.",
      url: "https://zw.appristine.co.in/costa-del-sol/properties",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Search and shortlist verified properties",
      text: "Browse the Zecco property portal for sale and rent, filter by type, price, bedrooms and location, and shortlist the villas, apartments, townhouses or new builds that match your criteria.",
      url: "https://zw.appristine.co.in/costa-del-sol/properties",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Arrange viewings and make an offer",
      text: "Visit the shortlisted homes in person or with a video call, then submit an offer to the seller with the help of a local agent or lawyer.",
      url: "https://zw.appristine.co.in/contact-us",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Complete legal checks and deposit",
      text: "Hire an independent Spanish lawyer to run title checks, confirm cadastral data and planning permission, review community fees, and sign the private contract with a deposit.",
      url: "https://zw.appristine.co.in/costa-del-sol",
    },
    {
      "@type": "HowToStep",
      position: 6,
      name: "Sign the deed before a notary",
      text: "Sign the public deed (escritura) before a Spanish notary, pay the transfer tax and notary and land registry fees (around 10-13% total in Andalusia), and register the property in your name.",
      url: "https://zw.appristine.co.in/costa-del-sol",
    },
  ],
};

// Renders only the HowTo JSON-LD schema (hidden from users) so answer engines
// can cite the step-by-step buying process without showing it on the page.
export function HowToSection() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
    />
  );
}