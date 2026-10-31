import Reveal from "@/components/ui/Reveal";
import type { Service } from "./servicesContent";

type ServiceColumnProps = {
  service: Service;
  index: number;
};

export default function ServiceColumn({ service, index }: ServiceColumnProps) {
  const delay = (milliseconds: number) => ({
    animationDelay: `${index * 170 + milliseconds}ms`,
  });

  return (
    <li>
      <Reveal
        className={`group relative grid h-full grid-cols-[5.5rem_1fr] items-start gap-x-5 py-8 sm:block sm:py-10 sm:pr-8 xl:px-7 xl:pb-4 ${
          index % 2 === 1 ? "sm:pl-8" : "sm:pl-0"
        } ${index === 0 ? "xl:pl-0" : ""}`}
      >
        <span
          aria-hidden="true"
          style={delay(0)}
          className="reveal-line-x absolute inset-x-0 top-0 h-px origin-left bg-brand-ink/15"
        />
        <span
          aria-hidden="true"
          style={delay(120)}
          className={`reveal-line-y absolute inset-y-0 left-0 hidden w-px origin-top bg-brand-ink/15 ${
            index % 2 === 1 ? "sm:block" : ""
          } ${index > 0 ? "xl:block" : "xl:hidden"}`}
        />

        <div
          aria-hidden="true"
          className="relative w-fit font-display text-[6.5rem] leading-[0.95] font-black [font-feature-settings:'lnum'] sm:text-[10rem] xl:text-[13rem]"
        >
          <span className="text-brand-ink/6">{service.number}</span>
          <span
            style={{ backgroundImage: `url(${service.grain})`, ...delay(160) }}
            className="reveal-fill absolute inset-0 bg-size-[11rem] bg-clip-text bg-position-[0%_0%] text-transparent transition-[background-position] duration-[1800ms] ease-out group-hover:bg-position-[60%_45%] sm:bg-size-[20rem]"
          >
            {service.number}
          </span>
        </div>

        <div>
          <h3
            style={delay(420)}
            className="reveal-up font-display text-[1.6rem] leading-tight text-brand-ink transition-colors duration-300 group-hover:text-brand-gold sm:mt-6 xl:text-[1.75rem]"
          >
            {service.title}
          </h3>
          <p
            style={delay(520)}
            className="reveal-up mt-3 text-[15.5px] leading-relaxed text-brand-muted"
          >
            {service.text}
          </p>
        </div>
      </Reveal>
    </li>
  );
}
