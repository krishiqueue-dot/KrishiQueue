import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/cn";
import { LanguageMenu } from "./LanguageMenu";
import { LogoMark, Wordmark } from "./Logo";
import type { DictKey } from "@/i18n/en";

const LINKS: { id: string; key: DictKey }[] = [
  { id: "home", key: "nav.home" },
  { id: "problem", key: "nav.problem" },
  { id: "solution", key: "nav.solution" },
  { id: "how-it-works", key: "nav.how" },
  { id: "live-queue", key: "nav.queue" },
  { id: "prototype", key: "nav.prototype" },
];

export function Nav() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll spy: the section occupying the upper third of the viewport wins.
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-15% 0px -60% 0px", threshold: [0.05, 0.25, 0.5] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a
        href="#problem"
        className="sr-only rounded-full bg-ink-900 px-4 py-2 text-ivory-50 focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100]"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-ink-900/10 bg-ivory-100/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-[68px] w-full max-w-[1180px] items-center justify-between gap-2 px-4 sm:gap-4 sm:px-8">
          <a href="#home" className="flex shrink-0 items-center gap-2 sm:gap-2.5" aria-label={t("brand.name")}>
            <LogoMark />
            <Wordmark label={t("brand.name")} />
          </a>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
            {LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={cn(
                  "relative rounded-full px-3 py-2 text-[13.5px] font-medium transition-colors",
                  active === link.id
                    ? "text-ink-900"
                    : "text-ink-700/65 hover:text-ink-900",
                )}
              >
                {t(link.key)}
                {active === link.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-saffron-500"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <LanguageMenu />
            <a
              href="#prototype"
              className="hidden rounded-full bg-ink-900 px-4 py-2.5 text-[13px] font-semibold text-ivory-50 transition-colors hover:bg-ink-800 sm:inline-flex"
            >
              {t("nav.cta")}
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t("nav.menu")}
              className="rounded-full border border-ink-900/12 p-2 text-ink-900 transition-colors hover:bg-ink-900/5 sm:p-2.5 lg:hidden"
            >
              <Menu size={17} strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <MobileSheet active={active} onClose={() => setOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

function MobileSheet({
  active,
  onClose,
}: {
  active: string;
  onClose: () => void;
}) {
  const { t } = useI18n();
  return (
    <motion.div
      className="fixed inset-0 z-[60] lg:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="absolute inset-x-0 top-0 rounded-b-3xl border-b border-ink-900/10 bg-ivory-100 px-5 pt-5 pb-8"
        initial={{ y: "-100%" }}
        animate={{ y: 0 }}
        exit={{ y: "-100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <Wordmark label={t("brand.name")} />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("nav.close")}
            className="rounded-full border border-ink-900/12 p-2.5 text-ink-900"
          >
            <X size={17} strokeWidth={2} />
          </button>
        </div>

        <nav className="mt-7 flex flex-col" aria-label="Mobile">
          {LINKS.map((link, i) => (
            <motion.a
              key={link.id}
              href={`#${link.id}`}
              onClick={onClose}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.035, duration: 0.25 }}
              className={cn(
                "flex items-center justify-between border-b border-ink-900/8 py-3.5 text-[17px] font-medium",
                active === link.id ? "text-ink-900" : "text-ink-700/70",
              )}
            >
              {t(link.key)}
              <span
                className={cn(
                  "font-mono text-[10px] tracking-widest",
                  active === link.id ? "text-saffron-600" : "text-transparent",
                )}
              >
                ●
              </span>
            </motion.a>
          ))}
        </nav>

        <div className="mt-6 flex items-center justify-between gap-3">
          <LanguageMenu align="left" fullLabel />
          <a
            href="#prototype"
            onClick={onClose}
            className="rounded-full bg-saffron-500 px-5 py-2.5 text-[13px] font-semibold text-ink-950"
          >
            {t("nav.cta")}
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
