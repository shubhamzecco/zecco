import type { Metadata } from "next";
import ContactUs from "./contact-us";

export const metadata: Metadata = {
  title: "Contact Us | Zecco Real Estate",
  description:
    "Get in touch with Zecco's local real estate experts in Costa del Sol for personalized assistance, property inquiries, and investment consultations.",
  alternates: {
    canonical: "/contact-us",
  },
  openGraph: {
    title: "Contact Us | Zecco Real Estate",
    description:
      "Get in touch with Zecco's local real estate experts in Costa del Sol for personalized assistance and property consultations.",
    url: "https://zw.appristine.co.in/contact-us",
    type: "website",
  },
};

export default function ContactUsPage() {
  return <ContactUs />;
}
