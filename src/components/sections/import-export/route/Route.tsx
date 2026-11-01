import Reveal from "@/components/ui/Reveal";
import RouteLine from "./RouteLine";
import { routeContent, routeStops } from "./routeContent";

const { eyebrow, heading } = routeContent;

export default function Route() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8 xl:px-6 xl:pb-32">
      <Reveal>
        <p className="reveal-up text-[13px] font-semibold tracking-[0.2em] text-brand-gold-deep uppercase">
          {eyebrow}
        </p>
        <h2
          style={{ animationDelay: "90ms" }}
          className="reveal-up mt-4 font-display text-[clamp(2.6rem,9vw,4.25rem)] leading-[1.08] tracking-[-0.02em] text-brand-ink"
        >
          {heading.start} <br className="sm:hidden" />
          <em className="text-brand-gold">{heading.accent}</em>
        </h2>
      </Reveal>

      <RouteLine className="relative mt-14 xl:mt-20">
        {/* The dashed sea lane, down the side on phones and across on desktop. */}
        <span aria-hidden="true" className="route-lane" />
        <span aria-hidden="true" className="route-ship">
          <svg viewBox="0 0 46 24" className="block h-6 w-11.5 fill-brand-ink">
            <path d="M1 12h35l9-3-5 13H6L1 12Z" />
            <path className="fill-brand-gold" d="M9 5h7v7H9zM18 5h7v7h-7zM27 5h7v7h-7z" />
            <path d="M3 1h4v11H3z" />
          </svg>
        </span>

        <ol className="grid gap-9 xl:grid-cols-6 xl:gap-6">
          {routeStops.map((stop) => (
            <li key={stop.number} data-stop className="group relative pl-14 xl:pt-14 xl:pl-0">
              <span
                aria-hidden="true"
                className="absolute top-1 left-2 size-4 rounded-full border-2 border-brand-ink/25 bg-background transition-colors duration-500 group-data-reached:border-brand-gold group-data-reached:bg-brand-gold xl:top-0 xl:left-0"
              />
              <p className="font-display text-[15px] text-brand-ink/35 italic transition-colors duration-500 [font-feature-settings:'lnum'] group-data-reached:text-brand-gold">
                {stop.number}
              </p>
              <h3 className="mt-0.5 font-display text-[1.6rem] leading-tight text-brand-ink">
                {stop.title}
              </h3>
              <p className="mt-1.5 text-[15.5px] leading-relaxed text-brand-muted">{stop.text}</p>
            </li>
          ))}
        </ol>
      </RouteLine>
    </section>
  );
}
