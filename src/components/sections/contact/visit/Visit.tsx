import ArrowIcon from "@/components/ui/ArrowIcon";
import Reveal from "@/components/ui/Reveal";
import DetailIcon from "../enquiry/details/DetailIcon";
import { contactDetails } from "../enquiry/details/detailsContent";
import FieldMap from "./FieldMap";
import { visitContent } from "./visitContent";

const { eyebrow, heading, text, pinLabel, directions } = visitContent;

// The address and hours come from the same list as the contact details, so they never disagree.
const visitDetails = contactDetails.filter((detail) => detail.icon === "address" || detail.icon === "hours");

export default function Visit() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 xl:px-6 xl:py-24">
      <Reveal className="relative overflow-hidden rounded-[2rem] border border-brand-ink/10">
        <FieldMap label={pinLabel} className="block aspect-[4/3] w-full sm:aspect-[16/9] xl:aspect-[16/7]" />

        <div className="relative bg-brand-ink p-7 text-background sm:p-10 xl:absolute xl:bottom-6 xl:left-6 xl:w-[26rem] xl:rounded-[1.5rem] xl:shadow-[0_30px_60px_-30px_rgba(20,38,27,0.7)]">
          <p
            style={{ animationDelay: "300ms" }}
            className="reveal-up text-[13px] font-semibold tracking-[0.2em] text-brand-wheat uppercase"
          >
            {eyebrow}
          </p>
          <h2
            style={{ animationDelay: "390ms" }}
            className="reveal-up mt-3 font-display text-[clamp(2rem,6vw,2.6rem)] leading-[1.1] tracking-[-0.02em]"
          >
            {heading.start} <em className="text-brand-wheat">{heading.accent}</em>
          </h2>
          <p style={{ animationDelay: "480ms" }} className="reveal-up mt-3 text-[15.5px] leading-relaxed text-background/75">
            {text}
          </p>

          <ul className="mt-6 space-y-4">
            {visitDetails.map((detail, index) => (
              <li
                key={detail.title}
                style={{ animationDelay: `${560 + index * 100}ms` }}
                className="reveal-up group flex items-center gap-4"
              >
                <DetailIcon name={detail.icon} delay={700 + index * 100} />
                <span className="text-[15.5px]">{detail.label}</span>
              </li>
            ))}
          </ul>

          <div style={{ animationDelay: "780ms" }} className="reveal-up mt-7">
            <a
              href={directions.href}
              target="_blank"
              rel="noreferrer"
              className="group/button inline-flex items-center gap-2 rounded-full bg-brand-wheat px-6 py-3.5 text-[15px] font-medium text-brand-ink transition-colors hover:bg-background"
            >
              {directions.label}
              <ArrowIcon className="size-4 -rotate-45 transition-transform group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
