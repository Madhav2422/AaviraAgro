import type { FooterContact } from "./footerContent";

type ContactIconProps = {
  icon: FooterContact["icon"];
  className?: string;
};

const paths: Record<FooterContact["icon"], string[]> = {
  address: ["M12 21s7-5.6 7-11.5a7 7 0 1 0-14 0C5 15.4 12 21 12 21Z", "M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"],
  phone: [
    "M5 4h3.2l1.6 4-2 1.4a12 12 0 0 0 6.8 6.8l1.4-2 4 1.6V19a2 2 0 0 1-2.2 2A16.6 16.6 0 0 1 3 6.2 2 2 0 0 1 5 4Z",
  ],
  email: ["M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z", "m3.5 7 8.5 6.5L20.5 7"],
};

export default function ContactIcon({ icon, className }: ContactIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[icon].map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}
