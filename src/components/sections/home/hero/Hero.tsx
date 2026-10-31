import Link from "next/link";
import ArrowIcon from "@/components/ui/ArrowIcon";
import GrainPour from "./GrainPour";
import { heroContent } from "./heroContent";

const { headline, text, primaryButton, secondaryButton } = heroContent;

type RisingWordProps = {
  word: string;
  delay: number;
  className?: string;
};

function RisingWord({ word, delay, className = "animate-rise" }: RisingWordProps) {
  return (
    <span className="pointer-events-auto mb-[-0.22em] inline-block overflow-hidden pb-[0.22em] align-bottom">
      <span
        style={{ animationDelay: `${delay}ms` }}
        className={`inline-block motion-reduce:animate-none ${className}`}
      >
        {word}
      </span>
    </span>
  );
}

export default function Hero() {
  const mainWords = headline.main.split(" ");

  return (
    <section className="relative isolate flex min-h-[calc(100svh-5rem-1px)] flex-col overflow-hidden xl:min-h-[calc(100svh-5.5rem-1px)]">
      <GrainPour />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-8 sm:px-8 xl:px-6 xl:pt-9">
        <h1 className="pointer-events-none relative z-10 font-display text-[clamp(3.5rem,19vw,7rem)] leading-[1.02] tracking-[-0.03em] text-brand-ink xl:text-[min(11.8vw,24svh,10.75rem)]">
          {mainWords.map((word, index) => (
            <span key={word}>
              <RisingWord word={word} delay={120 + index * 130} />{" "}
            </span>
          ))}
          <br />
          <RisingWord
            word={headline.accent}
            delay={120 + mainWords.length * 130}
            className="animate-rise-sheen bg-[linear-gradient(100deg,#946d16_0%,#ad8426_38%,#f2d78e_50%,#ad8426_62%,#946d16_100%)] bg-size-[300%_100%] bg-clip-text pr-[0.08em] text-transparent italic"
          />
        </h1>

        {/* The soft cream glow keeps this text readable while grain falls behind it. */}
        <div className="relative mt-6 max-w-lg rounded-3xl bg-background shadow-[0_0_30px_30px_var(--background)] xl:absolute xl:right-6 xl:-bottom-3 xl:mt-0 xl:w-100">
          <p
            style={{ animationDelay: "620ms" }}
            className="animate-fade-up text-[17px] leading-relaxed text-brand-muted motion-reduce:animate-none xl:text-lg"
          >
            {text}
          </p>

          <div
            style={{ animationDelay: "760ms" }}
            className="mt-6 flex animate-fade-up flex-wrap gap-3 motion-reduce:animate-none"
          >
            <Link
              href={primaryButton.href}
              className="group inline-flex items-center gap-2 rounded-full bg-brand-green px-5 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-brand-green/90 sm:px-6"
            >
              {primaryButton.label}
              <ArrowIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={secondaryButton.href}
              className="inline-flex items-center rounded-full border border-brand-ink/25 px-5 py-3.5 text-[15px] font-medium text-brand-ink transition-colors hover:bg-brand-ink/5 sm:px-6"
            >
              {secondaryButton.label}
            </Link>
          </div>
        </div>
      </div>

      <div data-heap-space className="min-h-[clamp(11rem,32svh,26rem)] flex-1" />
    </section>
  );
}
