export const purposeContent = {
  eyebrow: "Our Purpose",
  // Lights up word by word as it scrolls into view.
  statement:
    "We believe good food starts long before the kitchen. It starts in the field, with growers who are paid fairly, land that is cared for and grain that is handled honestly at every step.",
  // Words from the statement shown in gold, written without punctuation.
  highlight: ["field", "fairly", "honestly"],
  // A free Pexels photo, to replace with the client's own:
  // https://www.pexels.com/photo/person-holding-brown-dried-wheat-on-his-hands-6412600/
  image: {
    src: "/images/story-hands.webp",
    alt: "Two cupped hands holding freshly harvested wheat",
  },
};

export type PurposePillar = {
  title: string;
  text: string;
};

export const purposePillars: PurposePillar[] = [
  {
    title: "Our Mission",
    text: "To supply clean, carefully graded grain, pulses and spices that businesses can rely on, while building lasting, fair partnerships with the farmers who grow them.",
  },
  {
    title: "Our Vision",
    text: "To grow into a name trusted at home and abroad, known for quality that holds steady from one season to the next.",
  },
];
