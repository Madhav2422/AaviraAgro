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

// From the client's letterhead. Keep these in step with detailsContent.ts on the Contact page.
// An href makes a line clickable.
export const footerContact: FooterContact[] = [
  { icon: "address", label: "Office No. 1001, Plot No. E/3A, Sec-12, Kharghar, Mumbai – 410210" },
  { icon: "phone", label: "+91 22 4603 8109", href: "tel:+912246038109" },
  { icon: "email", label: "support@avviraagroindustries.com", href: "mailto:support@avviraagroindustries.com" },
];
