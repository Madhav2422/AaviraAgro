import Link from "next/link";
import ArrowIcon from "@/components/ui/ArrowIcon";
import RisingWord from "@/components/ui/RisingWord";
import { contactHeroContent } from "./contactHeroContent";
import SproutField from "./SproutField";

const { eyebrow, headline, text, button } = contactHeroContent;

export default function ContactHero() {
  const mainWords = headline.main.split(" ");
  const accentWords = headline.accent.split(" ");

  return (
    <section className="relative isolate flex min-h-[calc(82svh-5rem-1px)] flex-col overflow-hidden xl:min-h-[calc(86svh-5.5rem-1px)]">
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-6 px-5 pt-10 sm:px-8 xl:grid-cols-[1fr_24rem] xl:items-end xl:gap-16 xl:px-6 xl:pt-14">
        <div>
          <p className="animate-fade-up text-[13px] font-semibold tracking-[0.2em] text-brand-gold-deep uppercase motion-reduce:animate-none">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-display text-[clamp(3rem,13vw,6rem)] leading-[1.04] tracking-[-0.03em] text-brand-ink xl:text-[min(7.5vw,16svh,7rem)]">
            {mainWords.map((word, index) => (
              <span key={word}>
                <RisingWord word={word} delay={120 + index * 120} />{" "}
              </span>
            ))}
            <br />
            {accentWords.map((word, index) => (
              <span key={word}>
                <RisingWord
                  word={word}
                  delay={120 + (mainWords.length + index) * 120}
                  className="animate-rise-sheen bg-[linear-gradient(100deg,#1f5a2c_0%,#2f6b37_38%,#a9c47a_50%,#2f6b37_62%,#1f5a2c_100%)] bg-size-[300%_100%] -mb-[0.3em] -ml-[0.25em] bg-clip-text pr-[0.08em] pb-[0.3em] pl-[0.25em] text-transparent italic"
                />{" "}
              </span>
            ))}
          </h1>
        </div>

        <div style={{ animationDelay: "760ms" }} className="animate-fade-up motion-reduce:animate-none xl:pb-4">
          <p className="text-[17px] leading-relaxed text-brand-muted xl:text-lg">{text}</p>
          <Link
            href={button.href}
            className="group mt-6 inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-3.5 text-[15px] font-medium text-background transition-colors hover:bg-brand-ink"
          >
            {button.label}
            <ArrowIcon className="size-4 rotate-90 motion-safe:animate-[nudge-down_1.8s_ease-in-out_2s_infinite]" />
          </Link>
        </div>
      </div>

      <div className="relative mt-auto h-[clamp(11rem,30svh,18rem)] w-full pt-4">
        {/* Soft morning light rising behind the young field. */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_90%_at_50%_100%,rgba(169,196,122,0.32),transparent_72%)]" />
        <SproutField className="absolute inset-0 size-full" />
      </div>
    </section>
  );
}
