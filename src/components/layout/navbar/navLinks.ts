export type NavItem = {
  label: string;
  href: string;
};

// Add, remove or reorder navbar links here.
export const navLinks: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Import & Export", href: "/import-export" },
  { label: "Contact", href: "/contact" },
];

// The button on the right side of the navbar.
export const navCta: NavItem = { label: "Get a Quote", href: "/contact" };
