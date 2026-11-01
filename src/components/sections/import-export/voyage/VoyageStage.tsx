"use client";

import { useEffect, useRef, useState } from "react";
import RisingWord from "@/components/ui/RisingWord";
import { cargoOnShip } from "../cargo";
import { voyageContent } from "./voyageContent";
import { drawVoyage } from "./voyageScene";
import { chapterAt, type Chapter } from "./voyageTimeline";

const { eyebrow, heading, text, hint, castOff, dusk, night, arrival, stops } = voyageContent;

const FULL_FRAME_SECONDS = 1 / 45;

function captionOf(chapter: Chapter) {
  switch (chapter.kind) {
    case "cargo": {
      const cargo = cargoOnShip[chapter.cargo];
      return {
        tag: `Container ${chapter.cargo + 1} of ${cargoOnShip.length}`,
        title: cargo.name,
        text: cargo.line,
      };
    }
    case "castOff":
      return { tag: "Departure", ...castOff };
    case "dusk":
      return { tag: "Sunset", ...dusk };
    case "night":
      return { tag: "Night watch", ...night };
    case "arrival":
      return { tag: "Arrival", ...arrival };
    default:
      return null;
  }
}

export default function VoyageStage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const shipMarkRef = useRef<HTMLSpanElement>(null);
  const [chapter, setChapter] = useState<Chapter>({ kind: "opening", cargo: 0 });

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const intro = introRef.current;
    const shipMark = shipMarkRef.current;
    const ctx = canvas?.getContext("2d");
    if (!track || !stage || !canvas || !ctx || !intro || !shipMark) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const style = getComputedStyle(stage);
    const fonts = {
      name: style.getPropertyValue("--font-cinzel"),
      plain: style.fontFamily,
    };

    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let progress = 0;
    let time = 0;
    let frameId = 0;
    let lastFrame = 0;
    let lastDrawn = 0;
    let inView = false;
    let cancelled = false;

    const resize = () => {
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = stage.clientWidth;
      height = stage.clientHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
    };

    const scrollGoal = () => {
      // The stage sticks below the navbar, so the story starts from there.
      const offset = parseFloat(style.top) || 0;
      const { top, height: trackHeight } = track.getBoundingClientRect();
      const room = trackHeight - stage.clientHeight;
      return room > 0 ? Math.max(0, Math.min(1, (offset - top) / room)) : 1;
    };

    const draw = () => {
      const wordsEnd = intro.offsetTop + intro.offsetHeight;
      drawVoyage(ctx, { width, height, pixelRatio, progress, time, fonts, wordsEnd });
      intro.style.opacity = String(Math.max(0, 1 - progress / 0.035));
      intro.style.visibility = progress > 0.035 ? "hidden" : "visible";
      const voyage = progress < 0.6 ? progress / 1.2 : 0.5 + (progress - 0.6) / 0.7;
      shipMark.style.left = `${Math.min(voyage, 1) * 100}%`;
      const next = chapterAt(progress);
      setChapter((current) =>
        current.kind === next.kind && current.cargo === next.cargo ? current : next,
      );
    };

    const frame = (now: number) => {
      const seconds = Math.min((now - lastFrame) / 1000, 0.1);
      lastFrame = now;
      time += seconds;

      const goal = scrollGoal();
      const moving = Math.abs(goal - progress) > 0.00005;
      progress += (goal - progress) * Math.min(1, seconds * 7);

      // At rest the sea only needs half the frames, which saves a phone's battery.
      if (moving || now - lastDrawn >= FULL_FRAME_SECONDS * 1000 * 1.5) {
        lastDrawn = now;
        draw();
      }
      frameId = inView ? requestAnimationFrame(frame) : 0;
    };

    const start = () => {
      resize();
      if (reduceMotion) {
        draw();
        return;
      }
      progress = scrollGoal();
      draw();
      track.dataset.playing = "true";
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !frameId) {
          lastFrame = performance.now();
          frameId = requestAnimationFrame(frame);
        }
      });
      observer.observe(stage);
      cleanups.push(() => observer.disconnect());
    };

    const cleanups: (() => void)[] = [];
    const handleResize = () => {
      resize();
      draw();
    };

    document.fonts.ready.then(() => {
      if (!cancelled) start();
    });
    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  const caption = captionOf(chapter);

  return (
    <div ref={trackRef} className="voyage-track">
      <div ref={stageRef} className="voyage-stage font-sans">
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full" />

        <div
          ref={introRef}
          className="absolute inset-x-0 top-0 z-10 mx-auto max-w-7xl px-5 pt-8 text-center sm:px-8 xl:px-6 xl:pt-12"
        >
          <p className="animate-fade-up text-[13px] font-semibold tracking-[0.2em] text-brand-gold-deep uppercase motion-reduce:animate-none">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-display text-[clamp(2.2rem,10.6vw,5.5rem)] leading-[1.05] tracking-[-0.03em] text-brand-ink xl:text-[min(7.4vw,14svh,7rem)]">
            <RisingWord word={heading.main} delay={120} />
            <br />
            <RisingWord
              word={heading.accent}
              delay={260}
              className="animate-rise-sheen bg-[linear-gradient(100deg,#946d16_0%,#ad8426_38%,#f2d78e_50%,#ad8426_62%,#946d16_100%)] bg-size-[300%_100%] -mb-[0.3em] -ml-[0.25em] bg-clip-text pr-[0.08em] pb-[0.3em] pl-[0.25em] text-transparent italic"
            />
          </h1>
          <p
            style={{ animationDelay: "520ms" }}
            className="mx-auto mt-5 max-w-xl animate-fade-up text-[16px] leading-relaxed text-balance text-brand-ink/85 motion-reduce:animate-none xl:text-[17px]"
          >
            {text}
          </p>
        </div>

        {caption && (
          <div
            key={caption.title}
            className="absolute bottom-16 left-5 z-10 w-[min(21rem,calc(100%-2.5rem))] -rotate-1 animate-fade-up rounded-[3px] border border-brand-ink/15 bg-[#fffaf0] px-5 py-3.5 shadow-[0_14px_30px_-16px_rgba(0,0,0,0.7)] motion-reduce:animate-none sm:left-8 xl:bottom-8 xl:left-[max(1.5rem,calc((100%-77rem)/2))]"
          >
            <p className="text-[11px] font-semibold tracking-[0.18em] text-brand-gold-deep uppercase">
              {caption.tag}
            </p>
            <h2 className="mt-0.5 font-display text-[1.7rem] leading-tight text-brand-ink">
              {caption.title}
            </h2>
            <p className="mt-1 text-[14.5px] leading-snug text-brand-muted">{caption.text}</p>
          </div>
        )}

        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-5 z-10 mx-auto w-[min(26rem,calc(100%-3rem))] text-[11px] font-medium tracking-[0.14em] text-background/70 uppercase"
        >
          <div className="relative h-px bg-background/25">
            <span
              ref={shipMarkRef}
              className="absolute top-1/2 left-0 block size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-wheat"
            />
          </div>
          <div className="mt-2 flex justify-between">
            {stops.map((stop) => (
              <span key={stop}>{stop}</span>
            ))}
          </div>
        </div>

        {chapter.kind === "opening" && (
          <p className="absolute inset-x-0 bottom-14 z-10 text-center text-[13px] font-medium text-background/85">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
