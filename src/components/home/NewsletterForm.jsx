"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icons";

export default function NewsletterForm({ placeholder }) {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p role="status" className="flex h-11 items-center gap-2 text-[13px] font-medium text-mint-400">
        <Icon name="check" className="size-4" strokeWidth={2.2} /> Thanks — you&apos;re subscribed.
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
      className="relative"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder={placeholder}
        className="h-11 w-full rounded-full border border-white/15 bg-white/[0.04] pl-4 pr-14 text-[12.5px] text-white placeholder:text-white/45 outline-none transition-colors focus:border-mint-400/60"
      />
      <button
        type="submit"
        aria-label="Subscribe"
        className="absolute right-1 top-1 grid size-9 place-items-center rounded-full bg-mint-400 text-forest-950 transition-colors hover:bg-mint-300"
      >
        <Icon name="arrowRight" className="size-4" strokeWidth={2.2} />
      </button>
    </form>
  );
}
