import { ArrowLeft, ArrowRight, Check, CheckCircle2, MessageSquare } from "lucide-react";
import { useState } from "react";
import { CONGESTION_STYLE, CongestionDot, DemoTag } from "@/components/ui/primitives";
import { CROPS, centreName, type SlotWindow } from "@/data/india";
import { useI18n } from "@/i18n";
import type { DictKey } from "@/i18n/en";
import { cn } from "@/lib/cn";
import { nowLabel, usePrototype } from "@/state/prototype";

const STEP_KEYS: DictKey[] = ["booking.step1", "booking.step2", "booking.step3", "booking.step4"];

export function BookingDemo() {
  const { t, tl } = useI18n();
  const p = usePrototype();
  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

  const canContinue =
    step === 0 ? Boolean(p.centreId) : step === 1 ? true : step === 2 ? Boolean(p.slotLabel) : true;

  const confirm = () => {
    p.confirmBooking({
      kind: "sms",
      title: t("booking.confirmed"),
      body: tl({
        en: `Token KQ-102 · ${centreName(p.centre.place, "en")} · ${p.slotLabel} · Show this at the gate.`,
        hi: `टोकन KQ-102 · ${centreName(p.centre.place, "hi")} · ${p.slotLabel} · इसे गेट पर दिखाएँ।`,
        te: `టోకెన్ KQ-102 · ${centreName(p.centre.place, "te")} · ${p.slotLabel} · దీన్ని గేటు వద్ద చూపండి.`,
      }),
      at: nowLabel(),
    });
    setConfirmed(true);
  };

  const restart = () => {
    setConfirmed(false);
    setStep(0);
  };

  if (confirmed) {
    return <BookingConfirmation onRestart={restart} />;
  }

  return (
    <div>
      {/* Step rail */}
      <ol className="mb-8 flex items-center gap-1.5 sm:gap-3">
        {STEP_KEYS.map((key, i) => (
          <li key={key} className="flex min-w-0 flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[11.5px] font-semibold transition-colors",
                i === step
                  ? "border-ink-900 bg-ink-900 text-ivory-50"
                  : i < step
                    ? "border-agri-500 bg-agri-500 text-white"
                    : "border-ink-900/15 text-ink-700/40",
              )}
            >
              {i < step ? <Check size={13} strokeWidth={3} /> : i + 1}
            </button>
            <span
              className={cn(
                "hidden truncate text-[12.5px] font-medium sm:block",
                i === step ? "text-ink-900" : "text-ink-700/50",
              )}
            >
              {t(key)}
            </span>
            {i < STEP_KEYS.length - 1 && (
              <span aria-hidden className="hidden h-px flex-1 bg-ink-900/12 sm:block" />
            )}
          </li>
        ))}
      </ol>

      <div key={step} className="kq-swap min-h-[17rem]">
        {step === 0 && <CentreStep />}
        {step === 1 && <DateStep />}
        {step === 2 && <SlotStep />}
        {step === 3 && <SummaryStep />}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-ink-900/10 pt-5">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-2 rounded-full border border-ink-900/15 px-4 py-2.5 text-[13px] font-semibold text-ink-700 transition-colors hover:border-ink-900/35 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ArrowLeft size={14} />
          {t("common.back")}
        </button>

        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(3, s + 1))}
            disabled={!canContinue}
            className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-[13px] font-semibold text-ivory-50 transition-colors hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-35"
          >
            {t("common.next")}
            <ArrowRight size={14} />
          </button>
        ) : (
          <button
            type="button"
            onClick={confirm}
            className="inline-flex items-center gap-2 rounded-full bg-agri-600 px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-agri-500"
          >
            {t("booking.confirmCta")}
            <Check size={15} strokeWidth={2.6} />
          </button>
        )}
      </div>

      <p className="mt-4 text-[11.5px] text-ink-700/45">{t("disc.sim")}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function CentreStep() {
  const { t, tl, lang } = useI18n();
  const p = usePrototype();

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {p.region.centres.map((centre) => {
        const style = CONGESTION_STYLE[centre.congestion];
        const selected = centre.id === p.centreId;
        return (
          <button
            key={centre.id}
            type="button"
            onClick={() => p.setCentre(centre.id)}
            aria-pressed={selected}
            className={cn(
              "group rounded-2xl border p-4 text-left transition-all duration-200",
              selected
                ? "border-ink-900 bg-white shadow-lift"
                : "border-ink-900/12 bg-white/60 hover:border-ink-900/30",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[14.5px] leading-snug font-semibold">
                {centreName(centre.place, lang)}
              </p>
              {selected && (
                <CheckCircle2 size={17} className="shrink-0 text-agri-600" strokeWidth={2.2} />
              )}
            </div>
            <p className="mt-1 text-[11.5px] text-ink-700/55">
              {tl(centre.subdivision)} · {tl(centre.district)}
            </p>

            <div
              className={cn(
                "mt-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
                style.border,
                style.bg,
              )}
            >
              <CongestionDot level={centre.congestion} />
              <span className={cn("text-[11px] font-medium", style.text)}>
                {t(`congestion.${centre.congestion}` as DictKey)}
              </span>
            </div>

            <dl className="mt-3 flex gap-5">
              <div>
                <dt className="font-mono text-[9px] tracking-[0.14em] text-ink-700/40 uppercase">
                  {t("cong.wait")}
                </dt>
                <dd className="mt-0.5 font-mono text-[16px] font-semibold tabular">
                  {centre.waitMin}
                  <span className="ml-0.5 text-[10px] font-medium text-ink-700/50">
                    {t("common.min")}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] tracking-[0.14em] text-ink-700/40 uppercase">
                  {t("booking.slots")}
                </dt>
                <dd className="mt-0.5 font-mono text-[16px] font-semibold tabular">
                  {centre.slotsOpen}
                </dd>
              </div>
            </dl>
          </button>
        );
      })}
    </div>
  );
}

function DateStep() {
  const { t, tl } = useI18n();
  const p = usePrototype();

  const options: { offset: number; key: DictKey }[] = [
    { offset: 0, key: "booking.today" },
    { offset: 1, key: "booking.tomorrow" },
    { offset: 2, key: "booking.nextAvailable" },
  ];

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        {options.map(({ offset, key }) => {
          const selected = p.dayOffset === offset;
          const date = new Date();
          date.setDate(date.getDate() + offset);
          return (
            <button
              key={offset}
              type="button"
              onClick={() => p.setDay(offset)}
              aria-pressed={selected}
              className={cn(
                "rounded-2xl border p-4 text-left transition-all duration-200",
                selected
                  ? "border-ink-900 bg-white shadow-lift"
                  : "border-ink-900/12 bg-white/60 hover:border-ink-900/30",
              )}
            >
              <p className="text-[14.5px] font-semibold">{t(key)}</p>
              <p className="mt-1 font-mono text-[12px] tabular text-ink-700/55">
                {date.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  weekday: "short",
                })}
              </p>
            </button>
          );
        })}
      </div>

      {/* Crop + quantity: the booking carries what is being brought */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <p className="font-mono text-[9.5px] tracking-[0.16em] text-ink-700/45 uppercase">
            {t("booking.selectCrop")}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {p.centre.crops.map((id) => {
              const crop = CROPS[id];
              const on = p.cropId === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => p.setCrop(id)}
                  aria-pressed={on}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors",
                    on
                      ? "border-agri-600 bg-agri-50 text-agri-800"
                      : "border-ink-900/15 bg-white/70 text-ink-700/70 hover:border-ink-900/30",
                  )}
                >
                  {tl(crop.name)}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label
            htmlFor="kq-qty"
            className="font-mono text-[9.5px] tracking-[0.16em] text-ink-700/45 uppercase"
          >
            {t("booking.expectedQty")}
          </label>
          <div className="mt-2.5 flex items-center gap-3">
            <input
              id="kq-qty"
              type="range"
              min={5}
              max={80}
              step={1}
              value={p.expectedQtl}
              onChange={(e) => p.setQuantity(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink-900/12 accent-ink-900"
            />
            <span className="w-[6.5rem] shrink-0 font-mono text-[14px] font-semibold tabular">
              {p.expectedQtl}
              <span className="ml-1 text-[11px] font-medium text-ink-700/55">
                {t("common.quintal")}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlotStep() {
  const { t } = useI18n();
  const p = usePrototype();

  return (
    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
      {p.slots.map((slot: SlotWindow) => {
        const open = Math.max(0, slot.capacity - slot.booked);
        const full = open === 0;
        const selected = p.slotLabel === slot.label;
        const ratio = slot.booked / slot.capacity;
        return (
          <button
            key={slot.id}
            type="button"
            disabled={full}
            onClick={() => p.setSlot(slot.label)}
            aria-pressed={selected}
            className={cn(
              "rounded-2xl border p-4 text-left transition-all duration-200",
              full
                ? "cursor-not-allowed border-ink-900/8 bg-ivory-200/50"
                : selected
                  ? "border-ink-900 bg-white shadow-lift"
                  : "border-ink-900/12 bg-white/60 hover:border-ink-900/30",
            )}
          >
            <div className="flex items-baseline justify-between gap-2">
              <p
                className={cn(
                  "font-mono text-[14.5px] font-semibold tabular",
                  full && "text-ink-700/35",
                )}
              >
                {slot.label}
              </p>
              {selected && <Check size={15} strokeWidth={3} className="text-agri-600" />}
            </div>
            <p
              className={cn(
                "mt-1 text-[12px]",
                full ? "text-ink-700/35" : open <= 3 ? "text-saffron-700" : "text-agri-700",
              )}
            >
              {full ? t("common.full") : `${open} ${t("booking.slotsOpen")}`}
            </p>
            <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-ink-900/8">
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-500",
                  full ? "bg-ink-900/20" : ratio > 0.8 ? "bg-saffron-500" : "bg-agri-500",
                )}
                style={{ width: `${Math.min(100, ratio * 100)}%` }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}

function SummaryStep() {
  const { t, tl, lang } = useI18n();
  const p = usePrototype();

  const rows: [string, string][] = [
    [t("common.centre"), centreName(p.centre.place, lang)],
    [tl(p.region.subdivisionType), tl(p.centre.subdivision)],
    [t("common.district"), `${tl(p.centre.district)}, ${tl(p.region.state)}`],
    [
      t("common.date"),
      new Date(Date.now() + p.dayOffset * 86400000).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    ],
    [t("common.slot"), p.slotLabel ?? "—"],
    [t("common.crop"), tl(p.crop.name)],
    [t("booking.expectedQty"), `${p.expectedQtl} ${t("common.quintal")}`],
    [t("common.farmer"), `${tl(p.region.farmer)} · ${tl(p.region.village)}`],
  ];

  return (
    <div className="rounded-2xl border border-ink-900/10 bg-white p-5 sm:p-6">
      <p className="font-mono text-[9.5px] tracking-[0.16em] text-ink-700/45 uppercase">
        {t("booking.summary")}
      </p>
      <dl className="mt-4 grid gap-x-8 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div
            key={k}
            className="flex items-baseline justify-between gap-4 border-b border-ink-900/8 py-2.5"
          >
            <dt className="text-[12px] text-ink-700/55">{k}</dt>
            <dd className="text-right text-[13px] font-semibold">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function BookingConfirmation({ onRestart }: { onRestart: () => void }) {
  const { t, tl, lang } = useI18n();
  const p = usePrototype();

  return (
    <div className="kq-swap">
      <div className="grain relative overflow-hidden rounded-3xl border border-ink-950/40 bg-ink-900 p-6 text-ivory-100 sm:p-8">
        <div
          aria-hidden
          className="survey-grid pointer-events-none absolute inset-0 text-ivory-100 opacity-30"
        />
        <div className="relative flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-agri-500/15 text-agri-400">
            <Check size={24} strokeWidth={2.6} />
          </span>
          <p className="mt-4 font-mono text-[10px] tracking-[0.18em] text-agri-400 uppercase">
            {t("booking.confirmed")}
          </p>
          <p className="mt-4 font-mono text-[10px] tracking-[0.16em] text-ivory-200/40 uppercase">
            {t("booking.tokenIssued")}
          </p>
          <p className="mt-1.5 font-mono text-[clamp(2.6rem,9vw,3.6rem)] leading-none font-semibold tracking-tight text-saffron-400">
            {p.token ?? "KQ-102"}
          </p>

          <div className="my-6 flex w-full max-w-[26rem] items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-ink-900" />
            <span className="tick-rule h-px flex-1 text-ivory-100" />
            <span className="h-3 w-3 rounded-full bg-ink-900" />
          </div>

          <dl className="grid w-full max-w-[30rem] gap-x-8 text-left sm:grid-cols-2">
            {(
              [
                [t("common.centre"), centreName(p.centre.place, lang)],
                [t("booking.arriveBy"), p.slotLabel?.split("–")[0] ?? "—"],
                [t("common.slot"), p.slotLabel ?? "—"],
                [t("common.crop"), `${tl(p.crop.name)} · ${p.expectedQtl} ${t("common.quintal")}`],
              ] as [string, string][]
            ).map(([k, v]) => (
              <div
                key={k}
                className="flex items-baseline justify-between gap-4 border-b border-ivory-100/10 py-2.5"
              >
                <dt className="text-[12px] text-ivory-200/55">{k}</dt>
                <dd className="text-right text-[13px] font-semibold">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex w-full max-w-[30rem] items-start gap-2.5 rounded-xl border border-blue-400/20 bg-blue-500/[0.08] p-3.5 text-left">
            <MessageSquare size={14} className="mt-0.5 shrink-0 text-blue-400" strokeWidth={2} />
            <p className="text-[12px] leading-relaxed text-ivory-100/75">{t("booking.smsSent")}</p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <DemoTag tone="light" label={t("tag.simulation")} />
            <button
              type="button"
              onClick={onRestart}
              className="rounded-full border border-ivory-100/15 px-4 py-2 text-[12.5px] font-semibold text-ivory-100/80 transition-colors hover:border-ivory-100/35 hover:text-ivory-50"
            >
              {t("booking.startOver")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
