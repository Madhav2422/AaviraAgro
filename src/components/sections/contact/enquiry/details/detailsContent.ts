import type { DetailIconName } from "./DetailIcon";

export const detailsContent = {
  eyebrow: "Reach Us Directly",
  heading: {
    start: "We would love",
    accent: "to hear from you.",
  },
  text: "Prefer to talk? Call, write or drop by. Whichever is easiest for you.",
};

export type ContactDetail = {
  icon: DetailIconName;
  title: string;
  label: string;
  href?: string;
};

// Waiting for the client's real details, keep these in step with footerContent.ts.
// Add an href to make a line clickable, for example "tel:+910000000000" or "mailto:name@example.com".
export const contactDetails: ContactDetail[] = [
  { icon: "phone", title: "Call Us", label: "Phone number to be added" },
  { icon: "email", title: "Email Us", label: "Email to be added" },
  { icon: "address", title: "Visit Us", label: "Address to be added" },
  { icon: "hours", title: "Working Hours", label: "Mon to Sat, 9:30 am to 6:30 pm" },
];
