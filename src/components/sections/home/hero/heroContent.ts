import type { GrainKind } from "./grainSprites";

export const heroContent = {
  headline: {
    main: "Growing Value",
    accent: "Naturally.",
  },
  text: "We manufacture, process and supply wheat, rice, pulses and spices, so your business gets quality it can count on, season after season.",
  primaryButton: { label: "Get in Touch", href: "/contact" },
  secondaryButton: { label: "About Us", href: "/about" },
};

export type GrainPile = {
  label: string;
  // Add a link once the page exists, for example "/products", to make the tag clickable.
  href?: string;
  // Where the pile sits across the page: 0 is the left edge, 1 is the right edge.
  position: number;
  // How tall the pile grows: 1 is the tallest allowed.
  height: number;
  // Piles with a bigger depth sit in front of the others.
  depth: number;
  // Which grains are in the pile, and how much of each.
  mix: Partial<Record<GrainKind, number>>;
};

// Add, remove or reorder the grain piles here.
export const grainPiles: GrainPile[] = [
  {
    label: "Wheat",
    position: 0.13,
    height: 0.9,
    depth: 2,
    mix: { wheat: 1 },
  },
  {
    label: "Rice",
    position: 0.38,
    height: 1,
    depth: 1,
    mix: { rice: 1 },
  },
  {
    label: "Pulses",
    position: 0.61,
    height: 0.86,
    depth: 3,
    mix: { dal: 6, moong: 3, rajma: 2 },
  },
  {
    label: "Spices",
    position: 0.9,
    height: 0.76,
    depth: 0,
    mix: { coriander: 7, chilli: 3, pepper: 2 },
  },
];
