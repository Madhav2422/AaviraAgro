import Cta from "@/components/sections/home/cta/Cta";
import Hero from "@/components/sections/home/hero/Hero";
import Services from "@/components/sections/home/services/Services";
import Story from "@/components/sections/home/story/Story";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Services />
      <Story />
      <Cta />
    </main>
  );
}
