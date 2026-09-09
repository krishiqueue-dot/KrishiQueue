import { LogoMark, Wordmark } from "./Logo";
import { useI18n } from "@/i18n";
import type { DictKey } from "@/i18n/en";

const EXPLORE: { href: string; key: DictKey }[] = [
  { href: "#problem", key: "nav.problem" },
  { href: "#solution", key: "nav.solution" },
  { href: "#how-it-works", key: "nav.how" },
  { href: "#live-queue", key: "nav.queue" },
  { href: "#prototype", key: "nav.prototype" },
  { href: "#roadmap", key: "road.eyebrow" },
];

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="relative isolate overflow-hidden bg-ink-950 text-ivory-100">
      <div
        aria-hidden
        className="furrows pointer-events-none absolute inset-0 text-ivory-100 opacity-40"
      />
      <div className="relative mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-8 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr] md:gap-8">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark tone="light" />
              <Wordmark tone="light" label={t("brand.name")} />
            </div>
            <p className="mt-4 max-w-[34ch] font-display text-[19px] leading-snug text-ivory-100/85">
              {t("brand.tagline")}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-saffron-500/35 bg-saffron-500/10 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-saffron-400 uppercase">
                {t("brand.sih")}
              </span>
              <span className="rounded-full border border-ivory-100/15 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-ivory-200/55 uppercase">
                {t("footer.ps")}
              </span>
            </div>
          </div>

          <FooterColumn title={t("footer.explore")} links={EXPLORE} />
        </div>

        <div className="mt-14 border-t border-ivory-100/10 pt-7">
          <p className="max-w-[80ch] text-[12.5px] leading-relaxed text-ivory-200/55">
            {t("footer.notGov")}
          </p>
          <div className="mt-5 flex flex-col gap-2 text-[11.5px] text-ivory-200/40 sm:flex-row sm:items-center sm:justify-between">
            <p>{t("footer.built")}</p>
            <p>{t("footer.rights")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; key: DictKey }[];
}) {
  const { t } = useI18n();
  return (
    <nav aria-label={title}>
      <p className="font-mono text-[9.5px] tracking-[0.18em] text-ivory-200/40 uppercase">
        {title}
      </p>
      <ul className="mt-3 space-y-1.5">
        {links.map((link) => (
          <li key={`${link.href}-${link.key}`}>
            <a
              href={link.href}
              className="inline-block py-1 text-[13.5px] text-ivory-100/70 transition-colors hover:text-ivory-50"
            >
              {t(link.key)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
