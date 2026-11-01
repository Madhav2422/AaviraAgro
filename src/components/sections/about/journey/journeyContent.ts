export const journeyContent = {
  eyebrow: "How We Work",
  heading: {
    start: "From seed",
    accent: "to sack.",
  },
  text: "Every grain we sell passes through the same careful path. Scroll along it to see what happens between the field and your warehouse.",
};

export type JourneyStep = {
  number: string;
  title: string;
  text: string;
};

// Add, remove or reorder the steps here.
export const journeySteps: JourneyStep[] = [
  {
    number: "01",
    title: "Sow",
    text: "We plan crops and seasons with our partner growers, so the harvest matches what our buyers need.",
  },
  {
    number: "02",
    title: "Grow",
    text: "Our team stays in touch through the season, sharing guidance and checking on crop health.",
  },
  {
    number: "03",
    title: "Harvest",
    text: "Grain is bought at a fair price and collected at the right time, when it is at its best.",
  },
  {
    number: "04",
    title: "Clean & Grade",
    text: "In our own unit, every lot is cleaned, sorted and graded, then checked before it moves on.",
  },
  {
    number: "05",
    title: "Pack",
    text: "Packed in the sizes and labels you ask for, sealed to stay fresh on the road.",
  },
  {
    number: "06",
    title: "Deliver",
    text: "Dispatched on a clear schedule, so your shelves and your customers never wait.",
  },
];
