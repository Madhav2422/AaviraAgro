import Reveal from "@/components/ui/Reveal";
import DetailIcon from "./DetailIcon";
import { contactDetails, detailsContent } from "./detailsContent";

const { eyebrow, heading, text } = detailsContent;

export default function ContactDetails() {
  return (
    <Reveal className="relative isolate h-full overflow-hidden rounded-[2rem] bg-brand-ink p-7 text-background sm:p-10">
      {/* Slow sun rays turning behind the details, from the bottom corner. */}
      <div aria-hidden="true" className="sun-rays absolute top-full left-full -z-10" />

      <p className="reveal-up text-[13px] font-semibold tracking-[0.2em] text-brand-wheat uppercase">{eyebrow}</p>
      <h2
        style={{ animationDelay: "90ms" }}
        className="reveal-up mt-4 font-display text-[clamp(2.2rem,7vw,3rem)] leading-[1.1] tracking-[-0.02em]"
      >
        {heading.start}
        <br />
        <em className="text-brand-wheat">{heading.accent}</em>
      </h2>
      <p style={{ animationDelay: "180ms" }} className="reveal-up mt-4 text-[16px] leading-relaxed text-background/75">
        {text}
      </p>

      <span
        style={{ animationDelay: "260ms" }}
        className="reveal-line-x mt-8 block h-px origin-left bg-background/15"
      />

      <ul className="mt-8 space-y-6">
        {contactDetails.map((detail, index) => {
          const delay = 320 + index * 110;
          const body = (
            <>
              <DetailIcon name={detail.icon} delay={delay + 150} />
              <span>
                <span className="block text-[12px] font-semibold tracking-[0.18em] text-background/55 uppercase">
                  {detail.title}
                </span>
                <span className="mt-1 block text-[16px] text-background transition-colors group-hover:text-brand-wheat">
                  {detail.label}
                </span>
              </span>
            </>
          );

          return (
            <li key={detail.title} style={{ animationDelay: `${delay}ms` }} className="reveal-up">
              {detail.href ? (
                <a href={detail.href} className="group flex items-center gap-4">
                  {body}
                </a>
              ) : (
                <div className="group flex items-center gap-4">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </Reveal>
  );
}
