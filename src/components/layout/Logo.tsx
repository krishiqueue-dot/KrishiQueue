import { cn } from "@/lib/cn";

/**
 * The KrishiQueue mark: three stacked rows (a queue) inside a seal, with the
 * leading row picked out in saffron — the token currently being served. The
 * shortening rows also read as furrows in a field.
 */
export function LogoMark({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const frame = tone === "dark" ? "var(--color-ink-900)" : "var(--color-ivory-50)";
  const rows = tone === "dark" ? "var(--color-ink-900)" : "var(--color-ivory-50)";

  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-8 w-8 shrink-0", className)}
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="1.25"
        y="1.25"
        width="29.5"
        height="29.5"
        rx="8.5"
        fill="none"
        stroke={frame}
        strokeWidth="1.6"
        opacity="0.9"
      />
      <rect x="7" y="9" width="18" height="3.2" rx="1.6" fill="var(--color-saffron-500)" />
      <rect x="7" y="14.4" width="13.5" height="3.2" rx="1.6" fill={rows} opacity="0.55" />
      <rect x="7" y="19.8" width="9" height="3.2" rx="1.6" fill={rows} opacity="0.28" />
    </svg>
  );
}

export function Wordmark({
  className,
  tone = "dark",
  label,
}: {
  className?: string;
  tone?: "dark" | "light";
  label: string;
}) {
  return (
    <span
      className={cn(
        "font-display text-[17px] leading-none font-semibold tracking-[-0.02em] sm:text-[19px]",
        tone === "dark" ? "text-ink-900" : "text-ivory-50",
        className,
      )}
    >
      {label}
    </span>
  );
}
