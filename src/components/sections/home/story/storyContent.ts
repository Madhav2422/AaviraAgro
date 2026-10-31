export const storyContent = {
  eyebrow: "Our Story",
  heading: {
    start: "Good grain.",
    accent: "Honest work.",
  },
  text: "Avvira Agro Industries is built on a simple belief: a business is only as good as the grain it delivers. That is why we stay close to every step, from the field to the final sack, and treat each order as if our name depends on it.",
  // A free Pexels photo, to replace with the client's own:
  // https://www.pexels.com/photo/person-holding-brown-dried-wheat-on-his-hands-6412600/
  image: {
    src: "/images/story-hands.webp",
    alt: "Two cupped hands holding freshly harvested wheat",
  },
  tag: "Growing Value Naturally",
};

export type StoryPoint = {
  number: string;
  title: string;
  text: string;
};

// Add, remove or reorder the points here.
export const storyPoints: StoryPoint[] = [
  {
    number: "01",
    title: "Sourced with care",
    text: "Chosen from growers and regions we trust.",
  },
  {
    number: "02",
    title: "Processed with attention",
    text: "Cleaned, graded and checked before it is packed.",
  },
  {
    number: "03",
    title: "Delivered on time",
    text: "Clear schedules, so your business keeps moving.",
  },
];
