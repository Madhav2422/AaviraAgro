import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

type LogoProps = {
  // Uses lighter text for dark backgrounds, like the footer.
  onDark?: boolean;
  // Keeps the coin in the middle of the emblem turning round, like a wheel.
  turningCoin?: boolean;
};

// The emblem is two pictures: the ring of wheat, leaf and arrow, and the coin on its own
// under it, so the coin can turn. COIN is where the coin sits, in pixels of the emblem. The
// turning coin is drawn perfectly round, so it does not wobble as it goes.
const EMBLEM = { width: 213, height: 221 };
const COIN = { left: 57, top: 46, width: 130, height: 134 };
const coinBox: CSSProperties = {
  left: `${(COIN.left / EMBLEM.width) * 100}%`,
  top: `${(COIN.top / EMBLEM.height) * 100}%`,
  width: `${(COIN.width / EMBLEM.width) * 100}%`,
  height: `${(COIN.height / EMBLEM.height) * 100}%`,
};
const coinSrc = "/images/avvira-emblem-coin.png";

export default function Logo({ onDark = false, turningCoin = false }: LogoProps) {
  return (
    <Link href="/" className="flex w-fit items-center gap-3">
      {/* Change the logo size here: h-14 on phones, xl:h-16 on desktop. */}
      <span className="relative block aspect-[213/221] h-14 shrink-0 xl:h-16">
        <span style={coinBox} className="absolute">
          {turningCoin ? (
            <Image
              src="/images/avvira-emblem-coin-spin.svg"
              alt=""
              width={COIN.width}
              height={COIN.height}
              loading="eager"
              className="logo-coin-spin size-full"
            />
          ) : (
            <Image src={coinSrc} alt="" width={COIN.width} height={COIN.height} loading="eager" className="size-full" />
          )}
        </span>
        {/* The ring lies over the coin, so the leaf stays in front of it. */}
        <Image
          src="/images/avvira-emblem-ring.png"
          alt=""
          width={EMBLEM.width}
          height={EMBLEM.height}
          loading="eager"
          className="absolute inset-0 size-full"
        />
      </span>
      <span className="flex flex-col">
        <span
          className={`font-serif text-[26px] leading-none font-semibold tracking-wide uppercase xl:text-[30px] ${
            onDark ? "text-brand-wheat" : "text-brand-gold"
          }`}
        >
          Avvira
        </span>
        <span
          className={`mt-1.5 text-[10px] leading-none font-semibold tracking-[0.1em] uppercase xl:text-[11.5px] ${
            onDark ? "text-background/80" : "text-brand-green"
          }`}
        >
          Agro Industries
        </span>
      </span>
    </Link>
  );
}
