import { motion } from "framer-motion";
import { ArrowRight, MapPin, RotateCcw, Sparkles, TriangleAlert } from "lucide-react";
import { useState } from "react";
import {
  CONGESTION_STYLE,
  CongestionDot,
  CountUp,
  Eyebrow,
  Reveal,
  useGrow,
} from "@/components/ui/primitives";
import { centreName, type Centre } from "@/data/india";
import { useI18n } from "@/i18n";
import type { DictKey } from "@/i18n/en";
import { cn } from "@/lib/cn";
import { usePrototype } from "@/state/prototype";

export function Congestion() {
  const { t } = useI18n();
  const p = usePrototype();

  const worst = Math.max(...p.region.centres.map((c) => c.waitMin));

  return (
    <section
      id="congestion"
      className="relative isolate overflow-hidden bg-ivory-100 scroll-mt-20"
    >
      <div
        aria-hidden
        className="furrows pointer-events-none absolute inset-0 text-ink-900 opacity-60"
      />
      <div className="relative mx-auto w-full max-w-[1180px] px-5 py-20 sm:px-8 md:py-28">
        <div className="max-w-[46rem]">
          <Reveal>
            <Eyebrow>{t("cong.eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-[clamp(1.9rem,4.6vw,3.1rem)] font-semibold">
              {t("cong.title")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[56ch] text-[15px] leading-relaxed text-ink-700/80">
              {t("cong.sub")}
            </p>
          </Reveal>
        </div>

        {/* Comparative board */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {p.region.centres.map((centre, i) => (
            <CentreLoadCard key={centre.id} centre={centre} worst={worst} index={i} />
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-6 flex items-center gap-2.5 text-[13.5px] text-ink-700/70">
            <MapPin size={15} className="shrink-0 text-saffron-600" strokeWidth={2} />
            {t("cong.hint")}
          </p>
        </Reveal>

        <Recommendation />
      </div>
    </section>
  );
}

function CentreLoadCard({
  centre,
  worst,
  index,
}: {
  centre: Centre;
  worst: number;
  index: number;
}) {
  const { t, tl, lang } = useI18n();
  const p = usePrototype();
  const grow = useGrow();
  const style = CONGESTION_STYLE[centre.congestion];
  const selected = centre.id === p.centreId;

  return (
    <Reveal delay={index * 0.08}>
      <button
        type="button"
        onClick={() => p.setCentre(centre.id)}
        aria-pressed={selected}
        className={cn(
          "flex h-full w-full flex-col rounded-2xl border bg-white p-5 text-left transition-all duration-200",
          selected ? "border-ink-900 shadow-lift" : "border-ink-900/12 hover:border-ink-900/30",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[15px] leading-snug font-semibold">
              {centreName(centre.place, lang)}
            </p>
            <p className="mt-1 text-[11.5px] text-ink-700/55">
              {tl(centre.subdivision)} · {tl(centre.district)}
            </p>
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1",
              style.border,
              style.bg,
            )}
          >
            <CongestionDot level={centre.congestion} />
            <span className={cn("text-[10.5px] font-semibold", style.text)}>
              {t(`congestion.${centre.congestion}Short` as DictKey)}
            </span>
          </span>
        </div>

        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[9.5px] tracking-[0.14em] text-ink-700/45 uppercase">
              {t("cong.wait")}
            </p>
            <p className="mt-1 font-mono text-[34px] leading-none font-semibold tabular">
              <CountUp to={centre.waitMin} duration={1000} />
              <span className="ml-1 text-[13px] font-medium text-ink-700/50">
                {t("common.min")}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[9.5px] tracking-[0.14em] text-ink-700/45 uppercase">
              {t("cong.slotsToday")}
            </p>
            <p className="mt-1 font-mono text-[22px] leading-none font-semibold tabular">
              {centre.slotsOpen}
            </p>
          </div>
        </div>

        {/* Wait time drawn to scale against the worst centre in the region */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-ink-900/8">
          <motion.div
            className={cn("h-full rounded-full", style.bar)}
            {...grow(`${(centre.waitMin / worst) * 100}%`, 0.2 + index * 0.1, 0.8)}
          />
        </div>

        <p className="mt-4 text-[11.5px] text-ink-700/45">
          {t("rec.distance")}: {centre.distanceKm} {t("rec.km")}
        </p>

        <span
          className={cn(
            "mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold",
            selected ? "text-agri-700" : "text-ink-700/50",
          )}
        >
          {selected ? t("cong.selected") : t("cong.select")}
          {!selected && <ArrowRight size={13} strokeWidth={2.4} />}
        </span>
      </button>
    </Reveal>
  );
}

/* ==================================================================
   SMART RECOMMENDATION
   The scenario a farmer would actually hit: they pick the nearest
   centre, which happens to be the busiest one.
   ================================================================== */

function Recommendation() {
  const { t, tl, lang } = useI18n();
  const p = usePrototype();
  const [switched, setSwitched] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const busiest = p.region.centres.reduce((a, b) => (a.waitMin > b.waitMin ? a : b));
  const best = p.region.centres.reduce((a, b) => (a.waitMin < b.waitMin ? a : b));
  const saved = busiest.waitMin - best.waitMin;
  const chosen = switched ? best : busiest;

  const reset = () => {
    setSwitched(false);
    setDismissed(false);
    p.setCentre(busiest.id);
  };

  return (
    <Reveal delay={0.12} className="mt-16 md:mt-20">
      <div className="grain relative overflow-hidden rounded-3xl border border-ink-950/40 bg-ink-900 p-6 text-ivory-100 sm:p-9">
        <div
          aria-hidden
          className="survey-grid pointer-events-none absolute inset-0 text-ivory-100 opacity-30"
        />
        <div className="relative">
          <Eyebrow tone="light">{t("rec.eyebrow")}</Eyebrow>
          <h3 className="mt-5 max-w-[26ch] font-display text-[clamp(1.5rem,3.6vw,2.3rem)] font-semibold">
            {t("rec.title")}
          </h3>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-7">
            {/* What the farmer picked */}
            <div
              className={cn(
                "rounded-2xl border p-5 transition-colors duration-500",
                switched
                  ? "border-ivory-100/12 bg-ivory-100/[0.03] opacity-55"
                  : "border-clay-500/40 bg-clay-500/[0.09]",
              )}
            >
              <div className="flex items-center gap-2">
                <TriangleAlert size={14} className="shrink-0 text-clay-500" strokeWidth={2.2} />
                <p className="font-mono text-[9.5px] tracking-[0.14em] text-clay-500 uppercase">
                  {t("rec.detected")}
                </p>
              </div>
              <p className="mt-3 text-[16px] font-semibold">{centreName(busiest.place, lang)}</p>
              <p className="mt-1 text-[11.5px] text-ivory-200/50">
                {tl(busiest.subdivision)} · {tl(busiest.district)}
              </p>
              <dl className="mt-4 flex gap-7">
                <div>
                  <dt className="font-mono text-[9px] tracking-[0.14em] text-ivory-200/40 uppercase">
                    {t("cong.wait")}
                  </dt>
                  <dd className="mt-1 font-mono text-[26px] leading-none font-semibold text-clay-500">
                    {busiest.waitMin}
                    <span className="ml-1 text-[11px] font-medium text-ivory-200/45">
                      {t("common.min")}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[9px] tracking-[0.14em] text-ivory-200/40 uppercase">
                    {t("cong.slotsToday")}
                  </dt>
                  <dd className="mt-1 font-mono text-[26px] leading-none font-semibold">
                    {busiest.slotsOpen}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[9px] tracking-[0.14em] text-ivory-200/40 uppercase">
                    {t("rec.distance")}
                  </dt>
                  <dd className="mt-1 font-mono text-[26px] leading-none font-semibold">
                    {busiest.distanceKm}
                    <span className="ml-1 text-[11px] font-medium text-ivory-200/45">
                      {t("rec.km")}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex items-center justify-center lg:flex-col">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory-100/15 text-ivory-200/50">
                <ArrowRight size={15} strokeWidth={2.2} className="lg:hidden" />
                <ArrowRight size={15} strokeWidth={2.2} className="hidden lg:block" />
              </span>
            </div>

            {/* What the system suggests */}
            <div
              className={cn(
                "rounded-2xl border p-5 transition-colors duration-500",
                switched
                  ? "border-agri-400/50 bg-agri-500/[0.12]"
                  : "border-agri-500/30 bg-agri-500/[0.07]",
              )}
            >
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="shrink-0 text-agri-400" strokeWidth={2.2} />
                <p className="font-mono text-[9.5px] tracking-[0.14em] text-agri-400 uppercase">
                  {switched ? t("rec.switched") : t("rec.recommended")}
                </p>
              </div>
              <p className="mt-3 text-[16px] font-semibold">{centreName(best.place, lang)}</p>
              <p className="mt-1 text-[11.5px] text-ivory-200/50">
                {tl(best.subdivision)} · {tl(best.district)}
              </p>
              <dl className="mt-4 flex gap-7">
                <div>
                  <dt className="font-mono text-[9px] tracking-[0.14em] text-ivory-200/40 uppercase">
                    {t("cong.wait")}
                  </dt>
                  <dd className="mt-1 font-mono text-[26px] leading-none font-semibold text-agri-400">
                    {best.waitMin}
                    <span className="ml-1 text-[11px] font-medium text-ivory-200/45">
                      {t("common.min")}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[9px] tracking-[0.14em] text-ivory-200/40 uppercase">
                    {t("cong.slotsToday")}
                  </dt>
                  <dd className="mt-1 font-mono text-[26px] leading-none font-semibold">
                    {best.slotsOpen}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[9px] tracking-[0.14em] text-ivory-200/40 uppercase">
                    {t("rec.distance")}
                  </dt>
                  <dd className="mt-1 font-mono text-[26px] leading-none font-semibold">
                    {best.distanceKm}
                    <span className="ml-1 text-[11px] font-medium text-ivory-200/45">
                      {t("rec.km")}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Outcome */}
          <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-ivory-100/10 pt-6">
            {switched ? (
              <>
                <p className="kq-swap text-[14px] font-semibold text-agri-400">
                  {t("rec.saved")} {saved} {t("common.min")}
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-2 rounded-full border border-ivory-100/15 px-4 py-2.5 text-[13px] font-semibold text-ivory-100/80 transition-colors hover:border-ivory-100/35 hover:text-ivory-50"
                >
                  <RotateCcw size={14} />
                  {t("rec.tryAgain")}
                </button>
              </>
            ) : dismissed ? (
              <>
                <p className="kq-swap text-[13.5px] text-ivory-200/65">
                  {tl({
                    en: "Kept the busier centre. The farmer still knows the wait before leaving home — which is the point.",
                    hi: "व्यस्त केंद्र ही रखा। फिर भी किसान घर से निकलने से पहले प्रतीक्षा जानता है — बात यही है।",
                    te: "రద్దీ ఎక్కువ ఉన్న కేంద్రాన్నే ఉంచారు. అయినా రైతుకు ఇంటి నుంచి బయలుదేరక ముందే నిరీక్షణ తెలుసు — విషయం అదే.",
                  })}
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-2 rounded-full border border-ivory-100/15 px-4 py-2.5 text-[13px] font-semibold text-ivory-100/80 transition-colors hover:border-ivory-100/35 hover:text-ivory-50"
                >
                  <RotateCcw size={14} />
                  {t("rec.tryAgain")}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSwitched(true);
                    p.setCentre(best.id);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-agri-500 px-5 py-2.5 text-[13px] font-semibold text-ink-950 transition-colors hover:bg-agri-400"
                >
                  {t("rec.switch")}
                  <ArrowRight size={15} strokeWidth={2.4} />
                </button>
                <button
                  type="button"
                  onClick={() => setDismissed(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-ivory-100/15 px-4 py-2.5 text-[13px] font-semibold text-ivory-100/80 transition-colors hover:border-ivory-100/35 hover:text-ivory-50"
                >
                  {t("rec.keep")}
                </button>
              </>
            )}
            <span className="font-mono text-[10.5px] text-ivory-200/35">
              {t("common.centre")}: {centreName(chosen.place, lang)}
            </span>
          </div>

          <p className="mt-5 max-w-[70ch] text-[11.5px] leading-relaxed text-ivory-200/45">
            {t("rec.explain")} {t("disc.sim")}
          </p>
        </div>
      </div>
    </Reveal>
  );
}
