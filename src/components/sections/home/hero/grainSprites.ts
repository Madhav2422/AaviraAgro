// Draws one small picture of every grain ahead of time, so the animation only
// has to copy these pictures instead of painting thousands of shapes each frame.

export const GRAIN_KINDS = [
  "wheat",
  "rice",
  "dal",
  "moong",
  "rajma",
  "coriander",
  "chilli",
  "pepper",
] as const;

export type GrainKind = (typeof GRAIN_KINDS)[number];

type GrainLook = {
  length: number;
  width: number;
  shape: "seed" | "round" | "bean" | "flake";
  colors: [light: string, mid: string, dark: string];
  mark?: "crease" | "eye" | "shine";
};

const LOOKS: Record<GrainKind, GrainLook> = {
  wheat: {
    length: 1,
    width: 0.54,
    shape: "seed",
    colors: ["#f0cf8e", "#cf9d4c", "#8f6126"],
    mark: "crease",
  },
  rice: {
    length: 1.24,
    width: 0.32,
    shape: "round",
    colors: ["#fffdf7", "#f3ebda", "#cdbd9b"],
  },
  dal: {
    length: 0.72,
    width: 0.62,
    shape: "round",
    colors: ["#f9ca6b", "#e59a2e", "#a65d18"],
  },
  moong: {
    length: 0.66,
    width: 0.46,
    shape: "seed",
    colors: ["#b9c45e", "#7f9238", "#4a5c21"],
    mark: "eye",
  },
  rajma: {
    length: 1.06,
    width: 0.58,
    shape: "bean",
    colors: ["#c9604f", "#8f2a2a", "#551618"],
    mark: "shine",
  },
  coriander: {
    length: 0.56,
    width: 0.52,
    shape: "round",
    colors: ["#e0c992", "#b89a5c", "#785d34"],
    mark: "crease",
  },
  chilli: {
    length: 0.92,
    width: 0.46,
    shape: "flake",
    colors: ["#d9694a", "#a8352a", "#6b1a14"],
  },
  pepper: {
    length: 0.46,
    width: 0.44,
    shape: "round",
    colors: ["#62513f", "#33281f", "#140e0a"],
    mark: "shine",
  },
};

export const ANGLES = 12;
const VARIANTS = 3;
const VARIANT_TONES = [0.93, 1, 1.05];
const VARIANT_SIZES = [0.9, 1, 1.1];

// From the shaded side of a pile to the side facing the light.
const SHADE_TONES = [0.6, 0.76, 0.91, 1.04, 1.16];

export const SHADE_LEVELS = SHADE_TONES.length;
export const SHADE_NEUTRAL = 2;

export type GrainAtlas = {
  canvas: HTMLCanvasElement;
  cell: number;
};

export function grainArea(kind: GrainKind, size: number) {
  const look = LOOKS[kind];
  return look.length * look.width * size * size * 0.78;
}

export function shadowColor(kind: GrainKind) {
  return toneColor(LOOKS[kind].colors[2], kind === "rice" ? 0.9 : 0.78);
}

export function spriteRow(kind: GrainKind, variant: number, shade: number) {
  const kindIndex = GRAIN_KINDS.indexOf(kind);
  return (kindIndex * VARIANTS + variant) * SHADE_TONES.length + shade;
}

export function randomVariant() {
  return Math.floor(Math.random() * VARIANTS);
}

export function buildGrainAtlas(size: number, pixelRatio: number): GrainAtlas {
  const unit = size * pixelRatio;
  const cell = Math.ceil(unit * 1.9);
  const rows = GRAIN_KINDS.length * VARIANTS * SHADE_TONES.length;

  const canvas = document.createElement("canvas");
  canvas.width = cell * ANGLES;
  canvas.height = cell * rows;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { canvas, cell };

  for (const kind of GRAIN_KINDS) {
    for (let variant = 0; variant < VARIANTS; variant++) {
      SHADE_TONES.forEach((shadeTone, shade) => {
        const row = spriteRow(kind, variant, shade);
        for (let angle = 0; angle < ANGLES; angle++) {
          drawGrain(
            ctx,
            LOOKS[kind],
            (angle + 0.5) * cell,
            (row + 0.5) * cell,
            unit * VARIANT_SIZES[variant],
            (angle / ANGLES) * 360,
            shadeTone * VARIANT_TONES[variant],
            variant,
          );
        }
      });
    }
  }

  return { canvas, cell };
}

function drawGrain(
  ctx: CanvasRenderingContext2D,
  look: GrainLook,
  x: number,
  y: number,
  unit: number,
  degrees: number,
  tone: number,
  variant: number,
) {
  const length = look.length * unit;
  const width = look.width * unit;
  const turn = new DOMMatrix().rotateSelf(degrees);
  const outline = new Path2D();
  outline.addPath(grainOutline(look, length, width, variant), turn);

  ctx.save();
  ctx.translate(x, y);

  // Contact shadow, so each grain seems to sit on the ones below it.
  ctx.save();
  ctx.translate(unit * 0.09, unit * 0.14);
  ctx.fillStyle = "rgba(34, 20, 6, 0.34)";
  ctx.fill(outline);
  ctx.restore();

  // The light always comes from the top left, whichever way the grain lies.
  const [light, mid, dark] = look.colors.map((c) => toneColor(c, tone));
  const body = ctx.createRadialGradient(
    -length * 0.16,
    -width * 0.32,
    unit * 0.02,
    0,
    0,
    Math.max(length, width) * 0.62,
  );
  body.addColorStop(0, light);
  body.addColorStop(0.55, mid);
  body.addColorStop(1, dark);
  ctx.fillStyle = body;
  ctx.fill(outline);

  if (look.mark === "crease" || look.mark === "eye") {
    const line = new Path2D();
    const reach = look.mark === "crease" ? 0.36 : 0.14;
    line.moveTo(-length * reach, 0);
    line.quadraticCurveTo(0, width * 0.1, length * reach, 0);
    const turned = new Path2D();
    turned.addPath(line, turn);
    ctx.strokeStyle =
      look.mark === "crease" ? "rgba(84, 50, 14, 0.5)" : "rgba(244, 246, 214, 0.7)";
    ctx.lineWidth = Math.max(0.6, unit * 0.05);
    ctx.lineCap = "round";
    ctx.stroke(turned);
  }

  if (look.mark === "shine") {
    ctx.fillStyle = "rgba(255, 244, 232, 0.4)";
    ctx.beginPath();
    ctx.ellipse(-length * 0.14, -width * 0.2, length * 0.13, width * 0.09, -0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function grainOutline(look: GrainLook, length: number, width: number, variant: number) {
  const a = length / 2;
  const b = width / 2;
  const path = new Path2D();

  if (look.shape === "round") {
    path.ellipse(0, 0, a, b, 0, 0, Math.PI * 2);
    return path;
  }

  if (look.shape === "bean") {
    path.moveTo(-a, 0);
    path.bezierCurveTo(-a * 0.9, -b * 1.5, a * 0.9, -b * 1.5, a, 0);
    path.bezierCurveTo(a * 0.95, b * 1.3, a * 0.25, b * 1.2, 0, b * 0.55);
    path.bezierCurveTo(-a * 0.25, b * 1.2, -a * 0.95, b * 1.3, -a, 0);
    return path;
  }

  if (look.shape === "flake") {
    const corners = [
      [-1, -0.3],
      [-0.35, -1],
      [0.5, -0.7],
      [1, -0.1],
      [0.6, 0.9],
      [-0.2, 0.7],
      [-0.85, 0.8],
    ];
    corners.forEach(([cx, cy], i) => {
      const wobble = 1 + 0.16 * Math.sin((i + 1) * (variant + 2));
      const px = cx * a * wobble;
      const py = cy * b * wobble;
      if (i === 0) path.moveTo(px, py);
      else path.lineTo(px, py);
    });
    path.closePath();
    return path;
  }

  path.moveTo(-a, 0);
  path.bezierCurveTo(-a * 0.7, -b * 1.32, a * 0.55, -b * 1.25, a, 0);
  path.bezierCurveTo(a * 0.55, b * 1.25, -a * 0.7, b * 1.32, -a, 0);
  path.closePath();
  return path;
}

function toneColor(hex: string, tone: number) {
  // Shadows lean warm, as they do on real grain, instead of turning grey.
  const warmth = Math.max(0, 1 - tone);
  const channel = (start: number, shift: number) => {
    const value = parseInt(hex.slice(start, start + 2), 16);
    return Math.max(0, Math.min(255, Math.round(value * (tone - warmth * shift))));
  };
  return `rgb(${channel(1, 0)}, ${channel(3, 0.1)}, ${channel(5, 0.38)})`;
}
