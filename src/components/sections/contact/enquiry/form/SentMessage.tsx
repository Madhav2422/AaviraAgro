import { formContent } from "./formContent";

const { heading, text, again } = formContent.sent;

// One leaf, drawn pointing right from where it joins the stem.
const LEAF = "M0 0C6-7 17-9 26-3C18 3 7 4 0 0Z";

type SentMessageProps = {
  onAgain: () => void;
};

// Shown in place of the form once it is sent: a seedling grows out of the soil.
export default function SentMessage({ onAgain }: SentMessageProps) {
  return (
    <div role="status" className="flex flex-col items-center py-6 text-center">
      <svg aria-hidden="true" viewBox="0 0 120 130" className="w-32 overflow-visible">
        <ellipse cx="60" cy="118" rx="38" ry="6" fill="#e4c06a" opacity="0.45" className="sent-soil" />
        <path
          d="M60 118C60 98 57 80 60 52"
          pathLength={1}
          fill="none"
          stroke="#2f6b37"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ animationDelay: "250ms" }}
          className="sprout-stem"
        />
        <g transform="translate(59.5 86)" fill="#4f8a3c">
          <g style={{ animationDelay: "800ms" }} className="sprout-leaf">
            <path d={LEAF} transform="scale(1.1) rotate(-25)" />
            <path d={LEAF} transform="scale(-1.1 1.1) rotate(-25)" />
          </g>
        </g>
        <g transform="translate(60 52)" fill="#3d7a35">
          <g style={{ animationDelay: "1100ms" }} className="sprout-leaf">
            <path d={LEAF} transform="scale(1.5) rotate(-32)" />
            <path d={LEAF} transform="scale(-1.5 1.5) rotate(-32)" />
          </g>
        </g>
      </svg>

      <h3
        style={{ animationDelay: "500ms" }}
        className="mt-6 animate-fade-up font-display text-[2rem] leading-tight text-brand-ink motion-reduce:animate-none"
      >
        {heading}
      </h3>
      <p
        style={{ animationDelay: "620ms" }}
        className="mt-3 max-w-sm animate-fade-up text-[16px] leading-relaxed text-brand-muted motion-reduce:animate-none"
      >
        {text}
      </p>
      <button
        type="button"
        onClick={onAgain}
        style={{ animationDelay: "740ms" }}
        className="mt-7 animate-fade-up text-[15px] font-medium text-brand-green underline decoration-brand-gold/50 underline-offset-4 transition-colors hover:text-brand-gold-deep motion-reduce:animate-none"
      >
        {again}
      </button>
    </div>
  );
}
