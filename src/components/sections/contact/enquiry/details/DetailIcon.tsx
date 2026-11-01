import type { ReactNode } from "react";

export type DetailIconName = "phone" | "email" | "address" | "hours";

// Each line has pathLength 1, so the reveal-draw animation can draw it in from start to end.
const icons: Record<DetailIconName, ReactNode> = {
  phone: (
    <path
      d="M5 4h3.2l1.6 4-2 1.4a12 12 0 0 0 6.8 6.8l1.4-2 4 1.6V19a2 2 0 0 1-2.2 2A16.6 16.6 0 0 1 3 6.2 2 2 0 0 1 5 4Z"
      pathLength={1}
    />
  ),
  email: (
    <>
      <path d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z" pathLength={1} />
      <path d="m3.5 7 8.5 6.5L20.5 7" pathLength={1} />
    </>
  ),
  address: (
    <>
      <path d="M12 21s7-5.6 7-11.5a7 7 0 1 0-14 0C5 15.4 12 21 12 21Z" pathLength={1} />
      <path d="M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" pathLength={1} />
    </>
  ),
  hours: (
    <>
      <circle cx="12" cy="12" r="8.5" pathLength={1} />
      <path d="M12 7.5V12l3 2" pathLength={1} />
    </>
  ),
};

type DetailIconProps = {
  name: DetailIconName;
  delay: number;
};

export default function DetailIcon({ name, delay }: DetailIconProps) {
  return (
    <span className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-wheat/15 text-brand-wheat">
      {/* Fills with wheat from the bottom when the line is hovered. */}
      <span className="absolute inset-0 origin-bottom scale-y-0 bg-brand-wheat transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ animationDelay: `${delay}ms` }}
        className="reveal-draw relative size-5.5 transition-colors duration-300 group-hover:text-brand-ink"
      >
        {icons[name]}
      </svg>
    </span>
  );
}
