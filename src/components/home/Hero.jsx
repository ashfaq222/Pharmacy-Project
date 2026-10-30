import Image from "next/image";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icons";
import HeroVideo from "@/components/home/HeroVideo";
import { hero } from "@/data/home";

/** Background stack: placeholder colour → still (poster) → video → legibility overlays. */
function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      {/* Neutral cinematic placeholder; visible only until the still loads. */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_78%_8%,rgb(255_221_170/0.16),transparent_60%),radial-gradient(55%_60%_at_62%_70%,rgb(107_212_119/0.10),transparent_70%),linear-gradient(180deg,#0c2a21_0%,#081c16_55%,#06140f_100%)]" />
      {/* Poster still: shown while the video loads, if it can't play, and for reduced-motion users. */}
      <Image src={hero.media.poster} alt="" fill preload sizes="100vw" className="object-cover object-center" />
      <HeroVideo src={hero.media.video} />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(6_20_15/0.86)_0%,rgb(6_20_15/0.55)_38%,rgb(6_20_15/0.08)_70%,rgb(6_20_15/0.25)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-forest-950/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-forest-950/50 to-transparent" />
    </div>
  );
}

function TrustItem({ icon, title, text }) {
  return (
    <div className="flex flex-col items-center gap-2.5 text-center md:items-start md:text-left xl:flex-row xl:items-center xl:gap-3">
      <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/25 bg-white/[0.04] text-white backdrop-blur-sm">
        <Icon name={icon} className="size-[21px]" />
      </span>
      <span className="leading-tight">
        <span className="block text-[12.5px] font-semibold text-white xl:text-[13px]">{title}</span>
        <span className="mt-1 block text-[11px] text-white/60 xl:text-[11.5px]">{text}</span>
      </span>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-forest-950 text-white">
      <HeroBackdrop />

      <Container className="grid gap-y-10 pb-10 pt-28 sm:pt-32 md:grid-cols-12 md:gap-x-6 lg:min-h-[620px] lg:pb-12 lg:pt-[128px] xl:min-h-[660px] 2xl:min-h-[700px]">
        {/* Copy */}
        <div className="flex flex-col md:col-span-7 lg:col-span-6">
          <p className="animate-rise text-[11px] font-semibold uppercase tracking-[0.26em] text-white/85 sm:text-[12px]">
            {hero.eyebrow}
          </p>
          <h1 className="mt-4 animate-rise text-[38px] font-bold leading-[1.06] tracking-[-0.025em] [animation-delay:80ms] min-[400px]:text-[42px] sm:text-[52px] md:text-[42px] lg:text-[50px] xl:text-[60px] 2xl:text-[64px]">
            {hero.titleLead}
            <br />
            {hero.titleBreak}
            <span className="text-mint-400">{hero.titleHighlight}</span>
          </h1>
          <p className="mt-5 max-w-[440px] animate-rise text-[15px] leading-[1.6] text-white/85 [animation-delay:160ms] sm:text-base">
            {hero.description}
          </p>

          <div className="mt-8 flex animate-rise flex-wrap gap-3 [animation-delay:240ms] sm:gap-4">
            <a
              href={hero.primaryCta.href}
              className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-mint-400 px-7 text-[14px] font-semibold text-forest-950 shadow-[0_8px_24px_-8px_rgb(140_228_148/0.6)] transition-all hover:bg-mint-300 hover:shadow-[0_10px_28px_-6px_rgb(140_228_148/0.7)]"
            >
              {hero.primaryCta.label}
              <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
            </a>
            <a
              href={hero.secondaryCta.href}
              className="inline-flex h-12 items-center rounded-full border border-white/70 px-7 text-[14px] font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-forest-950"
            >
              {hero.secondaryCta.label}
            </a>
          </div>

          <ul className="mt-12 grid animate-rise grid-cols-3 gap-3 [animation-delay:320ms] md:max-w-[420px] lg:mt-auto lg:pt-12 xl:flex xl:max-w-none xl:items-center xl:gap-0">
            {hero.trust.map((item, i) => (
              <li key={item.title} className="contents">
                {i > 0 && <span aria-hidden="true" className="mx-5 hidden h-9 w-px bg-white/20 xl:block 2xl:mx-6" />}
                <TrustItem {...item} />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
