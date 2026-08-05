import type { Metadata } from "next";
import ChatbotWidget from "@/components/chat/chatbot-widget";
import HomePage from "./home/page";

export const metadata: Metadata = {
  title: "Costa del Sol Real Estate | Buy, Rent, and Invest with Zecco",
  description:
    "Discover premium villas, apartments, townhouses, and investment properties across Costa del Sol and Spain with AI-powered search and local expertise.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Costa del Sol Real Estate | Zecco",
    description:
      "Search premium properties for sale and rent across Costa del Sol with Zecco's AI-powered property platform.",
    url: "https://zecco.es",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <HomePage />
      <ChatbotWidget />
    </>
  );
}
