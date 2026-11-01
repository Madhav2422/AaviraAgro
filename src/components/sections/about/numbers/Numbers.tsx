import Reveal from "@/components/ui/Reveal";
import CountUp from "./CountUp";
import { numbersContent, stats } from "./numbersContent";

const { eyebrow, heading, text } = numbersContent;

export default function Numbers() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-ink py-20 text-background xl:py-28">
      {/* Slowly turning sun rays, rising from below like the footer sunrise. */}
      <div aria-hidden="true" className="sun-rays absolute top-full left-1/2 -z-10" />

      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 xl:px-6">
        <Reveal className="grid gap-6 xl:grid-cols-[1fr_24rem] xl:items-end xl:gap-16">
          <div>
            <p className="reveal-up text-[13px] font-semibold tracking-[0.2em] text-brand-wheat uppercase">
              {eyebrow}
            </p>
            <h2
              style={{ animationDelay: "90ms" }}
              className="reveal-up mt-4 font-display text-[clamp(2.6rem,9vw,4.25rem)] leading-[1.08] tracking-[-0.02em]"
            >
              {heading.start}
              <br />
              <em className="text-brand-wheat">{heading.accent}</em>
            </h2>
          </div>
          <p
            style={{ animationDelay: "200ms" }}
            className="reveal-up text-[17px] leading-relaxed text-background/70 xl:pb-3 xl:text-lg"
          >
            {text}
          </p>
        </Reveal>

        <dl className="mt-12 grid grid-cols-2 xl:mt-20 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal
              key={stat.label}
              className={`relative flex flex-col-reverse py-8 pr-4 sm:py-10 ${
                index % 2 === 1 ? "pl-5 sm:pl-8" : "pl-0"
              } ${index > 0 ? "xl:pl-8" : ""}`}
            >
              <span
                aria-hidden="true"
                style={{ animationDelay: `${index * 150}ms` }}
                className="reveal-line-x absolute inset-x-0 top-0 h-px origin-left bg-background/15"
              />
              <span
                aria-hidden="true"
                style={{ animationDelay: `${index * 150 + 120}ms` }}
                className={`reveal-line-y absolute inset-y-0 left-0 w-px origin-top bg-background/15 ${
                  index % 2 === 1 ? "block" : "hidden"
                } ${index > 0 ? "xl:block" : ""}`}
              />
              <dt
                style={{ animationDelay: `${index * 150 + 260}ms` }}
                className="reveal-up mt-3 text-[15px] leading-snug text-background/70 sm:text-base"
              >
                {stat.label}
              </dt>
              <dd
                style={{ animationDelay: `${index * 150 + 160}ms` }}
                className="reveal-up font-display text-[clamp(2.5rem,10vw,4.5rem)] leading-none text-brand-wheat tabular-nums"
              >
                <CountUp value={stat.value} />
                {stat.suffix && <span className="text-[0.55em] italic">{stat.suffix}</span>}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
