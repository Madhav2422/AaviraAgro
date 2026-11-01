import Reveal from "@/components/ui/Reveal";
import ContactDetails from "./details/ContactDetails";
import ContactForm from "./form/ContactForm";
import { formContent } from "./form/formContent";

const { eyebrow, heading, text } = formContent;

// The ways to reach us on the left, and the enquiry form on the right.
export default function Enquiry() {
  return (
    <section id="enquiry" className="mx-auto w-full max-w-7xl scroll-mt-24 px-5 py-16 sm:px-8 xl:px-6 xl:py-24">
      <div className="grid gap-5 xl:grid-cols-[27rem_1fr] xl:gap-6">
        <ContactDetails />

        <Reveal className="rounded-[2rem] border border-brand-ink/10 bg-[#fffaf0] p-7 sm:p-10 xl:p-12">
          <p className="reveal-up text-[13px] font-semibold tracking-[0.2em] text-brand-gold-deep uppercase">
            {eyebrow}
          </p>
          <h2
            style={{ animationDelay: "90ms" }}
            className="reveal-up mt-4 font-display text-[clamp(2.2rem,7vw,3rem)] leading-[1.1] tracking-[-0.02em] text-brand-ink"
          >
            {heading.start} <em className="text-brand-gold">{heading.accent}</em>
          </h2>
          <p
            style={{ animationDelay: "180ms" }}
            className="reveal-up mt-4 max-w-xl text-[16px] leading-relaxed text-brand-muted"
          >
            {text}
          </p>
          <div style={{ animationDelay: "280ms" }} className="reveal-up mt-10">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
