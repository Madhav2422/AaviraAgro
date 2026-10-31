import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <Image
        src="/images/avvira-emblem.jpeg"
        alt=""
        width={225}
        height={242}
        priority
        className="h-auto w-44 brightness-105 sm:w-56"
      />
      <h1 className="mt-6">
        <span className="block font-serif text-5xl font-semibold tracking-wide text-brand-gold sm:text-7xl">
          AVVIRA
        </span>
        <span className="mt-3 block text-sm font-semibold tracking-[0.3em] text-brand-green sm:text-lg">
          AGRO INDUSTRIES
        </span>
      </h1>
      <p className="mt-4 text-lg italic text-brand-gold sm:text-xl">
        Growing Value Naturally
      </p>
    </main>
  );
}
