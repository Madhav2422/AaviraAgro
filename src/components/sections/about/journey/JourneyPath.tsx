"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Where on the screen, from the top, the path counts as reached.
const REACH_LINE = 0.55;

type JourneyPathProps = {
  children: ReactNode;
};

// Draws the line down the side of the journey steps and fills it with gold as the page scrolls.
// Every element inside marked with data-step gets data-reached once the gold passes it.
export default function JourneyPath({ children }: JourneyPathProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const steps = Array.from(element.querySelectorAll<HTMLElement>("[data-step]"));

    let frameId = 0;
    const render = () => {
      frameId = 0;
      const reachLine = window.innerHeight * REACH_LINE;
      const { top, height } = element.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (reachLine - top) / height));
      element.style.setProperty("--progress", progress.toFixed(4));

      steps.forEach((step) => {
        step.toggleAttribute("data-reached", step.getBoundingClientRect().top < reachLine);
      });
    };
    const onScroll = () => {
      if (!frameId) frameId = requestAnimationFrame(render);
    };

    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div ref={ref} className="relative [--progress:0]">
      <div aria-hidden="true" className="absolute inset-y-0 left-[0.6875rem] w-0.5 bg-brand-ink/10">
        <div className="absolute inset-x-0 top-0 h-full origin-top scale-y-(--progress) bg-linear-to-b from-brand-wheat to-brand-gold" />
        {/* A grain riding the tip of the gold line. */}
        <svg
          viewBox="0 0 16 24"
          className="absolute left-1/2 h-6 w-4 -translate-x-1/2 -translate-y-1/2 fill-brand-gold drop-shadow-[0_0_8px_rgba(228,192,106,0.9)]"
          style={{ top: "calc(var(--progress) * 100%)" }}
        >
          <ellipse cx="8" cy="12" rx="5.5" ry="10" />
        </svg>
      </div>
      {children}
    </div>
  );
}
