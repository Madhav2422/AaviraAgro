"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  // How far it drifts against the scroll: 0.1 moves it 10px for every 100px scrolled.
  speed?: number;
};

// Drifts its contents slowly as the page scrolls, so a picture feels deeper than the page.
// Make it a little taller than its frame, so the drift never shows an edge.
export default function Parallax({ children, className, speed = 0.12 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!element || reduceMotion) return;

    let frameId = 0;
    const render = () => {
      frameId = 0;
      const { top, height } = element.getBoundingClientRect();
      const fromCenter = top + height / 2 - window.innerHeight / 2;
      element.style.translate = `0 ${(fromCenter * -speed).toFixed(1)}px`;
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
  }, [speed]);

  return (
    <div ref={ref} className={`will-change-[translate] ${className ?? ""}`}>
      {children}
    </div>
  );
}
