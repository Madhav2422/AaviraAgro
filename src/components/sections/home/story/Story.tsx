import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { storyContent, storyPoints } from "./storyContent";

const { eyebrow, heading, text, image, tag } = storyContent;

export default function Story() {
  return (
    <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-20 sm:px-8 xl:grid-cols-[34rem_1fr] xl:gap-24 xl:px-6 xl:pb-28">
      <Reveal className="relative mx-auto w-full max-w-136 xl:max-w-none">
        <div className="relative aspect-square overflow-hidden rounded-t-full rounded-b-lg bg-brand-ink/6">
          <div className="reveal-fill absolute inset-0">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 640px) 34rem, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <p
          style={{ animationDelay: "900ms" }}
          className="reveal-up absolute right-2 bottom-6 -rotate-2 rounded-[3px] border border-brand-ink/15 bg-[#fffaf0] px-4 py-2 font-display text-[15px] text-brand-ink italic shadow-[0_8px_18px_-10px_rgba(20,38,27,0.6)] sm:-right-3 sm:text-[17px]"
        >
          {tag}
        </p>
      </Reveal>

      <div>
        <Reveal>
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
            className="reveal-up mt-5 text-[17px] leading-relaxed text-brand-muted xl:text-lg"
          >
            {text}
          </p>
        </Reveal>

        <ol className="mt-8">
          {storyPoints.map((point, index) => (
            <li key={point.number}>
              <Reveal className="relative flex items-baseline gap-5 py-5">
                <span
                  aria-hidden="true"
                  style={{ animationDelay: `${index * 130}ms` }}
                  className="reveal-line-x absolute inset-x-0 top-0 h-px origin-left bg-brand-ink/15"
                />
                <span
                  aria-hidden="true"
                  style={{ animationDelay: `${index * 130 + 120}ms` }}
                  className="reveal-up font-display text-[1.75rem] leading-none text-brand-gold italic [font-feature-settings:'lnum']"
                >
                  {point.number}
                </span>
                <div style={{ animationDelay: `${index * 130 + 180}ms` }} className="reveal-up">
                  <h3 className="text-[17px] font-medium text-brand-ink">{point.title}</h3>
                  <p className="mt-1 text-[15.5px] leading-relaxed text-brand-muted">
                    {point.text}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
