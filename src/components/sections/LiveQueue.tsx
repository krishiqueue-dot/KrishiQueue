import { ChevronRight, Info, RotateCcw, Users } from "lucide-react";
import { Eyebrow, LivePill, Reveal } from "@/components/ui/primitives";
import { centreName } from "@/data/india";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/cn";
import { nowLabel, usePrototype } from "@/state/prototype";

const pad = (n: number) => String(n).padStart(3, "0");

export function LiveQueue() {
  const { t, tl, lang } = useI18n();
  const p = usePrototype();

  const advance = () => {
    const nextServing = p.nowServing + 1;
    const nextPosition = Math.max(0, p.tokenNumber - nextServing);

    // The platform's promise: warn the farmer while there is still travel time.
    if (nextPosition === 3) {
      p.advanceQueue({
        kind: "sms",
        title: tl({
          en: "You are 3 in the queue",
          hi: "आप कतार में तीसरे स्थान पर हैं",
          te: "మీరు క్యూలో మూడవ స్థానంలో ఉన్నారు",
        }),
        body: tl({
          en: `Token ${p.token ?? "KQ-102"} · about ${nextPosition * p.centre.avgServiceMin} minutes. Please reach the centre.`,
          hi: `टोकन ${p.token ?? "KQ-102"} · लगभग ${nextPosition * p.centre.avgServiceMin} मिनट। कृपया केंद्र पहुँचें।`,
          te: `టోకెన్ ${p.token ?? "KQ-102"} · సుమారు ${nextPosition * p.centre.avgServiceMin} నిమిషాలు. దయచేసి కేంద్రానికి చేరుకోండి.`,
        }),
        at: nowLabel(),
      });
      return;
    }

    if (nextPosition === 0) {
      p.advanceQueue({
        kind: "app",
        title: t("queue.yourTurn"),
        body: `${t("common.counter")} ${(nextServing % p.centre.counters) + 1}`,
        at: nowLabel(),
      });
      return;
    }

    p.advanceQueue();
  };

  const statusMessage = p.isComplete
    ? t("queue.done")
    : p.position === 0
      ? t("queue.yourTurn")
      : p.position === 1
        ? t("queue.youAreNext")
        : `${p.position} ${t("queue.aheadOfYou")}`;

  return (
    <section
      id="live-queue"
      className="relative isolate overflow-hidden bg-ink-900 text-ivory-100 scroll-mt-20"
    >
      <div
        aria-hidden
        className="survey-grid pointer-events-none absolute inset-0 text-ivory-100 opacity-30"
      />
      <div className="relative mx-auto w-full max-w-[1180px] px-5 py-20 sm:px-8 md:py-28">
        <div className="max-w-[46rem]">
          <Reveal>
            <Eyebrow tone="light">{t("queue.eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-[clamp(1.9rem,4.6vw,3.1rem)] font-semibold">
              {t("queue.title")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[56ch] text-[15px] leading-relaxed text-ivory-200/70">
              {t("queue.sub")}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="mt-12">
          <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr] lg:gap-6">
            {/* ---------------- Board ---------------- */}
            <div className="overflow-hidden rounded-3xl border border-ivory-100/12 bg-ink-950">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-ivory-100/10 px-5 py-4 sm:px-6">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.16em] text-ivory-200/40 uppercase">
                    {t("queue.board")}
                  </p>
                  <p className="mt-1.5 text-[15px] font-semibold">
                    {centreName(p.centre.place, lang)}
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-ivory-200/50">
                    {tl(p.centre.subdivision)} · {tl(p.centre.district)} · {tl(p.region.state)}
                  </p>
                </div>
                <LivePill label={t("tag.live")} />
              </div>

              {/* Now serving */}
              <div className="flex items-end justify-between gap-4 border-b border-ivory-100/10 px-5 py-6 sm:px-6">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.16em] text-ivory-200/40 uppercase">
                    {t("common.nowServing")}
                  </p>
                  <p
                    key={p.nowServing}
                    className="kq-swap mt-1.5 font-mono text-[clamp(2rem,6vw,2.75rem)] leading-none font-semibold tracking-tight text-saffron-400"
                  >
                    KQ-{pad(p.nowServing)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[10px] tracking-[0.16em] text-ivory-200/40 uppercase">
                    {t("common.counter")}
                  </p>
                  <p className="mt-1.5 font-mono text-[clamp(2rem,6vw,2.75rem)] leading-none font-semibold">
                    {(p.nowServing % p.centre.counters) + 1}
                  </p>
                </div>
              </div>

              {/* Rows */}
              <ul key={`rows-${p.nowServing}`} className="divide-y divide-ivory-100/8">
                {p.board.map((row, i) => {
                  const isYou = row.number === p.tokenNumber;
                  return (
                    <li
                      key={row.number}
                      style={{ animationDelay: `${i * 0.045}s` }}
                      className={cn(
                        "kq-slide flex items-center justify-between gap-3 px-5 py-3.5 sm:px-6",
                        row.status === "serving" && "bg-saffron-400/[0.07]",
                        isYou && "bg-agri-500/[0.08]",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden
                          className={cn(
                            "h-1.5 w-1.5 shrink-0 rounded-full",
                            row.status === "serving"
                              ? "bg-saffron-400"
                              : row.status === "called"
                                ? "bg-blue-400"
                                : isYou
                                  ? "bg-agri-400"
                                  : "bg-ivory-100/20",
                          )}
                        />
                        <span
                          className={cn(
                            "font-mono text-[15px] font-semibold tabular",
                            isYou ? "text-agri-400" : "text-ivory-100/90",
                          )}
                        >
                          {row.token.replace(/KQ-(\d+)/, (_, d) => `KQ-${pad(Number(d))}`)}
                        </span>
                        {isYou && (
                          <span className="rounded-full border border-agri-400/35 px-2 py-0.5 font-mono text-[9px] tracking-[0.12em] text-agri-400 uppercase">
                            {t("common.yourToken")}
                          </span>
                        )}
                      </div>
                      <span
                        className={cn(
                          "font-mono text-[10px] tracking-[0.14em] uppercase",
                          row.status === "serving"
                            ? "text-saffron-400"
                            : row.status === "called"
                              ? "text-blue-400"
                              : "text-ivory-200/40",
                        )}
                      >
                        {row.status === "serving"
                          ? t("common.nowServing")
                          : row.status === "called"
                            ? t("common.called")
                            : t("common.waiting")}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* Metrics */}
              <div className="grid grid-cols-3 divide-x divide-ivory-100/8 border-t border-ivory-100/10">
                <Metric
                  label={t("queue.avgService")}
                  value={`${p.centre.avgServiceMin} ${t("common.min")}`}
                  hint={t("queue.perFarmer")}
                />
                <Metric label={t("queue.throughput")} value={String(p.servedToday)} hint="" />
                <Metric
                  label={t("common.counter")}
                  value={String(p.centre.counters)}
                  hint=""
                  icon={<Users size={12} strokeWidth={2} />}
                />
              </div>
            </div>

            {/* ---------------- Farmer panel ---------------- */}
            <div className="flex flex-col gap-5">
              <div className="rounded-3xl border border-ivory-100/12 bg-ink-950 p-6 sm:p-7">
                <p className="font-mono text-[10px] tracking-[0.16em] text-ivory-200/40 uppercase">
                  {t("common.yourToken")}
                </p>
                <p className="mt-1.5 font-mono text-[clamp(2.2rem,7vw,3rem)] leading-none font-semibold tracking-tight text-ivory-50">
                  KQ-{pad(p.tokenNumber)}
                </p>

                <div className="mt-6 flex items-center gap-6">
                  <WaitRing position={p.position} complete={p.isComplete} />
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.14em] text-ivory-200/40 uppercase">
                      {t("common.estWait")}
                    </p>
                    <p className="mt-1 font-mono text-[30px] leading-none font-semibold text-agri-400">
                      {p.isComplete ? "—" : p.estWaitMin}
                      {!p.isComplete && (
                        <span className="ml-1 text-[13px] font-medium text-ivory-200/50">
                          {t("common.min")}
                        </span>
                      )}
                    </p>
                    <p
                      key={statusMessage}
                      className="kq-swap mt-2 max-w-[22ch] text-[12.5px] leading-snug text-ivory-100/75"
                    >
                      {statusMessage}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={advance}
                    disabled={!p.canAdvanceQueue}
                    className="inline-flex items-center gap-2 rounded-full bg-saffron-500 px-4 py-2.5 text-[13px] font-semibold text-ink-950 transition-colors hover:bg-saffron-400 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {t("queue.simulate")}
                    <ChevronRight size={15} strokeWidth={2.4} />
                  </button>
                  <button
                    type="button"
                    onClick={p.resetQueue}
                    className="inline-flex items-center gap-2 rounded-full border border-ivory-100/15 px-4 py-2.5 text-[13px] font-semibold text-ivory-100/80 transition-colors hover:border-ivory-100/35 hover:text-ivory-50"
                  >
                    <RotateCcw size={14} />
                    {t("queue.reset")}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-400/20 bg-blue-500/[0.07] p-4">
                <p className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-ivory-100/75">
                  <Info size={14} className="mt-0.5 shrink-0 text-blue-400" strokeWidth={2} />
                  {t("queue.notify")}
                </p>
              </div>

              <p className="text-[11.5px] leading-relaxed text-ivory-200/40">
                {t("queue.notice")}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="px-4 py-4 sm:px-5">
      <p className="flex items-center gap-1.5 font-mono text-[9.5px] leading-tight tracking-[0.14em] text-ivory-200/40 uppercase">
        {icon}
        {label}
      </p>
      <p className="mt-1.5 font-mono text-[19px] leading-none font-semibold tabular">{value}</p>
      {hint && <p className="mt-1 text-[10.5px] text-ivory-200/35">{hint}</p>}
    </div>
  );
}

/**
 * Position shown as a ring rather than a number alone — the farmer's own
 * progress toward the counter, from four away to being called.
 */
function WaitRing({ position, complete }: { position: number; complete: boolean }) {
  const total = 4;
  const done = complete ? total : Math.min(total, total - position);
  // A visible minimum arc: an empty ring reads as "broken", not as "not started".
  const pct = Math.max(0.06, Math.min(1, done / total));
  const r = 30;
  const c = 2 * Math.PI * r;

  return (
    <div className="relative h-[76px] w-[76px] shrink-0">
      <svg viewBox="0 0 76 76" className="h-full w-full -rotate-90">
        <circle cx="38" cy="38" r={r} fill="none" stroke="currentColor" strokeWidth="6" className="text-ivory-100/10" />
        <circle
          cx="38"
          cy="38"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          className="text-agri-500 transition-[stroke-dashoffset] duration-700 ease-out"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-[20px] leading-none font-semibold text-ivory-50">
          {complete ? "✓" : `#${position}`}
        </span>
      </div>
    </div>
  );
}
