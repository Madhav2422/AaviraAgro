import Link from "next/link";
import ArrowIcon from "@/components/ui/ArrowIcon";
import Reveal from "@/components/ui/Reveal";
import { closingContent } from "./closingContent";

const { heading, text, button } = closingContent;

export default function Closing() {
  return (
    <section className="bg-brand-ink pt-32 pb-16 text-center text-background [clip-path:ellipse(140%_100%_at_50%_100%)] sm:[clip-path:ellipse(100%_100%_at_50%_100%)] xl:pt-40 xl:pb-20">
      <Reveal className="mx-auto w-full max-w-3xl px-5 sm:px-8">
        <h2 className="reveal-up font-display text-[clamp(3rem,12vw,6rem)] leading-[1.04] tracking-[-0.03em]">
          {heading.start}
          <br />
          <em className="text-brand-wheat">{heading.accent}</em>
        </h2>
        <p
          style={{ animationDelay: "140ms" }}
          className="reveal-up mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-background/80 xl:text-lg"
        >
          {text}
        </p>
        <div style={{ animationDelay: "260ms" }} className="reveal-up mt-8">
          <Link
            href={button.href}
            className="group inline-flex items-center gap-2 rounded-full bg-brand-wheat px-6 py-3.5 text-[15px] font-medium text-brand-ink transition-colors hover:bg-background"
          >
            {button.label}
            <ArrowIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
