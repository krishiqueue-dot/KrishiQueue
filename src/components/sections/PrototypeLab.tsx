import { CalendarCheck, ScrollText, Smartphone, Wallet } from "lucide-react";
import { useState } from "react";
import { BookingDemo } from "@/components/prototype/BookingDemo";
import { PaymentDemo } from "@/components/prototype/PaymentDemo";
import { PhonePreview } from "@/components/prototype/PhonePreview";
import { ProcurementDemo } from "@/components/prototype/ProcurementDemo";
import { Eyebrow, Reveal } from "@/components/ui/primitives";
import { REGIONS } from "@/data/india";
import { useI18n } from "@/i18n";
import type { DictKey } from "@/i18n/en";
import { cn } from "@/lib/cn";
import { usePrototype } from "@/state/prototype";

type TabId = "booking" | "phone" | "procurement" | "payment";

const TABS: {
  id: TabId;
  label: DictKey;
  eyebrow: DictKey;
  title: DictKey;
  sub: DictKey;
  icon: typeof CalendarCheck;
}[] = [
  {
    id: "booking",
    label: "booking.eyebrow",
    eyebrow: "booking.eyebrow",
    title: "booking.title",
    sub: "booking.sub",
    icon: CalendarCheck,
  },
  {
    id: "phone",
    label: "phone.eyebrow",
    eyebrow: "phone.eyebrow",
    title: "phone.title",
    sub: "phone.sub",
    icon: Smartphone,
  },
  {
    id: "procurement",
    label: "proc.eyebrow",
    eyebrow: "proc.eyebrow",
    title: "proc.title",
    sub: "proc.sub",
    icon: ScrollText,
  },
  {
    id: "payment",
    label: "pay.eyebrow",
    eyebrow: "pay.eyebrow",
    title: "pay.title",
    sub: "pay.sub",
    icon: Wallet,
  },
];

export function PrototypeLab() {
  const { t, tl } = useI18n();
  const p = usePrototype();
  const [tab, setTab] = useState<TabId>("booking");
  const active = TABS.find((x) => x.id === tab)!;

  return (
    <section id="prototype" className="relative isolate overflow-hidden bg-white scroll-mt-20">
      <div
        aria-hidden
        className="furrows-dense pointer-events-none absolute inset-0 text-ink-900 opacity-50"
      />
      <div className="relative mx-auto w-full max-w-[1180px] px-5 py-20 sm:px-8 md:py-28">
        <div className="max-w-[38rem]">
          <Reveal>
            <Eyebrow>{t("tag.prototype")}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-[clamp(1.9rem,4.6vw,3.1rem)] font-semibold">
              {tl({
                en: "Use the prototype the way a farmer would.",
                hi: "प्रोटोटाइप को वैसे ही चलाएँ जैसे एक किसान चलाएगा।",
                te: "ఒక రైతు ఎలా వాడతారో అలాగే ప్రోటోటైప్‌ను వాడి చూడండి.",
              })}
            </h2>
          </Reveal>
        </div>

        {/* ---------------- Region switcher: the pan-India dimension ---------------- */}
        <Reveal delay={0.12} className="mt-10">
          <div className="rounded-2xl border border-ink-900/10 bg-ivory-100 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[9.5px] tracking-[0.16em] text-ink-700/45 uppercase">
                {tl({
                  en: "Demo region",
                  hi: "डेमो क्षेत्र",
                  te: "డెమో ప్రాంతం",
                })}
              </p>
              <p className="font-mono text-[10.5px] text-ink-700/40">
                {tl(p.region.state)} · {tl(p.region.subdivisionType)} ·{" "}
                {tl(p.region.village)}
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {REGIONS.map((region) => {
                const on = region.id === p.regionId;
                return (
                  <button
                    key={region.id}
                    type="button"
                    onClick={() => p.setRegion(region.id)}
                    aria-pressed={on}
                    className={cn(
                      "rounded-full border px-4 py-2 text-[12.5px] font-medium transition-colors",
                      on
                        ? "border-ink-900 bg-ink-900 text-ivory-50"
                        : "border-ink-900/15 bg-white text-ink-700/70 hover:border-ink-900/35",
                    )}
                  >
                    {tl(region.state)}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-[11.5px] leading-relaxed text-ink-700/50">
              {tl({
                en: "Switching region changes the centres, the local term for the tier below a district, the crops and the farmer — the same product, configured for a different part of India.",
                hi: "क्षेत्र बदलने पर केंद्र, ज़िले के नीचे की इकाई का स्थानीय नाम, फसलें और किसान बदल जाते हैं — वही उत्पाद, भारत के दूसरे हिस्से के लिए विन्यस्त।",
                te: "ప్రాంతం మార్చితే కేంద్రాలు, జిల్లా కింది స్థాయికి స్థానిక పదం, పంటలు, రైతు మారతారు — అదే ఉత్పత్తి, భారతదేశంలోని మరో ప్రాంతానికి అమర్చినది.",
              })}
            </p>
          </div>
        </Reveal>

        {/* ---------------- Tabs ---------------- */}
        <Reveal delay={0.14} className="mt-8">
          <div
            role="tablist"
            aria-label={t("tag.prototype")}
            className="flex flex-wrap gap-2"
          >
            {TABS.map((item) => {
              const Icon = item.icon;
              const on = tab === item.id;
              return (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={on}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-semibold transition-all duration-200",
                    on
                      ? "border-ink-900 bg-ink-900 text-ivory-50 shadow-lift"
                      : "border-ink-900/12 bg-white text-ink-700/65 hover:border-ink-900/30 hover:text-ink-900",
                  )}
                >
                  <Icon size={15} strokeWidth={2} />
                  {t(item.label)}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* ---------------- Panel ---------------- */}
        <div className="mt-8">
          <div key={tab} className="kq-swap">
            <div className="mb-7 max-w-[46rem]">
              <h3 className="font-display text-[clamp(1.4rem,3.4vw,2.05rem)] font-semibold">
                {t(active.title)}
              </h3>
              <p className="mt-3 max-w-[52ch] text-[14.5px] leading-relaxed text-ink-700/75">
                {t(active.sub)}
              </p>
            </div>

            <div className="rounded-3xl border border-ink-900/10 bg-ivory-50/70 p-5 sm:p-7">
              {tab === "booking" && <BookingDemo />}
              {tab === "phone" && <PhonePreview />}
              {tab === "procurement" && <ProcurementDemo />}
              {tab === "payment" && <PaymentDemo />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
