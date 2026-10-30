import Icon from "@/components/ui/Icons";

const base =
  "w-full rounded-md border bg-white px-4 text-[14px] text-ink-900 placeholder:text-ink-400 outline-none transition-[border-color,box-shadow] focus:ring-4";
const tone = (invalid) =>
  invalid ? "border-sale focus:border-sale focus:ring-sale/10" : "border-line hover:border-ink-400/40 focus:border-brand-500 focus:ring-mint-100";

const describedBy = (id, error, hint) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined);

/** Label + control + inline error (or hint). Required fields get a red asterisk. */
function Field({ id, label, optional, error, hint, className = "", children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline gap-1.5 text-[13px] font-semibold text-ink-800">
        {label}
        {optional ? (
          <span className="text-[12px] font-normal text-ink-400">(optional)</span>
        ) : (
          <span aria-hidden="true" className="text-sale">
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-[12px] font-medium leading-snug text-sale">
          <Icon name="alert" className="mt-px size-3.5 shrink-0" strokeWidth={2} />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[12px] leading-snug text-ink-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function TextField({ id, label, optional = false, error, hint, className, ...inputProps }) {
  return (
    <Field id={id} label={label} optional={optional} error={error} hint={hint} className={className}>
      <input
        id={id}
        required={!optional}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, error, hint)}
        className={`${base} h-12 ${tone(Boolean(error))}`}
        {...inputProps}
      />
    </Field>
  );
}

export function TextAreaField({ id, label, optional = false, error, hint, className, rows = 3, ...inputProps }) {
  return (
    <Field id={id} label={label} optional={optional} error={error} hint={hint} className={className}>
      <textarea
        id={id}
        rows={rows}
        required={!optional}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, error, hint)}
        className={`${base} block resize-y py-3 leading-relaxed ${tone(Boolean(error))}`}
        {...inputProps}
      />
    </Field>
  );
}

export function SelectField({ id, label, optional = false, error, hint, className, placeholder = "Select…", options, ...selectProps }) {
  return (
    <Field id={id} label={label} optional={optional} error={error} hint={hint} className={className}>
      <div className="relative">
        <select
          id={id}
          required={!optional}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(id, error, hint)}
          className={`${base} h-12 cursor-pointer appearance-none pr-10 ${selectProps.value ? "" : "text-ink-400"} ${tone(Boolean(error))}`}
          {...selectProps}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option} className="text-ink-900">
              {option}
            </option>
          ))}
        </select>
        <Icon name="chevronDown" className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-500" strokeWidth={2} />
      </div>
    </Field>
  );
}
