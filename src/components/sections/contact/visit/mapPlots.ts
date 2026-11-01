// The size of the drawing the map is laid out in. The SVG scales it to fit.
export const MAP_WIDTH = 800;
export const MAP_HEIGHT = 520;

export type MapPlot = {
  points: string;
  fill: string;
  // Draws faint crop rows over the plot.
  rows?: boolean;
};

const wheat = "#e4c06a";
const straw = "#efd99a";
const young = "#b5cb86";
const leafy = "#86ac63";
const soil = "#dcc59b";

// A patchwork of fields, left to right and top to bottom. The road runs along their edges.
export const mapPlots: MapPlot[] = [
  { points: "0,0 210,0 190,140 0,160", fill: wheat, rows: true },
  { points: "210,0 430,0 420,120 190,140", fill: young },
  { points: "430,0 640,0 650,110 420,120", fill: straw, rows: true },
  { points: "640,0 800,0 800,100 650,110", fill: leafy },
  { points: "0,160 190,140 180,300 0,330", fill: leafy, rows: true },
  { points: "190,140 420,120 410,255 180,300", fill: soil },
  { points: "420,120 650,110 640,230 410,255", fill: wheat, rows: true },
  { points: "650,110 800,100 800,195 640,230", fill: young },
  { points: "0,330 180,300 170,520 0,520", fill: straw },
  { points: "180,300 410,255 430,520 170,520", fill: young, rows: true },
  { points: "410,255 640,230 610,520 430,520", fill: wheat },
  { points: "640,230 800,195 800,520 610,520", fill: leafy, rows: true },
];

export const ROAD = "M-10 334C90 318 120 306 180 300S330 262 410 255 560 236 640 230 760 202 810 192";
export const RIVER = "M548 530C580 452 690 438 712 362S790 300 820 288";

// Where the pin stands, beside the road.
export const PIN = { x: 520, y: 228 };

// Small clumps of trees dotted between the fields.
export const trees = [
  { x: 196, y: 138, r: 13 },
  { x: 212, y: 150, r: 10 },
  { x: 655, y: 108, r: 12 },
  { x: 640, y: 120, r: 9 },
  { x: 176, y: 304, r: 11 },
  { x: 424, y: 470, r: 12 },
  { x: 440, y: 486, r: 9 },
  { x: 740, y: 470, r: 13 },
];
