import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icons";
import { whyUs } from "@/data/home";

export default function WhyChooseUs() {
  return (
    <section id="why-us" aria-labelledby="why-us-title" className="scroll-mt-20 bg-forest-900 py-10 text-white lg:py-11">
      <Container className="grid gap-8 lg:grid-cols-[200px_1fr] lg:items-center lg:gap-10 xl:grid-cols-[210px_1fr_auto] xl:gap-10">
        <div>
          <h2 id="why-us-title" className="text-[20px] font-semibold tracking-[-0.01em]">
            {whyUs.title} <span className="text-mint-400">{whyUs.highlight}</span>
          </h2>
          <p className="mt-2 text-[12.5px] leading-relaxed text-white/60">{whyUs.text}</p>
          <span aria-hidden="true" className="mt-3 block h-[3px] w-8 rounded-full bg-mint-400" />
        </div>

        <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-6 md:grid-cols-4 lg:gap-x-5">
          {whyUs.items.map((item) => (
            <li key={item.title} className="flex flex-col gap-3 2xl:flex-row 2xl:items-center">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/[0.06] text-mint-400 ring-1 ring-white/10">
                <Icon name={item.icon} className="size-[22px]" />
              </span>
              <span className="leading-tight">
                <span className="block text-[12.5px] font-semibold">{item.title}</span>
                <span className="mt-1 block text-[11.5px] text-white/55">{item.text}</span>
              </span>
            </li>
          ))}
        </ul>

        <div aria-hidden="true" className="hidden items-center gap-8 xl:flex">
          <span className="h-14 w-px bg-white/15" />
          <div className="-rotate-[9deg] font-script text-[24px] leading-[1.05] text-white/90">
            <p>{whyUs.signature[0]}</p>
            <p className="pl-1">{whyUs.signature[1]}</p>
            <svg viewBox="0 0 160 14" className="-mt-0.5 ml-4 w-[130px] text-white/80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M2 11C40 4 100 1 158 3" />
            </svg>
          </div>
        </div>
      </Container>
    </section>
  );
}
