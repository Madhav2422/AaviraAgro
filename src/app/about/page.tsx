import type { Metadata } from "next";
import AboutHero from "@/components/sections/about/hero/AboutHero";
import Journey from "@/components/sections/about/journey/Journey";
import Numbers from "@/components/sections/about/numbers/Numbers";
import Purpose from "@/components/sections/about/purpose/Purpose";
import GrainRibbon from "@/components/sections/about/ribbon/GrainRibbon";
import Values from "@/components/sections/about/values/Values";
import Cta from "@/components/sections/home/cta/Cta";

export const metadata: Metadata = {
  title: "About Us | Avvira Agro Industries",
  description:
    "The story, purpose and values behind Avvira Agro Industries, from the field to the final sack.",
};

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col">
      <AboutHero />
      <GrainRibbon />
      <Purpose />
      <Journey />
      <Numbers />
      <Values />
      <Cta />
    </main>
  );
}
