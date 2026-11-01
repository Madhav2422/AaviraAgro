import { ribbonWords } from "./ribbonContent";

function GrainMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 24" className="h-5 w-3.5 shrink-0 fill-brand-gold sm:h-7 sm:w-5">
      <ellipse cx="8" cy="12" rx="5.5" ry="10" transform="rotate(18 8 12)" />
    </svg>
  );
}

// A tilted band that scrolls the words in ribbonContent forever. Hovering pauses it.
export default function GrainRibbon() {
  return (
    <div className="relative z-10 -mt-10 overflow-x-clip py-6">
      <div className="-mx-[5%] -rotate-2 bg-brand-ink py-4 shadow-[0_18px_30px_-18px_rgba(20,38,27,0.7)] sm:py-5">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
          {/* Two copies side by side, so the loop has no gap when it starts over. */}
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
              {ribbonWords.map((word) => (
                <li key={word} className="flex items-center">
                  <span className="px-6 font-display text-2xl whitespace-nowrap text-brand-wheat italic sm:px-9 sm:text-4xl">
                    {word}
                  </span>
                  <GrainMark />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
