import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      {/* Change the logo size here: h-14 on phones, xl:h-16 on desktop. */}
      <Image
        src="/images/avvira-emblem.png"
        alt=""
        width={213}
        height={221}
        loading="eager"
        className="h-14 w-auto xl:h-16"
      />
      <span className="flex flex-col">
        <span className="font-serif text-[26px] leading-none font-semibold tracking-wide text-brand-gold uppercase xl:text-[30px]">
          Avvira
        </span>
        <span className="mt-1.5 text-[10px] leading-none font-semibold tracking-[0.1em] text-brand-green uppercase xl:text-[11.5px]">
          Agro Industries
        </span>
      </span>
    </Link>
  );
}
