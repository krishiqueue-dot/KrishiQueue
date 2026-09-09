import { motion } from "framer-motion";
import {
  BadgeCheck,
  CalendarCheck,
  Check,
  HelpCircle,
  Hourglass,
  ListOrdered,
  ScrollText,
  Sunrise,
  Ticket,
  Truck,
  UserRoundCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Eyebrow, Reveal, useGrow, useReveal } from "@/components/ui/primitives";
import { useI18n } from "@/i18n";
import type { DictKey } from "@/i18n/en";

const OLD_WAY: { icon: LucideIcon; key: DictKey }[] = [
  { icon: Sunrise, key: "solution.old1" },
  { icon: Hourglass, key: "solution.old2" },
  { icon: HelpCircle, key: "solution.old3" },
  { icon: Hourglass, key: "solution.old4" },
  { icon: Truck, key: "solution.old5" },
];

const NEW_WAY: { icon: LucideIcon; key: DictKey }[] = [
  { icon: UserRoundCheck, key: "solution.new1" },
  { icon: CalendarCheck, key: "solution.new2" },
  { icon: Ticket, key: "solution.new3" },
  { icon: ListOrdered, key: "solution.new4" },
  { icon: ScrollText, key: "solution.new5" },
  { icon: Wallet, key: "solution.new6" },
];

export function Solution() {
  const { t } = useI18n();

  return (
    <section id="solution" className="relative isolate overflow-hidden bg-white scroll-mt-20">
      <div className="relative mx-auto w-full max-w-[1180px] px-5 py-20 sm:px-8 md:py-28">
        <div className="max-w-[46rem]">
          <Reveal>
            <Eyebrow>{t("solution.eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-[clamp(1.9rem,4.6vw,3.1rem)] font-semibold">
              {t("solution.title")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[58ch] text-[15px] leading-relaxed text-ink-700/80">
              {t("solution.sub")}
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.25fr] lg:gap-10">
          <OldWayColumn />
          <NewWayColumn />
        </div>

        <Reveal delay={0.1}>
          <p className="mt-10 flex items-start gap-3 border-l-2 border-saffron-500 pl-5 text-[14.5px] leading-relaxed text-ink-700/80 italic">
            {t("solution.note")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function OldWayColumn() {
  const { t } = useI18n();
  const reveal = useReveal();

  return (
    <motion.div
      {...reveal(0)}
      className="relative rounded-3xl border border-dashed border-ink-900/20 bg-ivory-100/70 p-6 sm:p-8"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-mono text-[11px] font-semibold tracking-[0.18em] text-ink-700/55 uppercase">
          {t("solution.oldWay")}
        </h3>
        <span className="rounded-full bg-clay-100 px-2.5 py-1 font-mono text-[9.5px] tracking-[0.14em] text-clay-600 uppercase">
          {t("problem.c2.stat")}
        </span>
      </div>

      <ol className="relative mt-7">
        {/* the dashed spine */}
        <span
          aria-hidden
          className="absolute top-3 bottom-3 left-[15px] w-px border-l border-dashed border-ink-900/25"
        />
        {OLD_WAY.map((step, i) => {
          const Icon = step.icon;
          const isLoop = i === 1 || i === 3;
          return (
            <motion.li
              key={`${step.key}-${i}`}
              {...reveal(0.06 * i, 10, 0.4)}
              className="relative flex items-center gap-4 py-3"
            >
              <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink-900/15 bg-ivory-100 text-ink-700/60">
                <Icon size={14} strokeWidth={1.9} />
              </span>
              <span className="text-[14.5px] text-ink-700/75">{t(step.key)}</span>
              {isLoop && (
                <span className="ml-auto font-mono text-[10px] tracking-[0.12em] text-clay-500/70 uppercase">
                  ↺
                </span>
              )}
            </motion.li>
          );
        })}
      </ol>

      {/* the loop that has no defined end */}
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-clay-500/25 bg-clay-100/40 px-3.5 py-3">
        <Hourglass size={14} className="shrink-0 text-clay-600" strokeWidth={2} />
        <p className="text-[12.5px] leading-snug text-clay-600">
          {t("problem.c1.stat")} · {t("problem.c5.stat")}
        </p>
      </div>
    </motion.div>
  );
}

function NewWayColumn() {
  const { t } = useI18n();
  const reveal = useReveal();
  const grow = useGrow();

  return (
    <motion.div
      {...reveal(0.08)}
      className="grain relative overflow-hidden rounded-3xl border border-ink-950/40 bg-ink-900 p-6 text-ivory-100 sm:p-8"
    >
      <div
        aria-hidden
        className="survey-grid pointer-events-none absolute inset-0 text-ivory-100 opacity-30"
      />
      <div className="relative flex items-center justify-between gap-3">
        <h3 className="font-mono text-[11px] font-semibold tracking-[0.18em] text-saffron-400 uppercase">
          {t("solution.newWay")}
        </h3>
        <span className="rounded-full border border-agri-500/30 bg-agri-500/10 px-2.5 py-1 font-mono text-[9.5px] tracking-[0.14em] text-agri-400 uppercase">
          {t("tag.prototype")}
        </span>
      </div>

      <ol className="relative mt-7 grid gap-1 sm:grid-cols-2 sm:gap-x-8">
        {/* solid spine: this path has a defined end */}
        <motion.span
          aria-hidden
          className="absolute top-4 left-[17px] w-[2px] origin-top rounded-full bg-gradient-to-b from-agri-500 via-agri-500 to-saffron-500 sm:hidden"
          style={{ height: "calc(100% - 2rem)" }}
          {...grow(1, 0.2, 0.9, "scaleX")}
        />
        {NEW_WAY.map((step, i) => {
          const Icon = step.icon;
          const last = i === NEW_WAY.length - 1;
          return (
            <motion.li
              key={step.key}
              {...reveal(0.1 + i * 0.07, 10, 0.42)}
              className="relative flex items-center gap-3.5 py-3"
            >
              <span
                className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  last
                    ? "border-saffron-400/45 bg-saffron-400/12 text-saffron-400"
                    : "border-agri-500/35 bg-agri-500/10 text-agri-400"
                }`}
              >
                <Icon size={15} strokeWidth={1.9} />
              </span>
              <div className="min-w-0">
                <span className="block font-mono text-[9.5px] tracking-[0.16em] text-ivory-200/40 uppercase">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="block text-[14.5px] font-medium text-ivory-50">
                  {t(step.key)}
                </span>
              </div>
              {last && (
                <BadgeCheck size={16} className="ml-auto shrink-0 text-agri-400" strokeWidth={2} />
              )}
            </motion.li>
          );
        })}
      </ol>

      <div className="relative mt-6 flex flex-wrap items-center gap-2 border-t border-ivory-100/10 pt-5">
        {["proc.s1", "proc.s4", "proc.s5", "proc.s6", "proc.s8"].map((key, i) => (
          <motion.span
            key={key}
            {...reveal(0.5 + i * 0.08, 6, 0.35)}
            className="inline-flex items-center gap-1.5 rounded-full border border-ivory-100/12 px-2.5 py-1.5 text-[11px] text-ivory-200/70"
          >
            <Check size={11} strokeWidth={3} className="text-agri-400" />
            {t(key as DictKey)}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
