export const routeContent = {
  eyebrow: "How It Works",
  heading: {
    start: "Six ports of call,",
    accent: "one simple route.",
  },
};

export type RouteStop = {
  number: string;
  title: string;
  text: string;
};

// Add, remove or reorder the steps here.
export const routeStops: RouteStop[] = [
  { number: "01", title: "Tell us", text: "The cargo, the quantity and the port." },
  { number: "02", title: "We quote", text: "We source it and share a clear price." },
  { number: "03", title: "We check", text: "Quality and quantity, before it is packed." },
  { number: "04", title: "We clear", text: "Export, import and customs papers." },
  { number: "05", title: "We ship", text: "Freight booked, with updates on the way." },
  { number: "06", title: "You receive", text: "At the port, or at your own door." },
];
