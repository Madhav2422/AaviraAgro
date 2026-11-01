"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { FIELD_HEIGHT, FIELD_WIDTH, wheatRows, wheatStalks, type WheatStalk } from "./wheatStalks";

// How close the cursor must come, in drawing units, before a stalk bends away from it.
const PART_REACH = 170;
// How far, in degrees, a stalk right next to the cursor bends.
const PART_ANGLE = 15;

const round = (value: number) => Math.round(value * 10) / 10;

function Ear({ pairs }: { pairs: number }) {
  const step = 9;
  const grains = Array.from({ length: pairs }, (_, index) => -index * step - 5);
  const tip = -pairs * step - 3;

  return (
    <>
      {grains.map((y) => (
        <g key={y}>
          <ellipse cx="-3.4" cy={y} rx="2.7" ry="5.6" transform={`rotate(-26 -3.4 ${y})`} />
          <ellipse cx="3.4" cy={y} rx="2.7" ry="5.6" transform={`rotate(26 3.4 ${y})`} />
          <path d={`M-5 ${y - 4} L-10 ${y - 24} M5 ${y - 4} L10 ${y - 24}`} strokeWidth="0.6" />
        </g>
      ))}
      <ellipse cx="0" cy={tip} rx="2.5" ry="5.4" />
      <path d={`M0 ${tip - 5} L0 ${tip - 26}`} strokeWidth="0.6" />
    </>
  );
}

function Stalk({ stalk }: { stalk: WheatStalk }) {
  const row = wheatRows[stalk.row];
  const base = `${round(stalk.x)}px ${FIELD_HEIGHT}px`;
  const topX = round(stalk.x + stalk.bend);
  const topY = round(FIELD_HEIGHT - stalk.height);
  // The ear carries on in the direction the stem is leaning.
  const earAngle = round((stalk.bend / stalk.height) * 90);

  return (
    <g data-stalk={round(stalk.x)} style={{ transformOrigin: base }} className="wheat-lean">
      <g
        style={
          {
            transformOrigin: base,
            "--sway-time": `${round(stalk.swaySeconds)}s`,
            "--sway-delay": `${round(stalk.swayDelay)}s`,
          } as CSSProperties
        }
        className="wheat-sway"
      >
        <path
          d={`M${round(stalk.x)} ${FIELD_HEIGHT} Q${round(stalk.x + stalk.bend * 0.15)} ${round(
            FIELD_HEIGHT - stalk.height * 0.55,
          )} ${topX} ${topY}`}
          pathLength={1}
          fill="none"
          stroke={row.stem}
          strokeWidth={1.2 + stalk.row * 0.4}
          strokeLinecap="round"
          style={{ animationDelay: `${Math.round(stalk.growDelay)}ms` }}
          className="wheat-grow"
        />
        <g transform={`translate(${topX} ${topY}) rotate(${earAngle}) scale(${row.earScale})`}>
          <g
            fill={row.ear}
            stroke={row.ear}
            strokeWidth="0.6"
            style={{ animationDelay: `${Math.round(stalk.growDelay + 700)}ms` }}
            className="wheat-ear"
          >
            <Ear pairs={stalk.grainPairs} />
          </g>
        </g>
      </g>
    </g>
  );
}

type WheatFieldProps = {
  className?: string;
};

// A field of wheat that grows in, sways in the wind and parts around the cursor.
export default function WheatField({ className }: WheatFieldProps) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const noCursor = window.matchMedia("(hover: none)").matches;
    if (!svg || reduceMotion || noCursor) return;

    const stalks = Array.from(svg.querySelectorAll<SVGGElement>("[data-stalk]"));
    const positions = stalks.map((stalk) => Number(stalk.dataset.stalk));
    const leans = new Float32Array(stalks.length);
    let pointerX: number | null = null;
    let frameId = 0;

    const frame = () => {
      let moving = false;
      stalks.forEach((stalk, index) => {
        let goal = 0;
        if (pointerX !== null) {
          const distance = positions[index] - pointerX;
          const strength = Math.max(0, 1 - Math.abs(distance) / PART_REACH);
          goal = Math.sign(distance) * strength * strength * PART_ANGLE;
        }
        const lean = leans[index] + (goal - leans[index]) * 0.1;
        if (Math.abs(goal - lean) > 0.02) moving = true;
        leans[index] = lean;
        stalk.style.rotate = `${lean.toFixed(2)}deg`;
      });
      frameId = moving ? requestAnimationFrame(frame) : 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      const box = svg.getBoundingClientRect();
      const overField = event.clientY > box.top - 60 && event.clientY < box.bottom;
      if (overField) {
        // The drawing is scaled to cover the box, so turn screen pixels back into drawing units.
        const scale = Math.max(box.width / FIELD_WIDTH, box.height / FIELD_HEIGHT);
        const offset = (box.width - FIELD_WIDTH * scale) / 2;
        pointerX = (event.clientX - box.left - offset) / scale;
      } else {
        pointerX = null;
      }
      if (!frameId) frameId = requestAnimationFrame(frame);
    };
    const onPointerLeave = () => {
      pointerX = null;
      if (!frameId) frameId = requestAnimationFrame(frame);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      viewBox={`0 0 ${FIELD_WIDTH} ${FIELD_HEIGHT}`}
      preserveAspectRatio="xMidYMax slice"
      className={className}
    >
      {wheatRows.map((row, rowIndex) => (
        <g key={rowIndex} opacity={row.opacity}>
          {wheatStalks
            .filter((stalk) => stalk.row === rowIndex)
            .map((stalk) => (
              <Stalk key={stalk.x} stalk={stalk} />
            ))}
        </g>
      ))}
    </svg>
  );
}
