"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "./navLinks";

type NavLinkProps = NavItem & {
  onClick?: () => void;
};

export default function NavLink({ label, href, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`border-b-2 py-2 text-[15px] font-medium whitespace-nowrap transition-colors hover:text-brand-green ${
        isActive ? "border-brand-gold" : "border-transparent"
      }`}
    >
      {label}
    </Link>
  );
}
