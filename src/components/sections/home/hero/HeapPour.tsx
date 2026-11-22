"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { loadKernelSheets } from "./grainSprites";
import { createGrainStreams, type GrainStreams, type PourTarget } from "./grainStream";
import { grainPiles } from "./heroContent";

// When the first heap starts, the gap before each next one, and how long each pours.
const START_MS = 300;
const STAGGER_MS = 240;
const POUR_MS = 2200;
// The first grains take this long to fall from the top, so the heap starts growing then.
const FALL_MS = 420;
const GRAINS_PER_SECOND = 70;
// How big a heap is before any grain has landed on it.
const SMALLEST = 0.04;

const backDepth = Math.max(...grainPiles.map((pile) => pile.depth));

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const watchReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const prefersReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;

// The four heap photos rise as grain pours onto them from the top of the hero. Hovering a
// heap's tag pours a little more.
export default function HeapPour() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Each heap's box, which never changes size, and the part inside it that grows.
  const heapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const growRefs = useRef<(HTMLDivElement | null)[]>([]);
  const streamsRef = useRef<GrainStreams | null>(null);
  const targetsRef = useRef<PourTarget[]>([]);
  const [risen, setRisen] = useState<boolean[]>(() => grainPiles.map(() => false));
  // With reduced motion the heaps are simply there, with their tags, and nothing pours.
  const reduceMotion = useSyncExternalStore(watchReducedMotion, prefersReducedMotion, () => false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) return;

    const scales = grainPiles.map(() => SMALLEST);
    const setScale = (index: number, scale: number) => {
      scales[index] = scale;
      const grow = growRefs.current[index];
      if (!grow) return;
      grow.style.scale = String(scale);
      grow.style.opacity = String(Math.min(1, (scale - SMALLEST) / 0.08));
    };

    // One target per heap, kept up to date as the page resizes, so a pour already going
    // follows its heap.
    const targets: PourTarget[] = grainPiles.map((pile) => ({
      kind: pile.kind,
      x: 0,
      grainLength: 0,
      peakY: () => 0,
    }));
    targetsRef.current = targets;
    const measure = () => {
      const box = canvas.getBoundingClientRect();
      grainPiles.forEach((pile, index) => {
        const heap = heapRefs.current[index]?.getBoundingClientRect();
        if (!heap) return;
        const bottom = heap.bottom - box.top;
        targets[index].x = heap.left - box.left + heap.width * pile.peak;
        targets[index].grainLength = heap.width * pile.grainLength;
        targets[index].peakY = () => bottom - heap.height * scales[index];
      });
    };

    let cancelled = false;
    let frameId = 0;
    const timers: number[] = [];
    const done = grainPiles.map(() => false);

    const handleResize = () => {
      measure();
      streamsRef.current?.resize();
    };

    loadKernelSheets().then((sheets) => {
      if (cancelled) return;
      const streams = createGrainStreams(canvas, sheets);
      streamsRef.current = streams;
      measure();
      window.addEventListener("resize", handleResize);

      grainPiles.forEach((_, index) => {
        timers.push(
          window.setTimeout(
            () => streams.pour(targets[index], POUR_MS / 1000, GRAINS_PER_SECOND),
            START_MS + index * STAGGER_MS,
          ),
        );
      });

      const begin = performance.now();
      const tick = (now: number) => {
        let pouring = false;
        grainPiles.forEach((_, index) => {
          const startsAt = START_MS + index * STAGGER_MS + FALL_MS;
          const poured = Math.max(0, Math.min(1, (now - begin - startsAt) / POUR_MS));
          // Grain pours in at a steady rate, so the heap's volume grows evenly and its height
          // grows like the cube root of that: fast at first, then slowing as it widens.
          setScale(index, SMALLEST + (1 - SMALLEST) * Math.cbrt(poured));
          if (poured < 1) {
            pouring = true;
          } else if (!done[index]) {
            done[index] = true;
            setRisen((before) => before.map((value, other) => value || other === index));
          }
        });
        frameId = pouring ? requestAnimationFrame(tick) : 0;
      };
      frameId = requestAnimationFrame(tick);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("resize", handleResize);
      streamsRef.current?.destroy();
    };
  }, []);

  const pourMore = (index: number) => {
    const target = targetsRef.current[index];
    if (target) streamsRef.current?.pour(target, 0.6, GRAINS_PER_SECOND * 0.7);
  };

  return (
    <div className="pointer-events-none absolute inset-0 [--heap:min(40vw,28svh)] sm:[--heap:min(38vw,42svh)] xl:[--heap:min(34vw,50svh)]">
      {grainPiles.map((pile, index) => {
        const tag = {
          onPointerEnter: () => pourMore(index),
          style: { left: `${pile.peak * 100}%` },
          className:
            "group pointer-events-auto absolute bottom-[calc(100%-0.5rem)] flex -translate-x-1/2 animate-plant flex-col items-center motion-reduce:animate-none",
          children: (
            <>
              <span className="rounded-[3px] border border-brand-ink/15 bg-[#fffaf0] px-2.5 py-0.5 font-display text-[13px] whitespace-nowrap text-brand-ink italic shadow-[0_6px_14px_-8px_rgba(20,38,27,0.6)] transition-transform duration-300 group-hover:-rotate-3 sm:px-3.5 sm:py-1 sm:text-[15px]">
                {pile.label}
              </span>
              <span className="h-6 w-0.5 bg-brand-ink/55 sm:h-9" />
            </>
          ),
        };

        return (
          <div
            key={pile.label}
            ref={(element) => {
              heapRefs.current[index] = element;
            }}
            style={{
              left: `${pile.position * 100}%`,
              width: `calc(var(--heap) * ${pile.size})`,
              bottom: `calc(var(--heap) * ${(backDepth - pile.depth) * 0.012})`,
              zIndex: pile.depth,
            }}
            className="absolute -translate-x-1/2"
          >
            <div
              ref={(element) => {
                growRefs.current[index] = element;
              }}
              style={{ transformOrigin: `${pile.peak * 100}% 100%` }}
              className="relative isolate scale-[0.04] opacity-0 will-change-[scale] motion-reduce:scale-100 motion-reduce:opacity-100"
            >
              {/* A soft shadow on the floor under the heap. */}
              <span className="absolute inset-x-[4%] bottom-0 -z-10 h-[16%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(58,38,12,0.3),transparent)]" />
              <Image
                src={pile.image}
                alt=""
                width={1000}
                height={pile.imageHeight}
                sizes="(min-width: 1280px) 34vw, (min-width: 640px) 38vw, 40vw"
                loading="eager"
                className="block h-auto w-full"
              />
            </div>

            {/* A tag without a page to go to still pours more grain when hovered. */}
            {(risen[index] || reduceMotion) &&
              (pile.href ? (
                <Link href={pile.href} {...tag} />
              ) : (
                <span {...tag} />
              ))}
          </div>
        );
      })}

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 z-10 size-full"
      />
    </div>
  );
}
