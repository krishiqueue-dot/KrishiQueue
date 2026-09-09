import { BadgeIndianRupee, Check, Landmark, Loader, MessageSquare } from "lucide-react";
import { CountUp, DemoTag } from "@/components/ui/primitives";
import { DEMO, formatINR } from "@/data/india";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/cn";
import { nowLabel, usePrototype } from "@/state/prototype";

export function PaymentDemo() {
  const { t, tl } = useI18n();
  const p = usePrototype();

  const status = p.paymentStatus;

  const simulate = () => {
    if (status === "completed") return;
    // Jump straight to payment processing if the lot has not got there yet,
    // then complete it — the judge should not have to click seven times.
    if (status === "none") {
      p.setStage(6);
      return;
    }
    p.advanceStage({
      kind: "sms",
      title: t("pay.completed"),
      body: tl({
        en: `${formatINR(p.amount)} credited to account ${DEMO.accountMask} · Ref ${DEMO.paymentRef}`,
        hi: `${formatINR(p.amount)} खाते ${DEMO.accountMask} में जमा · संदर्भ ${DEMO.paymentRef}`,
        te: `${formatINR(p.amount)} ఖాతా ${DEMO.accountMask} లో జమ · సూచిక ${DEMO.paymentRef}`,
      }),
      at: nowLabel(),
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
      {/* ---------------- Amount ---------------- */}
      <div
        className={cn(
          "grain relative overflow-hidden rounded-3xl border p-6 transition-colors duration-500 sm:p-8",
          status === "completed"
            ? "border-agri-700/40 bg-agri-800 text-ivory-50"
            : "border-ink-950/40 bg-ink-900 text-ivory-100",
        )}
      >
        <div
          aria-hidden
          className="survey-grid pointer-events-none absolute inset-0 text-ivory-100 opacity-25"
        />
        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <p className="font-mono text-[10px] tracking-[0.16em] text-ivory-200/45 uppercase">
              {t("pay.amount")}
            </p>
            <StatusPill status={status} />
          </div>

          <p className="mt-3 font-mono text-[clamp(2.2rem,7vw,3.2rem)] leading-none font-semibold tracking-tight">
            <CountUp to={p.amount} duration={1200} format={formatINR} />
          </p>

          <dl className="mt-6 border-t border-ivory-100/12 pt-2">
            {(
              [
                [t("pay.actualQty"), `${p.acceptedQtl} ${t("common.quintal")}`],
                [
                  t("pay.rate"),
                  `${formatINR(p.crop.demoRate)} ${t("pay.perQuintal")}`,
                ],
                [t("common.crop"), tl(p.crop.name)],
                [t("pay.reference"), DEMO.paymentRef],
              ] as [string, string][]
            ).map(([k, v]) => (
              <div
                key={k}
                className="flex items-baseline justify-between gap-4 border-b border-ivory-100/10 py-2.5 last:border-b-0"
              >
                <dt className="text-[12.5px] text-ivory-200/60">{k}</dt>
                <dd className="text-right font-mono text-[13px] font-semibold tabular">{v}</dd>
              </div>
            ))}
          </dl>

          {status === "completed" && (
            <div className="kq-swap mt-5 flex items-start gap-2.5 rounded-xl border border-ivory-50/20 bg-ivory-50/10 p-3.5">
              <Landmark size={15} className="mt-0.5 shrink-0" strokeWidth={2} />
              <p className="text-[12.5px] leading-relaxed">
                {t("pay.creditedTo")} {DEMO.accountMask}
              </p>
            </div>
          )}

          <p className="mt-5 text-[11px] leading-relaxed text-ivory-200/45">
            {tl({
              en: "Demonstration rate and amount. In production the rate is read from the season's declared procurement rate for the crop, and payment status is read from the disbursing system.",
              hi: "प्रदर्शन हेतु दर और राशि। उत्पादन में दर उस मौसम की घोषित खरीद दर से ली जाती है, और भुगतान की स्थिति वितरण प्रणाली से पढ़ी जाती है।",
              te: "ప్రదర్శన కోసం ధర, మొత్తం. ఉత్పత్తిలో ధర ఆ సీజన్‌కు ప్రకటించిన సేకరణ ధర నుండి, చెల్లింపు స్థితి పంపిణీ వ్యవస్థ నుండి తీసుకోబడతాయి.",
            })}
          </p>
        </div>
      </div>

      {/* ---------------- Flow ---------------- */}
      <div>
        <ol className="rounded-2xl border border-ink-900/10 bg-white px-5 py-2 shadow-lift">
          {(
            [
              { key: t("proc.s6"), at: 5, icon: Check },
              { key: t("pay.processing"), at: 6, icon: Loader },
              { key: t("pay.completed"), at: 7, icon: BadgeIndianRupee },
            ] as const
          ).map((row) => {
            const done = p.stageIndex >= row.at;
            const active = p.stageIndex === row.at;
            const Icon = row.icon;
            return (
              <li
                key={row.key}
                className="flex items-center gap-3.5 border-b border-ink-900/8 py-4 last:border-b-0"
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                    done
                      ? "bg-agri-500 text-white"
                      : active
                        ? "bg-saffron-500/15 text-saffron-700"
                        : "bg-ink-900/6 text-ink-700/35",
                  )}
                >
                  <Icon size={16} strokeWidth={2.2} className={active ? "kq-spin-slow" : ""} />
                </span>
                <span
                  className={cn(
                    "flex-1 text-[14px] font-medium",
                    done || active ? "text-ink-900" : "text-ink-700/40",
                  )}
                >
                  {row.key}
                </span>
                {done && (
                  <Check size={16} strokeWidth={3} className="shrink-0 text-agri-600" />
                )}
              </li>
            );
          })}
        </ol>

        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={simulate}
            disabled={status === "completed"}
            className="inline-flex items-center gap-2 rounded-full bg-saffron-500 px-5 py-2.5 text-[13px] font-semibold text-ink-950 transition-colors hover:bg-saffron-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("pay.simulate")}
            <BadgeIndianRupee size={15} strokeWidth={2.2} />
          </button>
          <DemoTag label={t("tag.demo")} />
        </div>

        {status === "completed" && (
          <div className="kq-swap mt-5 rounded-2xl border border-blue-400/25 bg-blue-50 p-4">
            <div className="flex items-start gap-2.5">
              <MessageSquare size={15} className="mt-0.5 shrink-0 text-blue-600" strokeWidth={2} />
              <div>
                <p className="text-[12.5px] font-semibold text-blue-700">{t("pay.notify")}</p>
                <p className="mt-1.5 font-mono text-[11.5px] leading-relaxed text-blue-700/75">
                  KrishiQueue: {formatINR(p.amount)} · {DEMO.paymentRef} · {DEMO.accountMask}
                </p>
              </div>
            </div>
          </div>
        )}

        <p className="mt-5 text-[12px] leading-relaxed text-ink-700/60">{t("pay.sub")}</p>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: "none" | "processing" | "completed" }) {
  const { t } = useI18n();
  const label =
    status === "completed"
      ? t("pay.completed")
      : status === "processing"
        ? t("pay.processing")
        : t("proc.s5");

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9.5px] tracking-[0.14em] uppercase",
        status === "completed"
          ? "border-ivory-50/30 bg-ivory-50/15 text-ivory-50"
          : status === "processing"
            ? "border-saffron-400/35 bg-saffron-400/12 text-saffron-400"
            : "border-ivory-100/15 text-ivory-200/50",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "completed"
            ? "bg-ivory-50"
            : status === "processing"
              ? "animate-blink bg-saffron-400"
              : "bg-ivory-100/40",
        )}
      />
      {label}
    </span>
  );
}
