import RisingWord from "@/components/ui/RisingWord";
import { aboutHeroContent } from "./aboutHeroContent";
import WheatField from "./WheatField";

const { eyebrow, headline, text } = aboutHeroContent;

export default function AboutHero() {
  const mainWords = headline.main.split(" ");
  const accentWords = headline.accent.split(" ");

  return (
    <section className="relative isolate flex min-h-[calc(100svh-5rem-1px)] flex-col overflow-hidden xl:min-h-[calc(100svh-5.5rem-1px)]">
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-6 px-5 pt-10 sm:px-8 xl:grid-cols-[1fr_24rem] xl:items-end xl:gap-16 xl:px-6 xl:pt-14">
        <div>
          <p className="animate-fade-up text-[13px] font-semibold tracking-[0.2em] text-brand-gold-deep uppercase motion-reduce:animate-none">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-display text-[clamp(3rem,14vw,6rem)] leading-[1.04] tracking-[-0.03em] text-brand-ink xl:text-[min(8vw,18svh,7.5rem)]">
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
                  className="animate-rise-sheen bg-[linear-gradient(100deg,#946d16_0%,#ad8426_38%,#f2d78e_50%,#ad8426_62%,#946d16_100%)] bg-size-[300%_100%] -mb-[0.3em] -ml-[0.25em] bg-clip-text pr-[0.08em] pb-[0.3em] pl-[0.25em] text-transparent italic"
                />{" "}
              </span>
            ))}
          </h1>
        </div>

        <p
          style={{ animationDelay: "760ms" }}
          className="animate-fade-up text-[17px] leading-relaxed text-brand-muted motion-reduce:animate-none xl:pb-4 xl:text-lg"
        >
          {text}
        </p>
      </div>

      {/* The max height stops the stalks growing huge on very tall screens. */}
      <div className="relative mt-auto min-h-[clamp(15rem,42svh,30rem)] w-full flex-1 pt-4 xl:max-h-[52rem]">
        {/* Warm late-afternoon light behind the wheat. */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_85%_at_50%_100%,rgba(228,192,106,0.38),transparent_72%)]" />
        <WheatField className="absolute inset-0 size-full overflow-visible" />
      </div>
    </section>
  );
}
