import Link from "next/link";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icons";

/**
 * Dark strip at the top of inner pages: gives the transparent site header
 * its dark backdrop and carries the breadcrumb.
 * `crumbs`: [{ label, href? }] — the last item is the current page.
 */
export default function PageBand({ crumbs }) {
  return (
    <section className="relative isolate overflow-hidden bg-forest-950 pb-5 pt-[88px] text-white lg:pb-6 lg:pt-[108px]">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(50%_120%_at_85%_0%,rgb(107_212_119/0.12),transparent_70%)]" />
      <Container>
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12.5px]">
            {crumbs.map((crumb, i) => {
              const last = i === crumbs.length - 1;
              return (
                <li key={crumb.label} className="flex min-w-0 items-center gap-1.5">
                  {i > 0 && <Icon name="chevronRight" className="size-3.5 shrink-0 text-white/35" strokeWidth={2} />}
                  {last || !crumb.href ? (
                    <span aria-current={last ? "page" : undefined} className={`truncate ${last ? "font-medium text-white" : "text-white/60"}`}>
                      {crumb.label}
                    </span>
                  ) : (
                    <Link href={crumb.href} className="text-white/60 transition-colors hover:text-mint-400">
                      {crumb.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </Container>
    </section>
  );
}
