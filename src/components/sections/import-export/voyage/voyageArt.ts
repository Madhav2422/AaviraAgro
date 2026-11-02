// The drawn parts of the harbour: the ship, containers, gantry, trucks and people.
// Everything is drawn in one set of units with the waterline at y = 0, so up is negative.

import type { Cargo } from "../cargo";

export const CONTAINER_W = 130;
export const CONTAINER_H = 58;
export const QUAY_Y = -64;
export const DOCK_X = 260;
export const GIRDER_BOTTOM = -652;
export const BAYS = [-340, -190, -40, 110, 260, 410];

const DECK_Y = -158;
const TRUCK_BED = 34;

// The white block at the back holds the crew's cabins, with the bridge on top where the
// ship is steered. Three floors keep it in proportion with the cargo.
const BRIDGE_LEVELS = 3;
const BRIDGE_LEVEL = 46;
const BRIDGE_TOP = DECK_Y - BRIDGE_LEVELS * BRIDGE_LEVEL;
export const FUNNEL_TOP = BRIDGE_TOP - 96;

// The deckhand's spot near the bow, and the hatch he uses to go below deck.
export const BOW_POST = 668;
export const BOW_HATCH = 632;

export const truckBedTop = -TRUCK_BED - CONTAINER_H;

// The top edge of a container sitting in this tier on the ship.
export const cargoTop = (tier: number) => DECK_Y - (tier + 1) * CONTAINER_H;

export const INK = "#101e16";
const INK_SOFT = "#1d3528";
export const CREAM = "#f5ecd8";
export const GOLD = "#e2ad45";
const GOLD_DEEP = "#b98a2c";
const RUST = "#b4532a";
const RUST_DEEP = "#7f3a1d";

// Older containers, kept duller so the named cargo stands out against them.
const STOCK_PAINTS = ["#47604f", "#6e4d38", "#83704a", "#3a5a5f", "#5f3d30", "#55643f", "#39503f"];

export type Fonts = {
  // The logo font, for the name on the ship and the gantry.
  name: string;
  // The plain font, for lettering on the containers.
  plain: string;
};

export function drawContainer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  paint: string,
  cargo?: Cargo,
  fonts?: Fonts,
) {
  ctx.fillStyle = paint;
  ctx.fillRect(x, y, CONTAINER_W, CONTAINER_H);

  // The ribs pressed into the steel.
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  for (let rib = 8; rib < CONTAINER_W - 6; rib += 7) ctx.fillRect(x + rib, y + 4, 2.6, CONTAINER_H - 8);

  ctx.fillStyle = "rgba(0, 0, 0, 0.26)";
  ctx.fillRect(x, y, CONTAINER_W, 3);
  ctx.fillRect(x, y + CONTAINER_H - 3, CONTAINER_W, 3);
  ctx.fillRect(x, y, 3.5, CONTAINER_H);
  ctx.fillRect(x + CONTAINER_W - 3.5, y, 3.5, CONTAINER_H);

  if (!cargo || !fonts) return;

  const size = cargo.mark.length > 9 ? 12.5 : cargo.mark.length > 5 ? 19 : 25;
  ctx.fillStyle = cargo.letters;
  ctx.font = `800 ${size}px ${fonts.plain}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(cargo.mark, x + CONTAINER_W / 2, y + CONTAINER_H / 2 - 4);
  ctx.font = `700 7.5px ${fonts.name}`;
  ctx.fillText("AVVIRA", x + CONTAINER_W / 2, y + CONTAINER_H - 12);
}

// A dull stack of older containers, with the colours picked from its position.
export function drawStack(
  ctx: CanvasRenderingContext2D,
  x: number,
  ground: number,
  tiers: number,
  seed: number,
) {
  for (let tier = 0; tier < tiers; tier++) {
    const paint = STOCK_PAINTS[(seed * 3 + tier * 5) % STOCK_PAINTS.length];
    drawContainer(ctx, x, ground - (tier + 1) * CONTAINER_H, paint);
  }
}

type ShipOptions = {
  fonts: Fonts;
  cargo: Cargo[];
  // How many named containers are on board.
  loaded: number;
  time: number;
  // 0 by day, 1 at night, when the ship goes dark and its windows light up.
  night?: number;
};

function hullOutline(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.moveTo(-672, DECK_Y);
  ctx.lineTo(548, DECK_Y);
  ctx.quadraticCurveTo(566, DECK_Y, 582, DECK_Y - 40);
  ctx.lineTo(700, DECK_Y - 54);
  ctx.quadraticCurveTo(648, -90, 620, 34);
  ctx.lineTo(-640, 34);
  ctx.quadraticCurveTo(-664, -60, -672, DECK_Y);
  ctx.closePath();
}

function drawHull(ctx: CanvasRenderingContext2D, fonts: Fonts) {
  hullOutline(ctx);
  ctx.fillStyle = INK;
  ctx.fill();

  ctx.save();
  hullOutline(ctx);
  ctx.clip();

  // The red below the waterline, and the bright line above it.
  ctx.fillStyle = RUST;
  ctx.fillRect(-720, -30, 1460, 70);
  ctx.fillStyle = RUST_DEEP;
  ctx.fillRect(-720, -12, 1460, 50);
  ctx.fillStyle = CREAM;
  ctx.fillRect(-720, -33, 1460, 3);

  // A band along the deck edge, then the fine lines of the steel plates.
  ctx.fillStyle = INK_SOFT;
  ctx.fillRect(-720, DECK_Y - 60, 1460, 72);
  ctx.strokeStyle = "rgba(245, 236, 216, 0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (const y of [-58, -88, -118]) {
    ctx.moveTo(-720, y);
    ctx.lineTo(740, y);
  }
  for (let x = -660; x < 720; x += 62) {
    ctx.moveTo(x, DECK_Y + 12);
    ctx.lineTo(x, -33);
  }
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = CREAM;
  ctx.font = `700 40px ${fonts.name}`;
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText("AVVIRA", 590, -92);

  // The anchor resting by the bow.
  ctx.strokeStyle = CREAM;
  ctx.lineWidth = 2.4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(628, -150, 7, 0, Math.PI);
  ctx.moveTo(628, -143);
  ctx.lineTo(628, -158);
  ctx.stroke();
}

function drawBridge(ctx: CanvasRenderingContext2D, time: number, night: number) {
  const left = -640;
  const width = 192;
  const levels = BRIDGE_LEVELS;
  const level = BRIDGE_LEVEL;
  const top = BRIDGE_TOP;

  // The funnel stands behind the decks.
  ctx.fillStyle = GOLD;
  ctx.fillRect(left + 14, top - 96, 62, 110);
  ctx.fillStyle = INK;
  ctx.fillRect(left + 14, top - 96, 62, 16);
  ctx.fillStyle = RUST;
  ctx.fillRect(left + 14, top - 70, 62, 9);

  ctx.fillStyle = CREAM;
  ctx.fillRect(left, top, width, levels * level);
  ctx.fillStyle = "rgba(20, 38, 27, 0.09)";
  ctx.fillRect(left + width - 46, top, 46, levels * level);

  // At night the decks fall into shadow.
  ctx.fillStyle = `rgba(14, 26, 34, ${night * 0.72})`;
  ctx.fillRect(left, top, width, levels * level);

  for (let row = 0; row < levels; row++) {
    const y = top + row * level;
    ctx.fillStyle = "rgba(20, 38, 27, 0.16)";
    ctx.fillRect(left, y + level - 2, width, 2);
    for (let window = 0; window < 7; window++) {
      // Most cabins light up after dark, but never all of them.
      const lit = (row * 3 + window * 5) % 4 !== 0;
      ctx.fillStyle = lit && night > 0.4 ? `rgba(248, 208, 120, ${night})` : INK;
      ctx.fillRect(left + 14 + window * 25, y + 16, 13, 12);
    }
  }

  // The bridge sits on top, a little wider than the decks below it.
  ctx.fillStyle = CREAM;
  ctx.fillRect(left - 14, top - 44, width + 28, 44);
  ctx.fillStyle = `rgba(14, 26, 34, ${night * 0.72})`;
  ctx.fillRect(left - 14, top - 44, width + 28, 44);
  ctx.fillStyle = night > 0.4 ? `rgba(248, 208, 120, ${night})` : INK;
  ctx.fillRect(left - 6, top - 33, width + 12, 17);
  ctx.fillStyle = GOLD;
  ctx.fillRect(left - 18, top - 48, width + 36, 6);
  ctx.strokeStyle = "rgba(245, 236, 216, 0.5)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let pane = 1; pane < 14; pane++) {
    ctx.moveTo(left - 6 + pane * 14.6, top - 33);
    ctx.lineTo(left - 6 + pane * 14.6, top - 16);
  }
  ctx.stroke();

  // The mast, tapering up to a thin aerial, with a radar scanner that turns slowly.
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.moveTo(left + 112, top - 48);
  ctx.lineTo(left + 136, top - 48);
  ctx.lineTo(left + 126, top - 104);
  ctx.lineTo(left + 122, top - 104);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(left + 123, top - 132, 2, 30);
  const sweep = Math.abs(Math.cos(time * 1.4)) * 19 + 2;
  ctx.fillRect(left + 124 - sweep, top - 78, sweep * 2, 5);

  // A lifeboat on the side of the decks.
  ctx.fillStyle = RUST;
  ctx.beginPath();
  ctx.roundRect(left + width - 4, DECK_Y - 92, 66, 19, 9);
  ctx.fill();
}

// Draws the ship with its middle at (0, 0). Move the canvas first to place it.
export function drawShip(
  ctx: CanvasRenderingContext2D,
  { fonts, cargo, loaded, time, night = 0 }: ShipOptions,
) {
  drawBridge(ctx, time, night);

  // The cargo falls into shadow after dark.
  const shadeStack = (x: number, top: number) => {
    if (night <= 0) return;
    ctx.fillStyle = `rgba(10, 20, 30, ${night * 0.62})`;
    ctx.fillRect(x, top, CONTAINER_W, DECK_Y - top);
  };

  BAYS.forEach((bay, index) => {
    const x = bay - CONTAINER_W / 2;
    drawStack(ctx, x, DECK_Y, 2, index + 2);
    if (index < loaded) drawContainer(ctx, x, cargoTop(2), cargo[index].paint, cargo[index], fonts);
    shadeStack(x, index < loaded ? cargoTop(2) : cargoTop(1));
  });

  // One more bay of older containers towards the bow, kept lower.
  drawStack(ctx, 485, DECK_Y, 1, 3);
  shadeStack(485, cargoTop(0));

  drawHull(ctx, fonts);
  drawHatch(ctx);

  // The navigation lights: red on the bow, white high on the mast.
  if (night > 0) {
    ctx.fillStyle = `rgba(232, 74, 58, ${night})`;
    ctx.beginPath();
    ctx.arc(676, DECK_Y - 62, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(250, 240, 214, ${night * (0.6 + Math.sin(time * 3) * 0.4)})`;
    ctx.beginPath();
    ctx.arc(-516, BRIDGE_TOP - 134, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

// The top of the bow, which rises gently towards the tip.
const bowDeck = (x: number) => DECK_Y - 40 - ((x - 582) * 14) / 118;

function drawHatch(ctx: CanvasRenderingContext2D) {
  const top = bowDeck(BOW_HATCH) - 15;
  ctx.fillStyle = INK_SOFT;
  ctx.fillRect(BOW_HATCH - 12, top, 24, 17);
  ctx.fillStyle = GOLD;
  ctx.fillRect(BOW_HATCH - 14, top - 3, 28, 3);
}

type DeckhandPose = {
  x: number;
  // 0 standing on deck, 1 gone down through the hatch.
  sink: number;
  wave: number;
  walking: boolean;
};

// Draws the deckhand on the bow. Call it after drawShip, in the same place.
export function drawDeckhand(
  ctx: CanvasRenderingContext2D,
  { x, sink, wave, walking }: DeckhandPose,
  time: number,
) {
  if (sink >= 1) return;
  const deck = bowDeck(BOW_HATCH);

  // Anything below the deck is hidden, so he climbs down out of sight.
  ctx.save();
  ctx.beginPath();
  ctx.rect(x - 40, deck - 120, 80, 120);
  ctx.clip();
  drawPerson(ctx, x, bowDeck(x) + sink * 56, { step: walking ? x * 0.4 : undefined, wave, vest: GOLD }, time);
  ctx.restore();

  // The hatch is drawn again in front of him, so he steps into it.
  drawHatch(ctx);
}

function drawLeg(ctx: CanvasRenderingContext2D, x: number) {
  const top = GIRDER_BOTTOM + 2;
  const foot = QUAY_Y - 14;

  ctx.fillStyle = GOLD;
  ctx.beginPath();
  ctx.moveTo(x - 30, top);
  ctx.lineTo(x + 30, top);
  ctx.lineTo(x + 96, foot);
  ctx.lineTo(x + 62, foot);
  ctx.lineTo(x, top + 120);
  ctx.lineTo(x - 62, foot);
  ctx.lineTo(x - 96, foot);
  ctx.closePath();
  ctx.fill();

  // Shade on the side away from the light.
  ctx.fillStyle = GOLD_DEEP;
  ctx.beginPath();
  ctx.moveTo(x + 30, top);
  ctx.lineTo(x + 96, foot);
  ctx.lineTo(x + 78, foot);
  ctx.lineTo(x + 12, top + 60);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = GOLD_DEEP;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(x - 46, top + 330);
  ctx.lineTo(x + 46, top + 330);
  ctx.moveTo(x - 24, top + 210);
  ctx.lineTo(x + 24, top + 210);
  ctx.stroke();

  // The wheels it rolls on, along the rail on the quay.
  ctx.fillStyle = INK;
  ctx.fillRect(x - 108, foot, 216, 8);
  for (const wheel of [-92, -60, 60, 92]) {
    ctx.beginPath();
    ctx.arc(x + wheel, foot + 10, 7, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawGantry(ctx: CanvasRenderingContext2D, fonts: Fonts) {
  drawLeg(ctx, -960);
  drawLeg(ctx, 960);

  const left = -1030;
  const width = 2060;
  const height = 92;
  const top = GIRDER_BOTTOM - height;

  ctx.fillStyle = GOLD;
  ctx.fillRect(left, top, width, height);
  ctx.fillStyle = GOLD_DEEP;
  ctx.fillRect(left, GIRDER_BOTTOM - 10, width, 10);
  ctx.fillRect(left, top, width, 5);

  // The fine diagonal bracing along the girder.
  ctx.strokeStyle = "rgba(127, 90, 20, 0.28)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = left + 20; x < left + width - 60; x += 80) {
    ctx.moveTo(x, GIRDER_BOTTOM - 10);
    ctx.lineTo(x + 40, top + 5);
    ctx.lineTo(x + 80, GIRDER_BOTTOM - 10);
  }
  ctx.stroke();

  // The name, painted huge across the girder like a shipyard's.
  ctx.fillStyle = INK;
  ctx.font = `900 66px ${fonts.name}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("A V V I R A", 0, top + height / 2 + 2);

  // A small machine house on the very top.
  ctx.fillStyle = INK;
  ctx.fillRect(-720, top - 40, 150, 40);
  ctx.fillStyle = GOLD;
  ctx.fillRect(-700, top - 28, 34, 12);
  ctx.fillRect(-650, top - 28, 34, 12);
}

export function drawTrolley(
  ctx: CanvasRenderingContext2D,
  x: number,
  hookY: number,
  sway: number,
) {
  const top = GIRDER_BOTTOM;

  ctx.fillStyle = INK;
  ctx.fillRect(x - 52, top, 104, 30);
  ctx.fillStyle = GOLD;
  ctx.fillRect(x - 40, top + 9, 30, 12);
  ctx.fillRect(x + 10, top + 9, 30, 12);
  for (const wheel of [-40, 40]) {
    ctx.beginPath();
    ctx.fillStyle = INK_SOFT;
    ctx.arc(x + wheel, top, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  for (const side of [-34, 34]) {
    ctx.moveTo(x + side, top + 30);
    ctx.lineTo(x + side * 1.3 + sway, hookY - 8);
  }
  ctx.stroke();

  // The frame that locks onto the top of a container.
  ctx.fillStyle = INK;
  ctx.fillRect(x + sway - CONTAINER_W / 2, hookY - 10, CONTAINER_W, 10);
  ctx.fillStyle = GOLD;
  ctx.fillRect(x + sway - 26, hookY - 15, 52, 6);
}

export function drawTruck(
  ctx: CanvasRenderingContext2D,
  x: number,
  ground: number,
  load: Cargo | undefined,
  fonts: Fonts,
  time: number,
) {
  const bed = ground - TRUCK_BED;

  ctx.fillStyle = INK;
  ctx.fillRect(x - 76, bed, 158, 9);

  // The cab, just ahead of the load.
  ctx.fillStyle = RUST;
  ctx.beginPath();
  ctx.moveTo(x + 86, bed + 16);
  ctx.lineTo(x + 86, bed - 40);
  ctx.lineTo(x + 124, bed - 40);
  ctx.lineTo(x + 146, bed - 12);
  ctx.lineTo(x + 150, bed + 16);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = CREAM;
  ctx.beginPath();
  ctx.moveTo(x + 112, bed - 33);
  ctx.lineTo(x + 124, bed - 33);
  ctx.lineTo(x + 138, bed - 14);
  ctx.lineTo(x + 112, bed - 14);
  ctx.closePath();
  ctx.fill();

  const spin = time * 6;
  for (const wheel of [-52, -24, 118]) {
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.arc(x + wheel, ground - 12, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#6c7a70";
    ctx.beginPath();
    ctx.arc(x + wheel + Math.cos(spin) * 2, ground - 12 + Math.sin(spin) * 2, 3.6, 0, Math.PI * 2);
    ctx.fill();
  }

  if (load) drawContainer(ctx, x - CONTAINER_W / 2, bed - CONTAINER_H, load.paint, load, fonts);
}

type PersonOptions = {
  // Set while walking, and the legs swing with it. Left out, the person stands with feet apart.
  step?: number;
  // 0 is arms down, 1 is one arm waving high.
  wave?: number;
  vest?: string;
};

export function drawPerson(
  ctx: CanvasRenderingContext2D,
  x: number,
  ground: number,
  { step, wave = 0, vest = RUST }: PersonOptions,
  time: number,
) {
  const swing = step === undefined ? 3.4 : Math.sin(step) * 6;

  ctx.strokeStyle = INK;
  ctx.lineCap = "round";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x, ground - 16);
  ctx.lineTo(x - swing, ground);
  ctx.moveTo(x, ground - 16);
  ctx.lineTo(x + swing, ground);
  ctx.stroke();

  ctx.fillStyle = vest;
  ctx.beginPath();
  ctx.roundRect(x - 5.5, ground - 33, 11, 19, 3);
  ctx.fill();
  ctx.fillStyle = CREAM;
  ctx.fillRect(x - 5.5, ground - 25, 11, 2);

  ctx.strokeStyle = vest;
  ctx.lineWidth = 3.4;
  ctx.beginPath();
  ctx.moveTo(x - 5, ground - 31);
  ctx.lineTo(x - 7, ground - 18);
  ctx.moveTo(x + 5, ground - 31);
  const raised = Math.sin(time * 7) * 0.45;
  const angle = -Math.PI / 2 + (1 - wave) * 2.6 + wave * raised;
  ctx.lineTo(x + 5 + Math.cos(angle) * 15, ground - 31 + Math.sin(angle) * 15);
  ctx.stroke();

  ctx.fillStyle = "#c98f63";
  ctx.beginPath();
  ctx.arc(x, ground - 38, 4.6, 0, Math.PI * 2);
  ctx.fill();

  // The hard hat.
  ctx.fillStyle = GOLD;
  ctx.beginPath();
  ctx.arc(x, ground - 39.5, 5.4, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(x - 6.8, ground - 40.4, 13.6, 1.8);
}
