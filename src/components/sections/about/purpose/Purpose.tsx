import Image from "next/image";
import Parallax from "@/components/ui/Parallax";
import Reveal from "@/components/ui/Reveal";
import ScrollLitText from "@/components/ui/ScrollLitText";
import { purposeContent, purposePillars } from "./purposeContent";

const { eyebrow, statement, highlight, image } = purposeContent;

export default function Purpose() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 xl:px-6 xl:py-28">
      <Reveal>
        <p className="reveal-up text-[13px] font-semibold tracking-[0.2em] text-brand-gold-deep uppercase">
          {eyebrow}
        </p>
      </Reveal>
      <ScrollLitText
        text={statement}
        highlight={highlight}
        className="mt-6 max-w-6xl font-display text-[clamp(1.9rem,5.4vw,3.6rem)] leading-[1.2] tracking-[-0.015em] text-brand-ink"
      />

      <div className="mt-16 grid items-center gap-12 xl:mt-24 xl:grid-cols-[30rem_1fr] xl:gap-24">
        <Reveal className="mx-auto w-full max-w-120 xl:max-w-none">
          <div className="relative aspect-4/5 overflow-hidden rounded-t-full rounded-b-lg bg-brand-ink/6">
            <div className="reveal-fill absolute inset-0">
              <Parallax className="absolute inset-x-0 -inset-y-[10%]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1280px) 30rem, (min-width: 640px) 30rem, 100vw"
                  className="object-cover"
                />
              </Parallax>
            </div>
          </div>
        </Reveal>

        <div>
          {purposePillars.map((pillar, index) => (
            <Reveal key={pillar.title} className="relative py-8 xl:py-10">
              <span
                aria-hidden="true"
                style={{ animationDelay: `${index * 140}ms` }}
                className="reveal-line-x absolute inset-x-0 top-0 h-px origin-left bg-brand-ink/15"
              />
              <h3
                style={{ animationDelay: `${index * 140 + 120}ms` }}
                className="reveal-up font-display text-[2rem] leading-tight text-brand-ink italic xl:text-[2.4rem]"
              >
                {pillar.title}
              </h3>
              <p
                style={{ animationDelay: `${index * 140 + 220}ms` }}
                className="reveal-up mt-3 text-[17px] leading-relaxed text-brand-muted xl:text-lg"
              >
                {pillar.text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
