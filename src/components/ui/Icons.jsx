/**
 * Inline icon set — 24px grid, 1.6 stroke, rounded joins.
 * `<Icon name="cart" className="size-5" />`
 */

function Svg({ className = "size-5", strokeWidth = 1.6, children, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
}

function Glyph({ className = "size-5", children }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      {children}
    </svg>
  );
}

const icons = {
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.75" />
      <path d="M4.75 20c.6-3.6 3.6-5.75 7.25-5.75S18.65 16.4 19.25 20" />
    </>
  ),
  cart: (
    <>
      <path d="M2.75 4h2.1l2.3 10.6a1.9 1.9 0 0 0 1.86 1.5h7.8a1.9 1.9 0 0 0 1.85-1.45L20.5 8H6" />
      <circle cx="9.75" cy="20" r="1.1" />
      <circle cx="17" cy="20" r="1.1" />
    </>
  ),
  chevronDown: <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />,
  chevronLeft: <path d="m14.5 6-6 6 6 6" />,
  chevronRight: <path d="m9.5 6 6 6-6 6" />,
  arrowRight: <path d="M4.5 12h15m-5.5-5.5L19.5 12 14 17.5" />,
  heart: (
    <path d="M12 19.5s-7-4.3-8.9-8.4C1.6 7.9 3.5 4.75 6.75 4.75c2 0 3.4 1.05 5.25 3 1.85-1.95 3.25-3 5.25-3 3.25 0 5.15 3.15 3.65 6.35-1.9 4.1-8.9 8.4-8.9 8.4Z" />
  ),
  shield: (
    <>
      <path d="M12 3 5 5.8v5.4c0 4.4 2.9 8 7 9.8 4.1-1.8 7-5.4 7-9.8V5.8L12 3Z" />
      <path d="m9.2 12 2 2 3.8-4" />
    </>
  ),
  truck: (
    <>
      <path d="M2.75 6.25h11v9.5h-11z" />
      <path d="M13.75 9.25h4.1l3.4 3.7v2.8h-7.5" />
      <circle cx="6.75" cy="17.25" r="1.75" />
      <circle cx="17.25" cy="17.25" r="1.75" />
    </>
  ),
  headset: (
    <>
      <path d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2" />
      <path d="M4.5 13.5h1.75c.55 0 1 .45 1 1v3c0 .55-.45 1-1 1H5.5a1 1 0 0 1-1-1v-4Z" />
      <path d="M19.5 13.5h-1.75c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h1a1 1 0 0 0 1-1v-4Z" />
      <path d="M19.25 18.5c0 1.6-1.9 2.5-5.25 2.5" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.6" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6" />
    </>
  ),
  pills: (
    <>
      <path d="m10.3 19.2-5.5-5.5a3.9 3.9 0 0 1 5.5-5.5l5.5 5.5a3.9 3.9 0 0 1-5.5 5.5Z" />
      <path d="m7.55 10.95 5.5 5.5" />
      <path d="M13.2 8.4a3.9 3.9 0 1 1 6.1 4.6" />
    </>
  ),
  leaf: (
    <>
      <path d="M5.5 18.5C5 10.5 9.5 5 19 4.75c.25 9.5-5.25 14-13.5 13.75Z" />
      <path d="M5.5 18.5c3-4.4 6-7.2 9.5-9" />
    </>
  ),
  bottle: (
    <>
      <path d="M10 3h4" />
      <path d="M10.5 3v3.5M13.5 3v3.5" />
      <rect x="7.25" y="6.5" width="9.5" height="14.5" rx="2.6" />
      <path d="M7.25 11.5h9.5" />
    </>
  ),
  baby: (
    <>
      <circle cx="12" cy="12.5" r="8.25" />
      <path d="M12 4.25c-1.6.9-1.7 2.6 0 3.1" />
      <path d="M9.6 15.4c1.35 1.15 3.45 1.15 4.8 0" />
      <path d="M9 11.75h.01M15 11.75h.01" strokeWidth="2.2" />
    </>
  ),
  device: (
    <>
      <path d="M12 3.75a8.25 8.25 0 1 0 8.25 8.25" />
      <path d="M20.25 12a8.25 8.25 0 0 0-5.5-7.8" />
      <circle cx="12" cy="12" r="4" />
      <path d="m12 12 2.2-2.2" />
      <path d="M9 18.5h6" />
    </>
  ),
  dumbbell: (
    <>
      <path d="M8 12h8" />
      <rect x="5.25" y="7" width="2.75" height="10" rx="1" />
      <rect x="16" y="7" width="2.75" height="10" rx="1" />
      <path d="M5.25 9.5h-1.5v5h1.5M18.75 9.5h1.5v5h-1.5" />
    </>
  ),
  lotus: (
    <>
      <path d="M12 19.5c-2.6-1.9-3.6-4.2-3.6-6.6 0-2.5 1.3-4.8 3.6-7 2.3 2.2 3.6 4.5 3.6 7 0 2.4-1 4.7-3.6 6.6Z" />
      <path d="M8.6 10.2C6.7 9.6 5 9.7 3.25 10.3c.3 5.4 4.1 9.2 8.75 9.2" />
      <path d="M15.4 10.2c1.9-.6 3.6-.5 5.35.1-.3 5.4-4.1 9.2-8.75 9.2" />
    </>
  ),
  pharmacist: (
    <>
      <circle cx="12" cy="7.75" r="3.5" />
      <path d="M5 20.25c.4-3.75 3.3-6.25 7-6.25s6.6 2.5 7 6.25" />
      <path d="M12 15.75v3.5M10.25 17.5h3.5" />
    </>
  ),
  wallet: (
    <>
      <rect x="3" y="5.5" width="18" height="13.5" rx="2.5" />
      <path d="M3 10h18" />
      <path d="M15.5 14.75h2" />
    </>
  ),
  play: <path d="M8.5 5.9v12.2c0 .75.8 1.2 1.45.82l10-6.1a.95.95 0 0 0 0-1.64l-10-6.1A.95.95 0 0 0 8.5 5.9Z" />,
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2.25" />
      <path d="M8.25 10.5V8a3.75 3.75 0 0 1 7.5 0v2.5" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  minus: <path d="M5.5 12h13" />,
  alert: (
    <>
      <circle cx="12" cy="12" r="8.75" />
      <path d="M12 7.75v5" />
      <path d="M12 16.25h.01" strokeWidth="2.4" />
    </>
  ),
  mapPin: (
    <>
      <path d="M12 21s-6.75-5.6-6.75-11.25a6.75 6.75 0 0 1 13.5 0C18.75 15.4 12 21 12 21Z" />
      <circle cx="12" cy="9.75" r="2.5" />
    </>
  ),
  phone: (
    <path d="M8.2 3.75H6A2.25 2.25 0 0 0 3.75 6c0 7.87 6.38 14.25 14.25 14.25A2.25 2.25 0 0 0 20.25 18v-2.2a1 1 0 0 0-.73-.96l-3.3-.94a1 1 0 0 0-1 .27l-1.06 1.06a11.3 11.3 0 0 1-5.36-5.36l1.06-1.06a1 1 0 0 0 .27-1l-.94-3.3a1 1 0 0 0-.96-.73Z" />
  ),
  mail: (
    <>
      <rect x="3.25" y="5.25" width="17.5" height="13.5" rx="2.25" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  trash: (
    <>
      <path d="M4.5 6.5h15" />
      <path d="M9.5 6.5V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v1.5" />
      <path d="M6.5 6.5 7.3 19a1.75 1.75 0 0 0 1.75 1.6h5.9A1.75 1.75 0 0 0 16.7 19l.8-12.5" />
      <path d="M10.25 10.5v6M13.75 10.5v6" />
    </>
  ),
  plus: <path d="M12 5.5v13M5.5 12h13" />,
};

const glyphs = {
  star: (
    <path d="M12 2.9 14.8 8.8l6.4.75-4.75 4.4 1.3 6.35L12 17.1l-5.75 3.2 1.3-6.35L2.8 9.55l6.4-.75L12 2.9Z" />
  ),
  facebook: (
    <path d="M13.6 21.5v-8.2h2.8l.4-3.25h-3.2V8c0-.95.27-1.6 1.62-1.6h1.72V3.5a23 23 0 0 0-2.5-.13c-2.48 0-4.18 1.5-4.18 4.3v2.38H7.5v3.25h2.76v8.2h3.34Z" />
  ),
  youtube: (
    <path
      fillRule="evenodd"
      d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z"
    />
  ),
  x: (
    <path d="M17.6 3.5h3l-6.6 7.5 7.75 9.5h-6.05l-4.75-6.1-5.45 6.1h-3l7.05-8L2.1 3.5h6.2l4.3 5.6 5-5.6Zm-1.05 15.2h1.65L7.5 5.2H5.72l10.83 13.5Z" />
  ),
  linkedin: (
    <path d="M5.2 3.5a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4ZM3.3 9.4h3.8v11.1H3.3V9.4Zm6.1 0H13v1.55h.05c.5-.95 1.75-1.95 3.6-1.95 3.85 0 4.55 2.5 4.55 5.8v5.7h-3.8v-5.05c0-1.2 0-2.75-1.7-2.75s-1.95 1.3-1.95 2.65v5.15H9.4V9.4Z" />
  ),
};

export default function Icon({ name, ...props }) {
  if (glyphs[name]) return <Glyph {...props}>{glyphs[name]}</Glyph>;
  if (name === "instagram") {
    return (
      <Svg strokeWidth={1.8} {...props}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="3.9" />
        <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
      </Svg>
    );
  }
  if (name === "play") return <Glyph {...props}>{icons.play}</Glyph>;
  return <Svg {...props}>{icons[name]}</Svg>;
}
