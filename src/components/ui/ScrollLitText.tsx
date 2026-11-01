"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type ScrollLitTextProps = {
  text: string;
  // Words to show in gold italics, written without punctuation.
  highlight?: string[];
  className?: string;
};

// A paragraph whose words light up one by one as it scrolls up the screen.
// The fading is done in globals.css (.scroll-lit); this only tracks the scroll.
export default function ScrollLitText({ text, highlight = [], className }: ScrollLitTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const element = ref.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!element || reduceMotion) return;

    let frameId = 0;
    const render = () => {
      frameId = 0;
      const { top, height } = element.getBoundingClientRect();
      // 0 when the text reaches the lower part of the screen, 1 once it is near the middle.
      const start = window.innerHeight * 0.85;
      const lit = (start - top) / (height + window.innerHeight * 0.3);
      element.style.setProperty("--lit", Math.max(0, Math.min(1, lit)).toFixed(3));
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
    <p
      ref={ref}
      style={{ "--count": words.length } as CSSProperties}
      className={`scroll-lit ${className ?? ""}`}
    >
      {words.map((word, index) => {
        const isHighlighted = highlight.includes(word.replace(/[^\p{L}\p{N}]/gu, ""));
        return (
          <span
            key={index}
            style={{ "--i": index } as CSSProperties}
            className={isHighlighted ? "text-brand-gold italic" : undefined}
          >
            {word}{" "}
          </span>
        );
      })}
    </p>
  );
}
