// The grain that pours onto the heaps: grains fall from the top of the hero, land on the
// slope of their heap, skip once and settle into it.

import { makeKernels, type GrainKind, type KernelSheets, type Kernels } from "./grainSprites";

const GRAVITY = 2600;
// How steep the heap's sides are where falling grain lands: drop per step sideways.
const SLOPE = 0.75;
// How long a grain takes to settle into the heap after it lands.
const SETTLE_SECONDS = 0.35;
const MAX_GRAINS = 600;

// A heap to pour onto, in CSS pixels from the top left of the canvas.
export type PourTarget = {
  kind: GrainKind;
  x: number;
  // Where the top of the heap is right now; it moves up while the heap rises.
  peakY: () => number;
  // How long one grain is here.
  grainLength: number;
};

type Grain = {
  target: PourTarget;
  kernels: Kernels;
  variant: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  turn: number;
  spin: number;
  roll: number;
  rollSpin: number;
  age: number;
  // Seconds since it landed, or -1 while still falling.
  landed: number;
};

type Pour = { target: PourTarget; until: number; rate: number; carry: number };

export type GrainStreams = {
  // Pours grain onto a heap for a number of seconds, at a number of grains a second.
  pour: (target: PourTarget, seconds: number, rate: number) => void;
  resize: () => void;
  destroy: () => void;
};

const random = (min: number, max: number) => min + Math.random() * (max - min);
const eitherWay = () => (Math.random() < 0.5 ? -1 : 1);

export function createGrainStreams(canvas: HTMLCanvasElement, sheets: KernelSheets): GrainStreams {
  const ctx = canvas.getContext("2d");
  let pixelRatio = 1;
  const kernelCache = new Map<string, Kernels>();
  const grains: Grain[] = [];
  const pours: Pour[] = [];
  let clock = 0;
  let lastFrame = 0;
  let frameId = 0;

  function resize() {
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * pixelRatio);
    canvas.height = Math.round(canvas.clientHeight * pixelRatio);
    kernelCache.clear();
  }

  // Grain pictures are made once for each kind and size.
  function kernelsFor(target: PourTarget) {
    const image = sheets[target.kind];
    if (!image) return null;
    const length = Math.round(target.grainLength * pixelRatio);
    const key = `${target.kind}:${length}`;
    let kernels = kernelCache.get(key);
    if (!kernels) {
      kernels = makeKernels(target.kind, image, length);
      kernelCache.set(key, kernels);
    }
    return kernels;
  }

  function addGrain(target: PourTarget) {
    const kernels = kernelsFor(target);
    if (!kernels || grains.length >= MAX_GRAINS) return;
    // A stream is narrow, a few grains wide, and spreads a little as it falls.
    const offset = (random(-1, 1) + random(-1, 1)) * target.grainLength * 0.7;
    grains.push({
      target,
      kernels,
      variant: Math.floor(Math.random() * kernels.count),
      x: target.x + offset,
      y: random(-40, -10),
      vx: offset * random(0.4, 1.4),
      vy: random(160, 360),
      turn: Math.random(),
      spin: random(0.5, 1.6) * eitherWay(),
      roll: Math.random(),
      rollSpin: random(1, 2.8) * eitherWay(),
      age: 0,
      landed: -1,
    });
  }

  // The heap's surface below a point: its peak, falling away down the sides.
  function surfaceAt(target: PourTarget, x: number) {
    return target.peakY() + Math.abs(x - target.x) * SLOPE;
  }

  function step(seconds: number) {
    clock += seconds;

    for (let index = pours.length - 1; index >= 0; index--) {
      const pour = pours[index];
      const left = pour.until - clock;
      if (left <= 0) {
        pours.splice(index, 1);
        continue;
      }
      // The stream thins out over its last half second, as the last grain runs out.
      pour.carry += pour.rate * seconds * Math.min(1, left / 0.5);
      while (pour.carry >= 1) {
        pour.carry -= 1;
        addGrain(pour.target);
      }
    }

    for (let index = grains.length - 1; index >= 0; index--) {
      const grain = grains[index];
      grain.age += seconds;
      grain.vy += GRAVITY * seconds;
      grain.x += grain.vx * seconds;
      grain.y += grain.vy * seconds;

      if (grain.landed < 0) {
        // Lands somewhere on the upper slope, not all on one point.
        const surface = surfaceAt(grain.target, grain.x) + random(0, grain.target.grainLength);
        if (grain.y >= surface) {
          grain.landed = 0;
          grain.y = surface;
          // Skips once, down the side it landed on.
          const side = Math.sign(grain.x - grain.target.x) || eitherWay();
          grain.vy = -random(60, 220);
          grain.vx = side * random(40, 170);
          grain.spin *= 2;
        }
      } else {
        grain.landed += seconds;
        // It cannot sink into the heap faster than it settles.
        grain.y = Math.min(grain.y, surfaceAt(grain.target, grain.x) + grain.target.grainLength);
        if (grain.landed >= SETTLE_SECONDS) {
          grains[index] = grains[grains.length - 1];
          grains.pop();
        }
      }
    }
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const grain of grains) {
      const fade = grain.landed < 0 ? 1 : 1 - grain.landed / SETTLE_SECONDS;
      grain.kernels.paint(
        ctx,
        grain.variant,
        grain.turn + grain.age * grain.spin,
        grain.roll + grain.age * grain.rollSpin,
        grain.x * pixelRatio,
        grain.y * pixelRatio,
        fade,
      );
    }
  }

  function frame(now: number) {
    // A long pause (a hidden tab) does not make grains jump.
    const seconds = Math.min((now - lastFrame) / 1000, 1 / 30);
    lastFrame = now;
    step(seconds);
    draw();
    if (pours.length > 0 || grains.length > 0) {
      frameId = requestAnimationFrame(frame);
    } else {
      frameId = 0;
    }
  }

  function wake() {
    if (frameId) return;
    lastFrame = performance.now();
    frameId = requestAnimationFrame(frame);
  }

  resize();

  return {
    pour(target, seconds, rate) {
      if (!sheets[target.kind]) return;
      pours.push({ target, until: clock + seconds, rate, carry: 0 });
      wake();
    },
    resize,
    destroy() {
      cancelAnimationFrame(frameId);
    },
  };
}
