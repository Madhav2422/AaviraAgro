import type { Field } from "./formContent";

type FormFieldProps = {
  field: Field;
  multiline?: boolean;
  defaultValue?: string;
  error?: string;
  className?: string;
};

// A text field whose label floats up out of the way, with a gold furrow drawn under it while in use.
export default function FormField({ field, multiline, defaultValue, error, className }: FormFieldProps) {
  const id = `enquiry-${field.name}`;
  const errorId = `${id}-error`;
  const shared = {
    id,
    name: field.name,
    defaultValue,
    // An empty placeholder lets the label tell when the field has something in it.
    placeholder: " ",
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    className: "peer block w-full resize-none bg-transparent pt-6 pb-2.5 text-[16px] text-brand-ink outline-none",
  };

  return (
    <div className={className}>
      <div className="relative">
        {multiline ? (
          <textarea rows={4} {...shared} />
        ) : (
          <input type={field.type ?? "text"} autoComplete={field.autoComplete} {...shared} />
        )}
        <label
          htmlFor={id}
          className="pointer-events-none absolute top-0 left-0 origin-left scale-[0.8] text-[16px] text-brand-muted transition-[top,scale,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-focus:text-brand-gold-deep peer-[:placeholder-shown:not(:focus)]:top-6 peer-[:placeholder-shown:not(:focus)]:scale-100"
        >
          {field.label}
          {field.optional && <span className="text-brand-muted/60"> (optional)</span>}
        </label>
        <span className="absolute inset-x-0 bottom-0 h-px bg-brand-ink/20 peer-aria-invalid:bg-[#a3361f]/60" />
        <span className="absolute inset-x-0 -bottom-px h-0.5 origin-left scale-x-0 bg-brand-gold transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] peer-focus:scale-x-100" />
      </div>
      {error && (
        <p id={errorId} className="mt-2 animate-fade-up text-[13.5px] text-[#a3361f] motion-reduce:animate-none">
          {error}
        </p>
      )}
    </div>
  );
}
