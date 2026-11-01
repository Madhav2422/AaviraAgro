// The size of the drawing the sprouts are laid out in. The SVG scales it to fit.
export const SOIL_WIDTH = 1440;
export const SOIL_HEIGHT = 260;

export type Furrow = {
  // Where the furrow sits, from the top of the drawing.
  y: number;
  count: number;
  minHeight: number;
  maxHeight: number;
  // How big the leaves are, compared with the front furrow.
  leafScale: number;
  opacity: number;
};

// From the back of the field to the front. Back furrows sit higher and paler, so the field has depth.
export const furrows: Furrow[] = [
  { y: 170, count: 22, minHeight: 34, maxHeight: 56, leafScale: 0.6, opacity: 0.45 },
  { y: 205, count: 17, minHeight: 50, maxHeight: 80, leafScale: 0.8, opacity: 0.75 },
  { y: 245, count: 12, minHeight: 70, maxHeight: 115, leafScale: 1, opacity: 1 },
];

export type Sprout = {
  furrow: number;
  x: number;
  height: number;
  // How far the top leans sideways from the base.
  lean: number;
  // A second, smaller pair of leaves halfway up the stem.
  lowerLeaves: boolean;
  dropDelay: number;
  swaySeconds: number;
  swayDelay: number;
};

export type Pollen = {
  x: number;
  y: number;
  size: number;
  driftSeconds: number;
  driftDelay: number;
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

const random = seededRandom(11);

function createSprouts(): Sprout[] {
  const sprouts: Sprout[] = [];

  furrows.forEach((furrow, furrowIndex) => {
    const gap = SOIL_WIDTH / furrow.count;
    for (let i = 0; i < furrow.count; i++) {
      const x = gap * (i + 0.5) + (random() - 0.5) * gap * 0.6;
      sprouts.push({
        furrow: furrowIndex,
        x,
        height: furrow.minHeight + random() * (furrow.maxHeight - furrow.minHeight),
        lean: (random() - 0.5) * 18,
        lowerLeaves: random() > 0.45,
        // Seeds are sown from left to right, the way a farmer walks a furrow.
        dropDelay: 200 + (x / SOIL_WIDTH) * 1100 + furrowIndex * 160,
        swaySeconds: 2.8 + random() * 1.6,
        swayDelay: -random() * 4,
      });
    }
  });

  return sprouts;
}

function createPollen(): Pollen[] {
  return Array.from({ length: 18 }, () => ({
    x: random() * SOIL_WIDTH,
    y: 60 + random() * 160,
    size: 1.4 + random() * 2.2,
    driftSeconds: 7 + random() * 6,
    driftDelay: -random() * 12,
  }));
}

export const sprouts = createSprouts();
export const pollen = createPollen();
