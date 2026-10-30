/** Neutral stand-in shown until a product photo is supplied. */
export default function ProductPlaceholder({ className = "h-[58%]" }) {
  return (
    <div className="grid size-full place-items-center">
      <svg viewBox="0 0 120 170" className={`text-ink-400/30 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="32" y="8" width="56" height="22" rx="5" />
        <path d="M26 38c0-4.5 3.5-8 8-8h52c4.5 0 8 3.5 8 8v112c0 5.5-4.5 10-10 10H36c-5.5 0-10-4.5-10-10V38Z" />
        <rect x="26" y="64" width="68" height="52" />
      </svg>
    </div>
  );
}
