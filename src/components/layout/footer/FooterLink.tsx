import Link from "next/link";
import type { ComponentProps } from "react";

export default function FooterLink({ children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className="group relative inline-block py-1 text-[15.5px] text-background/75 transition-colors duration-300 hover:text-brand-wheat"
    >
      {children}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0.5 h-px origin-left scale-x-0 bg-brand-wheat transition-transform duration-300 group-hover:scale-x-100"
      />
    </Link>
  );
}
