import Link from "next/link";
import { brand } from "@/data/home";

export function LogoMark({ className = "size-9" }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className}>
      <path d="M20 37C9.5 37 4 30 4 20.5 4 13 8 7.5 13.5 5c-.4 9 1.8 16.4 6.5 22 4.7-5.6 6.9-13 6.5-22C32 7.5 36 13 36 20.5 36 30 30.5 37 20 37Z" fill="#6bd477" />
      <path d="M20 27C15.3 21.4 13.1 14 13.5 5 17 6.5 19.5 9 20 12.5 20.5 9 23 6.5 26.5 5c.4 9-1.8 16.4-6.5 22Z" fill="#a9edb0" />
      <path d="M20 16.5v9M15.5 21h9" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({ className = "" }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`} aria-label={`${brand.name} home`}>
      <LogoMark className="size-9 shrink-0 lg:size-10" />
      <span className="flex flex-col whitespace-nowrap leading-none">
        <span className="text-[19px] font-bold tracking-[-0.01em] lg:text-[21px]">{brand.name}</span>
        <span className="mt-1 text-[9.5px] font-medium tracking-[0.01em] opacity-70 lg:text-[10px]">{brand.tagline}</span>
      </span>
    </Link>
  );
}
