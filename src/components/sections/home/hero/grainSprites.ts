// Real grains for the grain that pours onto each heap, cut one by one out of pictures of
// separate grains made to match the heap pictures. Each sheet in public/images/grains/kernels
// holds the grains in rows of 8 square cells of 64px, lying lengthways, and a typical grain
// is 50px long.

// chana is kabuli chana (white chickpeas) and dal is tuver dal (split pigeon peas).
export type GrainKind = "wheat" | "rice" | "chana" | "dal";

// `thickness` is how wide a grain still looks when it tumbles side on, as a share of its full
// width: a chickpea is round, so it looks the same from every side, while a flat piece of dal
// turns into a thin edge and then shows its other face.
type KernelSheet = { src: string; count: number; thickness: number };

const SHEETS: Record<GrainKind, KernelSheet> = {
  wheat: { src: "/images/grains/kernels/wheat.webp", count: 31, thickness: 0.75 },
  rice: { src: "/images/grains/kernels/rice.webp", count: 31, thickness: 0.8 },
  chana: { src: "/images/grains/kernels/kabuli-chana.webp", count: 28, thickness: 1 },
  dal: { src: "/images/grains/kernels/tuver-dal.webp", count: 32, thickness: 0.3 },
};
// Grains thinner than this are flat enough to show their back as they tumble.
const FLAT = 0.5;
const SHEET_CELL = 64;
const SHEET_COLUMNS = 8;
const SHEET_GRAIN_LENGTH = 50;

export type KernelSheets = Partial<Record<GrainKind, HTMLImageElement>>;

let sheetsLoading: Promise<KernelSheets> | null = null;

// Loads the grain sheets once. A sheet that fails to load is left out, and that heap simply
// rises without grain pouring onto it.
export function loadKernelSheets() {
  sheetsLoading ??= Promise.all(
    Object.entries(SHEETS).map(
      ([kind, sheet]) =>
        new Promise<[string, HTMLImageElement | null]>((resolve) => {
          const image = new Image();
          image.onload = () => resolve([kind, image]);
          image.onerror = () => resolve([kind, null]);
          image.src = sheet.src;
        }),
    ),
  ).then((loaded) => Object.fromEntries(loaded.filter(([, image]) => image !== null)));
  return sheetsLoading;
}

export type Kernels = {
  count: number;
  // Paints one grain centred on x, y (in canvas pixels), part way through its spin (`turn`)
  // and its tumble over its long side (`roll`), both counted in whole turns.
  paint: (
    target: CanvasRenderingContext2D,
    variant: number,
    turn: number,
    roll: number,
    x: number,
    y: number,
    alpha: number,
  ) => void;
};

// Cuts a sheet into single grains drawn at `length` canvas pixels long. Each gets a faint soft
// edge, so pale grains still show against the cream page.
export function makeKernels(kind: GrainKind, image: HTMLImageElement, length: number): Kernels {
  const { count, thickness } = SHEETS[kind];
  const scale = length / SHEET_GRAIN_LENGTH;
  const grainCell = Math.max(2, Math.ceil(SHEET_CELL * scale));
  const edge = Math.max(1, Math.ceil(length * 0.06));
  const cell = grainCell + edge * 2;

  const canvas = document.createElement("canvas");
  canvas.width = cell;
  canvas.height = cell * count;
  const ctx = canvas.getContext("2d");
  const grain = document.createElement("canvas");
  grain.width = cell;
  grain.height = cell;
  const grainCtx = grain.getContext("2d");

  if (ctx && grainCtx) {
    grainCtx.imageSmoothingQuality = "high";
    for (let index = 0; index < count; index++) {
      grainCtx.clearRect(0, 0, cell, cell);
      grainCtx.drawImage(
        image,
        (index % SHEET_COLUMNS) * SHEET_CELL,
        Math.floor(index / SHEET_COLUMNS) * SHEET_CELL,
        SHEET_CELL,
        SHEET_CELL,
        edge,
        edge,
        grainCell,
        grainCell,
      );
      ctx.save();
      ctx.shadowColor = "rgba(70, 48, 20, 0.4)";
      ctx.shadowBlur = edge;
      ctx.drawImage(grain, 0, index * cell);
      ctx.restore();
    }
  }

  return {
    count,
    paint(target, variant, turn, roll, x, y, alpha) {
      const angle = turn * Math.PI * 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      // Side on, a grain looks only as thin as it really is; a flat one then shows its back.
      const facing = Math.cos(roll * Math.PI * 2);
      const width = Math.max(thickness, Math.abs(facing));
      const squash = thickness < FLAT ? Math.sign(facing || 1) * width : width;
      target.globalAlpha = alpha;
      target.setTransform(cos, sin, -sin * squash, cos * squash, x, y);
      target.drawImage(canvas, 0, variant * cell, cell, cell, -cell / 2, -cell / 2, cell, cell);
      target.setTransform(1, 0, 0, 1, 0, 0);
      target.globalAlpha = 1;
    },
  };
}
