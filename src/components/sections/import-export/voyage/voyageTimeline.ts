// Turns how far the visitor has scrolled (0 to 1) into where everything is. Nothing here
// depends on the frame before, so scrolling back up plays the whole story in reverse.

import { cargoOnShip } from "../cargo";
import { BAYS, DOCK_X, GIRDER_BOTTOM, QUAY_Y, cargoTop, truckBedTop } from "./voyageArt";

const LOADING_START = 0.06;
const LOADING_END = 0.58;
const CAST_OFF_END = 0.65;
const ARRIVAL = 0.95;

// Where the sailing ends up, in the same units as the ship.
export const TRAVEL = 12000;

const PICK_X = -640;
const PARK_X = -800;
const HOOK_UP = GIRDER_BOTTOM + 68;
const TRUCK_OFF_LEFT = -1750;
const TRUCK_OFF_RIGHT = 420;

export const clamp = (value: number) => Math.max(0, Math.min(1, value));
export const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;
export const smooth = (value: number) => {
  const amount = clamp(value);
  return amount * amount * (3 - 2 * amount);
};
export const between = (value: number, from: number, to: number) =>
  clamp((value - from) / (to - from));

const shipTravel = (progress: number) => {
  const amount = between(progress, CAST_OFF_END, ARRIVAL);
  // A slow start out of the harbour and a long, gentle stop at the far side.
  return smooth(amount) * 0.35 + amount * amount * (3 - 2 * amount) * 0.65;
};

export function timelineAt(progress: number) {
  const count = cargoOnShip.length;
  const load = between(progress, LOADING_START, LOADING_END) * count;
  const beat = Math.min(Math.floor(load), count - 1);
  const step = load >= count ? 1 : load - beat;

  const bayOf = (index: number) => DOCK_X + BAYS[index];
  const from = beat === 0 ? PICK_X : bayOf(beat - 1);
  const landing = cargoTop(2);
  const onTruck = QUAY_Y + truckBedTop;

  let trolleyX = lerp(from, PICK_X, smooth(step / 0.24));
  let hookY = HOOK_UP;
  let carrying = false;

  if (step >= 0.24 && step < 0.36) {
    hookY = lerp(HOOK_UP, onTruck, smooth((step - 0.24) / 0.12));
  } else if (step >= 0.36 && step < 0.5) {
    hookY = lerp(onTruck, HOOK_UP, smooth((step - 0.36) / 0.14));
    carrying = true;
  } else if (step >= 0.5 && step < 0.76) {
    trolleyX = lerp(PICK_X, bayOf(beat), smooth((step - 0.5) / 0.26));
    carrying = true;
  } else if (step >= 0.76 && step < 0.92) {
    trolleyX = bayOf(beat);
    hookY = lerp(HOOK_UP, landing, smooth((step - 0.76) / 0.16));
    carrying = true;
  } else if (step >= 0.92) {
    trolleyX = bayOf(beat);
    hookY = lerp(landing, HOOK_UP, smooth((step - 0.92) / 0.08));
  }

  // The gantry rolls its trolley home once the last container is on board.
  const parked = between(progress, LOADING_END, CAST_OFF_END);
  trolleyX = lerp(trolleyX, PARK_X, smooth(parked));

  const truckIn = lerp(TRUCK_OFF_LEFT, PICK_X, 1 - (1 - clamp(step / 0.24)) ** 3);
  const truckOut = lerp(PICK_X, TRUCK_OFF_RIGHT, between(step, 0.44, 0.74) ** 2);
  const truckX = step < 0.44 ? truckIn : truckOut;

  const travel = shipTravel(progress);
  const ahead = shipTravel(progress + 0.004);

  return {
    beat,
    step,
    loaded: load >= count ? count : step >= 0.92 ? beat + 1 : beat,
    trolleyX,
    hookY,
    carrying,
    truckX,
    truckHasCargo: step < 0.36,
    // Trucks stop coming once the ship is full.
    truckGone: load >= count,
    castOff: between(progress, LOADING_END + 0.02, CAST_OFF_END),
    shipX: DOCK_X + travel * TRAVEL,
    speed: clamp((ahead - travel) * 260),
    sailing: travel,
    arrived: between(progress, ARRIVAL - 0.04, ARRIVAL),
  };
}

export type Chapter = { kind: "opening" | "cargo" | "castOff" | "dusk" | "night" | "arrival"; cargo: number };

// Which caption belongs to this point of the story.
export function chapterAt(progress: number): Chapter {
  if (progress < LOADING_START * 0.8) return { kind: "opening", cargo: 0 };
  if (progress < LOADING_END) {
    const cargo = Math.floor(between(progress, LOADING_START, LOADING_END) * cargoOnShip.length);
    return { kind: "cargo", cargo: Math.min(cargo, cargoOnShip.length - 1) };
  }
  if (progress < 0.68) return { kind: "castOff", cargo: 0 };
  if (progress < 0.79) return { kind: "dusk", cargo: 0 };
  if (progress < 0.9) return { kind: "night", cargo: 0 };
  return { kind: "arrival", cargo: 0 };
}
