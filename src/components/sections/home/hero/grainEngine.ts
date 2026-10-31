// The grain pour: grains fall from the top, land on their pile and roll downhill
// until they settle, the same way a real heap of grain forms.

import type { GrainPile } from "./heroContent";
import {
  ANGLES,
  SHADE_LEVELS,
  SHADE_NEUTRAL,
  buildGrainAtlas,
  grainArea,
  randomVariant,
  shadowColor,
  spriteRow,
  type GrainKind,
} from "./grainSprites";

const GRAVITY = 2400;
const POUR_SECONDS = 2.5;
const PILE_STAGGER_SECONDS = 0.14;
const COLUMN_WIDTH = 2;
const ROLL_REACH = 4;
const MAX_ROLL_STEPS = 160;
const LANDING_SCATTER = 3.4;
const BOUNCE_CHANCE = 0.16;
const EXTRA_GRAINS_PER_LANDING = 3;
const PACKING = 1.6;
const SLOW_FRAME_SECONDS = 0.04;
const MAX_LOOSE_GRAINS = 220;
const SPILL_CHANCE = 0.05;

// The floor space kept below the piles, as a share of their height.
export const FLOOR_SHARE = 0.17;

type Grain = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  kind: GrainKind;
  variant: number;
  angle: number;
  spin: number;
  age: number;
  // Stirred grains land back on the pile without making it taller.
  loose: boolean;
  rolling: boolean;
};

type Pile = {
  x: number;
  column: number;
  target: number;
  kinds: GrainKind[];
  depth: number;
  startsAt: number;
  grainsPerSecond: number;
  carry: number;
  done: boolean;
  // Height of this pile at every column across the page.
  heights: Float32Array;
  // The rounded edge where the pile meets the floor, at every column.
  floor: Float32Array;
  baseY: number;
  halfBase: number;
  grains: Grain[];
  // Settled grains are painted once onto this layer and never redrawn.
  layer: HTMLCanvasElement;
  layerCtx: CanvasRenderingContext2D | null;
  undercoat: string;
};

type StartOptions = {
  heapHeight: number;
  instant: boolean;
  onSettled: (peaks: number[]) => void;
};

export type GrainPour = {
  stir: (x: number, y: number, moveX: number) => void;
  pourOn: (pileIndex: number) => void;
  destroy: () => void;
};

const random = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T>(list: T[]) => list[Math.floor(Math.random() * list.length)];

export function startGrainPour(
  canvas: HTMLCanvasElement,
  pileList: GrainPile[],
  { heapHeight, instant, onSettled }: StartOptions,
): GrainPour {
  const ctx = canvas.getContext("2d");
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);

  const grainSize = width < 640 ? 6.5 : 8;
  const atlas = buildGrainAtlas(grainSize, pixelRatio);
  const cell = atlas.cell;
  // Piles run on past the screen edges instead of stacking up against them.
  const sideMargin = heapHeight * 1.6;
  const columns = Math.ceil((width + sideMargin * 2) / COLUMN_WIDTH) + 1;
  const floorDepth = Math.max(30, heapHeight * FLOOR_SHARE);
  const baseLine = height - floorDepth;
  const layerTop = Math.max(0, baseLine - heapHeight * 1.25);
  const frontDepth = Math.max(...pileList.map((pile) => pile.depth));

  const piles: Pile[] = pileList.map((pile, index) => {
    const kinds = kindsFromMix(pile.mix);
    const target = pile.height * heapHeight;
    const averageArea =
      kinds.reduce((sum, kind) => sum + grainArea(kind, grainSize), 0) / kinds.length;
    const pileArea = 1.6 * target * target;

    const layer = document.createElement("canvas");
    layer.width = canvas.width;
    layer.height = Math.round((height - layerTop) * pixelRatio);

    // Piles further back sit a little higher up, and each base curves like a real mound.
    const x = pile.position * width;
    const halfBase = target * 1.5;
    const baseY = baseLine - (frontDepth - pile.depth) * 7;
    const floor = new Float32Array(columns);
    for (let column = 0; column < columns; column++) {
      const across = (xOfColumn(column) - x) / halfBase;
      floor[column] = baseY + Math.sqrt(Math.max(0, 1 - across * across)) * floorDepth * 0.72;
    }

    return {
      x,
      column: columnAt(x),
      target,
      kinds,
      depth: pile.depth,
      startsAt: index * PILE_STAGGER_SECONDS,
      grainsPerSecond: pileArea / (averageArea * PACKING) / POUR_SECONDS,
      carry: 0,
      done: false,
      heights: new Float32Array(columns),
      floor,
      baseY,
      halfBase,
      grains: [],
      layer,
      layerCtx: layer.getContext("2d"),
      undercoat: shadowColor(kinds[0]),
    };
  });

  const backToFront = [...piles].sort((a, b) => a.depth - b.depth);

  let frameId = 0;
  let idleTimer = 0;
  let lastFrame = 0;
  let clock = 0;
  let slowFrames = 0;
  let rushing = false;
  let pourFinished = false;

  function columnAt(x: number) {
    return Math.max(0, Math.min(columns - 1, Math.round((x + sideMargin) / COLUMN_WIDTH)));
  }

  function xOfColumn(column: number) {
    return column * COLUMN_WIDTH - sideMargin;
  }

  function surfaceAt(pile: Pile, x: number) {
    const column = columnAt(x);
    return pile.floor[column] - pile.heights[column];
  }

  function airborneGrains() {
    return piles.reduce((sum, pile) => sum + pile.grains.length, 0);
  }

  function makeGrain(x: number, y: number, kind: GrainKind, loose: boolean): Grain {
    return {
      x,
      y,
      vx: 0,
      vy: 0,
      kind,
      variant: randomVariant(),
      angle: Math.floor(Math.random() * ANGLES),
      spin: random(6, 18),
      age: 0,
      loose,
      rolling: false,
    };
  }

  // Gentle near the peak and steeper lower down, which gives each pile a rounded top.
  function slopeLimit(pile: Pile, pileHeight: number) {
    const belowPeak = 1 - pileHeight / pile.target;
    return 0.24 + 0.62 * Math.max(0, Math.min(1, belowPeak * 2.4));
  }

  function rollDownhill(pile: Pile, start: number) {
    const { heights } = pile;
    let column = start;
    for (let step = 0; step < MAX_ROLL_STEPS; step++) {
      const here = heights[column];
      const left = column >= ROLL_REACH ? heights[column - ROLL_REACH] : 0;
      const right = column + ROLL_REACH < columns ? heights[column + ROLL_REACH] : 0;
      const drop = slopeLimit(pile, here) * ROLL_REACH * COLUMN_WIDTH * random(0.82, 1.18);
      const canGoLeft = here - left > drop && column >= ROLL_REACH;
      const canGoRight = here - right > drop && column + ROLL_REACH < columns;
      if (!canGoLeft && !canGoRight) break;
      if (canGoLeft && canGoRight) column += Math.random() < 0.5 ? -ROLL_REACH : ROLL_REACH;
      else column += canGoLeft ? -ROLL_REACH : ROLL_REACH;
    }
    return column;
  }

  function raisePile(pile: Pile, column: number, kind: GrainKind) {
    const rise = (grainArea(kind, grainSize) * PACKING) / COLUMN_WIDTH;
    for (let offset = -3; offset <= 3; offset++) {
      const index = column + offset;
      if (index >= 0 && index < columns) {
        pile.heights[index] += (rise * (4 - Math.abs(offset))) / 16;
      }
    }
  }

  // Each pile is lit like a round mound with the light at the top left. The random
  // part blends the tones grain by grain, so there are no hard bands of light.
  function shadeAt(pile: Pile, column: number) {
    const pileHeight = pile.heights[column];
    const halfWidth = pile.target * 1.45 * (0.4 + 0.6 * (1 - pileHeight / pile.target));
    const distance = (xOfColumn(column) - pile.x) / halfWidth;
    const across = Math.max(-1, Math.min(1, distance));
    const facing = Math.sqrt(1 - across * across);
    const light = 0.34 - 0.42 * across + 0.42 * facing + 0.1 * (pileHeight / pile.target);
    const level = ((light - 0.1) / 0.92) * (SHADE_LEVELS - 1) + random(-0.55, 0.55);
    return Math.max(0, Math.min(SHADE_LEVELS - 1, Math.round(level)));
  }

  function paint(
    target: CanvasRenderingContext2D | null,
    row: number,
    angle: number,
    x: number,
    y: number,
  ) {
    target?.drawImage(
      atlas.canvas,
      angle * cell,
      row * cell,
      cell,
      cell,
      Math.round(x * pixelRatio - cell / 2),
      Math.round(y * pixelRatio - cell / 2),
      cell,
      cell,
    );
  }

  function layDown(pile: Pile, grain: Grain) {
    // Grains scatter a little on landing, which keeps the top of each pile soft.
    const scatter = grain.loose
      ? 0
      : (random(-1, 1) + random(-1, 1)) * grainSize * LANDING_SCATTER;
    const column = rollDownhill(pile, columnAt(grain.x + scatter));
    if (!grain.loose) raisePile(pile, column, grain.kind);
    if (!grain.loose && Math.random() < SPILL_CHANCE) spillGrain(pile, grain.kind);

    const top = pile.floor[column] - pile.heights[column] - layerTop;
    const shade = shadeAt(pile, column);
    const extras = grain.loose ? 0 : EXTRA_GRAINS_PER_LANDING;
    for (let index = extras; index >= 0; index--) {
      const spread = index === 0 ? 0.3 : 1;
      paint(
        pile.layerCtx,
        spriteRow(grain.kind, randomVariant(), shade),
        Math.floor(Math.random() * ANGLES),
        xOfColumn(column) + random(-1, 1) * grainSize * spread,
        top + random(0, grainSize * 1.15 * spread),
      );
    }
  }

  // A few grains always skip past the foot of a pile and lie loose on the floor.
  function spillGrain(pile: Pile, kind: GrainKind) {
    const x = pile.x + random(-1, 1) * pile.halfBase * 1.04;
    const y = pile.floor[columnAt(x)] + random(0, 1) ** 2 * floorDepth * 0.42;
    paint(
      pile.layerCtx,
      spriteRow(kind, randomVariant(), SHADE_NEUTRAL),
      Math.floor(Math.random() * ANGLES),
      x,
      Math.min(y, height - grainSize) - layerTop,
    );
  }

  function pour(pile: Pile, seconds: number) {
    const elapsed = clock - pile.startsAt;
    if (pile.done || elapsed < 0) return;

    const remaining = pile.target - pile.heights[pile.column];
    if (remaining <= pile.target * 0.02 || elapsed > POUR_SECONDS * 1.5) {
      pile.done = true;
      return;
    }

    const easeIn = Math.min(1, elapsed / 0.3);
    const taper = Math.min(1, Math.max(0.2, remaining / (pile.target * 0.3)));
    pile.carry += pile.grainsPerSecond * seconds * easeIn * taper;

    while (pile.carry >= 1) {
      pile.carry -= 1;
      const fall = random(-1, 1) * random(0, 1);
      const grain = makeGrain(
        pile.x + fall * grainSize * 2.4,
        random(-30, -6),
        pick(pile.kinds),
        false,
      );
      grain.vy = random(120, 300);
      grain.vx = fall * 26;
      if (rushing) layDown(pile, grain);
      else pile.grains.push(grain);
    }
  }

  function move(pile: Pile, seconds: number) {
    const { grains } = pile;
    for (let index = grains.length - 1; index >= 0; index--) {
      const grain = grains[index];
      grain.age += seconds;

      if (grain.rolling) {
        const slope = (surfaceAt(pile, grain.x + 6) - surfaceAt(pile, grain.x - 6)) / 12;
        grain.vx = (grain.vx + slope * 900 * seconds) * 0.992;
        grain.x += grain.vx * seconds;
        grain.y = surfaceAt(pile, grain.x) - grainSize * 0.35;
        if (grain.age < 1.3 && (grain.age < 0.4 || Math.abs(grain.vx) > 6)) continue;
      } else {
        grain.vy += GRAVITY * seconds;
        grain.x += grain.vx * seconds;
        grain.y += grain.vy * seconds;

        const floor = surfaceAt(pile, grain.x);
        if (grain.y < floor) continue;

        if (grain.vy > 500 && Math.random() < BOUNCE_CHANCE) {
          grain.y = floor;
          grain.vy *= -0.24;
          grain.vx += random(-110, 110);
          continue;
        }
      }

      layDown(pile, grain);
      grains[index] = grains[grains.length - 1];
      grains.pop();
    }
  }

  function outlineOf(pile: Pile) {
    const outline = new Path2D();
    const inset = grainSize * 0.8;
    const first = pile.heights.findIndex((value) => value > 1);
    if (first < 0) return outline;

    let last = first;
    for (let column = first; column < columns; column += 3) {
      if (pile.heights[column] <= 1) continue;
      last = column;
      const bottom = pile.floor[column] - inset;
      const top = Math.min(bottom, pile.floor[column] - pile.heights[column] + grainSize * 0.9);
      outline.lineTo(xOfColumn(column) * pixelRatio, top * pixelRatio);
    }
    for (let column = last; column >= first; column -= 3) {
      outline.lineTo(xOfColumn(column) * pixelRatio, (pile.floor[column] - inset) * pixelRatio);
    }
    outline.closePath();
    return outline;
  }

  // A soft shadow on the floor around the foot of the pile, which grows with it.
  function floorShadow(target: CanvasRenderingContext2D, pile: Pile) {
    const grown = Math.min(1, pile.heights[pile.column] / pile.target);
    if (grown === 0) return;

    const radius = pile.halfBase * 1.08 * pixelRatio;
    const squash = ((floorDepth * 0.72 + 16) * pixelRatio) / radius;
    const shadow = target.createRadialGradient(0, 0, 0, 0, 0, radius);
    shadow.addColorStop(0.72, "rgba(58, 38, 12, 0.34)");
    shadow.addColorStop(1, "rgba(58, 38, 12, 0)");

    target.save();
    target.translate((pile.x + 12) * pixelRatio, pile.baseY * pixelRatio);
    target.scale(grown, squash);
    target.fillStyle = shadow;
    target.beginPath();
    target.arc(0, 0, radius, 0, Math.PI);
    target.fill();
    target.restore();
  }

  // A soft shadow on the piles behind, which only falls where there is already grain.
  function castShadow(target: CanvasRenderingContext2D, outline: Path2D) {
    target.save();
    target.globalCompositeOperation = "source-atop";
    target.translate(16 * pixelRatio, 8 * pixelRatio);
    target.strokeStyle = "rgba(38, 22, 6, 0.1)";
    for (const shadowWidth of [76, 46, 22]) {
      target.lineWidth = shadowWidth * pixelRatio;
      target.stroke(outline);
    }
    target.restore();
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    backToFront.forEach((pile, order) => {
      const outline = outlineOf(pile);
      if (order > 0) castShadow(ctx, outline);

      // A dark coat under the grains, so any gap between them reads as deep shadow.
      ctx.fillStyle = pile.undercoat;
      ctx.fill(outline);
      ctx.drawImage(pile.layer, 0, Math.round(layerTop * pixelRatio));

      for (const grain of pile.grains) {
        const angle = Math.floor(grain.angle + grain.age * grain.spin) % ANGLES;
        paint(ctx, spriteRow(grain.kind, grain.variant, SHADE_NEUTRAL), angle, grain.x, grain.y);
      }
    });

    ctx.globalCompositeOperation = "destination-over";
    for (const pile of piles) floorShadow(ctx, pile);
    ctx.globalCompositeOperation = "source-over";
  }

  function frame(now: number) {
    const realSeconds = (now - lastFrame) / 1000;
    const seconds = Math.min(realSeconds, 1 / 30);
    lastFrame = now;
    clock += seconds;

    // On slow devices, finish the piles straight away instead of stuttering.
    slowFrames = realSeconds > SLOW_FRAME_SECONDS ? slowFrames + 1 : Math.max(0, slowFrames - 1);
    if (slowFrames > 14) rushing = true;

    for (const pile of piles) {
      pour(pile, seconds);
      move(pile, seconds);
    }
    draw();

    if (piles.some((pile) => !pile.done) || airborneGrains() > 0) {
      frameId = requestAnimationFrame(frame);
      return;
    }

    frameId = 0;
    if (!pourFinished) finishPour();
  }

  function wake() {
    if (frameId) return;
    lastFrame = performance.now();
    frameId = requestAnimationFrame(frame);
  }

  // How far the top of the pile is from the bottom of the hero.
  function peakOf(pile: Pile) {
    let top = height;
    for (let offset = -30; offset <= 30; offset++) {
      const index = pile.column + offset;
      if (index >= 0 && index < columns) {
        top = Math.min(top, pile.floor[index] - pile.heights[index]);
      }
    }
    return height - top;
  }

  function finishPour() {
    pourFinished = true;
    onSettled(piles.map(peakOf));
    scheduleRollingGrains();
  }

  // Now and then a few grains slip down a pile, so the heaps never feel frozen.
  // The animation sleeps in between, and skips this while the hero is off screen.
  function scheduleRollingGrains() {
    idleTimer = window.setTimeout(() => {
      if (!document.hidden && canvas.getBoundingClientRect().bottom > 0) {
        const pile = pick(piles);
        const count = Math.floor(random(2, 5));
        for (let index = 0; index < count; index++) {
          const x = pile.x + random(-10, 10);
          const grain = makeGrain(x, surfaceAt(pile, x), pick(pile.kinds), true);
          grain.rolling = true;
          grain.vx = random(30, 80) * (Math.random() < 0.5 ? -1 : 1);
          pile.grains.push(grain);
        }
        wake();
      }
      scheduleRollingGrains();
    }, random(3200, 7000));
  }

  function pileUnder(x: number, y: number) {
    return [...backToFront].reverse().find((pile) => y >= surfaceAt(pile, x) - 36);
  }

  if (instant) {
    for (const pile of piles) {
      let guard = 0;
      while (pile.heights[pile.column] < pile.target * 0.98 && guard++ < 60000) {
        const fall = random(-1, 1) * random(0, 1);
        layDown(pile, makeGrain(pile.x + fall * grainSize * 2.4, 0, pick(pile.kinds), false));
      }
      pile.done = true;
    }
    draw();
    finishPour();
  } else {
    wake();
  }

  return {
    // Grains jump up under the cursor, like a hand running through a heap.
    stir(x, y, moveX) {
      if (!pourFinished || airborneGrains() > MAX_LOOSE_GRAINS) return;
      const pile = pileUnder(x, y);
      if (!pile) return;
      const count = Math.min(5, 1 + Math.floor(Math.abs(moveX) / 10));
      for (let index = 0; index < count; index++) {
        const startX = x + random(-16, 16);
        const grain = makeGrain(startX, surfaceAt(pile, startX), pick(pile.kinds), true);
        grain.vy = -random(170, 440);
        grain.vx = moveX * 2.6 + random(-70, 70);
        pile.grains.push(grain);
      }
      wake();
    },

    // A small extra pour onto one pile.
    pourOn(pileIndex) {
      const pile = piles[pileIndex];
      if (!pile || !pourFinished || airborneGrains() > MAX_LOOSE_GRAINS) return;
      const top = surfaceAt(pile, pile.x);
      for (let index = 0; index < 34; index++) {
        const grain = makeGrain(
          pile.x + random(-14, 14),
          top - random(130, 240),
          pick(pile.kinds),
          true,
        );
        grain.vy = random(0, 140);
        grain.vx = random(-16, 16);
        pile.grains.push(grain);
      }
      wake();
    },

    destroy() {
      cancelAnimationFrame(frameId);
      window.clearTimeout(idleTimer);
    },
  };
}

function kindsFromMix(mix: GrainPile["mix"]) {
  const kinds: GrainKind[] = [];
  for (const [kind, amount] of Object.entries(mix)) {
    for (let index = 0; index < (amount ?? 0); index++) kinds.push(kind as GrainKind);
  }
  return kinds;
}
