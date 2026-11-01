import ArrowIcon from "@/components/ui/ArrowIcon";
import { formContent } from "./formContent";

// Three grains turning around each other while the message is on its way.
function GrainSpinner() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 animate-spin fill-brand-wheat">
      <ellipse cx="12" cy="5" rx="2.4" ry="4" />
      <ellipse cx="12" cy="5" rx="2.4" ry="4" transform="rotate(120 12 12)" />
      <ellipse cx="12" cy="5" rx="2.4" ry="4" transform="rotate(240 12 12)" />
    </svg>
  );
}

type SubmitButtonProps = {
  pending: boolean;
};

export default function SubmitButton({ pending }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-brand-green px-7 py-4 text-[15px] font-medium text-background transition-colors hover:bg-brand-ink disabled:cursor-wait"
    >
      {/* A band of light sweeps across the button on hover. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1/3 -translate-x-full -skew-x-12 bg-white/15 transition-transform duration-700 ease-out group-hover:translate-x-[400%]"
      />
      <span className="relative">{pending ? formContent.sending : formContent.submit}</span>
      {pending ? (
        <GrainSpinner />
      ) : (
        <ArrowIcon className="relative size-4 transition-transform group-hover:translate-x-0.5" />
      )}
    </button>
  );
}
