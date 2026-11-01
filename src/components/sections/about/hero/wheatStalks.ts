// The size of the drawing the wheat field is laid out in. The SVG scales it to fit.
export const FIELD_WIDTH = 1440;
export const FIELD_HEIGHT = 420;

export type WheatRow = {
  count: number;
  minHeight: number;
  maxHeight: number;
  // How big the ears are, compared with the middle row.
  earScale: number;
  stem: string;
  ear: string;
  opacity: number;
};

// From the back of the field to the front. Back rows are shorter and paler, so the field has depth.
// Keep each row's maxHeight plus its ear (about 100 times earScale) under FIELD_HEIGHT,
// or the tips of the tallest stalks get cut off at the top.
export const wheatRows: WheatRow[] = [
  {
    count: 44,
    minHeight: 140,
    maxHeight: 200,
    earScale: 0.8,
    stem: "#e4c06a",
    ear: "#e4c06a",
    opacity: 0.5,
  },
  {
    count: 34,
    minHeight: 180,
    maxHeight: 250,
    earScale: 1,
    stem: "#c99a3a",
    ear: "#d4a94a",
    opacity: 0.8,
  },
  {
    count: 24,
    minHeight: 220,
    maxHeight: 285,
    earScale: 1.25,
    stem: "#a67c1e",
    ear: "#b88a24",
    opacity: 1,
  },
];

export type WheatStalk = {
  row: number;
  x: number;
  height: number;
  // How far the top leans sideways from the base.
  bend: number;
  grainPairs: number;
  swaySeconds: number;
  swayDelay: number;
  growDelay: number;
};

// A small seeded random generator, so the server and the browser draw the same field.
function seededRandom(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createStalks(): WheatStalk[] {
  const random = seededRandom(7);
  const stalks: WheatStalk[] = [];

  wheatRows.forEach((row, rowIndex) => {
    const gap = FIELD_WIDTH / row.count;
    for (let i = 0; i < row.count; i++) {
      const x = gap * (i + 0.5) + (random() - 0.5) * gap * 0.8;
      stalks.push({
        row: rowIndex,
        x,
        height: row.minHeight + random() * (row.maxHeight - row.minHeight),
        bend: (random() - 0.5) * 40,
        grainPairs: 6 + Math.floor(random() * 3),
        swaySeconds: 2.6 + random() * 1.8,
        swayDelay: -random() * 4,
        // The field grows in from the middle outwards.
        growDelay: 150 + Math.abs(x / FIELD_WIDTH - 0.5) * 900 + rowIndex * 120,
      });
    }
  });

  return stalks;
}

export const wheatStalks = createStalks();
