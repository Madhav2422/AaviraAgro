import Reveal from "@/components/ui/Reveal";
import ServiceColumn from "./ServiceColumn";
import { services, servicesContent } from "./servicesContent";

const { eyebrow, heading, text } = servicesContent;

export default function Services() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 xl:px-6 xl:py-28">
      <Reveal className="grid gap-6 xl:grid-cols-[1fr_24rem] xl:items-end xl:gap-16">
        <div>
          <p className="reveal-up text-[13px] font-semibold tracking-[0.2em] text-brand-gold-deep uppercase">
            {eyebrow}
          </p>
          <h2
            style={{ animationDelay: "90ms" }}
            className="reveal-up mt-4 font-display text-[clamp(2.6rem,9vw,4.25rem)] leading-[1.08] tracking-[-0.02em] text-brand-ink"
          >
            {heading.start}
            <br />
            <em className="text-brand-gold">{heading.accent}</em>
            {` ${heading.end}`}
          </h2>
        </div>
        <p
          style={{ animationDelay: "200ms" }}
          className="reveal-up text-[17px] leading-relaxed text-brand-muted xl:pb-3 xl:text-lg"
        >
          {text}
        </p>
      </Reveal>

      <ol className="mt-12 grid sm:grid-cols-2 xl:mt-20 xl:grid-cols-4">
        {services.map((service, index) => (
          <ServiceColumn key={service.number} service={service} index={index} />
        ))}
      </ol>
    </section>
  );
}
