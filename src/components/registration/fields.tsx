import { CheckCircle2, ChevronDown, FileText, Upload as UploadIcon } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/cn";
import { REG, type RegCopyKey } from "./copy";
import { formatSize, type Upload } from "./validation";

/* ==================================================================
   FIELD SHELL
   ================================================================== */

const INPUT =
  "w-full rounded-xl border bg-white px-3.5 py-2.5 text-[13.5px] text-ink-900 transition-colors placeholder:text-ink-700/35 focus:border-ink-900/45 focus:outline-none";

export function Field({
  id,
  label,
  hint,
  error,
  children,
  className,
}: {
  id: string;
  label: ReactNode;
  hint?: string;
  error?: RegCopyKey;
  children: ReactNode;
  className?: string;
}) {
  const { tl } = useI18n();
  return (
    <div className={cn("min-w-0", className)}>
      <label
        htmlFor={id}
        className="mb-1.5 block font-mono text-[9.5px] tracking-[0.14em] text-ink-700/55 uppercase"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-[11.5px] leading-snug text-clay-600">
          {tl(REG[error])}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-[11px] leading-snug text-ink-700/45">{hint}</p>
      ) : null}
    </div>
  );
}

const border = (error?: RegCopyKey) => (error ? "border-clay-500/60" : "border-ink-900/12");

export function TextInput({
  id,
  value,
  onChange,
  error,
  inputMode,
  placeholder,
  list,
  suffix,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  error?: RegCopyKey;
  inputMode?: "text" | "decimal" | "numeric";
  placeholder?: string;
  list?: string;
  suffix?: string;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode={inputMode}
        placeholder={placeholder}
        list={list}
        autoComplete="off"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(INPUT, border(error), suffix && "pr-16")}
      />
      {suffix && (
        <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-[12px] text-ink-700/45">
          {suffix}
        </span>
      )}
    </div>
  );
}

export function SelectInput({
  id,
  value,
  onChange,
  options,
  error,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  error?: RegCopyKey;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        className={cn(INPUT, border(error), "cursor-pointer appearance-none pr-9")}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        strokeWidth={2.2}
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-700/45"
      />
    </div>
  );
}

/**
 * A number the farmer should never see printed in full once it is entered.
 * While focused it shows exactly what is typed; the moment focus leaves it
 * collapses to the masked form. A masked demo value is selected on focus so
 * typing replaces it rather than appending to the X's.
 */
export function SensitiveInput({
  id,
  value,
  onChange,
  mask,
  error,
  numeric,
  prefix,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  mask: (v: string) => string;
  error?: RegCopyKey;
  numeric?: boolean;
  prefix?: string;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      {prefix && (
        <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 font-mono text-[13px] text-ink-700/55">
          {prefix}
        </span>
      )}
      <input
        id={id}
        value={focused ? value : mask(value)}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => {
          setFocused(true);
          if (value.includes("X")) e.currentTarget.select();
        }}
        onBlur={() => setFocused(false)}
        inputMode={numeric ? "numeric" : "text"}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(INPUT, border(error), "font-mono tracking-wide", prefix && "pl-12")}
      />
    </div>
  );
}

/* ==================================================================
   STATUS PILL
   ================================================================== */

export function StatusPill({ ready, label }: { ready: boolean; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-semibold transition-colors duration-300",
        ready
          ? "border-agri-500/30 bg-agri-50 text-agri-700"
          : "border-ink-900/12 bg-ivory-100 text-ink-700/55",
      )}
    >
      <span
        aria-hidden
        className={cn("h-1.5 w-1.5 rounded-full", ready ? "bg-agri-500" : "bg-ink-700/30")}
      />
      {label}
    </span>
  );
}

/* ==================================================================
   UPLOAD
   A real file picker, but nothing is read or sent: only the name and size
   of the chosen file are kept, and they never leave the browser.
   ================================================================== */

const ACCEPT = ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";
const MAX_BYTES = 5 * 1024 * 1024;

export function UploadBox({
  id,
  upload,
  onChange,
  label,
  doneLabel,
  sample,
  error,
}: {
  id: string;
  upload: Upload;
  onChange: (u: Upload) => void;
  label: RegCopyKey;
  doneLabel: RegCopyKey;
  sample: { name: string; size: number };
  error?: RegCopyKey;
}) {
  const { tl } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<RegCopyKey | null>(null);

  // The parent passes a fresh callback every render; holding it in a ref
  // keeps a keystroke elsewhere in the form from restarting the timer below.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Simulated transfer: a short pause, then done.
  useEffect(() => {
    if (upload.state !== "uploading") return;
    const timer = window.setTimeout(
      () => onChangeRef.current({ state: "done", name: upload.name, size: upload.size }),
      900,
    );
    return () => window.clearTimeout(timer);
  }, [upload]);

  const start = (name: string, size: number) => {
    setFileError(null);
    onChange({ state: "uploading", name, size });
  };

  const pick = (file: File | undefined) => {
    if (!file) return;
    const okType = /\.(pdf|jpe?g|png)$/i.test(file.name);
    if (!okType) return setFileError("errFileType");
    if (file.size > MAX_BYTES) return setFileError("errFileSize");
    start(file.name, file.size);
  };

  const shownError = fileError ?? error;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          pick(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {upload.state === "done" ? (
        <div className="kq-swap flex items-start gap-3 rounded-xl border border-agri-500/30 bg-agri-50 p-3.5">
          <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-agri-600" strokeWidth={2.2} />
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] font-semibold text-agri-800">{tl(REG[doneLabel])}</p>
            <p className="mt-0.5 truncate font-mono text-[11px] text-agri-800/70">
              {upload.name} · {formatSize(upload.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="shrink-0 rounded-full px-2 py-1 text-[11.5px] font-semibold text-agri-700 underline-offset-2 hover:underline"
          >
            {tl(REG.replace)}
          </button>
        </div>
      ) : upload.state === "uploading" ? (
        <div className="rounded-xl border border-ink-900/12 bg-white p-3.5">
          <div className="flex items-center gap-2.5">
            <FileText size={15} className="shrink-0 text-ink-700/55" strokeWidth={2} />
            <p className="min-w-0 flex-1 truncate font-mono text-[11.5px] text-ink-800">{upload.name}</p>
            <span className="shrink-0 text-[11px] text-ink-700/50">{tl(REG.uploading)}</span>
          </div>
          <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-ink-900/8">
            <div className="kq-grow-x h-full rounded-full bg-agri-500" style={{ animationDuration: "900ms" }} />
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "rounded-xl border border-dashed p-3.5 transition-colors",
            shownError ? "border-clay-500/50 bg-clay-100/25" : "border-ink-900/20 bg-ivory-50",
          )}
        >
          <div className="flex items-center gap-2.5">
            <UploadIcon size={15} className="shrink-0 text-ink-700/55" strokeWidth={2} />
            <p className="text-[12.5px] font-semibold text-ink-800">{tl(REG[label])}</p>
          </div>
          <p className="mt-1 text-[11px] text-ink-700/45">{tl(REG.fileHint)}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              id={id}
              type="button"
              onClick={() => inputRef.current?.click()}
              aria-describedby={shownError ? `${id}-err` : undefined}
              className="rounded-full border border-ink-900/20 bg-white px-3.5 py-2 text-[12px] font-semibold text-ink-900 transition-colors hover:border-ink-900/40"
            >
              {tl(REG.chooseFile)}
            </button>
            <button
              type="button"
              onClick={() => start(sample.name, sample.size)}
              className="rounded-full px-2.5 py-2 text-[12px] font-semibold text-ink-700/70 underline-offset-2 hover:text-ink-900 hover:underline"
            >
              {tl(REG.useSample)}
            </button>
          </div>
        </div>
      )}

      {shownError && upload.state !== "done" && (
        <p id={`${id}-err`} className="mt-1.5 text-[11.5px] text-clay-600">
          {tl(REG[shownError])}
        </p>
      )}
    </div>
  );
}
