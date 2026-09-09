import {
  Bell,
  CalendarDays,
  Check,
  Home,
  MessageSquare,
  ScrollText,
  Ticket,
  Wallet,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { CENTRE_SUFFIX, DEMO, centreName, formatINR } from "@/data/india";
import { useI18n } from "@/i18n";
import type { DictKey } from "@/i18n/en";
import { cn } from "@/lib/cn";
import { PROC_STAGES, usePrototype } from "@/state/prototype";

type TabId = "home" | "slot" | "token" | "procurement" | "payment" | "alerts";

const TABS: { id: TabId; label: DictKey; icon: typeof Home }[] = [
  { id: "home", label: "phone.tab.home", icon: Home },
  { id: "slot", label: "phone.tab.slot", icon: CalendarDays },
  { id: "token", label: "phone.tab.token", icon: Ticket },
  { id: "procurement", label: "phone.tab.procurement", icon: ScrollText },
  { id: "payment", label: "phone.tab.payment", icon: Wallet },
  { id: "alerts", label: "phone.tab.alerts", icon: Bell },
];

const pad = (n: number) => String(n).padStart(3, "0");

export function PhonePreview() {
  const { t } = useI18n();
  const [tab, setTab] = useState<TabId>("home");
  const p = usePrototype();

  return (
    <div className="flex flex-col items-center gap-7 lg:flex-row lg:items-start lg:gap-10">
      {/* ---------------- Device ---------------- */}
      <div className="relative w-full max-w-[330px] shrink-0">
        <div className="relative rounded-[42px] border border-ink-950/60 bg-ink-950 p-2.5 shadow-lift-lg">
          {/* side buttons */}
          <span
            aria-hidden
            className="absolute top-[112px] -left-[2px] h-10 w-[2px] rounded-l-full bg-ink-800/70"
          />
          <span
            aria-hidden
            className="absolute top-[164px] -left-[2px] h-14 w-[2px] rounded-l-full bg-ink-800/70"
          />
          <span
            aria-hidden
            className="absolute top-[140px] -right-[2px] h-20 w-[2px] rounded-r-full bg-ink-800/70"
          />

          <div className="relative overflow-hidden rounded-[33px] bg-ivory-100">
            {/* status bar */}
            <div className="relative flex items-center justify-between bg-ink-900 px-5 pt-2.5 pb-1.5 text-ivory-100">
              <span className="font-mono text-[10px] tabular">9:41</span>
              <span
                aria-hidden
                className="absolute left-1/2 h-[18px] w-[86px] -translate-x-1/2 rounded-b-2xl bg-ink-950"
              />
              <span className="flex items-center gap-1">
                <span aria-hidden className="h-2 w-2 rounded-full bg-ivory-100/40" />
                <span aria-hidden className="h-2.5 w-4 rounded-[3px] border border-ivory-100/40" />
              </span>
            </div>

            {/* app bar */}
            <div className="bg-ink-900 px-5 pt-2 pb-4 text-ivory-100">
              <p className="font-mono text-[9px] tracking-[0.16em] text-ivory-200/40 uppercase">
                {t("brand.name")}
              </p>
              <p className="mt-0.5 text-[15px] font-semibold">{t(TABS.find((x) => x.id === tab)!.label)}</p>
            </div>

            {/* screen */}
            <div className="h-[422px] overflow-y-auto bg-ivory-100 px-4 py-4">
              <div key={tab} className="kq-swap">
                <PhoneScreen tab={tab} />
              </div>
            </div>

            {/* tab bar */}
            <nav
              aria-label={t("phone.eyebrow")}
              className="grid grid-cols-6 border-t border-ink-900/10 bg-white px-1 pt-1.5 pb-3"
            >
              {TABS.map((item) => {
                const Icon = item.icon;
                const on = tab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    aria-pressed={on}
                    className="flex flex-col items-center gap-1 rounded-lg py-1.5 transition-colors"
                  >
                    <Icon
                      size={16}
                      strokeWidth={on ? 2.4 : 1.8}
                      className={on ? "text-ink-900" : "text-ink-700/40"}
                    />
                    <span
                      className={cn(
                        "max-w-full truncate text-[7.5px] leading-tight",
                        on ? "font-semibold text-ink-900" : "text-ink-700/40",
                      )}
                    >
                      {t(item.label)}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* ---------------- Tab list for larger screens ---------------- */}
      <div className="w-full">
        <p className="font-mono text-[9.5px] tracking-[0.16em] text-ink-700/45 uppercase">
          {t("phone.eyebrow")}
        </p>
        <p className="mt-3 max-w-[46ch] text-[14.5px] leading-relaxed text-ink-700/80">
          {t("phone.sub")}
        </p>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {TABS.map((item) => {
            const Icon = item.icon;
            const on = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                aria-pressed={on}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all duration-200",
                  on
                    ? "border-ink-900 bg-white shadow-lift"
                    : "border-ink-900/12 bg-white/60 hover:border-ink-900/30",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    on ? "bg-ink-900 text-ivory-50" : "bg-ink-900/6 text-ink-700/55",
                  )}
                >
                  <Icon size={15} strokeWidth={2} />
                </span>
                <span
                  className={cn(
                    "text-[13.5px] font-medium",
                    on ? "text-ink-900" : "text-ink-700/65",
                  )}
                >
                  {t(item.label)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-xl border border-ink-900/10 bg-white/60 p-4">
          <p className="text-[12px] leading-relaxed text-ink-700/65">
            {t("phone.sub")} — {t("disc.sim")}
          </p>
          <p className="mt-2 font-mono text-[11px] tabular text-ink-700/45">
            {t("common.token")}: KQ-{pad(p.tokenNumber)} · {t("common.position")} #{p.position} ·{" "}
            {p.estWaitMin} {t("common.min")}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ==================================================================
   SCREENS
   ================================================================== */

function Tile({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: "green" | "saffron";
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3",
        accent === "green"
          ? "border-agri-500/25 bg-agri-50"
          : accent === "saffron"
            ? "border-saffron-500/25 bg-saffron-50"
            : "border-ink-900/10 bg-white",
      )}
    >
      <p className="font-mono text-[8.5px] tracking-[0.14em] text-ink-700/45 uppercase">{label}</p>
      <p className="mt-1 font-mono text-[20px] leading-none font-semibold tabular">{value}</p>
      {hint && <p className="mt-1 text-[10px] text-ink-700/50">{hint}</p>}
    </div>
  );
}

function PhoneScreen({ tab }: { tab: TabId }) {
  const { t, tl, lang } = useI18n();
  const p = usePrototype();

  if (tab === "home") {
    return (
      <div className="space-y-3">
        <div>
          <p className="text-[12px] text-ink-700/55">{t("phone.greeting")},</p>
          <p className="text-[17px] font-semibold">{tl(p.region.farmer)}</p>
          <p className="mt-0.5 text-[11px] text-ink-700/50">
            {tl(p.region.village)} · {tl(p.centre.subdivision)}, {tl(p.region.state)}
          </p>
        </div>

        <div className="rounded-2xl bg-ink-900 p-4 text-ivory-100">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[8.5px] tracking-[0.14em] text-ivory-200/45 uppercase">
              {t("common.yourToken")}
            </p>
            <span className="flex items-center gap-1.5 rounded-full border border-agri-500/30 px-2 py-0.5 font-mono text-[8px] tracking-[0.12em] text-agri-400 uppercase">
              <span className="h-1 w-1 rounded-full bg-agri-500" />
              {t("tag.live")}
            </span>
          </div>
          <p className="mt-1.5 font-mono text-[30px] leading-none font-semibold text-saffron-400">
            KQ-{pad(p.tokenNumber)}
          </p>
          <div className="mt-3 flex gap-6">
            <div>
              <p className="font-mono text-[8.5px] tracking-[0.14em] text-ivory-200/45 uppercase">
                {t("common.position")}
              </p>
              <p className="mt-0.5 font-mono text-[18px] leading-none font-semibold">
                #{p.position}
              </p>
            </div>
            <div>
              <p className="font-mono text-[8.5px] tracking-[0.14em] text-ivory-200/45 uppercase">
                {t("common.estWait")}
              </p>
              <p className="mt-0.5 font-mono text-[18px] leading-none font-semibold text-agri-400">
                {p.estWaitMin} {t("common.min")}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-ink-900/10 bg-white p-3">
          <p className="font-mono text-[8.5px] tracking-[0.14em] text-ink-700/45 uppercase">
            {t("common.centre")}
          </p>
          <p className="mt-1 text-[13px] font-semibold">{centreName(p.centre.place, lang)}</p>
          <p className="mt-0.5 text-[10.5px] text-ink-700/50">
            {tl(p.centre.district)}, {tl(p.region.state)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Tile label={t("common.crop")} value={<span className="text-[14px]">{tl(p.crop.name)}</span>} />
          <Tile
            label={t("common.quantity")}
            value={p.expectedQtl}
            hint={t("common.quintal")}
          />
        </div>
      </div>
    );
  }

  if (tab === "slot") {
    return (
      <div className="space-y-3">
        <div className="rounded-2xl border border-agri-500/25 bg-agri-50 p-4">
          <p className="font-mono text-[8.5px] tracking-[0.14em] text-agri-700 uppercase">
            {t("phone.todaySlot")}
          </p>
          <p className="mt-1.5 font-mono text-[26px] leading-none font-semibold text-agri-800">
            {p.slotLabel ?? "08:00–09:00"}
          </p>
          <p className="mt-2 text-[11.5px] text-agri-800/75">
            {t("booking.arriveBy")} {(p.slotLabel ?? "08:00–09:00").split("–")[0]}
          </p>
        </div>

        <dl className="rounded-xl border border-ink-900/10 bg-white px-3 py-1">
          {(
            [
              [t("common.centre"), `${tl(p.centre.place)} ${CENTRE_SUFFIX[lang]}`],
              [tl(p.region.subdivisionType), tl(p.centre.subdivision)],
              [t("common.district"), tl(p.centre.district)],
              [t("common.state"), tl(p.region.state)],
              [
                t("common.date"),
                new Date(Date.now() + p.dayOffset * 86400000).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                }),
              ],
            ] as [string, string][]
          ).map(([k, v]) => (
            <div
              key={k}
              className="flex items-baseline justify-between gap-3 border-b border-ink-900/8 py-2 last:border-b-0"
            >
              <dt className="text-[11px] text-ink-700/55">{k}</dt>
              <dd className="text-right text-[11.5px] font-semibold">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="rounded-xl border border-blue-400/25 bg-blue-50 p-3">
          <p className="text-[11px] leading-relaxed text-blue-700">{t("queue.notify")}</p>
        </div>
      </div>
    );
  }

  if (tab === "token") {
    return (
      <div className="space-y-3">
        <div className="rounded-2xl bg-ink-900 p-5 text-center text-ivory-100">
          <p className="font-mono text-[8.5px] tracking-[0.16em] text-ivory-200/45 uppercase">
            {t("common.yourToken")}
          </p>
          <p className="mt-2 font-mono text-[40px] leading-none font-semibold tracking-tight text-saffron-400">
            KQ-{pad(p.tokenNumber)}
          </p>
          <div className="my-4 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-ivory-100/10" />
            <span className="tick-rule h-px flex-1 text-ivory-100" />
            <span className="h-2.5 w-2.5 rounded-full bg-ivory-100/10" />
          </div>
          {/* A scannable stub — the operator confirms arrival against it */}
          <div className="mx-auto flex h-16 w-full max-w-[190px] items-end justify-center gap-[3px]">
            {Array.from({ length: 34 }).map((_, i) => (
              <span
                key={i}
                className="w-[3px] rounded-sm bg-ivory-100"
                style={{ height: `${28 + ((i * 37) % 60)}%`, opacity: 0.25 + ((i * 13) % 60) / 100 }}
              />
            ))}
          </div>
          <p className="mt-4 text-[10.5px] text-ivory-200/50">{t("phone.showAtGate")}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Tile label={t("common.position")} value={`#${p.position}`} accent="green" />
          <Tile
            label={t("common.estWait")}
            value={p.estWaitMin}
            hint={t("common.min")}
            accent="saffron"
          />
        </div>
      </div>
    );
  }

  if (tab === "procurement") {
    return (
      <div className="space-y-3">
        <ol className="rounded-xl border border-ink-900/10 bg-white px-3 py-1">
          {PROC_STAGES.slice(0, 6).map((stage, i) => {
            const done = i < p.stageIndex;
            const current = i === p.stageIndex;
            return (
              <li
                key={stage}
                className="flex items-center gap-2.5 border-b border-ink-900/8 py-2.5 last:border-b-0"
              >
                <span
                  className={cn(
                    "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border",
                    done
                      ? "border-agri-500 bg-agri-500 text-white"
                      : current
                        ? "border-saffron-500 bg-saffron-500/20"
                        : "border-ink-900/15",
                  )}
                  style={{ height: 18, width: 18 }}
                >
                  {done && <Check size={10} strokeWidth={3.4} />}
                  {current && <span className="h-1.5 w-1.5 rounded-full bg-saffron-600" />}
                </span>
                <span
                  className={cn(
                    "flex-1 text-[11.5px]",
                    done || current ? "text-ink-900" : "text-ink-700/40",
                  )}
                >
                  {t(`proc.s${i + 1}` as DictKey)}
                </span>
              </li>
            );
          })}
        </ol>

        {p.stageIndex >= 4 && (
          <div className="grid grid-cols-2 gap-2">
            <Tile label={t("proc.grossWeight")} value={DEMO.grossWeightQtl} hint={t("common.quintal")} />
            <Tile label={t("proc.moisture")} value={`${DEMO.moisturePct}%`} />
            <Tile label={t("proc.grade")} value={<span className="text-[15px]">{DEMO.grade}</span>} />
            <Tile
              label={t("proc.acceptedQty")}
              value={p.acceptedQtl}
              hint={t("common.quintal")}
              accent="green"
            />
          </div>
        )}
      </div>
    );
  }

  if (tab === "payment") {
    return (
      <div className="space-y-3">
        <div
          className={cn(
            "rounded-2xl border p-4",
            p.paymentStatus === "completed"
              ? "border-agri-500/25 bg-agri-50"
              : "border-saffron-500/25 bg-saffron-50",
          )}
        >
          <p className="font-mono text-[8.5px] tracking-[0.14em] text-ink-700/50 uppercase">
            {t("pay.amount")}
          </p>
          <p className="mt-1.5 font-mono text-[26px] leading-none font-semibold">
            {formatINR(p.amount)}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-[11.5px] font-medium">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                p.paymentStatus === "completed" ? "bg-agri-500" : "bg-saffron-500",
              )}
            />
            {p.paymentStatus === "completed"
              ? t("pay.completed")
              : p.paymentStatus === "processing"
                ? t("pay.processing")
                : t("proc.s6")}
          </p>
        </div>

        <dl className="rounded-xl border border-ink-900/10 bg-white px-3 py-1">
          {(
            [
              [t("pay.actualQty"), `${p.acceptedQtl} ${t("common.quintal")}`],
              [t("pay.rate"), `${formatINR(p.crop.demoRate)} / ${t("common.quintal")}`],
              [t("common.crop"), tl(p.crop.name)],
              [t("pay.reference"), DEMO.paymentRef],
              [t("proc.lotId"), DEMO.lotId],
            ] as [string, string][]
          ).map(([k, v]) => (
            <div
              key={k}
              className="flex items-baseline justify-between gap-3 border-b border-ink-900/8 py-2 last:border-b-0"
            >
              <dt className="text-[11px] text-ink-700/55">{k}</dt>
              <dd className="text-right font-mono text-[11px] font-semibold tabular">{v}</dd>
            </div>
          ))}
        </dl>

        {p.paymentStatus === "completed" && (
          <div className="rounded-xl border border-agri-500/25 bg-agri-50 p-3">
            <p className="text-[11px] text-agri-800">
              {t("pay.creditedTo")} {DEMO.accountMask}
            </p>
          </div>
        )}
      </div>
    );
  }

  // alerts
  return (
    <div className="space-y-2.5">
      {p.notifications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink-900/15 px-4 py-10 text-center">
          <Bell size={18} className="mx-auto text-ink-700/25" strokeWidth={1.8} />
          <p className="mt-3 text-[12px] text-ink-700/45">{t("phone.noAlerts")}</p>
        </div>
      ) : (
        p.notifications.map((n) => (
          <div key={n.id} className="rounded-xl border border-ink-900/10 bg-white p-3">
            <div className="flex items-start gap-2.5">
              <span
                className={cn(
                  "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                  n.kind === "sms" ? "bg-blue-100 text-blue-600" : "bg-agri-100 text-agri-700",
                )}
              >
                {n.kind === "sms" ? (
                  <MessageSquare size={12} strokeWidth={2.2} />
                ) : (
                  <Bell size={12} strokeWidth={2.2} />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[12px] font-semibold">{n.title}</p>
                  <span className="shrink-0 font-mono text-[9px] tabular text-ink-700/40">
                    {n.at}
                  </span>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-ink-700/65">{n.body}</p>
                <span className="mt-1.5 inline-block font-mono text-[8.5px] tracking-[0.12em] text-ink-700/35 uppercase">
                  {n.kind === "sms" ? t("phone.smsPreview") : t("tag.demo")}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
