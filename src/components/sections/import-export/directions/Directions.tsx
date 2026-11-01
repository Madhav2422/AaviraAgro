import Reveal from "@/components/ui/Reveal";
import { directions, directionsContent } from "./directionsContent";

const { eyebrow, heading } = directionsContent;

export default function Directions() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 pt-16 pb-20 sm:px-8 xl:px-6 xl:pt-24 xl:pb-28">
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

      <div className="mt-14 grid gap-14 xl:mt-20 xl:grid-cols-2 xl:gap-20">
        {directions.map((direction, index) => {
          const comingIn = direction.heading === "in";
          return (
            <Reveal key={direction.name}>
              <p
                style={{ animationDelay: `${index * 140}ms` }}
                className={`reveal-up font-display text-[clamp(4.5rem,19vw,8.5rem)] leading-none tracking-[-0.03em] text-brand-ink ${
                  comingIn ? "" : "xl:text-right"
                }`}
              >
                {direction.name}
              </p>

              {/* A line that draws itself across, with the arrow head at the end it runs to. */}
              <div className="relative mt-5 h-3" aria-hidden="true">
                <span
                  style={{ animationDelay: `${index * 140 + 200}ms` }}
                  className={`reveal-line-x absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-brand-gold ${
                    comingIn ? "origin-right" : "origin-left"
                  }`}
                />
                <span
                  style={{ animationDelay: `${index * 140 + 1000}ms` }}
                  className={`reveal-up absolute top-0 size-3 rotate-45 border-brand-gold ${
                    comingIn ? "left-0 border-b-2 border-l-2" : "right-0 border-t-2 border-r-2"
                  }`}
                />
              </div>

              <h3
                style={{ animationDelay: `${index * 140 + 280}ms` }}
                className="reveal-up mt-7 font-display text-[1.9rem] leading-tight text-brand-ink"
              >
                {direction.title}
              </h3>
              <p
                style={{ animationDelay: `${index * 140 + 360}ms` }}
                className="reveal-up mt-3 max-w-lg text-[17px] leading-relaxed text-brand-muted"
              >
                {direction.text}
              </p>
              <ul
                style={{ animationDelay: `${index * 140 + 440}ms` }}
                className="reveal-up mt-6 grid gap-x-6 gap-y-2.5 text-[15.5px] text-brand-ink sm:grid-cols-2"
              >
                {direction.points.map((point) => (
                  <li key={point} className="flex items-center gap-2.5">
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-gold" />
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
