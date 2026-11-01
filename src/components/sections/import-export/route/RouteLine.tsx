"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RouteLineProps = {
  children: ReactNode;
  className?: string;
};

// Sails the little ship along the route as the section scrolls up the screen,
// and marks each stop once the ship has reached it.
export default function RouteLine({ children, className }: RouteLineProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stops = [...element.querySelectorAll<HTMLElement>("[data-stop]")];

    let frameId = 0;
    const render = () => {
      frameId = 0;
      const { top, height } = element.getBoundingClientRect();
      const start = window.innerHeight * 0.8;
      const travel = height + window.innerHeight * 0.2;
      const route = reduceMotion ? 1 : Math.max(0, Math.min(1, (start - top) / travel));
      element.style.setProperty("--route", route.toFixed(4));
      stops.forEach((stop, index) => {
        stop.toggleAttribute("data-reached", route >= index / (stops.length - 1) - 0.01);
      });
    };
    const onScroll = () => {
      if (!frameId) frameId = requestAnimationFrame(render);
    };

    render();
    if (reduceMotion) return;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div ref={ref} className={`route-line ${className ?? ""}`}>
      {children}
    </div>
  );
}
