import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icons";
import Logo from "@/components/ui/Logo";
import NewsletterForm from "@/components/home/NewsletterForm";
import { footer } from "@/data/home";

/** Wordmark-style payment chips. Swap for official logo files when supplied. */
const paymentMarks = {
  visa: <span className="text-[14px] font-black italic tracking-[-0.02em] text-[#1a1f71]">VISA</span>,
  mastercard: (
    <span className="flex">
      <span className="size-[17px] rounded-full bg-[#eb001b]" />
      <span className="-ml-[7px] size-[17px] rounded-full bg-[#f79e1b] mix-blend-multiply" />
    </span>
  ),
  bkash: <span className="text-[12.5px] font-bold tracking-[-0.01em] text-[#d12053]">bKash</span>,
  nagad: <span className="text-[12.5px] font-bold tracking-[-0.01em] text-[#ec1c24]">Nagad</span>,
};

const paymentNames = { visa: "Visa", mastercard: "Mastercard", bkash: "bKash", nagad: "Nagad" };

export default function SiteFooter() {
  return (
    <footer id="footer" className="bg-forest-925 text-white">
      <Container className="pt-12 lg:pt-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.15fr_0.9fr_1.1fr_1.15fr] lg:gap-8">
          <div>
            <Logo />
            <ul className="mt-6 flex gap-1.5">
              {footer.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    className="grid size-9 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-mint-400"
                  >
                    <Icon name={s.icon} className="size-[17px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {footer.columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-[13.5px] font-semibold">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[12.5px] text-white/60 transition-colors hover:text-mint-400">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h3 className="text-[13.5px] font-semibold">{footer.newsletter.title}</h3>
            <p className="mb-4 mt-3 text-[12.5px] text-white/60">{footer.newsletter.text}</p>
            <NewsletterForm placeholder={footer.newsletter.placeholder} />
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse gap-5 border-t border-white/10 py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[12px] text-white/50">{footer.copyright}</p>
          <ul className="flex flex-wrap items-center gap-2">
            {footer.payments.map((p) => (
              <li key={p} title={paymentNames[p]} className="grid h-8 w-[54px] place-items-center rounded-md bg-white">
                <span className="sr-only">{paymentNames[p]}</span>
                {paymentMarks[p]}
              </li>
            ))}
            <li className="flex h-8 items-center gap-1.5 rounded-md border border-mint-400/30 bg-mint-400/10 px-2.5 text-mint-300">
              <Icon name="lock" className="size-3.5" strokeWidth={2} />
              <span className="text-[11px] font-semibold leading-none">Secure Checkout</span>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
