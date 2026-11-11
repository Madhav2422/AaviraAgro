import Link from "next/link";
import ArrowIcon from "@/components/ui/ArrowIcon";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import NavLink from "./NavLink";
import { navCta, navLinks } from "./navLinks";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8 xl:h-22 xl:px-6">
        <Logo turningCoin />

        <nav aria-label="Main" className="hidden items-center gap-9 xl:flex">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        <Link
          href={navCta.href}
          className="group hidden items-center gap-2 rounded-full bg-brand-green px-6 py-3 text-[15px] font-medium whitespace-nowrap text-white transition-colors hover:bg-brand-green/90 xl:inline-flex"
        >
          {navCta.label}
          <ArrowIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>

        <MobileMenu />
      </div>
    </header>
  );
}
