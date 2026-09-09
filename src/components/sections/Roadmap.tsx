import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Eyebrow, Reveal, useReveal } from "@/components/ui/primitives";
import { useI18n } from "@/i18n";
import type { DictKey } from "@/i18n/en";
import { cn } from "@/lib/cn";

const PHASES: { title: DictKey; body: DictKey; built: boolean }[] = [
  { title: "road.p1", body: "road.p1d", built: true },
  { title: "road.p2", body: "road.p2d", built: false },
  { title: "road.p3", body: "road.p3d", built: false },
  { title: "road.p4", body: "road.p4d", built: false },
  { title: "road.p5", body: "road.p5d", built: false },
  { title: "road.p6", body: "road.p6d", built: false },
  { title: "road.p7", body: "road.p7d", built: false },
  { title: "road.p8", body: "road.p8d", built: false },
];

export function Roadmap() {
  const { t } = useI18n();
  const reveal = useReveal();

  return (
    <section
      id="roadmap"
      className="relative isolate overflow-hidden bg-ink-900 text-ivory-100 scroll-mt-20"
    >
      <div
        aria-hidden
        className="survey-grid pointer-events-none absolute inset-0 text-ivory-100 opacity-25"
      />
      <div className="relative mx-auto w-full max-w-[1180px] px-5 py-20 sm:px-8 md:py-28">
        <div className="max-w-[46rem]">
          <Reveal>
            <Eyebrow tone="light">{t("road.eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-[clamp(1.9rem,4.6vw,3.1rem)] font-semibold">
              {t("road.title")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[56ch] text-[15px] leading-relaxed text-ivory-200/70">
              {t("road.sub")}
            </p>
          </Reveal>
        </div>

        {/* Horizontal rail on wide screens, vertical on narrow */}
        <div className="mt-14">
          <div className="relative">
            <span
              aria-hidden
              className="absolute top-[15px] right-0 left-0 hidden h-px bg-ivory-100/12 lg:block"
            />
            <span
              aria-hidden
              className="absolute top-4 bottom-4 left-[15px] w-px bg-ivory-100/12 lg:hidden"
            />
            {/* the built portion of the line */}
            <span
              aria-hidden
              className="absolute top-[15px] left-0 hidden h-px w-[6.25%] bg-saffron-500 lg:block"
            />

            <ol className="grid gap-7 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
              {PHASES.map((phase, i) => (
                <motion.li
                  key={phase.title}
                  {...reveal(i * 0.06, 14, 0.45)}
                  className="relative flex gap-4 lg:flex-col lg:gap-0"
                >
                  <span
                    className={cn(
                      "relative z-10 flex h-[31px] w-[31px] shrink-0 items-center justify-center rounded-full border-2 font-mono text-[11px] font-semibold",
                      phase.built
                        ? "border-saffron-500 bg-saffron-500 text-ink-950"
                        : "border-ivory-100/20 bg-ink-900 text-ivory-200/50",
                    )}
                  >
                    {phase.built ? <Check size={15} strokeWidth={3} /> : i + 1}
                  </span>

                  <div className="min-w-0 flex-1 lg:mt-5">
                    <span
                      className={cn(
                        "inline-block rounded-full border px-2 py-0.5 font-mono text-[8.5px] tracking-[0.14em] uppercase",
                        phase.built
                          ? "border-saffron-500/40 bg-saffron-500/10 text-saffron-400"
                          : "border-ivory-100/12 text-ivory-200/40",
                      )}
                    >
                      {phase.built ? t("road.now") : t("road.next")}
                    </span>
                    <h3 className="mt-2.5 text-[15px] leading-snug font-semibold">
                      {t(phase.title)}
                    </h3>
                    <p className="mt-2 max-w-[34ch] text-[12.5px] leading-relaxed text-ivory-200/60">
                      {t(phase.body)}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
