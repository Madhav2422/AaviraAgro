"use client";

import { useEffect, useRef } from "react";
import { cargoOnShip } from "@/components/sections/import-export/cargo";
import { drawShip } from "@/components/sections/import-export/voyage/voyageArt";

const SHIP_LENGTH = 1380;

// A small version of the Import & Export page: the same ship, sailing across the
// page as the visitor scrolls past, with the sun low behind it.
export default function TradeShip() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const style = getComputedStyle(canvas);
    const fonts = {
      name: style.getPropertyValue("--font-cinzel"),
      plain: style.fontFamily,
    };

    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let time = 0;
    let lastFrame = 0;
    let frameId = 0;
    let inView = false;
    let cancelled = false;

    const resize = () => {
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
    };

    // 0 as the band comes up from the bottom of the screen, 1 as it leaves at the top.
    const scrolled = () => {
      const { top } = canvas.getBoundingClientRect();
      const span = window.innerHeight + height;
      return Math.max(0, Math.min(1, (window.innerHeight - top) / span));
    };

    const waves = (top: number, color: string, swell: number, length: number) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width + 12; x += 12) {
        const along = x / length;
        ctx.lineTo(x, top + (Math.sin(along + time * 0.7) + Math.sin(along * 2.3 - time) * 0.45) * swell);
      }
      ctx.lineTo(width + 12, height);
      ctx.closePath();
      ctx.fill();
    };

    const draw = () => {
      const water = height * 0.76;
      const scale = Math.min(width * (width < 640 ? 0.9 : 0.5), height * 1.75) / SHIP_LENGTH;
      const travel = Math.max(width * 0.24, (SHIP_LENGTH * scale) / 5);
      const shipX = width / 2 + (scrolled() * 2 - 1) * travel;

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // The low sun and its fine rays, the same ones as in the footer.
      const sunX = width * 0.5;
      const sunY = water - height * 0.08;
      const radius = height * 0.42;
      const reach = radius * 2.9;
      const rays = ctx.createRadialGradient(sunX, sunY, radius, sunX, sunY, reach);
      rays.addColorStop(0, "rgba(190, 132, 40, 0.34)");
      rays.addColorStop(1, "rgba(190, 132, 40, 0)");
      ctx.strokeStyle = rays;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let ray = 0; ray < 60; ray++) {
        const angle = (ray / 60) * Math.PI * 2 + scrolled() * 0.8;
        ctx.moveTo(sunX + Math.cos(angle) * radius * 1.1, sunY + Math.sin(angle) * radius * 1.1);
        ctx.lineTo(sunX + Math.cos(angle) * reach, sunY + Math.sin(angle) * reach);
      }
      ctx.stroke();

      const disc = ctx.createLinearGradient(0, sunY - radius, 0, sunY + radius);
      disc.addColorStop(0, "#f8e4aa");
      disc.addColorStop(1, "#e2aa42");
      ctx.fillStyle = disc;
      ctx.beginPath();
      ctx.arc(sunX, sunY, radius, 0, Math.PI * 2);
      ctx.fill();

      waves(water - 16 * scale, "#2f6a58", 2, 200);

      ctx.setTransform(pixelRatio * scale, 0, 0, pixelRatio * scale, pixelRatio * shipX, pixelRatio * water);
      ctx.translate(0, Math.sin(time * 0.9) * 4);
      drawShip(ctx, { fonts, cargo: cargoOnShip, loaded: cargoOnShip.length, time });

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      waves(water + 2, "#1f4a3c", 2.5, 150);
      waves(water + height * 0.09, "#17362a", 3.5, 210);
      waves(water + height * 0.17, "#14261b", 4.5, 300);
    };

    const frame = (now: number) => {
      time += Math.min((now - lastFrame) / 1000, 0.1);
      lastFrame = now;
      draw();
      frameId = inView ? requestAnimationFrame(frame) : 0;
    };

    const handleResize = () => {
      resize();
      draw();
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && !frameId && !reduceMotion) {
        lastFrame = performance.now();
        frameId = requestAnimationFrame(frame);
      }
    });

    document.fonts.ready.then(() => {
      if (cancelled) return;
      resize();
      draw();
      observer.observe(canvas);
    });
    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="mt-8 block h-[clamp(15rem,34vw,28rem)] w-full font-sans"
    />
  );
}
