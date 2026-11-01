type RisingWordProps = {
  word: string;
  delay: number;
  className?: string;
};

// One word of a big headline, rising up into view from behind an invisible line.
// The padding, cancelled out by the negative margins, leaves room for italic tails like the g's.
// A gradient-filled word needs the same padding on itself too, since the gradient
// only paints inside the word's own box.
export default function RisingWord({ word, delay, className = "animate-rise" }: RisingWordProps) {
  return (
    <span className="pointer-events-auto -ml-[0.3em] mb-[-0.4em] inline-block overflow-hidden pb-[0.4em] pl-[0.3em] align-bottom">
      <span
        style={{ animationDelay: `${delay}ms` }}
        className={`inline-block motion-reduce:animate-none ${className}`}
      >
        {word}
      </span>
    </span>
  );
}
