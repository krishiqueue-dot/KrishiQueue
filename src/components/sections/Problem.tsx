import { motion } from "framer-motion";
import {
  Banknote,
  ClipboardList,
  Clock3,
  EyeOff,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Eyebrow, Reveal, useGrow, useReveal } from "@/components/ui/primitives";
import { useI18n } from "@/i18n";
import type { DictKey } from "@/i18n/en";

const ITEMS: { icon: LucideIcon; title: DictKey; body: DictKey; stat: DictKey }[] = [
  { icon: Clock3, title: "problem.c1.title", body: "problem.c1.body", stat: "problem.c1.stat" },
  { icon: EyeOff, title: "problem.c2.title", body: "problem.c2.body", stat: "problem.c2.stat" },
  { icon: Users, title: "problem.c3.title", body: "problem.c3.body", stat: "problem.c3.stat" },
  {
    icon: ClipboardList,
    title: "problem.c4.title",
    body: "problem.c4.body",
    stat: "problem.c4.stat",
  },
  { icon: Banknote, title: "problem.c5.title", body: "problem.c5.body", stat: "problem.c5.stat" },
];

export function Problem() {
  const { t } = useI18n();

  return (
    <section
      id="problem"
      className="relative isolate overflow-hidden bg-ivory-100 scroll-mt-20"
    >
      <div
        aria-hidden
        className="furrows pointer-events-none absolute inset-0 text-ink-900 opacity-60"
      />
      <div className="relative mx-auto w-full max-w-[1180px] px-5 py-20 sm:px-8 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          {/* Sticky heading column */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <Eyebrow>{t("problem.eyebrow")}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 text-[clamp(1.9rem,4.4vw,2.9rem)] font-semibold">
                {t("problem.title")}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-[46ch] text-[14.5px] leading-relaxed text-ink-700/80">
                {t("problem.sub")}
              </p>
            </Reveal>
          </div>

          {/* The ledger */}
          <ol className="border-t border-ink-900/12">
            {ITEMS.map((item, i) => (
              <ProblemRow key={item.title} item={item} index={i} />
            ))}
          </ol>
        </div>

        <CompoundingCost />
      </div>
    </section>
  );
}

function ProblemRow({
  item,
  index,
}: {
  item: (typeof ITEMS)[number];
  index: number;
}) {
  const { t } = useI18n();
  const reveal = useReveal();
  const grow = useGrow();
  const Icon = item.icon;

  return (
    <motion.li
      className="group relative border-b border-ink-900/12"
      {...reveal(index * 0.06, 14, 0.45)}
    >
      {/* A short accent tick that draws in as the row enters — enough to
          mark the row without laying five orange rules across the page. */}
      <motion.span
        aria-hidden
        className="absolute top-0 left-0 h-[2px] w-10 origin-left bg-saffron-500"
        {...grow(1, 0.1 + index * 0.06, 0.7, "scaleX")}
      />

      <div className="flex items-start gap-4 py-7 transition-colors sm:gap-6">
        <span className="mt-0.5 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-700/40 tabular">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink-900/12 bg-white text-ink-800 transition-colors duration-300 group-hover:border-saffron-500/50 group-hover:text-saffron-700">
          <Icon size={16} strokeWidth={1.9} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="font-display text-[19px] font-semibold sm:text-[21px]">
              {t(item.title)}
            </h3>
            <span className="font-mono text-[10.5px] tracking-[0.13em] text-ink-700/45 uppercase">
              {t(item.stat)}
            </span>
          </div>
          <p className="mt-2.5 max-w-[58ch] text-[14.5px] leading-relaxed text-ink-700/75">
            {t(item.body)}
          </p>
        </div>
      </div>
    </motion.li>
  );
}

/* ==================================================================
   The compounding cost — one illustrative day, drawn to scale.
   ================================================================== */

const DAY = [
  { at: "04:30", key: "leave", span: 1.5, kind: "travel" as const },
  { at: "06:00", key: "arrive", span: 8.3, kind: "wait" as const },
  { at: "14:20", key: "weigh", span: 0.7, kind: "work" as const },
  { at: "15:00", key: "return", span: 1.5, kind: "travel" as const },
];

const DAY_LABELS: Record<string, { en: string; hi: string; te: string }> = {
  leave: { en: "Leave the village", hi: "गाँव से निकलना", te: "గ్రామం నుండి బయలుదేరడం" },
  arrive: { en: "Waiting at the centre", hi: "केंद्र पर प्रतीक्षा", te: "కేంద్రంలో నిరీక్షణ" },
  weigh: { en: "Weighment & handover", hi: "तौल और सुपुर्दगी", te: "తూకం & అప్పగింత" },
  return: { en: "Journey home", hi: "घर वापसी", te: "ఇంటికి తిరుగు ప్రయాణం" },
};

const KIND_STYLE = {
  travel: "bg-ink-700",
  wait: "bg-clay-500",
  work: "bg-agri-500",
} as const;

function CompoundingCost() {
  const { t, tl } = useI18n();
  const grow = useGrow();
  const total = DAY.reduce((n, d) => n + d.span, 0);

  return (
    <Reveal delay={0.1} className="mt-16 md:mt-20">
      <div className="grain relative overflow-hidden rounded-3xl border border-ink-950/40 bg-ink-900 p-7 text-ivory-100 sm:p-10">
        <div
          aria-hidden
          className="survey-grid pointer-events-none absolute inset-0 text-ivory-100 opacity-30"
        />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-14">
          <div>
            <h3 className="font-display text-[clamp(1.4rem,3vw,2rem)] font-semibold">
              {t("problem.cost.title")}
            </h3>
            <p className="mt-4 max-w-[46ch] text-[14.5px] leading-relaxed text-ivory-200/70">
              {t("problem.cost.body")}
            </p>
          </div>

          <div>
            {/* Proportional day bar */}
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-ivory-100/10">
              {DAY.map((d, i) => (
                <motion.div
                  key={d.key}
                  className={KIND_STYLE[d.kind]}
                  {...grow(`${(d.span / total) * 100}%`, 0.15 + i * 0.12, 0.75)}
                />
              ))}
            </div>

            <ul className="mt-5 space-y-0">
              {DAY.map((d) => (
                <li
                  key={d.key}
                  className="flex items-center gap-3 border-b border-ivory-100/10 py-2.5 last:border-b-0"
                >
                  <span
                    aria-hidden
                    className={`h-2 w-2 shrink-0 rounded-full ${KIND_STYLE[d.kind]}`}
                  />
                  <span className="font-mono text-[11.5px] tabular text-ivory-200/55">{d.at}</span>
                  <span className="flex-1 text-[13.5px] text-ivory-100/85">
                    {tl(DAY_LABELS[d.key])}
                  </span>
                  <span className="font-mono text-[11.5px] tabular text-ivory-200/45">
                    {d.span}h
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-[11px] leading-relaxed text-ivory-200/40">
              {tl({
                en: "An illustrative day, not a measured average. It is drawn to show where the hours go, and which block KrishiQueue is designed to shrink.",
                hi: "यह एक उदाहरणात्मक दिन है, कोई मापा गया औसत नहीं। यह दिखाने के लिए है कि घंटे कहाँ जाते हैं, और कृषिक्यू किस हिस्से को घटाने के लिए बनाया गया है।",
                te: "ఇది ఒక ఉదాహరణ దినం, కొలిచిన సగటు కాదు. గంటలు ఎక్కడ గడిచిపోతున్నాయో, కృషిక్యూ ఏ భాగాన్ని తగ్గించడానికి రూపొందించబడిందో చూపడానికి ఇది.",
              })}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
