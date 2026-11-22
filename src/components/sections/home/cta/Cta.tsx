import Image from "next/image";
import Link from "next/link";
import ArrowIcon from "@/components/ui/ArrowIcon";
import Reveal from "@/components/ui/Reveal";
import { ctaContent } from "./ctaContent";

const { heading, text, button, grain, image } = ctaContent;

export default function Cta() {
  return (
    <section className="relative isolate flex min-h-152 items-center bg-brand-ink pt-32 pb-20 [clip-path:ellipse(140%_100%_at_50%_100%)] sm:[clip-path:ellipse(100%_100%_at_50%_100%)] xl:min-h-176 xl:pt-36 xl:pb-24">
      <Image src={image} alt="" fill sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-radial from-brand-ink/90 via-brand-ink/85 to-brand-ink/55" />
      {/* The field fades into the footer below, so the two read as one landscape. */}
      <div className="absolute inset-x-0 bottom-0 -z-10 h-56 bg-linear-to-t from-brand-ink to-transparent" />

      <Reveal className="group mx-auto w-full max-w-7xl px-5 text-center sm:px-8 xl:px-6">
        <h2 className="font-display text-[clamp(3.75rem,18vw,8rem)] leading-[1.02] tracking-[-0.03em] text-background xl:text-[min(10.5vw,10rem)]">
          <span className="reveal-up inline-block">{heading.start}</span>{" "}
          {/* The padding keeps the tail of the italic g inside the grain fill. */}
          <span className="relative -mx-[0.15em] inline-block px-[0.15em] pb-[0.22em] text-[1.4em] font-bold italic xl:text-[1em]">
            <span className="text-brand-wheat/20">{heading.accent}</span>
            <span
              aria-hidden="true"
              style={{ backgroundImage: `url(${grain})`, animationDelay: "160ms" }}
              className="reveal-fill absolute inset-0 bg-brand-wheat bg-size-[24rem] bg-clip-text bg-position-[0%_0%] px-[0.15em] pb-[0.22em] text-transparent transition-[background-position] duration-[1800ms] ease-out group-hover:bg-position-[60%_45%] sm:bg-size-[38rem]"
            >
              {heading.accent}
            </span>
          </span>
        </h2>

        <p
          style={{ animationDelay: "420ms" }}
          className="reveal-up mx-auto mt-2 max-w-xl text-[17px] leading-relaxed text-background/85 xl:text-lg"
        >
          {text}
        </p>

        <div style={{ animationDelay: "540ms" }} className="reveal-up mt-8">
          <Link
            href={button.href}
            className="group/button inline-flex items-center gap-2 rounded-full bg-brand-wheat px-6 py-3.5 text-[15px] font-medium text-brand-ink transition-colors hover:bg-background"
          >
            {button.label}
            <ArrowIcon className="size-4 transition-transform group-hover/button:translate-x-0.5" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
