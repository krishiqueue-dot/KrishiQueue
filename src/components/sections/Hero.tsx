import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { CountUp, LivePill, LinkButton, useEntrance } from "@/components/ui/primitives";
import { REGIONS, centreName, CROPS as ALL_CROPS } from "@/data/india";
import { useI18n } from "@/i18n";

const CENTRE_COUNT = REGIONS.reduce((n, r) => n + r.centres.length, 0);
const STATE_COUNT = REGIONS.length;
const CROP_COUNT = Object.keys(ALL_CROPS).length;

/** Tokens are always three digits on the board: KQ-098, not KQ-98. */
const pad = (n: number) => String(n).padStart(3, "0");

export function Hero() {
  const { t } = useI18n();
  const enter = useEntrance();

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-ivory-100 pt-[104px] pb-0 scroll-mt-20"
    >
      {/* Dawn wash — warm light in the upper right, cool ivory elsewhere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 90% at 88% 4%, rgba(240,166,63,0.16) 0%, rgba(240,166,63,0.05) 32%, rgba(250,247,241,0) 62%), radial-gradient(80% 70% at 10% 100%, rgba(30,131,85,0.10) 0%, rgba(250,247,241,0) 60%)",
        }}
      />
      <div
        aria-hidden
        className="furrows pointer-events-none absolute inset-0 -z-10 text-ink-900 opacity-70"
      />

      <div className="mx-auto grid w-full max-w-[1180px] items-center gap-12 px-5 pb-24 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-32">
        {/* ---------------- Copy ---------------- */}
        <div className="flex flex-col">
          <motion.div
            {...enter(12, 0, 0.5)}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-ink-900/12 bg-white/70 px-3 py-1.5 backdrop-blur"
          >
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-saffron-500" />
            <span className="font-mono text-[10.5px] font-medium tracking-[0.12em] text-ink-700/80 uppercase">
              {t("hero.badge")}
            </span>
          </motion.div>

          <h1 className="display-1 mt-7 text-[clamp(2.6rem,7.2vw,4.6rem)]">
            <motion.span
              className="block"
              {...enter(20, 0.06, 0.6)}
            >
              {t("hero.title1")}
            </motion.span>
            <motion.span
              className="relative block text-ink-700"
              {...enter(20, 0.14, 0.6)}
            >
              {t("hero.title2")}
              <motion.span
                aria-hidden
                className="absolute -bottom-1 left-0 h-[3px] rounded-full bg-saffron-500"
                initial={{ width: "42%" }}
                animate={{ width: "42%" }}
                transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.span>
          </h1>

          <motion.p
            className="mt-7 max-w-[54ch] text-[15.5px] leading-relaxed text-ink-700/85 sm:text-[17px]"
            {...enter(14, 0.22)}
          >
            {t("hero.sub")}
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            {...enter(14, 0.3)}
          >
            <LinkButton
              href="#solution"
              size="lg"
              variant="primary"
              icon={
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              }
            >
              {t("hero.cta1")}
            </LinkButton>
            <LinkButton
              href="#film"
              size="lg"
              variant="secondary"
              icon={<Play size={14} className="fill-current" />}
            >
              {t("hero.cta2")}
            </LinkButton>
          </motion.div>

          {/* Scope strip — establishes pan-India reach immediately */}
          <motion.dl
            className="mt-12 grid max-w-[30rem] grid-cols-3 gap-px overflow-hidden rounded-xl border border-ink-900/10 bg-ink-900/10"
            {...enter(0, 0.42, 0.6)}
          >
            {[
              { n: CENTRE_COUNT, label: t("hero.statCentres") },
              { n: STATE_COUNT, label: t("hero.statStates") },
              { n: CROP_COUNT, label: t("hero.statCrops") },
            ].map((s) => (
              <div key={s.label} className="bg-ivory-100 px-3 py-3.5 sm:px-4">
                <dd className="font-mono text-[22px] leading-none font-semibold text-ink-900">
                  <CountUp to={s.n} duration={900} />
                </dd>
                <dt className="mt-1.5 text-[11px] leading-tight text-ink-700/60">{s.label}</dt>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* ---------------- Live token visual ---------------- */}
        <HeroQueueCard />
      </div>

      {/* Horizon that carries the eye into the film section */}
      <FieldHorizon />

    </section>
  );
}

/* ==================================================================
   The hero's product visual: a live queue board for one farmer.
   It advances on its own so the concept lands before any reading.
   ================================================================== */

function HeroQueueCard() {
  const { t, tl, lang } = useI18n();
  const reduce = useReducedMotion();
  const enter = useEntrance();
  const centre = REGIONS[0].centres[0]; // Tirupati — the low-congestion demo centre

  const [nowServing, setNowServing] = useState(98);
  const yourToken = 102;
  const position = yourToken - nowServing;
  const waitMin = position * centre.avgServiceMin;

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setNowServing((n) => (n >= 101 ? 98 : n + 1));
    }, 3400);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[440px] lg:mx-0"
      {...enter(26, 0.18, 0.7)}
    >
      {/* Main board */}
      <div className="grain relative overflow-hidden rounded-[26px] border border-ink-950/50 bg-ink-900 p-6 text-ivory-100 shadow-lift-lg sm:p-7">
        <div
          aria-hidden
          className="survey-grid pointer-events-none absolute inset-0 text-ivory-100 opacity-40"
        />

        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] tracking-[0.16em] text-ivory-200/45 uppercase">
              {t("common.centre")}
            </p>
            <p className="mt-1.5 text-[15px] leading-snug font-semibold">
              {centreName(centre.place, lang)}
            </p>
            <p className="mt-0.5 text-[11.5px] text-ivory-200/50">
              {tl(centre.subdivision)} · {tl(centre.district)} · {tl(REGIONS[0].state)}
            </p>
          </div>
          <LivePill label={t("tag.live")} />
        </div>

        <div className="relative mt-6 flex items-end justify-between gap-4 border-y border-ivory-100/10 py-5">
          <div>
            <p className="font-mono text-[10px] tracking-[0.16em] text-ivory-200/45 uppercase">
              {t("common.nowServing")}
            </p>
            <motion.p
              key={nowServing}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32 }}
              className="mt-1 font-mono text-[30px] leading-none font-semibold tracking-tight text-saffron-400"
            >
              KQ-{pad(nowServing)}
            </motion.p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] tracking-[0.16em] text-ivory-200/45 uppercase">
              {t("common.counter")}
            </p>
            <p className="mt-1 font-mono text-[30px] leading-none font-semibold tracking-tight">
              {(nowServing % centre.counters) + 1}
            </p>
          </div>
        </div>

        {/* The farmer's own token */}
        <div className="relative mt-5 rounded-2xl border border-saffron-400/25 bg-saffron-400/[0.07] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] tracking-[0.16em] text-saffron-400/80 uppercase">
                {t("common.yourToken")}
              </p>
              <p className="mt-1 font-mono text-[27px] leading-none font-semibold tracking-tight text-ivory-50">
                KQ-{pad(yourToken)}
              </p>
            </div>
            <div className="flex gap-5 text-right">
              <div>
                <p className="font-mono text-[10px] tracking-[0.14em] text-ivory-200/45 uppercase">
                  {t("common.position")}
                </p>
                <motion.p
                  key={`p-${position}`}
                  initial={reduce ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-1 font-mono text-[24px] leading-none font-semibold"
                >
                  #{position}
                </motion.p>
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-[0.14em] text-ivory-200/45 uppercase">
                  {t("common.estWait")}
                </p>
                <motion.p
                  key={`w-${waitMin}`}
                  initial={reduce ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-1 font-mono text-[24px] leading-none font-semibold text-agri-400"
                >
                  {waitMin}
                  <span className="ml-0.5 text-[12px] font-medium text-ivory-200/55">
                    {t("common.min")}
                  </span>
                </motion.p>
              </div>
            </div>
          </div>

          {/* Progress toward the counter */}
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-ivory-100/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-agri-500 to-saffron-400"
              animate={{ width: `${8 + ((4 - position) / 4) * 92}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        <p className="relative mt-5 text-[10.5px] leading-relaxed text-ivory-200/40">
          {t("disc.sim")}
        </p>
      </div>

    </motion.div>
  );
}

/* ==================================================================
   Horizon band — layered fields, a centre shed, and a line of trolleys.
   Decorative, but it grounds the product in a real place.
   ================================================================== */

function FieldHorizon() {
  return (
    <div aria-hidden className="pointer-events-none relative h-[120px] w-full sm:h-[150px]">
      <svg
        viewBox="0 0 1440 150"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="hz-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E8355" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#1E8355" stopOpacity="0.20" />
          </linearGradient>
          <linearGradient id="hz-near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0F5233" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#0F5233" stopOpacity="0.38" />
          </linearGradient>
        </defs>

        {/* far ridge */}
        <path
          d="M0 92 C 140 70, 250 96, 380 84 C 520 71, 640 92, 780 80 C 920 68, 1060 90, 1200 78 C 1310 69, 1380 84, 1440 76 L1440 150 L0 150 Z"
          fill="url(#hz-far)"
        />
        {/* near field */}
        <path
          d="M0 118 C 180 104, 340 122, 520 112 C 700 102, 860 120, 1040 110 C 1200 101, 1330 116, 1440 108 L1440 150 L0 150 Z"
          fill="url(#hz-near)"
        />

        {/* procurement shed */}
        <g opacity="0.5">
          <rect x="1096" y="60" width="86" height="28" rx="2" fill="#0B1B2B" opacity="0.5" />
          <path d="M1090 60 L1139 44 L1188 60 Z" fill="#0B1B2B" opacity="0.62" />
          <rect x="1124" y="72" width="14" height="16" fill="#FAF7F1" opacity="0.45" />
        </g>

        {/* a queue of trolleys approaching the shed */}
        <g opacity="0.4" fill="#0B1B2B">
          {[880, 946, 1012].map((x, i) => (
            <g key={x} transform={`translate(${x}, ${72 + i * 2})`}>
              <rect x="0" y="4" width="30" height="11" rx="1.5" />
              <rect x="30" y="7" width="11" height="8" rx="1.5" />
              <circle cx="8" cy="17" r="2.6" />
              <circle cx="24" cy="17" r="2.6" />
              <circle cx="37" cy="17" r="2.4" />
            </g>
          ))}
        </g>

        {/* crop rows */}
        <g opacity="0.16" stroke="#0F5233" strokeWidth="1.4" strokeLinecap="round">
          {Array.from({ length: 46 }).map((_, i) => {
            const x = i * 32 + 8;
            return <line key={i} x1={x} y1={128} x2={x - 10} y2={150} />;
          })}
        </g>
      </svg>
    </div>
  );
}
