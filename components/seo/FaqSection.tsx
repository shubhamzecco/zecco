const FAQS = [
  {
    question: "Which are the best areas on the Costa del Sol to buy property?",
    answer:
      "The most popular areas are Marbella (and Puerto Banus), Estepona, Benahavis, Mijas, Fuengirola, Benalmadena, Torremolinos, Malaga city, Nerja and Sotogrande. Marbella and Benahavis are known for luxury villas and golf; Estepona and Fuengirola offer strong rental demand and family-friendly living; Malaga city offers capital growth and urban apartments. The best area depends on your budget, lifestyle and investment goals.",
  },
  {
    question: "Can foreigners buy property in Spain?",
    answer:
      "Yes. Non-residents from the EU and non-EU countries (including the UK, USA and Canada) can freely buy and own property in Spain. You only need a NIE number (Numero de Identidad de Extranjero), a bank account in Spain, and your passport. No special permit or residency is required to purchase a home on the Costa del Sol.",
  },
  {
    question: "How much does it cost to buy a property in Spain (taxes and fees)?",
    answer:
      "Budget roughly 10-13% of the purchase price on top of the sale price. This covers stamp/transfer tax (ITP is around 8-10% for resale homes in Andalusia, 10% VAT on new builds plus stamp duty), notary and land registry fees (around 1-2%), legal fees (usually 1-1.5%), and a valuation if you take a mortgage.",
  },
  {
    question: "What are the running costs of owning a property in Spain?",
    answer:
      "Typical annual costs include municipal rates (IBI, roughly 0.4-1% of the cadastral value), community fees for urbanisations with shared facilities, refuse collection tax, and optional buildings insurance. For most Costa del Sol apartments this totals around 2,000-4,000 euros a year; larger villas with pools and gardens can cost more.",
  },
  {
    question: "Is the Costa del Sol a good place to invest in property?",
    answer:
      "Yes. The Costa del Sol has consistently strong rental demand, year-round tourism, good seasonal occupancy and long-term price growth. Short-term rental yields in areas like Marbella, Estepona and Fuengirola typically range from 4-8% depending on property type and management. Coastal homes with pool, sea views and proximity to golf tend to hold value best.",
  },
  {
    question: "Can I get a mortgage in Spain as a foreign buyer?",
    answer:
      "Yes. Spanish banks lend to non-residents, typically financing 60-70% of the purchase price for non-residents (up to 80% for residents). LTV depends on the valuation and your income. You will need proof of income, tax returns and bank statements, and the property will be valued by an approved surveying company before approval.",
  },
  {
    question: "Do I need to visit Spain to buy a property?",
    answer:
      "Not necessarily. Many international buyers complete purchases remotely using a power of attorney (poder) granted to a Spanish lawyer. Zecco can arrange viewings, and the legal steps (NIE, bank account, notary) can be handled by your legal representative, though you will need to sign the final deed before a notary (in person or by power of attorney).",
  },
  {
    question: "What should I look for when buying a vacation or investment home on the Costa del Sol?",
    answer:
      "Key factors are location and rental demand, proximity to the beach and amenities, orientation and sun exposure, parking, pool availability, community fees, and the level of noise in summer. For rentals, check local short-stay licensing rules. Review the property's legal status (cadastre, planning permission) before committing.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answer,
    },
  })),
};

// Renders only the FAQPage JSON-LD schema (hidden from users) so AI engines and
// answer engines can cite the Q&A while the FAQ stays invisible on the website.
export function FaqSection() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
    />
  );
}