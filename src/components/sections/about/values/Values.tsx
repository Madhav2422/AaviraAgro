import Reveal from "@/components/ui/Reveal";
import ValueIcon from "./ValueIcon";
import { values, valuesContent } from "./valuesContent";

const { eyebrow, heading, text } = valuesContent;

export default function Values() {
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
          </h2>
        </div>
        <p
          style={{ animationDelay: "200ms" }}
          className="reveal-up text-[17px] leading-relaxed text-brand-muted xl:pb-3 xl:text-lg"
        >
          {text}
        </p>
      </Reveal>

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 xl:mt-16 xl:grid-cols-4">
        {values.map((value, index) => (
          <li key={value.title}>
            <Reveal className="h-full">
              <div
                style={{ animationDelay: `${index * 130}ms` }}
                className="reveal-up group h-full rounded-[1.75rem] border border-brand-ink/10 bg-[#fffaf0] p-7 transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-[0_24px_40px_-24px_rgba(20,38,27,0.45)]"
              >
                <ValueIcon name={value.icon} />
                <h3 className="mt-7 font-display text-[1.6rem] leading-tight text-brand-ink transition-colors duration-300 group-hover:text-brand-gold">
                  {value.title}
                </h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-brand-muted">{value.text}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
