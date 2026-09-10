import {
  CalendarCheck,
  Check,
  ListOrdered,
  ScrollText,
  Ticket,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { FarmerRegistration } from "@/components/registration/FarmerRegistration";
import { Eyebrow, Reveal } from "@/components/ui/primitives";
import { CROPS, REGIONS, centreName, formatINR } from "@/data/india";
import { useI18n } from "@/i18n";
import type { DictKey } from "@/i18n/en";
import { cn } from "@/lib/cn";

const STEPS: { icon: LucideIcon; title: DictKey; body: DictKey }[] = [
  { icon: UserRoundCheck, title: "how.s1.title", body: "how.s1.body" },
  { icon: CalendarCheck, title: "how.s2.title", body: "how.s2.body" },
  { icon: Ticket, title: "how.s3.title", body: "how.s3.body" },
  { icon: ListOrdered, title: "how.s4.title", body: "how.s4.body" },
  { icon: ScrollText, title: "how.s5.title", body: "how.s5.body" },
];

export function HowItWorks() {
  const { t } = useI18n();
  const [active, setActive] = useState(0);

  return (
    <section
      id="how-it-works"
      className="relative isolate overflow-hidden bg-ivory-100 scroll-mt-20"
    >
      <div className="relative mx-auto w-full max-w-[1180px] px-5 py-20 sm:px-8 md:py-28">
        <div className="max-w-[46rem]">
          <Reveal>
            <Eyebrow>{t("how.eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-[clamp(1.9rem,4.6vw,3.1rem)] font-semibold">
              {t("how.title")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[56ch] text-[15px] leading-relaxed text-ink-700/80">
              {t("how.sub")}
            </p>
          </Reveal>
        </div>

        {/* Step rail */}
        <Reveal delay={0.12} className="mt-12">
          <div
            className="scroll-hint no-scrollbar -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0"
            style={{ "--kq-hint": "var(--color-ivory-100)" } as React.CSSProperties}
          >
            <div className="relative flex min-w-[600px] gap-2 sm:min-w-0">
              <span
                aria-hidden
                className="absolute top-[27px] right-4 left-4 h-px bg-ink-900/12"
              />
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                const isActive = i === active;
                const isDone = i < active;
                return (
                  <button
                    key={step.title}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={isActive}
                    className="group relative flex-1 pt-1 text-left"
                  >
                    <span
                      className={cn(
                        "relative z-10 flex h-[52px] w-[52px] items-center justify-center rounded-full border-2 transition-all duration-300",
                        isActive
                          ? "border-ink-900 bg-ink-900 text-ivory-50 shadow-lift"
                          : isDone
                            ? "border-agri-500/50 bg-agri-50 text-agri-700"
                            : "border-ink-900/12 bg-white text-ink-700/45 group-hover:border-ink-900/30",
                      )}
                    >
                      {isDone ? (
                        <Check size={18} strokeWidth={2.6} />
                      ) : (
                        <Icon size={19} strokeWidth={1.9} />
                      )}
                    </span>
                    <span
                      className={cn(
                        "mt-3 block font-mono text-[9.5px] tracking-[0.16em] uppercase transition-colors",
                        isActive ? "text-saffron-700" : "text-ink-700/40",
                      )}
                    >
                      {`0${i + 1}`}
                    </span>
                    <span
                      className={cn(
                        "mt-1 block max-w-[12ch] text-[13px] leading-snug font-semibold transition-colors",
                        isActive ? "text-ink-900" : "text-ink-700/55",
                      )}
                    >
                      {t(step.title)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Step 01 is a working registration flow and needs the full width.
            It stays mounted while another step is showing, so a farmer's
            progress survives a look at step 02; `hidden` also replays the
            entrance animation each time it comes back into view. */}
        <div className="kq-swap mt-12" hidden={active !== 0}>
          <FarmerRegistration />
        </div>

        {active !== 0 && (
        <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14">
          <div className="min-h-[9rem]">
            <div key={active} className="kq-swap">
              <p className="font-mono text-[10.5px] tracking-[0.18em] text-saffron-700 uppercase">
                {`Step 0${active + 1}`}
              </p>
              <h3 className="mt-3 font-display text-[clamp(1.5rem,3.2vw,2.1rem)] font-semibold">
                {t(STEPS[active].title)}
              </h3>
              <p className="mt-4 max-w-[46ch] text-[14.5px] leading-relaxed text-ink-700/80">
                {t(STEPS[active].body)}
              </p>
            </div>
          </div>

          <div className="relative">
            <div key={active} className="kq-swap">
              <StepPreview step={active} />
            </div>
          </div>
        </div>
        )}
      </div>
    </section>
  );
}

/* ==================================================================
   PREVIEWS — a different shape for each step, never the same card.
   ================================================================== */

function PreviewShell({
  label,
  children,
  tone = "light",
}: {
  label: string;
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5 sm:p-6",
        tone === "light"
          ? "border-ink-900/10 bg-white shadow-lift"
          : "grain border-ink-950/40 bg-ink-900 text-ivory-100 shadow-lift-lg",
      )}
    >
      <p
        className={cn(
          "font-mono text-[9.5px] tracking-[0.18em] uppercase",
          tone === "light" ? "text-ink-700/40" : "text-ivory-200/40",
        )}
      >
        {label}
      </p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function StepPreview({ step }: { step: number }) {
  const { t, tl, lang } = useI18n();
  const region = REGIONS[0];
  const centre = region.centres[0];
  const crop = CROPS[region.primaryCrop];

  if (step === 1) {
    const windows = [
      { label: "08:00–09:00", open: 18 },
      { label: "09:00–10:00", open: 8 },
      { label: "10:00–11:00", open: 3 },
      { label: "11:00–12:00", open: 0 },
    ];
    return (
      <PreviewShell label={t("how.s2.title")}>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {windows.map((w, i) => {
            const full = w.open === 0;
            const picked = i === 0;
            return (
              <div
                key={w.label}
                style={{ animationDelay: `${0.07 * i}s` }}
                className={cn(
                  "kq-swap",
                  "rounded-xl border px-3.5 py-3",
                  full
                    ? "border-ink-900/8 bg-ivory-200/50 text-ink-700/35"
                    : picked
                      ? "border-agri-500/45 bg-agri-50"
                      : "border-ink-900/12 bg-white",
                )}
              >
                <p className="font-mono text-[13px] font-semibold tabular">{w.label}</p>
                <p
                  className={cn(
                    "mt-1 text-[11.5px]",
                    full ? "" : picked ? "text-agri-700" : "text-ink-700/55",
                  )}
                >
                  {full ? t("common.full") : `${w.open} ${t("booking.slotsOpen")}`}
                </p>
              </div>
            );
          })}
        </div>
      </PreviewShell>
    );
  }

  if (step === 2) {
    return (
      <PreviewShell label={t("how.s3.title")} tone="dark">
        <div className="flex flex-col items-center py-3 text-center">
          <p className="font-mono text-[10px] tracking-[0.18em] text-ivory-200/45 uppercase">
            {t("common.yourToken")}
          </p>
          <p
            className="kq-swap mt-2 font-mono text-[clamp(2.6rem,8vw,3.6rem)] leading-none font-semibold tracking-tight text-saffron-400"
          >
            KQ-102
          </p>
          <p className="mt-3 text-[13px] text-ivory-100/80">{centreName(centre.place, lang)}</p>
          <p className="mt-1 font-mono text-[11.5px] text-ivory-200/45">
            {t("booking.arriveBy")} 08:00 · {tl(crop.name)}
          </p>
          {/* perforated stub */}
          <div className="my-5 flex w-full items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-ivory-100/10" />
            <span className="tick-rule h-px flex-1 text-ivory-100" />
            <span className="h-3 w-3 rounded-full bg-ivory-100/10" />
          </div>
          <p className="text-[11.5px] text-ivory-200/50">{t("phone.showAtGate")}</p>
        </div>
      </PreviewShell>
    );
  }

  if (step === 3) {
    const rows = [98, 99, 100, 101, 102];
    return (
      <PreviewShell label={t("how.s4.title")} tone="dark">
        <div className="space-y-1.5">
          {rows.map((n, i) => {
            const serving = n === 98;
            const you = n === 102;
            return (
              <div
                key={n}
                style={{ animationDelay: `${0.06 * i}s` }}
                className={cn(
                  "kq-slide",
                  "flex items-center justify-between rounded-lg border px-3.5 py-2.5",
                  serving
                    ? "border-saffron-400/45 bg-saffron-400/12"
                    : you
                      ? "border-agri-400/45 bg-agri-400/10"
                      : "border-ivory-100/10",
                )}
              >
                <span className="font-mono text-[14px] font-semibold tabular">KQ-{n}</span>
                <span
                  className={cn(
                    "font-mono text-[10px] tracking-[0.14em] uppercase",
                    serving
                      ? "text-saffron-400"
                      : you
                        ? "text-agri-400"
                        : "text-ivory-200/40",
                  )}
                >
                  {serving
                    ? t("common.nowServing")
                    : you
                      ? `${t("common.position")} #4 · 32 ${t("common.min")}`
                      : t("common.waiting")}
                </span>
              </div>
            );
          })}
        </div>
      </PreviewShell>
    );
  }

  const timeline: DictKey[] = ["proc.s4", "proc.s5", "proc.s6", "proc.s7", "proc.s8"];
  return (
    <PreviewShell label={t("how.s5.title")}>
      <ol className="space-y-0">
        {timeline.map((key, i) => {
          const done = i < 3;
          const current = i === 3;
          return (
            <li
              key={key}
              style={{ animationDelay: `${0.06 * i}s` }}
              className="kq-slide flex items-center gap-3 border-b border-ink-900/8 py-2.5 last:border-b-0"
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                  done
                    ? "border-agri-500 bg-agri-500 text-white"
                    : current
                      ? "border-saffron-500 bg-saffron-500/15"
                      : "border-ink-900/15",
                )}
              >
                {done && <Check size={11} strokeWidth={3.2} />}
                {current && <span className="h-1.5 w-1.5 rounded-full bg-saffron-600" />}
              </span>
              <span
                className={cn(
                  "flex-1 text-[13.5px]",
                  done || current ? "text-ink-900" : "text-ink-700/45",
                )}
              >
                {t(key)}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="mt-4 flex items-baseline justify-between rounded-xl bg-ivory-100 px-4 py-3">
        <span className="text-[12px] text-ink-700/60">{t("pay.amount")}</span>
        <span className="font-mono text-[17px] font-semibold text-ink-900">
          {formatINR(39.6 * crop.demoRate)}
        </span>
      </div>
    </PreviewShell>
  );
}
