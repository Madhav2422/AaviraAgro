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

// From the client's letterhead. Keep these in step with footerContent.ts. An href makes a line clickable.
// The working hours are not on the letterhead, so they still need the client's confirmation.
export const contactDetails: ContactDetail[] = [
  { icon: "phone", title: "Call Us", label: "+91 22 4603 8109", href: "tel:+912246038109" },
  { icon: "email", title: "Email Us", label: "support@avviraagroindustries.com", href: "mailto:support@avviraagroindustries.com" },
  { icon: "address", title: "Visit Us", label: "Office No. 1001, Plot No. E/3A, Sec-12, Kharghar, Mumbai – 410210" },
  { icon: "hours", title: "Working Hours", label: "Mon to Sat, 9:30 am to 6:30 pm" },
];
