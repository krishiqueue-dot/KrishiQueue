import { Check, ChevronDown, Languages } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { LANGUAGES, useI18n, type Lang } from "@/i18n";
import { cn } from "@/lib/cn";

/**
 * Language selector as a dropdown rather than a row of buttons.
 *
 * The row worked for three languages and would not survive a fourth: it
 * competes with the brand and the CTA for header width. This menu is driven
 * entirely off the LANGUAGES array — adding a language is a one-line data
 * change with no layout consequences, and the list scrolls past about six.
 */
export function LanguageMenu({
  className,
  align = "right",
  fullLabel = false,
}: {
  className?: string;
  /** Which edge the panel hangs from. */
  align?: "right" | "left";
  /** Always spell out the language name. The header collapses to the short
   *  form on narrow screens; places with room (the mobile sheet) do not. */
  fullLabel?: boolean;
}) {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const menuId = useId();

  const activeIndex = Math.max(
    0,
    LANGUAGES.findIndex((l) => l.code === lang),
  );
  const current = LANGUAGES[activeIndex];

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  // Dismiss on an outside press or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Opening lands focus on the current language, so a keyboard user starts
  // from where they are rather than at the top of the list.
  useEffect(() => {
    if (open) itemRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  const focusItem = (index: number) => {
    const next = (index + LANGUAGES.length) % LANGUAGES.length;
    itemRefs.current[next]?.focus();
  };

  const choose = (code: Lang) => {
    setLang(code);
    close();
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`${t("nav.language")}: ${current.english}`}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border py-2 pr-2 pl-2.5 text-[12px] font-semibold transition-colors sm:gap-2 sm:pr-2.5 sm:pl-3 sm:text-[12.5px]",
          open
            ? "border-ink-900/35 bg-white text-ink-900"
            : "border-ink-900/12 bg-white/60 text-ink-800 hover:border-ink-900/30 hover:bg-white",
        )}
      >
        <Languages size={15} strokeWidth={2} className="shrink-0 text-ink-700/70" />
        <span className={fullLabel ? "" : "hidden sm:inline"}>{current.native}</span>
        {!fullLabel && <span className="sm:hidden">{current.label}</span>}
        <ChevronDown
          size={14}
          strokeWidth={2.4}
          className={cn(
            "shrink-0 text-ink-700/50 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={t("nav.language")}
          className={cn(
            "kq-menu absolute top-full z-50 mt-2 max-h-[15rem] w-[13.5rem] overflow-y-auto rounded-2xl border border-ink-900/12 bg-white p-1.5 shadow-lift-lg",
            align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left",
          )}
        >
          {LANGUAGES.map((l, i) => {
            const selected = l.code === lang;
            return (
              <button
                key={l.code}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => choose(l.code)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    focusItem(i + 1);
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    focusItem(i - 1);
                  } else if (e.key === "Home") {
                    e.preventDefault();
                    focusItem(0);
                  } else if (e.key === "End") {
                    e.preventDefault();
                    focusItem(LANGUAGES.length - 1);
                  } else if (e.key === "Tab") {
                    setOpen(false);
                  }
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors",
                  selected ? "bg-ink-900/[0.06]" : "hover:bg-ink-900/[0.04]",
                )}
              >
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block truncate text-[13.5px]",
                      selected ? "font-semibold text-ink-900" : "text-ink-800",
                    )}
                  >
                    {l.native}
                  </span>
                  {l.english !== l.native && (
                    <span className="block truncate text-[11px] text-ink-700/50">
                      {l.english}
                    </span>
                  )}
                </span>
                <Check
                  size={15}
                  strokeWidth={3}
                  className={cn(
                    "shrink-0 text-agri-600",
                    selected ? "opacity-100" : "opacity-0",
                  )}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
