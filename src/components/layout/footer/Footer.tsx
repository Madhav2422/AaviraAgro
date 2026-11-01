import Logo from "@/components/layout/navbar/Logo";
import { navLinks } from "@/components/layout/navbar/navLinks";
import Reveal from "@/components/ui/Reveal";
import ContactIcon from "./ContactIcon";
import FooterLink from "./FooterLink";
import SunriseFooter from "./SunriseFooter";
import { footerContact, footerContent } from "./footerContent";

const { text, exploreTitle, contactTitle, wordmark, copyright, tagline, credit } = footerContent;

const titleStyle = "font-display text-xl text-background";
const wordStyle = "sunrise-word font-serif font-black";

export default function Footer() {
  return (
    <SunriseFooter className="sunrise relative isolate overflow-hidden bg-brand-ink text-background">
      <Reveal className="mx-auto grid w-full max-w-7xl gap-x-14 gap-y-10 px-5 pt-16 pb-10 sm:grid-cols-2 sm:px-8 xl:grid-cols-[1.8fr_1fr_1.2fr] xl:px-6 xl:pt-20">
        <div className="reveal-up sm:col-span-2 xl:col-span-1">
          <Logo onDark />
          <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-background/70">{text}</p>
        </div>

        <nav aria-label="Footer" style={{ animationDelay: "120ms" }} className="reveal-up">
          <h2 className={titleStyle}>{exploreTitle}</h2>
          <ul className="mt-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <FooterLink href={link.href}>{link.label}</FooterLink>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ animationDelay: "240ms" }} className="reveal-up">
          <h2 className={titleStyle}>{contactTitle}</h2>
          <ul className="mt-5 space-y-3.5 text-[15.5px] text-background/75">
            {footerContact.map((item) => (
              <li key={item.icon} className="flex items-start gap-3">
                <ContactIcon icon={item.icon} className="mt-0.5 size-5 shrink-0 text-brand-wheat" />
                {item.href ? (
                  <a href={item.href} className="transition-colors hover:text-brand-wheat">
                    {item.label}
                  </a>
                ) : (
                  <span>{item.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <div data-sky className="sunrise-sky">
        <div className="sunrise-rays" />
        <div className="sunrise-glow" />
        <p aria-hidden="true" className={`${wordStyle} text-background`}>
          {wordmark}
        </p>
        <div className="sunrise-disc">
          <p aria-hidden="true" className={`${wordStyle} text-brand-ink`}>
            {wordmark}
          </p>
        </div>
        <div className="sunrise-rim" />
        <div className="sunrise-hill" />
      </div>

      <div className="relative bg-[#0c1811]">
        <div className="mx-auto grid w-full max-w-7xl items-baseline gap-x-8 gap-y-1.5 px-5 pt-1 pb-6 text-center text-[13.5px] text-background/60 sm:grid-cols-[1fr_auto] sm:px-8 sm:text-left lg:grid-cols-[1fr_auto_1fr] xl:px-6">
          <p>{copyright}</p>
          <p className="font-display text-[15px] text-brand-wheat italic">{tagline}</p>
          <p className="text-xs sm:col-span-2 sm:text-center lg:col-span-1 lg:text-right">
            {credit.text}{" "}
            <a
              href={credit.href}
              target="_blank"
              rel="noopener"
              className="underline decoration-background/25 underline-offset-2 transition-colors hover:text-brand-wheat hover:decoration-brand-wheat"
            >
              {credit.label}
            </a>
          </p>
        </div>
      </div>
    </SunriseFooter>
  );
}
