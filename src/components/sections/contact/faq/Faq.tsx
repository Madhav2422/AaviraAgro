import Reveal from "@/components/ui/Reveal";
import { faqContent, faqs } from "./faqContent";
import FaqItem from "./FaqItem";

const { eyebrow, heading, text } = faqContent;

export default function Faq() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 pt-8 pb-24 sm:px-8 xl:px-6 xl:pb-32">
      <div className="grid gap-10 xl:grid-cols-[24rem_1fr] xl:gap-16">
        <Reveal className="xl:sticky xl:top-32 xl:self-start">
          <p className="reveal-up text-[13px] font-semibold tracking-[0.2em] text-brand-gold-deep uppercase">
            {eyebrow}
          </p>
          <h2
            style={{ animationDelay: "90ms" }}
            className="reveal-up mt-4 font-display text-[clamp(2.6rem,9vw,4rem)] leading-[1.08] tracking-[-0.02em] text-brand-ink"
          >
            {heading.start}
            <br />
            <em className="text-brand-gold">{heading.accent}</em>
          </h2>
          <p style={{ animationDelay: "200ms" }} className="reveal-up mt-5 text-[17px] leading-relaxed text-brand-muted">
            {text}
          </p>
        </Reveal>

        <Reveal>
          <span className="reveal-line-x block h-px origin-left bg-brand-ink/12" />
          {faqs.map((faq, index) => (
            <div key={faq.question} style={{ animationDelay: `${120 + index * 90}ms` }} className="reveal-up">
              <FaqItem faq={faq} index={index} />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
