"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FLOOR_SHARE, startGrainPour, type GrainPour as GrainPourControls } from "./grainEngine";
import { grainPiles } from "./heroContent";

export default function GrainPour() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<GrainPourControls | null>(null);
  const [peaks, setPeaks] = useState<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.parentElement;
    const heapSpace = section?.querySelector<HTMLElement>("[data-heap-space]");
    if (!canvas || !section || !heapSpace) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const start = (instant: boolean) => {
      // Keeps room above the tallest pile for its tag, which is smaller on phones.
      const tagRoom = window.matchMedia("(min-width: 640px)").matches ? 84 : 58;
      const roomForPiles = (heapSpace.clientHeight - tagRoom) / (1 + FLOOR_SHARE);

      controlsRef.current?.destroy();
      controlsRef.current = startGrainPour(canvas, grainPiles, {
        heapHeight: Math.min(roomForPiles, 120 + section.clientWidth * 0.26, 400),
        instant,
        onSettled: setPeaks,
      });
    };

    start(reduceMotion);

    let width = section.clientWidth;
    let resizeTimer = 0;
    const resizeObserver = new ResizeObserver(() => {
      if (section.clientWidth === width) return;
      width = section.clientWidth;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => start(true), 180);
    });
    resizeObserver.observe(section);

    const handlePointerMove = (event: PointerEvent) => {
      if (reduceMotion) return;
      const bounds = section.getBoundingClientRect();
      controlsRef.current?.stir(
        event.clientX - bounds.left,
        event.clientY - bounds.top,
        event.movementX,
      );
    };
    section.addEventListener("pointermove", handlePointerMove);

    return () => {
      controlsRef.current?.destroy();
      resizeObserver.disconnect();
      window.clearTimeout(resizeTimer);
      section.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full"
      />

      {peaks.length > 0 && (
        <div className="pointer-events-none absolute inset-0 z-20">
          {grainPiles.map((pile, index) => (
            <Link
              key={pile.label}
              href={pile.href}
              onPointerEnter={() => controlsRef.current?.pourOn(index)}
              style={{
                left: `${pile.position * 100}%`,
                bottom: `${peaks[index] - 10}px`,
                animationDelay: `${index * 110}ms`,
              }}
              className="group pointer-events-auto absolute flex -translate-x-1/2 animate-plant flex-col items-center motion-reduce:animate-none"
            >
              <span className="rounded-[3px] border border-brand-ink/15 bg-[#fffaf0] px-2.5 py-0.5 font-display text-[13px] text-brand-ink italic shadow-[0_6px_14px_-8px_rgba(20,38,27,0.6)] transition-transform duration-300 group-hover:-rotate-3 sm:px-3.5 sm:py-1 sm:text-[15px]">
                {pile.label}
              </span>
              <span className="h-6 w-0.5 bg-brand-ink/55 sm:h-9" />
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
