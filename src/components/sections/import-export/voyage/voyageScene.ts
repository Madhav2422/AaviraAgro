// Paints one frame of the voyage: the sky for that time of day, the harbour, the ship and the sea.
// A frame depends only on the scroll position and the clock, so it can be drawn in any order.

import { cargoOnShip } from "../cargo";
import {
  CONTAINER_W,
  CREAM,
  BOW_HATCH,
  BOW_POST,
  DOCK_X,
  FUNNEL_TOP,
  GOLD,
  INK,
  QUAY_Y,
  drawContainer,
  drawDeckhand,
  drawGantry,
  drawPerson,
  drawShip,
  drawStack,
  drawTrolley,
  drawTruck,
  type Fonts,
} from "./voyageArt";
import { EMBLEM_BOX, EMBLEM_PATH } from "./emblemPath";
import { TRAVEL, between, lerp, smooth, timelineAt } from "./voyageTimeline";

type Color = [number, number, number];

type SkyStop = {
  at: number;
  top: Color;
  middle: Color;
  low: Color;
  far: Color;
};

// The day passes as the ship sails: a golden morning, sunset, night and a new dawn.
const SKY: SkyStop[] = [
  { at: 0, top: [247, 241, 228], middle: [246, 231, 196], low: [240, 201, 132], far: [66, 124, 104] },
  { at: 0.6, top: [246, 238, 220], middle: [244, 221, 170], low: [236, 178, 104], far: [62, 116, 96] },
  { at: 0.7, top: [229, 174, 118], middle: [240, 150, 84], low: [246, 176, 88], far: [168, 104, 62] },
  { at: 0.76, top: [92, 58, 74], middle: [204, 88, 62], low: [248, 150, 72], far: [124, 66, 54] },
  { at: 0.79, top: [26, 34, 54], middle: [84, 50, 70], low: [186, 82, 60], far: [58, 44, 54] },
  { at: 0.83, top: [10, 20, 30], middle: [14, 30, 40], low: [30, 52, 58], far: [18, 44, 48] },
  { at: 0.89, top: [10, 20, 26], middle: [18, 36, 42], low: [40, 62, 62], far: [22, 52, 52] },
  { at: 0.93, top: [104, 112, 132], middle: [236, 164, 128], low: [250, 198, 132], far: [122, 124, 108] },
  { at: 1, top: [247, 241, 228], middle: [247, 230, 190], low: [240, 192, 120], far: [66, 124, 104] },
];

const mix = (from: Color, to: Color, amount: number): Color => [
  lerp(from[0], to[0], amount),
  lerp(from[1], to[1], amount),
  lerp(from[2], to[2], amount),
];

const css = ([red, green, blue]: Color, alpha = 1) =>
  `rgba(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)}, ${alpha})`;

function skyAt(progress: number) {
  let index = 0;
  while (index < SKY.length - 2 && progress > SKY[index + 1].at) index++;
  const from = SKY[index];
  const to = SKY[index + 1];
  const amount = between(progress, from.at, to.at);
  return {
    top: mix(from.top, to.top, amount),
    middle: mix(from.middle, to.middle, amount),
    low: mix(from.low, to.low, amount),
    far: mix(from.far, to.far, amount),
  };
}

// Numbers that look random but stay the same every frame.
const scatter = (index: number, salt: number) => {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

const wrap = (value: number, size: number) => ((value % size) + size) % size;

type Camera = {
  x: number;
  scale: number;
  // Where the waterline sits on the screen.
  water: number;
};

type Frame = {
  width: number;
  height: number;
  pixelRatio: number;
  progress: number;
  time: number;
  fonts: Fonts;
  // How far down the screen the opening words reach, so the harbour can sit below them.
  wordsEnd: number;
};

// The gantry's height, from the water to the top of the girder.
const SCENE_TOP = 760;
const LIGHTHOUSE_X = 5600;

function cameraAt(
  progress: number,
  width: number,
  height: number,
  focusX: number,
  shipX: number,
  wordsEnd: number,
): Camera {
  const portrait = width < height * 0.9;
  const fit = (spanX: number, spanY: number) => Math.min(width / spanX, height / spanY);

  const openingWater = height * 0.88;
  const wide = Math.min(width / 2250, (openingWater - wordsEnd - 18) / SCENE_TOP);
  const close = fit(portrait ? 760 : 1960, portrait ? 1180 : 1040);
  const sailing = fit(portrait ? 1560 : 2100, 1000);

  const pushIn = smooth(between(progress, 0.005, 0.08));
  const leave = smooth(between(progress, 0.57, 0.68));
  const land = smooth(between(progress, 0.9, 0.97));

  const near = lerp(wide, close, pushIn);
  const scale = lerp(lerp(near, sailing, leave), fit(portrait ? 1900 : 2500, 1100), land);

  // On a tall phone the camera has to follow the work, since it cannot show it all at once.
  const follow = portrait ? 0.86 : 0.08;
  const working = lerp(-30, lerp(40, focusX, follow), pushIn);
  const x = lerp(working, shipX + (portrait ? 30 : 110), leave);

  const water = lerp(lerp(0.88, portrait ? 0.69 : 0.76, pushIn), portrait ? 0.66 : 0.72, leave);
  return { x, scale, water: height * water };
}

function drawSky(ctx: CanvasRenderingContext2D, frame: Frame, sky: ReturnType<typeof skyAt>, horizon: number) {
  const { width, height } = frame;
  const gradient = ctx.createLinearGradient(0, 0, 0, horizon);
  gradient.addColorStop(0, css(sky.top));
  gradient.addColorStop(0.62, css(sky.middle));
  gradient.addColorStop(1, css(sky.low));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function sunAt(progress: number, width: number, horizon: number, size: number) {
  const radius = size * 0.2;
  const path: [number, number, number, number][] = [
    // progress, across the screen, height above the horizon, size
    [0, 0.5, radius * 0.72, 1],
    [0.3, 0.62, horizon * 0.62, 0.72],
    [0.6, 0.68, horizon * 0.44, 0.8],
    [0.71, 0.74, radius * 0.72, 1],
    [0.78, 0.76, -radius * 1.2, 1],
    [0.9, 0.62, -radius * 1.2, 1],
    [1, 0.6, radius * 0.86, 1],
  ];

  let index = 0;
  while (index < path.length - 2 && progress > path[index + 1][0]) index++;
  const from = path[index];
  const to = path[index + 1];
  const amount = smooth(between(progress, from[0], to[0]));
  return {
    x: width * lerp(from[1], to[1], amount),
    y: horizon - lerp(from[2], to[2], amount),
    radius: radius * lerp(from[3], to[3], amount),
  };
}

// The Avvira emblem shines in place of the sun, as wide as the sun was.
const EMBLEM_SPAN = 2;
// Room around the emblem's outline for the line drawn along its edge, in the outline's units.
const EMBLEM_MARGIN = 1;

type EmblemPictures = { width: number; morning: HTMLCanvasElement; sunset: HTMLCanvasElement };
let emblemPictures: EmblemPictures | null = null;

// The emblem's outline is slow to paint, so it is painted once into two pictures, one in
// morning colours and one in sunset colours, and only again when the screen size changes.
function emblemPicturesAt(width: number) {
  if (emblemPictures?.width === width) return emblemPictures;

  const outline = new Path2D(EMBLEM_PATH);
  const scale = width / EMBLEM_BOX.width;
  const fade = (art: CanvasRenderingContext2D, top: Color, bottom: Color) => {
    const gradient = art.createLinearGradient(0, EMBLEM_BOX.y, 0, EMBLEM_BOX.y + EMBLEM_BOX.height);
    gradient.addColorStop(0, css(top));
    gradient.addColorStop(1, css(bottom));
    return gradient;
  };
  const paint = (top: Color, bottom: Color, lineTop: Color, lineBottom: Color) => {
    const picture = document.createElement("canvas");
    picture.width = Math.ceil((EMBLEM_BOX.width + EMBLEM_MARGIN * 2) * scale);
    picture.height = Math.ceil((EMBLEM_BOX.height + EMBLEM_MARGIN * 2) * scale);
    const art = picture.getContext("2d");
    if (!art) return picture;
    art.scale(scale, scale);
    art.translate(EMBLEM_MARGIN - EMBLEM_BOX.x, EMBLEM_MARGIN - EMBLEM_BOX.y);
    // A deeper gold picks out the lines inside the emblem, and its edge. It stays soft at the
    // top, where the heading sits over the emblem.
    art.strokeStyle = fade(art, lineTop, lineBottom);
    art.lineWidth = 1.1;
    art.lineJoin = "round";
    art.stroke(outline);
    art.fillStyle = fade(art, top, bottom);
    art.fill(outline, "evenodd");
    return picture;
  };

  emblemPictures = {
    width,
    morning: paint([248, 228, 170], [228, 170, 66], [230, 196, 124], [196, 136, 46]),
    sunset: paint([244, 164, 84], [214, 92, 46], [226, 138, 70], [178, 70, 34]),
  };
  return emblemPictures;
}

function drawSun(ctx: CanvasRenderingContext2D, frame: Frame, horizon: number) {
  const { width, height, progress, time, pixelRatio } = frame;
  const size = Math.min(Math.max(width, height * 0.9), height * 1.5);
  const sun = sunAt(progress, width, horizon, size);
  const night = between(progress, 0.76, 0.81) * (1 - between(progress, 0.9, 0.94));
  const strength = 1 - night;
  if (strength <= 0) return;

  const warmth = between(progress, 0.64, 0.76) * (1 - between(progress, 0.9, 1));

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, width, horizon);
  ctx.clip();

  const glow = ctx.createRadialGradient(sun.x, sun.y, sun.radius * 0.5, sun.x, sun.y, sun.radius * 3.8);
  glow.addColorStop(0, `rgba(240, 180, 90, ${0.42 * strength})`);
  glow.addColorStop(1, "rgba(240, 180, 90, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, horizon);

  // The fine rays, the same ones that rise behind the name in the footer.
  const reach = sun.radius * 5;
  const rays = ctx.createRadialGradient(sun.x, sun.y, sun.radius, sun.x, sun.y, reach);
  rays.addColorStop(0, `rgba(190, 132, 40, ${0.3 * strength})`);
  rays.addColorStop(1, "rgba(190, 132, 40, 0)");
  ctx.strokeStyle = rays;
  ctx.lineWidth = Math.max(1, size * 0.0014);
  ctx.beginPath();
  const turn = progress * 1.3 + time * 0.012;
  for (let ray = 0; ray < 72; ray++) {
    const angle = turn + (ray / 72) * Math.PI * 2;
    ctx.moveTo(sun.x + Math.cos(angle) * sun.radius * 1.14, sun.y + Math.sin(angle) * sun.radius * 1.14);
    ctx.lineTo(sun.x + Math.cos(angle) * reach, sun.y + Math.sin(angle) * reach);
  }
  ctx.stroke();

  // The emblem, painted at the biggest the sun gets and drawn smaller when the sun is smaller.
  // Towards sunset the sunset picture fades in over the morning one.
  const pictures = emblemPicturesAt(Math.round(size * 0.2 * EMBLEM_SPAN * pixelRatio));
  const unit = (sun.radius * EMBLEM_SPAN) / EMBLEM_BOX.width;
  const across = (EMBLEM_BOX.width + EMBLEM_MARGIN * 2) * unit;
  const down = (EMBLEM_BOX.height + EMBLEM_MARGIN * 2) * unit;
  ctx.drawImage(pictures.morning, sun.x - across / 2, sun.y - down / 2, across, down);
  if (warmth > 0) {
    ctx.globalAlpha = warmth;
    ctx.drawImage(pictures.sunset, sun.x - across / 2, sun.y - down / 2, across, down);
  }
  ctx.restore();
}

function drawStars(ctx: CanvasRenderingContext2D, frame: Frame, horizon: number) {
  const { width, progress, time } = frame;
  const dark = between(progress, 0.77, 0.82) * (1 - between(progress, 0.89, 0.93));
  if (dark <= 0) return;

  for (let star = 0; star < 170; star++) {
    const x = scatter(star, 1) * width;
    const y = scatter(star, 2) ** 1.5 * horizon * 0.96;
    const twinkle = 0.5 + 0.5 * Math.sin(time * (1 + scatter(star, 3) * 2) + star);
    ctx.fillStyle = `rgba(247, 236, 200, ${dark * (0.3 + twinkle * 0.6)})`;
    ctx.beginPath();
    ctx.arc(x, y, 0.5 + scatter(star, 4) * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // A crescent moon: the outside edge of one circle, back along the edge of another.
  const moon = { x: width * 0.74, y: horizon * 0.3, radius: Math.min(width, horizon) * 0.075 };
  const inner = moon.radius * 0.9;
  const gap = moon.radius * 0.44;
  const outerAngle = Math.acos((moon.radius ** 2 + gap ** 2 - inner ** 2) / (2 * moon.radius * gap));
  const innerAngle = Math.acos((inner ** 2 + gap ** 2 - moon.radius ** 2) / (2 * inner * gap));
  ctx.fillStyle = `rgba(244, 232, 198, ${dark})`;
  ctx.beginPath();
  ctx.arc(moon.x, moon.y, moon.radius, Math.PI + outerAngle, Math.PI - outerAngle);
  ctx.arc(moon.x - gap, moon.y, inner, innerAngle, -innerAngle, true);
  ctx.closePath();
  ctx.fill();
}

function drawClouds(ctx: CanvasRenderingContext2D, frame: Frame, camera: Camera, horizon: number, tint: Color) {
  const { width, progress } = frame;
  const unit = Math.min(width, 1500) / 1500;
  const dark = between(progress, 0.76, 0.82) * (1 - between(progress, 0.89, 0.94));

  for (let cloud = 0; cloud < 6; cloud++) {
    const size = (70 + scatter(cloud, 5) * 90) * unit * 1.4;
    const lane = width + size * 8;
    const drift = camera.x * camera.scale * 0.08 + frame.time * (2 + scatter(cloud, 6) * 2);
    const x = wrap(scatter(cloud, 7) * lane - drift, lane) - size * 4;
    const y = horizon * (0.16 + scatter(cloud, 8) * 0.56);
    ctx.fillStyle = css(tint, lerp(0.62, 0.16, dark));

    // Long flat bars, in the style of an old shipping poster.
    for (let bar = 0; bar < 3; bar++) {
      const length = size * (3.4 - bar * (0.8 + scatter(cloud, 9 + bar) * 0.6));
      const offset = scatter(cloud, 12 + bar) * size * 1.3;
      ctx.beginPath();
      ctx.roundRect(x + offset, y + bar * size * 0.2, length, size * 0.13, size * 0.07);
      ctx.fill();
    }
  }
}

function drawBirds(ctx: CanvasRenderingContext2D, frame: Frame, camera: Camera, horizon: number) {
  const { width, time, progress } = frame;
  const seen = 1 - between(progress, 0.72, 0.78) + between(progress, 0.95, 1);
  if (seen <= 0) return;

  ctx.strokeStyle = `rgba(16, 30, 22, ${0.75 * Math.min(1, seen)})`;
  ctx.lineWidth = Math.max(1.2, 2.4 * camera.scale);
  ctx.lineCap = "round";
  ctx.beginPath();
  for (let bird = 0; bird < 6; bird++) {
    const lane = width + 160;
    const x = wrap(scatter(bird, 20) * lane + time * (22 + bird * 3), lane) - 80;
    if (progress < 0.04 && Math.abs(x - width / 2) < width * 0.34) continue;
    const y = horizon * (0.2 + scatter(bird, 21) * 0.42) + Math.sin(time * 0.6 + bird) * 10;
    const span = 8 + scatter(bird, 22) * 5;
    const flap = Math.sin(time * 5 + bird * 2) * span * 0.55;
    ctx.moveTo(x - span, y - flap);
    ctx.quadraticCurveTo(x - span * 0.4, y - span * 0.15, x, y);
    ctx.quadraticCurveTo(x + span * 0.4, y - span * 0.15, x + span, y - flap);
  }
  ctx.stroke();
}

// The far shore behind the harbour, drifting slower than the harbour itself.
function drawFarShore(ctx: CanvasRenderingContext2D, camera: Camera, tint: string, centre: number, buildings: number) {
  ctx.fillStyle = tint;
  ctx.beginPath();
  ctx.moveTo(centre - 2600, 0);
  for (let block = 0; block < buildings; block++) {
    const x = centre - 2600 + (block / buildings) * 5200;
    const tall = 40 + scatter(block, 30) * 130;
    const next = x + 5200 / buildings;
    ctx.lineTo(x, -tall);
    ctx.lineTo(next * 0.5 + x * 0.5, -tall);
    ctx.lineTo(next * 0.5 + x * 0.5, -tall * 0.62);
    ctx.lineTo(next, -tall * 0.62);
  }
  ctx.lineTo(centre + 2600, 0);
  ctx.closePath();
  ctx.fill();
}

function drawQuay(ctx: CanvasRenderingContext2D, left: number, right: number) {
  ctx.fillStyle = "#2c3b32";
  ctx.fillRect(left, QUAY_Y, right - left, 90);
  ctx.fillStyle = "#3e4f44";
  ctx.fillRect(left, QUAY_Y, right - left, 7);

  // Rubber fenders hung along the quay wall.
  ctx.fillStyle = INK;
  for (let x = left + 40; x < right; x += 170) ctx.fillRect(x, QUAY_Y + 14, 16, 36);

  // Rocks at the far end, where the quay runs down into the sea.
  ctx.fillStyle = "#2c3b32";
  ctx.beginPath();
  ctx.moveTo(right - 1, QUAY_Y);
  ctx.quadraticCurveTo(right + 90, QUAY_Y + 8, right + 210, 30);
  ctx.lineTo(right - 1, 30);
  ctx.closePath();
  ctx.fill();
}

function drawHarbour(ctx: CanvasRenderingContext2D, frame: Frame, state: ReturnType<typeof timelineAt>) {
  const { fonts, time } = frame;

  drawQuay(ctx, -2600, 2500);

  // The yard of older containers, off to the left and behind the ship.
  [-1880, -1730, -1580, -1430, -1280, -1130].forEach((x, index) => {
    drawStack(ctx, x, QUAY_Y, 2 + ((index * 7) % 4), index + 1);
  });
  [980, 1130, 1280, 1430, 1580].forEach((x, index) => {
    drawStack(ctx, x, QUAY_Y, 1 + ((index * 5) % 3), index + 4);
  });

  drawGantry(ctx, fonts);

  // A truck drives in with each container and away again behind the ship.
  if (!state.truckGone) {
    drawTruck(
      ctx,
      state.truckX,
      QUAY_Y,
      state.truckHasCargo ? cargoOnShip[state.beat] : undefined,
      fonts,
      time,
    );
  }

  // The crew on the quay, with hands going up as the ship leaves.
  const goodbye = smooth(between(frame.progress, 0.62, 0.68));

  // A checker walks slowly up and down by the yard, slowing at each turn.
  const beat = wrap(time / 18, 1);
  const checker = lerp(-870, -830, smooth(1 - Math.abs(beat * 2 - 1)));
  drawPerson(ctx, checker, QUAY_Y, { step: checker * 0.4, wave: goodbye }, time);

  // The signaller walks over as each truck pulls up, waves the crane down onto the
  // container, and walks back once it has been lifted away.
  const { step } = state;
  const atTruck = smooth(between(step, 0.06, 0.24)) - smooth(between(step, 0.5, 0.72));
  const walking = (step > 0.06 && step < 0.24) || (step > 0.5 && step < 0.72);
  const signal = between(step, 0.24, 0.28) * (1 - between(step, 0.44, 0.48));
  drawPerson(
    ctx,
    lerp(-800, -726, atTruck),
    QUAY_Y,
    { step: walking ? lerp(-800, -726, atTruck) * 0.4 : undefined, wave: Math.max(signal, goodbye), vest: GOLD },
    time,
  );
  drawPerson(ctx, -500, QUAY_Y, { wave: Math.max(0.55 * (1 - goodbye), goodbye), vest: GOLD }, time);
  drawPerson(ctx, -462, QUAY_Y, { wave: goodbye }, time);
  drawPerson(ctx, -428, QUAY_Y, { wave: goodbye, vest: "#2f5a73" }, time);
}

function drawMooring(ctx: CanvasRenderingContext2D, shipX: number, castOff: number) {
  if (castOff >= 1) return;
  ctx.strokeStyle = `rgba(16, 30, 22, ${1 - castOff})`;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  for (const [onShip, onQuay] of [
    [-660, DOCK_X - 780],
    [640, DOCK_X + 860],
  ]) {
    const fromX = shipX + onShip;
    ctx.moveTo(fromX, -152);
    ctx.quadraticCurveTo((fromX + onQuay) / 2, -60 + castOff * 90, onQuay, QUAY_Y + castOff * 60);
  }
  ctx.stroke();
}

function drawWake(ctx: CanvasRenderingContext2D, frame: Frame, shipX: number, speed: number) {
  if (speed <= 0.02) return;
  const { time } = frame;

  ctx.fillStyle = `rgba(245, 236, 216, ${0.75 * speed})`;
  for (let foam = 0; foam < 26; foam++) {
    const back = foam * 74 + wrap(time * 90, 74);
    const length = (120 - foam * 3.4) * (0.6 + scatter(foam, 40) * 0.8) * speed;
    const y = 8 + foam * 1.6 + scatter(foam, 41) * 26;
    ctx.beginPath();
    ctx.roundRect(shipX - 640 - back - length, y, length, 3.4, 2);
    ctx.fill();
  }

  // The wave pushed up at the bow.
  ctx.beginPath();
  ctx.moveTo(shipX + 500, 6);
  ctx.quadraticCurveTo(shipX + 600, -22 * speed - 6, shipX + 680, 8);
  ctx.quadraticCurveTo(shipX + 600, 2, shipX + 500, 6);
  ctx.fillStyle = `rgba(245, 236, 216, ${0.9 * speed})`;
  ctx.fill();
}

function drawSmoke(ctx: CanvasRenderingContext2D, frame: Frame, shipX: number, speed: number) {
  const { time, progress } = frame;
  const strength = between(progress, 0.6, 0.66);
  if (strength <= 0) return;

  for (let puff = 0; puff < 9; puff++) {
    const age = wrap(time * 0.5 + puff / 9, 1);
    const x = shipX - 595 - age * (120 + speed * 300);
    const y = FUNNEL_TOP - 16 - age * 150;
    const radius = 16 + age * 58;
    const puffGlow = ctx.createRadialGradient(x, y, 0, x, y, radius);
    puffGlow.addColorStop(0, `rgba(245, 236, 216, ${(1 - age) * 0.34 * strength})`);
    puffGlow.addColorStop(1, "rgba(245, 236, 216, 0)");
    ctx.fillStyle = puffGlow;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// The lighthouse stands well behind the ship's path, on a rock of its own.
function drawLighthouse(ctx: CanvasRenderingContext2D, frame: Frame, x: number, shade: string) {
  const { progress, time } = frame;
  const lit = between(progress, 0.75, 0.8) * (1 - between(progress, 0.88, 0.92));

  ctx.translate(x, 0);
  ctx.scale(0.72, 0.72);

  if (lit > 0) {
    const swing = time * 0.45;
    for (const side of [-1, 1]) {
      const tilt = Math.sin(swing) * 0.1;
      const reach = side * 2300;
      const beam = ctx.createLinearGradient(0, -365, reach, -365);
      beam.addColorStop(0, `rgba(250, 230, 170, ${0.3 * lit})`);
      beam.addColorStop(1, "rgba(250, 230, 170, 0)");
      ctx.fillStyle = beam;
      ctx.beginPath();
      ctx.moveTo(0, -365);
      ctx.lineTo(reach, -365 + reach * tilt - 130);
      ctx.lineTo(reach, -365 + reach * tilt + 130);
      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.fillStyle = shade;
  ctx.beginPath();
  ctx.moveTo(-300, 60);
  ctx.quadraticCurveTo(-190, -64, -60, -70);
  ctx.quadraticCurveTo(100, -80, 280, 60);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = CREAM;
  ctx.beginPath();
  ctx.moveTo(-40, -66);
  ctx.lineTo(-22, -340);
  ctx.lineTo(22, -340);
  ctx.lineTo(40, -66);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#b4532a";
  for (const band of [-120, -220]) {
    const lower = 40 - ((band + 66) / -274) * 18;
    const upper = 40 - ((band - 44 + 66) / -274) * 18;
    ctx.beginPath();
    ctx.moveTo(-lower, band);
    ctx.lineTo(lower, band);
    ctx.lineTo(upper, band - 44);
    ctx.lineTo(-upper, band - 44);
    ctx.closePath();
    ctx.fill();
  }

  // Darkens with the evening.
  const dusk = between(progress, 0.72, 0.8);
  ctx.fillStyle = `rgba(14, 26, 34, ${dusk * 0.6})`;
  ctx.fillRect(-42, -340, 84, 276);

  ctx.fillStyle = INK;
  ctx.fillRect(-30, -344, 60, 6);
  ctx.fillRect(-18, -386, 36, 42);
  ctx.fillStyle = lit > 0 ? "#fbe7a8" : GOLD;
  ctx.fillRect(-13, -380, 26, 30);
}

function drawArrivalPort(ctx: CanvasRenderingContext2D, frame: Frame, centre: number) {
  const { progress, time } = frame;
  drawQuay(ctx, centre - 2000, centre + 2600);
  [-1240, -1090, 780, 930, 1080, 1230].forEach((x, index) => {
    drawStack(ctx, centre + x, QUAY_Y, 1 + ((index * 3) % 4), index + 2);
  });

  // Two harbour cranes on the far side, waiting for the ship.
  for (const crane of [-900, 860]) {
    const x = centre + crane;
    ctx.fillStyle = "#2c3b32";
    ctx.fillRect(x - 12, -470, 24, 406);
    ctx.fillRect(x - 170, -500, 420, 26);
    ctx.fillStyle = GOLD;
    ctx.fillRect(x - 170, -482, 420, 8);
  }

  // The crew on the far side, waving the ship in.
  const welcome = smooth(between(progress, 0.92, 0.97));
  drawPerson(ctx, centre - 742, QUAY_Y, { wave: welcome, vest: GOLD }, time);
  drawPerson(ctx, centre - 704, QUAY_Y, { wave: welcome }, time + 0.6);
  drawPerson(ctx, centre + 742, QUAY_Y, { wave: welcome, vest: "#2f5a73" }, time + 0.3);
  drawPerson(ctx, centre + 782, QUAY_Y, { wave: welcome, vest: GOLD }, time + 1);
}

// One band of sea, filled down to the bottom of the screen.
function drawWaves(
  ctx: CanvasRenderingContext2D,
  frame: Frame,
  camera: Camera,
  top: number,
  color: string,
  height: number,
  length: number,
  depth: number,
) {
  const { width, height: screen, time } = frame;
  const shift = camera.x * camera.scale * depth;
  const step = Math.max(6, width / 90);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, screen);
  for (let x = 0; x <= width + step; x += step) {
    const along = (x + shift) / length;
    const swell = Math.sin(along + time * 0.7) + Math.sin(along * 2.3 - time * 0.9) * 0.45;
    ctx.lineTo(x, top + swell * height);
  }
  ctx.lineTo(width + step, screen);
  ctx.closePath();
  ctx.fill();
}

// Fine engraved lines on the water, and the path of light under the sun or moon.
function drawWaterDetail(ctx: CanvasRenderingContext2D, frame: Frame, camera: Camera, horizon: number, from: number, to: number) {
  const { width, height, time, progress } = frame;
  const depthOfSea = height - horizon;
  const inBand = (y: number) => y >= from && y <= to;

  ctx.strokeStyle = "rgba(245, 236, 216, 0.1)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let line = 0; line < 90; line++) {
    const row = scatter(line, 50) ** 1.3;
    const y = horizon + 10 + row * depthOfSea;
    if (!inBand(y)) continue;
    const speed = 0.4 + row * 1.1;
    const x = wrap(scatter(line, 51) * width * 1.3 - camera.x * camera.scale * speed + Math.sin(time * 0.5 + line) * 12, width * 1.3) - width * 0.15;
    const length = (20 + row * 90) * (0.6 + scatter(line, 52));
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + length / 2, y - 3 - row * 3, x + length, y);
  }
  ctx.stroke();

  const size = Math.min(Math.max(width, height * 0.9), height * 1.5);
  const sun = sunAt(progress, width, horizon, size);
  const night = between(progress, 0.8, 0.82) * (1 - between(progress, 0.9, 0.92));
  const pathX = lerp(sun.x, width * 0.74, night);
  const color = night > 0.5 ? "rgba(244, 232, 198," : "rgba(246, 200, 110,";
  const strength = lerp(0.5, 0.34, night);

  for (let glint = 0; glint < 46; glint++) {
    const row = scatter(glint, 60);
    const y = horizon + 6 + row * row * depthOfSea * 0.9;
    if (!inBand(y)) continue;
    const spread = (0.04 + row * 0.14) * width;
    const flicker = 0.5 + 0.5 * Math.sin(time * 1.6 + glint * 1.7);
    const x = pathX + (scatter(glint, 61) - 0.5) * spread * 2 + Math.sin(time * 0.8 + glint) * 7;
    const length = (12 + row * 54) * (0.5 + flicker * 0.7);
    ctx.fillStyle = `${color} ${strength * flicker})`;
    ctx.beginPath();
    ctx.roundRect(x - length / 2, y, length, 2 + row * 1.6, 2);
    ctx.fill();
  }
}

export function drawVoyage(ctx: CanvasRenderingContext2D, frame: Frame) {
  const { width, height, pixelRatio, progress, time, fonts, wordsEnd } = frame;
  const state = timelineAt(progress);
  const camera = cameraAt(progress, width, height, state.trolleyX, state.shipX, wordsEnd);
  const sky = skyAt(progress);
  const horizon = camera.water - 58 * camera.scale;

  const toWorld = (depth = 1, y = camera.water) => {
    ctx.setTransform(
      pixelRatio * camera.scale,
      0,
      0,
      pixelRatio * camera.scale,
      pixelRatio * (width / 2 - camera.x * depth * camera.scale),
      pixelRatio * y,
    );
  };
  const toScreen = () => ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  toScreen();
  drawSky(ctx, frame, sky, horizon);
  drawStars(ctx, frame, horizon);
  drawSun(ctx, frame, horizon);
  drawClouds(ctx, frame, camera, horizon, mix(mix(sky.middle, [255, 248, 232], 0.5), sky.top, 0.2));
  drawBirds(ctx, frame, camera, horizon);

  // The open water, right back to the horizon.
  ctx.fillStyle = css(sky.far);
  ctx.fillRect(0, horizon, width, height - horizon);

  const backlit = between(progress, 0.62, 0.72) * (1 - between(progress, 0.93, 1));
  const shoreTint = css(mix(sky.low, [38, 40, 44], lerp(0.32, 0.86, backlit)));
  toWorld(0.45, horizon);
  const leftBehind = 1 - between(progress, 0.68, 0.76);
  if (leftBehind > 0) drawFarShore(ctx, camera, shoreTint, 0, 26);
  const nearing = between(progress, 0.9, 0.96);
  if (nearing > 0) drawFarShore(ctx, camera, shoreTint, (DOCK_X + TRAVEL) * 0.45, 30);

  toScreen();
  drawWaves(ctx, frame, camera, horizon + 26 * camera.scale, css(mix(sky.far, [28, 72, 60], 0.5)), 3 * camera.scale, 260, 0.7);
  drawWaterDetail(ctx, frame, camera, horizon, horizon, camera.water);

  if (state.sailing > 0.2 && state.sailing < 0.8) {
    toWorld(0.8, horizon + 30 * camera.scale);
    drawLighthouse(ctx, frame, LIGHTHOUSE_X, css(mix(sky.far, [20, 30, 30], 0.7)));
  }

  toWorld();
  if (state.sailing < 0.3) drawHarbour(ctx, frame, state);
  if (state.sailing > 0.75) drawArrivalPort(ctx, frame, DOCK_X + TRAVEL);

  // The ship rocks a little, and a little more once it is out at sea.
  const swell = lerp(1.4, 4, state.speed);
  ctx.translate(state.shipX, Math.sin(time * 0.9) * swell);
  ctx.rotate(Math.sin(time * 0.7) * lerp(0.0008, 0.0034, state.speed));
  const night = between(progress, 0.74, 0.82) * (1 - between(progress, 0.9, 0.96));
  drawShip(ctx, { fonts, cargo: cargoOnShip, loaded: state.loaded, time, night });
  // The deckhand waves the quay goodbye, goes below through the hatch for the voyage,
  // and climbs back up to wave the far port in.
  const returning = progress > 0.85;
  const toHatch = returning
    ? 1 - smooth(between(progress, 0.945, 0.96))
    : smooth(between(progress, 0.68, 0.71));
  const sink = returning ? 1 - between(progress, 0.925, 0.945) : between(progress, 0.71, 0.735);
  const farewell = smooth(between(progress, 0.6, 0.63)) * (1 - smooth(between(progress, 0.665, 0.68)));
  const welcome = smooth(between(progress, 0.96, 0.975));
  drawDeckhand(
    ctx,
    {
      x: lerp(BOW_POST, BOW_HATCH, toHatch),
      sink,
      wave: returning ? welcome : farewell,
      walking: toHatch > 0 && toHatch < 1,
    },
    time,
  );

  toWorld();
  drawMooring(ctx, state.shipX, state.castOff);

  // What the gantry is carrying swings a little as it moves, and hangs in front of the ship.
  if (state.sailing < 0.3) {
    const sway = Math.sin(time * 1.6) * (state.carrying ? 3.6 : 1.4);
    if (state.carrying) {
      const load = cargoOnShip[state.beat];
      drawContainer(ctx, state.trolleyX + sway - CONTAINER_W / 2, state.hookY, load.paint, load, fonts);
    }
    drawTrolley(ctx, state.trolleyX, state.hookY, sway);
  }

  drawSmoke(ctx, frame, state.shipX, state.speed);
  drawWake(ctx, frame, state.shipX, state.speed);

  // The nearer waves pass in front of the hull, each band darker and faster than the last.
  toScreen();
  const water = camera.water;
  const waterBase = mix(sky.far, [34, 84, 70], 0.62);
  const near = (shade: number) => css(mix(waterBase, [20, 38, 27], shade));
  drawWaves(ctx, frame, camera, water + 2 * camera.scale, near(0.62), 4 * camera.scale, 170, 1);
  drawWaves(ctx, frame, camera, water + 46 * camera.scale, near(0.8), 6 * camera.scale, 230, 1.2);
  drawWaves(ctx, frame, camera, water + 112 * camera.scale, near(1), 9 * camera.scale, 320, 1.5);
  drawWaterDetail(ctx, frame, camera, horizon, camera.water + 10 * camera.scale, height);

  // The very bottom always ends in the page's dark green, so the next section joins on cleanly.
  const fade = ctx.createLinearGradient(0, height - 70, 0, height);
  fade.addColorStop(0, "rgba(20, 38, 27, 0)");
  fade.addColorStop(1, "rgba(20, 38, 27, 1)");
  ctx.fillStyle = fade;
  ctx.fillRect(0, height - 70, width, 70);
}
