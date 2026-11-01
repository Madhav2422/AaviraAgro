import Link from "next/link";
import ArrowIcon from "@/components/ui/ArrowIcon";
import Reveal from "@/components/ui/Reveal";
import TradeShip from "./TradeShip";
import { tradeContent } from "./tradeContent";

const { eyebrow, heading, text, button } = tradeContent;

export default function Trade() {
  return (
    <section className="mb-20 xl:mb-28">
      <Reveal className="mx-auto w-full max-w-3xl px-5 text-center sm:px-8">
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
          className="reveal-up mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-balance text-brand-muted xl:text-lg"
        >
          {text}
        </p>
        <div style={{ animationDelay: "300ms" }} className="reveal-up mt-7">
          <Link
            href={button.href}
            className="group inline-flex items-center gap-2 rounded-full bg-brand-green px-5 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-brand-green/90 sm:px-6"
          >
            {button.label}
            <ArrowIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Reveal>

      <TradeShip />
    </section>
  );
}
