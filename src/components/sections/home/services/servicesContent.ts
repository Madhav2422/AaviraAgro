export const servicesContent = {
  eyebrow: "What We Do",
  heading: {
    start: "One harvest,",
    accent: "four ways",
    end: "to work with us.",
  },
  text: "Whether you need a single shipment or a long-term partner, we shape our supply around your business.",
};

export type Service = {
  number: string;
  title: string;
  text: string;
  // The grain picture that fills the big number.
  grain: string;
};

// Add, remove or reorder the services here.
export const services: Service[] = [
  {
    number: "1",
    title: "In-house Manufacturing",
    text: "Cleaning, grading, processing and packing under one roof, so quality stays in our hands from start to finish.",
    grain: "/images/grains/wheat.webp",
  },
  {
    number: "2",
    title: "Contract Supply",
    text: "Steady, long-term supply for wholesalers, retail chains and food businesses, planned around your volumes.",
    grain: "/images/grains/rice.webp",
  },
  {
    number: "3",
    title: "Contract Farming",
    text: "We work with growers on chosen crops and seasons, so the harvest is planned around what you need.",
    grain: "/images/grains/pulses.webp",
  },
  {
    number: "4",
    title: "Private Label & Export",
    text: "Your brand on our supply, with custom pack sizes and labelling for local and overseas markets.",
    grain: "/images/grains/spices.webp",
  },
];
