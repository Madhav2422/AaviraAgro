"use client";

import { useEffect, useRef, type ReactNode } from "react";

// How far the sun can slide along the name under the cursor, as a share of the width.
const MAX_SHIFT = 27;

// Phones have no cursor, so there the sun drifts slowly from side to side by itself.
const SWAY_SHIFT = 14;
const SWAY_SECONDS = 9;

type SunriseFooterProps = {
  children: ReactNode;
  className?: string;
};

export default function SunriseFooter({ children, className }: SunriseFooterProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = ref.current;
    const sky = footer?.querySelector<HTMLElement>("[data-sky]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!footer || !sky || reduceMotion) return;

    // 0 when the sky first shows at the bottom of the screen, 1 once it is fully in view.
    const riseGoal = () => {
      const { top, height } = sky.getBoundingClientRect();
      return Math.max(0, Math.min(1, (window.innerHeight - top) / height));
    };

    const noCursor = window.matchMedia("(hover: none)");

    let rise = riseGoal();
    let shift = 0;
    let shiftGoal = 0;
    let frameId = 0;
    let inView = false;
    let steering = false;

    const render = () => {
      footer.style.setProperty("--rise", rise.toFixed(4));
      footer.style.setProperty("--sun-shift", shift.toFixed(2));
    };

    const frame = (now: number) => {
      const swaying = inView && noCursor.matches && !steering;
      if (swaying) shiftGoal = Math.sin((now / (SWAY_SECONDS * 1000)) * Math.PI * 2) * SWAY_SHIFT;

      const goal = riseGoal();
      rise += (goal - rise) * 0.12;
      shift += (shiftGoal - shift) * 0.08;

      const resting =
        !swaying && Math.abs(goal - rise) < 0.001 && Math.abs(shiftGoal - shift) < 0.05;
      if (resting) {
        rise = goal;
        shift = shiftGoal;
      }
      render();
      frameId = resting ? 0 : requestAnimationFrame(frame);
    };

    const wake = () => {
      if (!frameId) frameId = requestAnimationFrame(frame);
    };

    const updateSway = () => {
      if (!inView || !noCursor.matches) shiftGoal = 0;
      wake();
    };

    // The sway only runs while the sky is on screen, so it never drains a phone's battery.
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updateSway();
    });

    // A cursor or a finger steers the sun, and the sway picks up again afterwards.
    const handlePointerMove = (event: PointerEvent) => {
      const { left, width } = sky.getBoundingClientRect();
      steering = true;
      shiftGoal = ((event.clientX - left) / width - 0.5) * 2 * MAX_SHIFT;
      wake();
    };

    const handlePointerLeave = () => {
      steering = false;
      shiftGoal = 0;
      wake();
    };

    render();
    observer.observe(sky);
    noCursor.addEventListener("change", updateSway);
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    sky.addEventListener("pointermove", handlePointerMove);
    sky.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      noCursor.removeEventListener("change", updateSway);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      sky.removeEventListener("pointermove", handlePointerMove);
      sky.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <footer ref={ref} className={className}>
      {children}
    </footer>
  );
}
