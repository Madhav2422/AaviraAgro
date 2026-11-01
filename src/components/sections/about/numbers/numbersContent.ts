export const numbersContent = {
  eyebrow: "Avvira in Numbers",
  heading: {
    start: "Growing,",
    accent: "season after season.",
  },
  text: "Behind every figure are the growers, workers and partners who make our supply dependable.",
};

export type Stat = {
  // The number counts up to this value when it scrolls into view.
  value: number;
  suffix?: string;
  label: string;
};

// Placeholder figures, to replace with the client's real numbers.
export const stats: Stat[] = [
  { value: 500, suffix: "+", label: "Partner farmers" },
  { value: 25000, suffix: " t", label: "Grain handled every year" },
  { value: 12, suffix: "+", label: "States we deliver to" },
  { value: 98, suffix: "%", label: "Orders delivered on time" },
];
