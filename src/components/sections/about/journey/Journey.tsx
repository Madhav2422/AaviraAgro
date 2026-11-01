import Reveal from "@/components/ui/Reveal";
import JourneyPath from "./JourneyPath";
import { journeyContent, journeySteps } from "./journeyContent";

const { eyebrow, heading, text } = journeyContent;

export default function Journey() {
  return (
    <section className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-20 sm:px-8 xl:grid-cols-[1fr_1.1fr] xl:gap-24 xl:px-6 xl:py-28">
      <Reveal className="xl:sticky xl:top-32 xl:self-start">
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
        </h2>
        <p
          style={{ animationDelay: "200ms" }}
          className="reveal-up mt-5 max-w-md text-[17px] leading-relaxed text-brand-muted xl:text-lg"
        >
          {text}
        </p>
      </Reveal>

      <JourneyPath>
        <ol>
          {journeySteps.map((step) => (
            <li key={step.number} data-step className="group relative pb-12 pl-14 last:pb-0 sm:pl-16">
              <span
                aria-hidden="true"
                className="absolute top-1 left-0 grid size-6 place-items-center rounded-full border-2 border-brand-ink/20 bg-background transition-colors duration-500 group-data-reached:border-brand-gold"
              >
                <span className="size-2.5 scale-0 rounded-full bg-brand-gold transition-transform duration-500 group-data-reached:scale-100" />
              </span>
              <Reveal>
                <p className="reveal-up font-display text-[15px] text-brand-ink/35 italic transition-colors duration-500 [font-feature-settings:'lnum'] group-data-reached:text-brand-gold">
                  Step {step.number}
                </p>
                <h3
                  style={{ animationDelay: "80ms" }}
                  className="reveal-up mt-1 font-display text-[2rem] leading-tight text-brand-ink xl:text-[2.4rem]"
                >
                  {step.title}
                </h3>
                <p
                  style={{ animationDelay: "160ms" }}
                  className="reveal-up mt-2 max-w-lg text-[16px] leading-relaxed text-brand-muted"
                >
                  {step.text}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </JourneyPath>
    </section>
  );
}
