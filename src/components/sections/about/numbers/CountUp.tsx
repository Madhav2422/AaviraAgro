"use client";

import { useEffect, useRef } from "react";

const DURATION = 1800;

const format = (value: number) => Math.round(value).toLocaleString("en-IN");

type CountUpProps = {
  value: number;
  className?: string;
};

// Counts from 0 up to the value once it scrolls into view.
// Without JavaScript, or with animation turned off, it just shows the value.
export default function CountUp({ value, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!element || reduceMotion) return;

    let frameId = 0;
    element.textContent = format(0);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const frame = (now: number) => {
          const time = Math.min(1, (now - start) / DURATION);
          const eased = 1 - Math.pow(1 - time, 4);
          element.textContent = format(value * eased);
          if (time < 1) frameId = requestAnimationFrame(frame);
        };
        frameId = requestAnimationFrame(frame);
      },
      { threshold: 0.6 },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
      element.textContent = format(value);
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
