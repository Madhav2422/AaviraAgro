import { Geist_Mono } from "next/font/google";
import Reveal from "@/components/ui/Reveal";
import { cargoList } from "../cargo";
import { manifestContent } from "./manifestContent";

const { eyebrow, heading, text, sheet } = manifestContent;

// A typewriter-like font, used only on this sheet so other pages do not load it.
const mono = Geist_Mono({ subsets: ["latin"] });

export default function Manifest() {
  return (
    <section className="relative isolate bg-brand-ink px-5 pt-20 pb-36 text-background sm:px-8 xl:px-6 xl:pt-28 xl:pb-48">
      <Reveal className="mx-auto max-w-308">
        <p className="reveal-up text-[13px] font-semibold tracking-[0.2em] text-brand-wheat uppercase">
          {eyebrow}
        </p>
        <h2
          style={{ animationDelay: "90ms" }}
          className="reveal-up mt-4 font-display text-[clamp(2.6rem,9vw,4.25rem)] leading-[1.08] tracking-[-0.02em]"
        >
          {heading.start} <br className="sm:hidden" />
          <em className="text-brand-wheat">{heading.accent}</em>
        </h2>
        <p
          style={{ animationDelay: "200ms" }}
          className="reveal-up mt-4 max-w-xl text-[17px] leading-relaxed text-background/75 xl:text-lg"
        >
          {text}
        </p>
      </Reveal>

      <Reveal className="mx-auto mt-12 max-w-308 xl:mt-16">
        <div
          style={{ animationDelay: "120ms" }}
          className={`${mono.className} reveal-up relative rounded-[3px] bg-[#fbf5e6] px-5 pt-7 pb-26 text-brand-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] sm:px-9 sm:pt-9 sm:pb-24 xl:-rotate-[0.5deg] xl:px-14 xl:pt-12 xl:pb-24`}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b-2 border-brand-ink pb-4">
            <h3 className="text-[1.35rem] font-bold tracking-[0.08em] uppercase sm:text-[1.7rem]">
              {sheet.title}
            </h3>
            <p className="text-[13px] tracking-wide text-brand-muted">{sheet.company}</p>
          </div>

          <dl className="grid gap-x-10 gap-y-2 border-b border-brand-ink/20 py-4 text-[13.5px] sm:grid-cols-3">
            {sheet.details.map((detail) => (
              <div key={detail.label}>
                <dt className="text-[11.5px] tracking-[0.1em] text-brand-muted uppercase">
                  {detail.label}
                </dt>
                <dd className="font-medium">{detail.value}</dd>
              </div>
            ))}
          </dl>

          <table className="mt-2 w-full border-collapse text-left text-[14.5px]">
            <thead className="hidden sm:table-header-group">
              <tr className="text-[11.5px] tracking-[0.1em] text-brand-muted uppercase">
                {sheet.columns.map((column) => (
                  <th key={column} scope="col" className="py-3 pr-6 font-medium last:pr-0">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cargoList.map((cargo, index) => (
                <tr
                  key={cargo.name}
                  className="block border-t border-brand-ink/15 py-3 transition-colors hover:bg-brand-wheat/20 sm:table-row sm:py-0"
                >
                  <td className="hidden py-3.5 pr-6 text-brand-muted sm:table-cell">
                    {String(index + 1).padStart(2, "0")}
                  </td>
                  <td className="block font-bold sm:table-cell sm:py-3.5 sm:pr-6">
                    <span className="flex items-center gap-3">
                      {/* A tiny container in this cargo's colour, as on the ship. */}
                      <span
                        aria-hidden="true"
                        style={{ backgroundColor: cargo.paint }}
                        className="h-3.5 w-6 shrink-0 rounded-[1px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.25)]"
                      />
                      {cargo.name}
                    </span>
                  </td>
                  <td className="mt-1 block text-[13.5px] sm:mt-0 sm:table-cell sm:py-3.5 sm:pr-6 sm:text-[14.5px]">
                    {cargo.form}
                  </td>
                  <td className="block text-[13.5px] text-brand-muted sm:table-cell sm:py-3.5 sm:text-[14.5px]">
                    {cargo.use}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* The customs stamp comes down last, once the sheet is in place. */}
          <div
            aria-hidden="true"
            className="reveal-stamp absolute right-5 bottom-5 rotate-[-9deg] rounded-md border-[3px] border-[#a8341f] px-3.5 py-1.5 text-center text-[#a8341f] outline-2 outline-offset-2 outline-[#a8341f] sm:right-8 sm:bottom-6 xl:right-14 xl:bottom-7"
          >
            <p className="text-[1.5rem] leading-none font-bold tracking-[0.14em] uppercase sm:text-[1.9rem]">
              {sheet.stamp.big}
            </p>
            <p className="mt-1 text-[9px] tracking-[0.14em] uppercase">{sheet.stamp.small}</p>
          </div>
        </div>
      </Reveal>

      {/* The dark sea ends in a wave, with the page's cream rising behind it. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className="absolute inset-x-0 -bottom-px h-14 w-full fill-background xl:h-22"
      >
        <path d="M0 90V52C180 12 360 12 540 44s360 46 540 14 240-34 360-14v46Z" />
      </svg>
    </section>
  );
}
