import Icon from "@/components/ui/Icons";

const sizes = {
  md: { box: "h-12", cell: "w-11" },
  sm: { box: "h-10", cell: "w-10" },
};

function StepButton({ icon, label, width, disabled, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`grid h-full ${width} place-items-center text-ink-700 transition-colors hover:bg-mist hover:text-brand-700 disabled:cursor-not-allowed disabled:text-ink-400/50 disabled:hover:bg-transparent`}
    >
      <Icon name={icon} className="size-4" strokeWidth={2} />
    </button>
  );
}

/** − value + control. Controlled: the parent owns `value` and clamps via min/max. */
export default function QuantityStepper({ value, onChange, min = 1, max = Infinity, disabled = false, size = "md", label = "Quantity" }) {
  const s = sizes[size];
  return (
    <div role="group" aria-label={label} className={`inline-flex ${s.box} items-stretch overflow-hidden rounded-md border border-line bg-white ${disabled ? "opacity-50" : ""}`}>
      <StepButton icon="minus" label="Decrease quantity" width={s.cell} disabled={disabled || value <= min} onClick={() => onChange(value - 1)} />
      <output aria-live="polite" className={`grid ${s.cell} place-items-center border-x border-line text-[15px] font-semibold tabular-nums text-ink-900`}>
        {value}
      </output>
      <StepButton icon="plus" label="Increase quantity" width={s.cell} disabled={disabled || value >= max} onClick={() => onChange(value + 1)} />
    </div>
  );
}
