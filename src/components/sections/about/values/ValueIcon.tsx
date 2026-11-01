import type { ReactNode } from "react";

export type ValueIconName = "quality" | "farmers" | "honesty" | "land";

// Each line has pathLength 1, so the reveal-draw animation can draw it in from start to end.
const icons: Record<ValueIconName, ReactNode> = {
  quality: (
    <>
      <circle cx="24" cy="24" r="15" pathLength={1} />
      <path d="M17 24.5l5 5 9.5-10.5" pathLength={1} />
    </>
  ),
  farmers: (
    <>
      <path d="M24 41V21" pathLength={1} />
      <path d="M24 27c0-7.5-5.5-12-13-12 0 7.5 5.5 12 13 12z" pathLength={1} />
      <path d="M24 22c0-6.5 4.5-11 12-11 0 6.5-4.5 11-12 11z" pathLength={1} />
    </>
  ),
  honesty: (
    <>
      <path d="M24 8v32M15 40h18M9 14h30" pathLength={1} />
      <path d="M9 14L4 26h10zM39 14l-5 12h10z" pathLength={1} />
    </>
  ),
  land: (
    <>
      <circle cx="24" cy="20" r="6" pathLength={1} />
      <path d="M24 6v4M13 10.5l2.8 2.8M35 10.5l-2.8 2.8" pathLength={1} />
      <path d="M5 33c6.3-4 12.7-4 19 0s12.7 4 19 0M5 40.5c6.3-4 12.7-4 19 0s12.7 4 19 0" pathLength={1} />
    </>
  ),
};

type ValueIconProps = {
  name: ValueIconName;
};

export default function ValueIcon({ name }: ValueIconProps) {
  return (
    <span className="relative grid size-18 place-items-center overflow-hidden rounded-full bg-brand-wheat/25">
      {/* Fills with wheat from the bottom when the card is hovered. */}
      <span className="absolute inset-0 origin-bottom scale-y-0 bg-brand-wheat/70 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ animationDelay: "250ms" }}
        className="reveal-draw relative size-10 text-brand-green"
      >
        {icons[name]}
      </svg>
    </span>
  );
}
