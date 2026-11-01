import type { ValueIconName } from "./ValueIcon";

export const valuesContent = {
  eyebrow: "What We Stand For",
  heading: {
    start: "Values we",
    accent: "grow by.",
  },
  text: "The way we work has not changed since day one. These are the promises behind every sack with our name on it.",
};

export type Value = {
  icon: ValueIconName;
  title: string;
  text: string;
};

// Add, remove or reorder the values here.
export const values: Value[] = [
  {
    icon: "quality",
    title: "Quality First",
    text: "Every lot is cleaned, graded and checked. If it is not good enough for our own table, it does not leave.",
  },
  {
    icon: "farmers",
    title: "Fair to Farmers",
    text: "Fair prices and steady relationships, so the people who grow our grain grow with us.",
  },
  {
    icon: "honesty",
    title: "Honest Dealing",
    text: "Clear weights, clear prices and clear timelines. No surprises in the sack or on the invoice.",
  },
  {
    icon: "land",
    title: "Care for the Land",
    text: "We encourage farming that keeps the soil healthy, so it can feed the next generation too.",
  },
];
