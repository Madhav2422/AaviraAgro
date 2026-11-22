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

// The wheat, rice, kabuli chana and tuver dal pictures are free Unsplash photos (Unsplash
// License), to replace with the client's own when they have them. They are real photos, so they
// do not repeat seamlessly: keep them square and large (1200px) so one photo covers the fill.
//   wheat:        https://unsplash.com/photos/brown-grains-OvUAL6Vx3uY
//   rice:         https://unsplash.com/photos/raw-white-rice-grains-background--LdilhDx3sk
//   kabuli chana and tuver dal, cropped from the two halves of one photo:
//                 https://unsplash.com/photos/yellow-split-peas-and-chickpeas-side-by-side-2nEDE_zt7rg

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
    grain: "/images/grains/kabuli-chana.webp",
  },
  {
    number: "4",
    title: "Private Label & Export",
    text: "Your brand on our supply, with custom pack sizes and labelling for local and overseas markets.",
    grain: "/images/grains/tuver-dal.webp",
  },
];
