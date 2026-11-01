export const directionsContent = {
  eyebrow: "Two Directions",
  heading: {
    start: "One team,",
    accent: "either way across.",
  },
};

export type Direction = {
  name: string;
  title: string;
  text: string;
  points: string[];
  // Which way the arrow runs across the panel.
  heading: "in" | "out";
};

// The two panels. Add or change the points here.
export const directions: Direction[] = [
  {
    name: "Import",
    title: "Bringing it in",
    text: "We find the right supplier abroad, check the cargo, clear customs and bring it to your door.",
    points: ["Supplier sourcing", "Quality and quantity checks", "Customs clearance", "Delivery to your site"],
    heading: "in",
  },
  {
    name: "Export",
    title: "Sending it out",
    text: "We source the cargo, pack it to your buyer's standard, book the freight and handle the papers.",
    points: ["Sourcing and packing", "Export documents", "Freight booking", "Loading and dispatch"],
    heading: "out",
  },
];
