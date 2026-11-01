export const footerContent = {
  text: "Manufacturing, processing and supply you can rely on, with honest work at every step.",
  exploreTitle: "Explore",
  contactTitle: "Reach Us",
  // The big name at the bottom of the footer.
  wordmark: "AVVIRA",
  copyright: `© ${new Date().getFullYear()} Avvira Agro Industries. All rights reserved.`,
  tagline: "Growing Value Naturally",
  // The small line at the very bottom of the footer.
  credit: {
    text: "Designed and developed by",
    label: "fluxoninfotech.com",
    href: "https://www.fluxoninfotech.com",
  },
};

export type FooterContact = {
  icon: "address" | "phone" | "email";
  label: string;
  href?: string;
};

// Waiting for the client's real details. Add an href to make a line clickable,
// for example "tel:+910000000000" or "mailto:name@example.com".
export const footerContact: FooterContact[] = [
  { icon: "address", label: "Address to be added" },
  { icon: "phone", label: "Phone number to be added" },
  { icon: "email", label: "Email to be added" },
];
