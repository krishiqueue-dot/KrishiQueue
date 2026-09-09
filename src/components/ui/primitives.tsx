import {
  motion,
  useInView,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import type { Congestion } from "@/data/india";

/* ==================================================================
   SECTION SHELL
   Alternating light / ivory / dark bands give the page its rhythm.
   ================================================================== */

type Tone = "paper" | "ivory" | "ink" | "blue";

const TONE_CLASS: Record<Tone, string> = {
  paper: "bg-white text-ink-900",
  ivory: "bg-ivory-100 text-ink-900",
  ink: "bg-ink-900 text-ivory-100",
  blue: "bg-blue-700 text-ivory-50",
};

export function Section({
  id,
  tone = "ivory",
  className,
  children,
  texture,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  children: ReactNode;
  texture?: "furrows" | "grid" | "none";
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative isolate overflow-hidden scroll-mt-20",
        TONE_CLASS[tone],
        className,
      )}
    >
      {texture === "furrows" && (
        <div aria-hidden className="furrows pointer-events-none absolute inset-0 opacity-70" />
      )}
      {texture === "grid" && (
        <div aria-hidden className="survey-grid pointer-events-none absolute inset-0 opacity-60" />
      )}
      <div className="relative mx-auto w-full max-w-[1180px] px-5 py-20 sm:px-8 md:py-28">
        {children}
      </div>
    </section>
  );
}

/* ==================================================================
   HEADINGS
   ================================================================== */

export function Eyebrow({
  children,
  tone = "dark",
  className,
}: {
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span
        aria-hidden
        className={cn(
          "h-px w-8 shrink-0",
          tone === "dark" ? "bg-saffron-500" : "bg-saffron-400",
        )}
      />
      <span
        className={cn(
          "font-mono text-[11px] font-medium tracking-[0.18em] uppercase",
          tone === "dark" ? "text-saffron-700" : "text-saffron-400",
        )}
      >
        {children}
      </span>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  tone = "dark",
  align = "left",
  className,
  action,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <div className={cn("flex flex-col gap-5", align === "center" && "items-center")}>
        {eyebrow && <Reveal>{<Eyebrow tone={tone}>{eyebrow}</Eyebrow>}</Reveal>}
        <Reveal delay={0.05}>
          <h2
            className={cn(
              "max-w-[20ch] text-[clamp(1.9rem,4.4vw,3.1rem)] font-semibold",
              align === "center" && "mx-auto max-w-[24ch]",
            )}
          >
            {title}
          </h2>
        </Reveal>
        {sub && (
          <Reveal delay={0.1}>
            <p
              className={cn(
                "max-w-[62ch] text-[15px] leading-relaxed sm:text-base",
                tone === "dark" ? "text-ink-700/85" : "text-ivory-200/75",
                align === "center" && "mx-auto",
              )}
            >
              {sub}
            </p>
          </Reveal>
        )}
      </div>
      {action && <Reveal delay={0.15}>{action}</Reveal>}
    </div>
  );
}

/* ==================================================================
   SCROLL REVEAL
   ================================================================== */

export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ==================================================================
   BUTTONS
   ================================================================== */

type ButtonVariant = "primary" | "secondary" | "ghost" | "onDark" | "saffron";

const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  primary:
    "bg-ink-900 text-ivory-50 hover:bg-ink-800 active:bg-ink-950 border border-ink-900",
  secondary:
    "bg-white text-ink-900 border border-ink-900/15 hover:border-ink-900/35 hover:bg-ivory-50",
  ghost:
    "bg-transparent text-ink-900 border border-transparent hover:bg-ink-900/5",
  onDark:
    "bg-ivory-50 text-ink-900 border border-ivory-50 hover:bg-white",
  saffron:
    "bg-saffron-500 text-ink-950 border border-saffron-500 hover:bg-saffron-400",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  icon,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
}) {
  return (
    <button
      {...rest}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "active:scale-[0.985]",
        size === "sm" && "px-4 py-2 text-[13px]",
        size === "md" && "px-5 py-2.5 text-sm",
        size === "lg" && "px-6 py-3.5 text-[15px]",
        BUTTON_VARIANT[variant],
        className,
      )}
    >
      {children}
      {icon}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  icon,
}: {
  href: string;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <a
      href={href}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 active:scale-[0.985]",
        size === "sm" && "px-4 py-2 text-[13px]",
        size === "md" && "px-5 py-2.5 text-sm",
        size === "lg" && "px-6 py-3.5 text-[15px]",
        BUTTON_VARIANT[variant],
        className,
      )}
    >
      {children}
      {icon}
    </a>
  );
}

/* ==================================================================
   TAGS / BADGES
   ================================================================== */

export function DemoTag({
  label,
  tone = "dark",
  className,
}: {
  label: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium tracking-[0.14em] uppercase",
        tone === "dark"
          ? "border-saffron-600/30 bg-saffron-50 text-saffron-700"
          : "border-saffron-400/30 bg-saffron-400/10 text-saffron-400",
        className,
      )}
    >
      <span aria-hidden className="h-1 w-1 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function LivePill({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-agri-500/30 bg-agri-500/10 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.16em] text-agri-500 uppercase",
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-agri-500" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-agri-500" />
      </span>
      {label}
    </span>
  );
}

export const CONGESTION_STYLE: Record<
  Congestion,
  { dot: string; text: string; bg: string; border: string; bar: string }
> = {
  low: {
    dot: "bg-agri-500",
    text: "text-agri-700",
    bg: "bg-agri-50",
    border: "border-agri-500/30",
    bar: "bg-agri-500",
  },
  medium: {
    dot: "bg-saffron-500",
    text: "text-saffron-700",
    bg: "bg-saffron-50",
    border: "border-saffron-500/30",
    bar: "bg-saffron-500",
  },
  high: {
    dot: "bg-clay-500",
    text: "text-clay-600",
    bg: "bg-clay-100/50",
    border: "border-clay-500/30",
    bar: "bg-clay-500",
  },
};

export function CongestionDot({
  level,
  className,
}: {
  level: Congestion;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block h-2 w-2 shrink-0 rounded-full",
        CONGESTION_STYLE[level].dot,
        className,
      )}
    />
  );
}

/* ==================================================================
   CARD
   ================================================================== */

export function Card({
  className,
  children,
  ...rest
}: HTMLMotionProps<"div"> & { className?: string; children?: ReactNode }) {
  return (
    <motion.div
      {...rest}
      className={cn(
        "relative rounded-2xl border border-ink-900/10 bg-white p-6 shadow-lift",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

/* ==================================================================
   COUNT-UP
   ================================================================== */

export function CountUp({
  to,
  from = 0,
  duration = 1100,
  suffix = "",
  prefix = "",
  decimals = 0,
  format,
  className,
}: {
  to: number;
  from?: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  /** Formats each frame — use it for currency so the digits stay grouped. */
  format?: (n: number) => string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  // Reduced motion never animates, so start on the answer rather than
  // painting a 0 for one frame.
  const [value, setValue] = useState(() => (reduce ? to : from));

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setValue(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      // easeOutExpo keeps the last digits from crawling
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setValue(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // A throttled tab can stop delivering frames part-way through. The
    // number matters more than the animation, so land it regardless.
    const settle = window.setTimeout(() => setValue(to), duration + 400);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
    };
  }, [inView, to, from, duration, reduce]);

  return (
    <span ref={ref} className={cn("tabular", className)}>
      {prefix}
      {format ? format(value) : value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ==================================================================
   DATA ROW — a labelled value, used across every prototype panel
   ================================================================== */

export function DataRow({
  label,
  value,
  mono = false,
  tone = "dark",
  className,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 border-b py-2.5 last:border-b-0",
        tone === "dark" ? "border-ink-900/8" : "border-ivory-100/10",
        className,
      )}
    >
      <span
        className={cn(
          "text-[12.5px]",
          tone === "dark" ? "text-ink-700/65" : "text-ivory-200/60",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "text-right text-[13.5px] font-semibold",
          mono && "font-mono tabular tracking-tight",
          tone === "dark" ? "text-ink-900" : "text-ivory-50",
        )}
      >
        {value}
      </span>
    </div>
  );
}

/* ==================================================================
   HAIRLINE — decorative measurement rule
   ================================================================== */

export function TickRule({ className }: { className?: string }) {
  return <div aria-hidden className={cn("tick-rule h-px w-full", className)} />;
}

/* ==================================================================
   ENTRANCE
   Under prefers-reduced-motion the content must appear immediately —
   never animate opacity from 0, or a paused rAF leaves it invisible.
   ================================================================== */

export function useEntrance() {
  const reduce = useReducedMotion();
  return (y = 16, delay = 0, duration = 0.55) => ({
    initial: reduce ? false : ({ opacity: 0, y } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration, delay, ease: [0.22, 1, 0.36, 1] as const },
  });
}

/**
 * Scroll-reveal props for hand-rolled motion elements, with the same
 * reduced-motion guarantee as <Reveal>: content is never hidden to begin with.
 */
export function useReveal() {
  const reduce = useReducedMotion();
  return (delay = 0, y = 16, duration = 0.5) => ({
    initial: reduce ? false : ({ opacity: 0, y } as const),
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" } as const,
    transition: { duration, delay, ease: [0.22, 1, 0.36, 1] as const },
  });
}

/** Same idea for elements that grow (rules, bars) rather than fade. */
export function useGrow() {
  const reduce = useReducedMotion();
  return (to: string | number, delay = 0, duration = 0.7, axis: "width" | "scaleX" = "width") => {
    const target = axis === "width" ? { width: to } : { scaleX: to as number };
    return {
      initial: reduce ? target : axis === "width" ? { width: 0 } : { scaleX: 0 },
      whileInView: target,
      viewport: { once: true, margin: "-60px" } as const,
      transition: { duration, delay, ease: [0.22, 1, 0.36, 1] as const },
    };
  };
}
