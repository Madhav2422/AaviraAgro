import type { Faq } from "./faqContent";

type FaqItemProps = {
  faq: Faq;
  index: number;
};

// A question that opens to show its answer. The plus turns into a cross, and the answer
// slides open in browsers that can animate details. Elsewhere it simply opens.
export default function FaqItem({ faq, index }: FaqItemProps) {
  return (
    <details name="faq" className="faq-item group border-b border-brand-ink/12">
      <summary className="flex cursor-pointer list-none items-center gap-5 py-6 [&::-webkit-details-marker]:hidden">
        <span className="font-serif text-[13px] text-brand-gold-deep">{String(index + 1).padStart(2, "0")}</span>
        <span className="flex-1 font-display text-[1.35rem] leading-snug text-brand-ink transition-colors group-hover:text-brand-green sm:text-[1.55rem]">
          {faq.question}
        </span>
        <span className="relative grid size-10 shrink-0 place-items-center rounded-full border border-brand-ink/15 transition-[background-color,border-color,rotate] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-open:rotate-45 group-open:border-brand-green group-open:bg-brand-green">
          <span className="absolute h-px w-3.5 bg-brand-ink transition-colors group-open:bg-background" />
          <span className="absolute h-3.5 w-px bg-brand-ink transition-colors group-open:bg-background" />
        </span>
      </summary>
      <p className="max-w-2xl pb-7 pl-10 text-[16px] leading-relaxed text-brand-muted">{faq.answer}</p>
    </details>
  );
}
