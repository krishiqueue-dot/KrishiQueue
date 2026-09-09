import { Check, ChevronRight, RotateCcw } from "lucide-react";
import { DemoTag } from "@/components/ui/primitives";
import { DEMO, formatINR } from "@/data/india";
import { useI18n } from "@/i18n";
import type { DictKey } from "@/i18n/en";
import { cn } from "@/lib/cn";
import { PROC_STAGES, nowLabel, usePrototype } from "@/state/prototype";

const STAGE_KEYS: DictKey[] = [
  "proc.s1",
  "proc.s2",
  "proc.s3",
  "proc.s4",
  "proc.s5",
  "proc.s6",
  "proc.s7",
  "proc.s8",
];

/** Times are illustrative: the point is that each stage carries one. */
const STAGE_TIMES = ["07:12", "08:02", "08:14", "08:46", "08:58", "09:06", "09:20", "11:44"];

export function ProcurementDemo() {
  const { t, tl } = useI18n();
  const p = usePrototype();
  const last = PROC_STAGES.length - 1;

  const advance = () => {
    const next = p.stageIndex + 1;
    if (next > last) return;

    if (next === 5) {
      p.advanceStage({
        kind: "app",
        title: t("proc.s6"),
        body: tl({
          en: `${p.acceptedQtl} quintal accepted · Grade ${DEMO.grade}`,
          hi: `${p.acceptedQtl} क्विंटल स्वीकृत · श्रेणी ${DEMO.grade}`,
          te: `${p.acceptedQtl} క్వింటాల్ ఆమోదం · గ్రేడ్ ${DEMO.grade}`,
        }),
        at: nowLabel(),
      });
      return;
    }
    if (next === 7) {
      p.advanceStage({
        kind: "sms",
        title: t("pay.completed"),
        body: `${formatINR(p.amount)} · ${DEMO.paymentRef}`,
        at: nowLabel(),
      });
      return;
    }
    p.advanceStage();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
      {/* ---------------- Timeline ---------------- */}
      <div>
        <ol className="relative">
          <span
            aria-hidden
            className="absolute top-4 bottom-4 left-[13px] w-px bg-ink-900/12"
          />
          <span
            aria-hidden
            className="absolute top-4 left-[13px] w-px bg-agri-500 transition-[height] duration-500 ease-out"
            style={{ height: `${(p.stageIndex / (STAGE_KEYS.length - 1)) * 88}%` }}
          />

          {STAGE_KEYS.map((key, i) => {
            const done = i < p.stageIndex;
            const current = i === p.stageIndex;
            const future = i > p.stageIndex;
            return (
              <li key={key} className="relative flex items-start gap-4 py-2.5">
                <span
                  className={cn(
                    "relative z-10 mt-0.5 flex h-[27px] w-[27px] shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                    done
                      ? "border-agri-500 bg-agri-500 text-white"
                      : current
                        ? "border-saffron-500 bg-ivory-100"
                        : "border-ink-900/15 bg-ivory-100",
                  )}
                >
                  {done && <Check size={14} strokeWidth={3} />}
                  {current && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-saffron-500" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-saffron-500" />
                    </span>
                  )}
                </span>

                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <p
                      className={cn(
                        "text-[14px] font-semibold transition-colors",
                        future ? "text-ink-700/35" : "text-ink-900",
                      )}
                    >
                      {t(key)}
                    </p>
                    <span
                      className={cn(
                        "font-mono text-[11px] tabular",
                        future ? "text-transparent" : "text-ink-700/45",
                      )}
                    >
                      {STAGE_TIMES[i]}
                    </span>
                  </div>
                  {current && (
                    <p className="kq-swap mt-1 text-[12px] text-saffron-700">
                      {t("common.inProgress")}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={advance}
            disabled={p.stageIndex >= last}
            className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-[13px] font-semibold text-ivory-50 transition-colors hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-35"
          >
            {t("proc.advance")}
            <ChevronRight size={15} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            onClick={() => p.setStage(0)}
            className="inline-flex items-center gap-2 rounded-full border border-ink-900/15 px-4 py-2.5 text-[13px] font-semibold text-ink-700 transition-colors hover:border-ink-900/35"
          >
            <RotateCcw size={14} />
            {t("common.reset")}
          </button>
          <DemoTag label={t("tag.simulation")} />
        </div>
      </div>

      {/* ---------------- Lot record ---------------- */}
      <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-lift sm:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-mono text-[9.5px] tracking-[0.16em] text-ink-700/45 uppercase">
            {t("proc.lotId")}
          </p>
          <p className="font-mono text-[12.5px] font-semibold tabular">{DEMO.lotId}</p>
        </div>

        <dl className="mt-4">
          {(
            [
              [t("common.token"), `KQ-${String(p.tokenNumber).padStart(3, "0")}`, true],
              [t("common.crop"), tl(p.crop.name), false],
              [
                t("proc.grossWeight"),
                p.stageIndex >= 3 ? `${DEMO.grossWeightQtl} ${t("common.quintal")}` : "—",
                true,
              ],
              [t("proc.moisture"), p.stageIndex >= 4 ? `${DEMO.moisturePct}%` : "—", true],
              [t("proc.grade"), p.stageIndex >= 4 ? DEMO.grade : "—", true],
              [
                t("proc.acceptedQty"),
                p.stageIndex >= 5 ? `${p.acceptedQtl} ${t("common.quintal")}` : "—",
                true,
              ],
              [
                t("pay.rate"),
                p.stageIndex >= 5 ? `${formatINR(p.crop.demoRate)} / ${t("common.quintal")}` : "—",
                true,
              ],
            ] as [string, string, boolean][]
          ).map(([k, v, mono]) => (
            <div
              key={k}
              className="flex items-baseline justify-between gap-4 border-b border-ink-900/8 py-2.5 last:border-b-0"
            >
              <dt className="text-[12.5px] text-ink-700/60">{k}</dt>
              <dd
                className={cn(
                  "text-right text-[13.5px] font-semibold",
                  mono && "font-mono tabular",
                  v === "—" && "text-ink-700/30",
                )}
              >
                {v}
              </dd>
            </div>
          ))}
        </dl>

        <div
          className={cn(
            "mt-5 rounded-xl border p-4 transition-colors duration-300",
            p.stageIndex >= 5
              ? "border-agri-500/25 bg-agri-50"
              : "border-ink-900/10 bg-ivory-100",
          )}
        >
          <p className="font-mono text-[9.5px] tracking-[0.14em] text-ink-700/50 uppercase">
            {t("pay.amount")}
          </p>
          <p
            key={p.stageIndex >= 5 ? "on" : "off"}
            className={cn(
              "kq-swap mt-1.5 font-mono text-[clamp(1.5rem,4vw,1.9rem)] leading-none font-semibold",
              p.stageIndex >= 5 ? "text-agri-800" : "text-ink-700/30",
            )}
          >
            {p.stageIndex >= 5 ? formatINR(p.amount) : "—"}
          </p>
          <p className="mt-2 text-[11.5px] text-ink-700/55">
            {p.stageIndex >= 5
              ? `${p.acceptedQtl} × ${formatINR(p.crop.demoRate)}`
              : t("proc.s5")}
          </p>
        </div>

        <p className="mt-4 text-[11px] leading-relaxed text-ink-700/45">
          {tl({
            en: "Every stage above is written against the token with an actor, a counter and a timestamp — the audit trail a farmer can be shown on request.",
            hi: "ऊपर का हर चरण कर्ता, काउंटर और समय के साथ टोकन के विरुद्ध दर्ज होता है — वह ऑडिट रिकॉर्ड जो माँगने पर किसान को दिखाया जा सकता है।",
            te: "పైన ఉన్న ప్రతి దశ చేసినవారు, కౌంటర్, సమయంతో టోకెన్‌కు నమోదవుతుంది — అడిగితే రైతుకు చూపగలిగే ఆడిట్ రికార్డు ఇది.",
          })}
        </p>
      </div>
    </div>
  );
}
