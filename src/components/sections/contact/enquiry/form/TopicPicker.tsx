import { formContent, topics } from "./formContent";

type TopicPickerProps = {
  defaultValue?: string;
  error?: string;
};

// A row of pills to pick one from. The picked pill turns green and a small leaf opens inside it.
export default function TopicPicker({ defaultValue, error }: TopicPickerProps) {
  return (
    <fieldset aria-describedby={error ? "enquiry-topic-error" : undefined}>
      <legend className="text-[15px] text-brand-muted">{formContent.topicLabel}</legend>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {topics.map((topic) => (
          <label key={topic} className="group cursor-pointer">
            <input
              type="radio"
              name="topic"
              value={topic}
              defaultChecked={topic === defaultValue}
              className="sr-only"
            />
            <span className="inline-flex items-center rounded-full border border-brand-ink/15 px-4 py-2 text-[14.5px] text-brand-ink transition-[background-color,border-color,color,scale] duration-300 group-hover:border-brand-green/60 group-active:scale-95 group-has-[:checked]:border-brand-green group-has-[:checked]:bg-brand-green group-has-[:checked]:text-background group-has-[:focus-visible]:outline-2 group-has-[:focus-visible]:outline-offset-2 group-has-[:focus-visible]:outline-brand-gold">
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="h-3.5 w-0 -rotate-45 scale-0 fill-brand-wheat transition-[width,margin,scale,rotate] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-has-[:checked]:mr-1.5 group-has-[:checked]:w-3.5 group-has-[:checked]:rotate-0 group-has-[:checked]:scale-100"
              >
                <path d="M2 14C2 7 6 2 14 2c0 8-5 12-12 12Z" />
              </svg>
              {topic}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p
          id="enquiry-topic-error"
          className="mt-2 animate-fade-up text-[13.5px] text-[#a3361f] motion-reduce:animate-none"
        >
          {error}
        </p>
      )}
    </fieldset>
  );
}
