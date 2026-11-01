import type { Metadata } from "next";
import ContactHero from "@/components/sections/contact/hero/ContactHero";
import Enquiry from "@/components/sections/contact/enquiry/Enquiry";
import Faq from "@/components/sections/contact/faq/Faq";
import Visit from "@/components/sections/contact/visit/Visit";

export const metadata: Metadata = {
  title: "Contact Us | Avvira Agro Industries",
  description:
    "Get in touch with Avvira Agro Industries for bulk orders, export enquiries or to supply your grain to us.",
};

export default function ContactPage() {
  return (
    <main className="flex flex-1 flex-col">
      <ContactHero />
      <Enquiry />
      <Visit />
      <Faq />
    </main>
  );
}
