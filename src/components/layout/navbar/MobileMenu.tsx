"use client";

import { useState } from "react";
import Link from "next/link";
import NavLink from "./NavLink";
import { navCta, navLinks } from "./navLinks";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="flex size-11 items-center justify-center rounded-full text-brand-green transition-colors hover:bg-foreground/5"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="size-6"
        >
          {isOpen ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      <nav
        id="mobile-menu"
        aria-label="Mobile"
        className={`absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] flex-col items-start gap-2 overflow-y-auto border-b border-foreground/10 bg-background px-5 py-4 shadow-lg sm:px-8 ${
          isOpen ? "flex" : "hidden"
        }`}
      >
        {navLinks.map((link) => (
          <NavLink key={link.href} {...link} onClick={closeMenu} />
        ))}
        <Link
          href={navCta.href}
          onClick={closeMenu}
          className="mt-2 rounded-full bg-brand-green px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-brand-green/90"
        >
          {navCta.label}
        </Link>
      </nav>
    </div>
  );
}
