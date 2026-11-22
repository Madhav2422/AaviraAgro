import type { GrainKind } from "./grainSprites";

export const heroContent = {
  headline: {
    main: "Growing Value",
    accent: "Naturally.",
  },
  text: "We manufacture, process and supply wheat, rice, kabuli chana and tuver dal, so your business gets quality it can count on, season after season.",
  primaryButton: { label: "Get in Touch", href: "/contact" },
  secondaryButton: { label: "About Us", href: "/about" },
};

export type GrainPile = {
  label: string;
  // Add a link once the page exists, for example "/products", to make the tag clickable.
  href?: string;
  // The heap picture: cut out on a transparent background, cropped so its top edge is the
  // peak and its bottom edge the floor, 1000 x `imageHeight` pixels.
  image: string;
  imageHeight: number;
  // Where the peak is across the picture, from 0 (left) to 1 (right).
  peak: number;
  // The grain that pours onto it, and how long one grain is as a share of the heap's width.
  kind: GrainKind;
  grainLength: number;
  // Where the heap sits across the page: 0 is the left edge, 1 is the right edge.
  position: number;
  // How big the heap is: 1 is the biggest allowed.
  size: number;
  // Heaps with a bigger depth sit in front of the others, and the ones behind sit a little
  // higher up, as if further away.
  depth: number;
};

// Add, remove or reorder the heaps here. The pictures are in public/images/grains/heaps.
export const grainPiles: GrainPile[] = [
  {
    label: "Wheat",
    image: "/images/grains/heaps/wheat.webp",
    imageHeight: 550,
    peak: 0.485,
    kind: "wheat",
    grainLength: 0.03,
    position: 0.125,
    size: 0.96,
    depth: 2,
  },
  {
    label: "Rice",
    image: "/images/grains/heaps/rice.webp",
    imageHeight: 554,
    peak: 0.496,
    kind: "rice",
    grainLength: 0.045,
    position: 0.375,
    size: 1,
    depth: 1,
  },
  {
    label: "Kabuli Chana",
    image: "/images/grains/heaps/kabuli-chana.webp",
    imageHeight: 570,
    peak: 0.487,
    kind: "chana",
    grainLength: 0.045,
    position: 0.625,
    size: 0.96,
    depth: 3,
  },
  {
    label: "Tuver Dal",
    image: "/images/grains/heaps/tuver-dal.webp",
    imageHeight: 556,
    peak: 0.493,
    kind: "dal",
    grainLength: 0.03,
    position: 0.875,
    size: 0.94,
    depth: 0,
  },
];
