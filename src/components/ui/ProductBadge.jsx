const tones = {
  sale: "bg-sale text-white",
  brand: "bg-brand-800 text-white",
};

export default function ProductBadge({ badge, className = "" }) {
  return (
    <span className={`rounded-[4px] px-1.5 py-[3px] text-[10px] font-bold leading-none tracking-[0.01em] ${tones[badge.tone]} ${className}`}>
      {badge.label}
    </span>
  );
}
