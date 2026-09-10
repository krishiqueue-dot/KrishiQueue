import {
  ArrowRight,
  CalendarCheck,
  Check,
  CheckCircle2,
  Eraser,
  IdCard,
  LandPlot,
  Landmark,
  Loader2,
  MapPinned,
  Pencil,
  ShieldCheck,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { DemoTag } from "@/components/ui/primitives";
import { CROPS, REGIONS, centreName, getRegion } from "@/data/india";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/cn";
import { nowLabel, usePrototype } from "@/state/prototype";
import { REG, type RegCopyKey } from "./copy";
import {
  Field,
  SelectInput,
  SensitiveInput,
  StatusPill,
  TextInput,
  UploadBox,
} from "./fields";
import {
  COMMON_BANKS,
  DOC_RULES,
  DOC_TYPES,
  FIELD_ORDER,
  SAMPLE_FILES,
  demoForm,
  emptyForm,
  maskMobile,
  maskTail,
  onlyAlnum,
  onlyDigits,
  regionDefaults,
  sectionValid,
  validate,
  type FieldKey,
  type RegistrationForm,
  type SectionId,
} from "./validation";

/**
 * Step 01 of the farmer journey: registration and verification.
 *
 * Profile → proof of identity → land records → bank details → verification →
 * complete → centre mapped → book a slot. Every check here is a front-end
 * demonstration; no identity, land-record or banking system is contacted.
 *
 * On completion the chosen state, centre and crop are written to the shared
 * prototype store, which is the "centre mapped" hand-off: the slot booking
 * further down the page opens on that centre.
 */

type Phase = "editing" | "verifying" | "complete";

const fieldId = (k: FieldKey) => `kq-reg-${k}`;

/** Illustrative identifier shown on the completion card. */
const DEMO_FARMER_ID = "KQ-FR-000142";

const RAIL: { key: RegCopyKey; section?: SectionId }[] = [
  { key: "railProfile", section: "profile" },
  { key: "railIdentity", section: "identity" },
  { key: "railLand", section: "land" },
  { key: "railBank", section: "bank" },
  { key: "railVerify" },
  { key: "railComplete" },
];

export function FarmerRegistration() {
  const { tl, lang } = useI18n();
  const p = usePrototype();

  const [form, setForm] = useState<RegistrationForm>(() => demoForm(p.regionId, false));
  const [submitted, setSubmitted] = useState(false);
  const [phase, setPhase] = useState<Phase>("editing");
  const [tick, setTick] = useState(0);

  const region = getRegion(form.regionId);
  const centre = region.centres.find((c) => c.id === form.centreId) ?? region.centres[0];
  const errors = useMemo(() => validate(form), [form]);
  const errorCount = Object.keys(errors).length;

  /** Errors are held back until the first submit, then shown live. */
  const err = (k: FieldKey) => (submitted ? errors[k] : undefined);

  const set = <K extends FieldKey>(k: K, v: RegistrationForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  /* ---------------- submit & verification ---------------- */

  const submit = () => {
    setSubmitted(true);
    const first = FIELD_ORDER.find((k) => errors[k]);
    if (first) {
      const el = document.getElementById(fieldId(first));
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
      el?.focus({ preventScroll: true });
      return;
    }
    setTick(0);
    setPhase("verifying");
  };

  // The rail ticks through each section, then lands on "complete". Timers,
  // not animation frames, so a throttled tab still finishes.
  useEffect(() => {
    if (phase !== "verifying") return;
    const id = window.setInterval(() => setTick((n) => n + 1), 340);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "verifying" || tick < RAIL.length - 1) return;
    setPhase("complete");

    // Centre mapping: hand the verified profile to the booking flow.
    if (form.regionId !== p.regionId) p.setRegion(form.regionId);
    p.setCentre(form.centreId);
    p.setCrop(form.crop);
    p.notify({
      kind: "sms",
      title: tl(REG.railComplete),
      body: `${DEMO_FARMER_ID} · ${tl(REG.nextMapped)}: ${centreName(centre.place, lang)}`,
      at: nowLabel(),
    });
    // Runs once per verification; the store setters are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, phase]);

  /* ---------------- rail state ---------------- */

  const railState = (i: number): "done" | "current" | "error" | "pending" => {
    if (phase === "complete") return "done";
    if (phase === "verifying") return i < tick ? "done" : i === tick ? "current" : "pending";
    const section = RAIL[i].section;
    if (!section) return "pending";
    if (sectionValid(errors, section)) return "done";
    return submitted ? "error" : "pending";
  };

  /* ---------------- field handlers ---------------- */

  const changeRegion = (id: string) =>
    setForm((f) => ({ ...f, ...regionDefaults(getRegion(id)) }));

  const changeCentre = (id: string) =>
    setForm((f) => {
      const c = getRegion(f.regionId).centres.find((x) => x.id === id);
      if (!c) return f;
      return { ...f, centreId: id, crop: c.crops.includes(f.crop) ? f.crop : c.crops[0] };
    });

  const rule = DOC_RULES[form.docType];

  return (
    <div>
      <Header />

      <ProgressRail states={RAIL.map((_, i) => railState(i))} />

      {phase === "complete" ? (
        <Completion
          form={form}
          onEdit={() => {
            setPhase("editing");
            setSubmitted(false);
          }}
        />
      ) : (
        <div
          className={cn(
            "mt-8 transition-opacity duration-300",
            phase === "verifying" && "pointer-events-none opacity-60",
          )}
          aria-busy={phase === "verifying"}
        >
          {/* ---------- toolbar ---------- */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <DemoTag label={tl(REG.demoTag)} />
              <span className="text-[11.5px] text-ink-700/55">{tl(REG.demoNote)}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setForm(demoForm(form.regionId, true));
                  setSubmitted(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink-900/15 bg-white px-3.5 py-2 text-[12px] font-semibold text-ink-800 transition-colors hover:border-ink-900/35"
              >
                <Sparkles size={13} strokeWidth={2.2} />
                {tl(REG.fillDemo)}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm(emptyForm(form.regionId));
                  setSubmitted(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink-900/15 bg-white px-3.5 py-2 text-[12px] font-semibold text-ink-700/75 transition-colors hover:border-ink-900/35 hover:text-ink-900"
              >
                <Eraser size={13} strokeWidth={2.2} />
                {tl(REG.clear)}
              </button>
            </div>
          </div>

          {/* ---------- farmer profile ---------- */}
          <SectionCard
            className="mt-4"
            icon={UserRound}
            title={tl(REG.railProfile)}
            sub={tl(REG.profileSub)}
            ready={sectionValid(errors, "profile")}
          >
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field id={fieldId("name")} label={tl(REG.fName)} error={err("name")}>
                <TextInput
                  id={fieldId("name")}
                  value={tl(form.name)}
                  onChange={(v) => set("name", v)}
                  error={err("name")}
                />
              </Field>
              <Field id={fieldId("mobile")} label={tl(REG.fMobile)} error={err("mobile")}>
                <SensitiveInput
                  id={fieldId("mobile")}
                  value={form.mobile}
                  onChange={(v) => set("mobile", onlyDigits(v, 10))}
                  mask={maskMobile}
                  prefix="+91"
                  numeric
                  placeholder="10 digits"
                  error={err("mobile")}
                />
              </Field>
              <Field id={fieldId("regionId")} label={tl(REG.fState)}>
                <SelectInput
                  id={fieldId("regionId")}
                  value={form.regionId}
                  onChange={changeRegion}
                  options={REGIONS.map((r) => ({ value: r.id, label: tl(r.state) }))}
                />
              </Field>
              <Field id={fieldId("district")} label={tl(REG.fDistrict)} error={err("district")}>
                <TextInput
                  id={fieldId("district")}
                  value={tl(form.district)}
                  onChange={(v) => set("district", v)}
                  error={err("district")}
                />
              </Field>
              <Field
                id={fieldId("subdivision")}
                label={tl(region.subdivisionType)}
                hint={tl(REG.fSubHint)}
                error={err("subdivision")}
              >
                <TextInput
                  id={fieldId("subdivision")}
                  value={tl(form.subdivision)}
                  onChange={(v) => set("subdivision", v)}
                  error={err("subdivision")}
                />
              </Field>
              <Field id={fieldId("village")} label={tl(REG.fVillage)} error={err("village")}>
                <TextInput
                  id={fieldId("village")}
                  value={tl(form.village)}
                  onChange={(v) => set("village", v)}
                  error={err("village")}
                />
              </Field>
              <Field id={fieldId("crop")} label={tl(REG.fCrop)}>
                <SelectInput
                  id={fieldId("crop")}
                  value={form.crop}
                  onChange={(v) => set("crop", v as RegistrationForm["crop"])}
                  options={centre.crops.map((c) => ({ value: c, label: tl(CROPS[c].name) }))}
                />
              </Field>
              <Field id={fieldId("centreId")} label={tl(REG.fCentre)}>
                <SelectInput
                  id={fieldId("centreId")}
                  value={form.centreId}
                  onChange={changeCentre}
                  options={region.centres.map((c) => ({
                    value: c.id,
                    label: centreName(c.place, lang),
                  }))}
                />
              </Field>
            </div>
          </SectionCard>

          {/* ---------- the three verifications ---------- */}
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <SectionCard
              n="01"
              icon={IdCard}
              title={tl(REG.railIdentity)}
              sub={tl(REG.idSub)}
              ready={sectionValid(errors, "identity")}
              footer={<VerificationNote />}
            >
              <div className="space-y-4">
                <div>
                  <p className="mb-1.5 font-mono text-[9.5px] tracking-[0.14em] text-ink-700/55 uppercase">
                    {tl(REG.fDocType)}
                  </p>
                  <div role="radiogroup" aria-label={tl(REG.fDocType)} className="grid grid-cols-2 gap-1.5">
                    {DOC_TYPES.map((d) => {
                      const on = form.docType === d;
                      return (
                        <button
                          key={d}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          onClick={() =>
                            on ||
                            setForm((f) => ({
                              ...f,
                              docType: d,
                              docNumber: "",
                              idUpload: { state: "idle" },
                            }))
                          }
                          className={cn(
                            "rounded-xl border px-3 py-2 text-left text-[12.5px] font-medium transition-colors",
                            on
                              ? "border-ink-900 bg-ink-900 text-ivory-50"
                              : "border-ink-900/12 bg-white text-ink-700/75 hover:border-ink-900/30",
                          )}
                        >
                          {tl(REG[DOC_RULES[d].label])}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Field id={fieldId("docNumber")} label={tl(REG.fDocNumber)} error={err("docNumber")}>
                  <SensitiveInput
                    id={fieldId("docNumber")}
                    value={form.docNumber}
                    onChange={(v) =>
                      set("docNumber", rule.numeric ? onlyDigits(v, rule.max) : onlyAlnum(v, rule.max))
                    }
                    mask={maskTail}
                    numeric={rule.numeric}
                    placeholder={rule.placeholder}
                    error={err("docNumber")}
                  />
                </Field>

                <UploadBox
                  id={fieldId("idUpload")}
                  upload={form.idUpload}
                  onChange={(u) => set("idUpload", u)}
                  label="uploadId"
                  doneLabel="uploadedId"
                  sample={SAMPLE_FILES.id}
                  error={err("idUpload")}
                />
              </div>
            </SectionCard>

            <SectionCard
              n="02"
              icon={LandPlot}
              title={tl(REG.railLand)}
              sub={tl(REG.landSub)}
              ready={sectionValid(errors, "land")}
              footer={<VerificationNote />}
            >
              <div className="space-y-4">
                <Field id={fieldId("survey")} label={tl(REG.fSurvey)} error={err("survey")}>
                  <TextInput
                    id={fieldId("survey")}
                    value={form.survey}
                    onChange={(v) => set("survey", v.toUpperCase().replace(/[^0-9A-Z/-]/g, "").slice(0, 20))}
                    placeholder="142/2A"
                    error={err("survey")}
                  />
                </Field>
                <Field id={fieldId("landArea")} label={tl(REG.fLandArea)} error={err("landArea")}>
                  <TextInput
                    id={fieldId("landArea")}
                    value={form.landArea}
                    onChange={(v) => set("landArea", v.replace(/[^\d.]/g, "").slice(0, 7))}
                    inputMode="decimal"
                    suffix={tl(REG.acres)}
                    error={err("landArea")}
                  />
                </Field>
                <UploadBox
                  id={fieldId("landUpload")}
                  upload={form.landUpload}
                  onChange={(u) => set("landUpload", u)}
                  label="uploadLand"
                  doneLabel="uploadedLand"
                  sample={SAMPLE_FILES.land}
                  error={err("landUpload")}
                />
              </div>
            </SectionCard>

            <SectionCard
              n="03"
              icon={Landmark}
              title={tl(REG.railBank)}
              sub={tl(REG.bankSub)}
              ready={sectionValid(errors, "bank")}
              footer={
                <p className="flex items-center gap-2 text-[11px] text-ink-700/50">
                  <ShieldCheck size={13} className="shrink-0 text-agri-600" strokeWidth={2.2} />
                  {tl(REG.maskNote)}
                </p>
              }
            >
              <div className="space-y-4">
                <Field id={fieldId("holder")} label={tl(REG.fHolder)} error={err("holder")}>
                  <TextInput
                    id={fieldId("holder")}
                    value={tl(form.holder)}
                    onChange={(v) => set("holder", v)}
                    error={err("holder")}
                  />
                </Field>
                <Field id={fieldId("bank")} label={tl(REG.fBank)} error={err("bank")}>
                  <TextInput
                    id={fieldId("bank")}
                    value={tl(form.bank)}
                    onChange={(v) => set("bank", v)}
                    list="kq-reg-banks"
                    error={err("bank")}
                  />
                  <datalist id="kq-reg-banks">
                    {COMMON_BANKS.map((b) => (
                      <option key={b} value={b} />
                    ))}
                  </datalist>
                </Field>
                <Field id={fieldId("account")} label={tl(REG.fAccount)} error={err("account")}>
                  <SensitiveInput
                    id={fieldId("account")}
                    value={form.account}
                    onChange={(v) => set("account", onlyDigits(v, 18))}
                    mask={maskTail}
                    numeric
                    placeholder="9–18 digits"
                    error={err("account")}
                  />
                </Field>
                <Field
                  id={fieldId("accountConfirm")}
                  label={tl(REG.fAccountConfirm)}
                  error={err("accountConfirm")}
                >
                  <SensitiveInput
                    id={fieldId("accountConfirm")}
                    value={form.accountConfirm}
                    onChange={(v) => set("accountConfirm", onlyDigits(v, 18))}
                    mask={maskTail}
                    numeric
                    error={err("accountConfirm")}
                  />
                </Field>
                <Field id={fieldId("ifsc")} label={tl(REG.fIfsc)} error={err("ifsc")}>
                  <TextInput
                    id={fieldId("ifsc")}
                    value={form.ifsc}
                    onChange={(v) => set("ifsc", onlyAlnum(v, 11))}
                    placeholder="SBIN0001234"
                    error={err("ifsc")}
                  />
                </Field>
              </div>
            </SectionCard>
          </div>

          {/* ---------- submit bar ---------- */}
          <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-ink-900/10 bg-ivory-50/80 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-900 text-ivory-50">
                <ShieldCheck size={15} strokeWidth={2} />
              </span>
              <div>
                <p className="text-[13px] font-semibold text-ink-900">{tl(REG.maskNote)}</p>
                <p className="mt-0.5 max-w-[62ch] text-[11.5px] leading-relaxed text-ink-700/55">
                  <span className="font-semibold text-ink-700/70">{tl(REG.archLabel)}.</span>{" "}
                  {tl(REG.archNote)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:shrink-0">
              {submitted && errorCount > 0 && (
                <p role="alert" className="text-[12px] font-medium text-clay-600">
                  {tl(REG.needsAttention).replace("{n}", String(errorCount))}
                </p>
              )}
              <button
                type="button"
                onClick={submit}
                disabled={phase === "verifying"}
                className="inline-flex items-center gap-2 rounded-full bg-agri-600 px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-agri-500 disabled:cursor-wait"
              >
                {phase === "verifying" ? (
                  <>
                    <Loader2 size={15} className="kq-spin" strokeWidth={2.4} />
                    {tl(REG.verifying)}
                  </>
                ) : (
                  <>
                    {tl(REG.submit)}
                    <ArrowRight size={15} strokeWidth={2.4} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <span className="sr-only" aria-live="polite">
        {phase === "complete" ? tl(REG.completeTitle) : ""}
      </span>
    </div>
  );
}

/* ==================================================================
   HEADER — step label, the core message, and the equation it rests on
   ================================================================== */

function Header() {
  const { t, tl } = useI18n();
  const parts: { icon: LucideIcon; key: RegCopyKey }[] = [
    { icon: IdCard, key: "railIdentity" },
    { icon: LandPlot, key: "railLand" },
    { icon: Landmark, key: "railBank" },
  ];
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
      <div>
        <p className="font-mono text-[10.5px] tracking-[0.18em] text-saffron-700 uppercase">
          {tl(REG.step)} · {tl(REG.eyebrow)}
        </p>
        <h3 className="mt-3 font-display text-[clamp(1.5rem,3.2vw,2.1rem)] font-semibold">
          {tl(REG.title)}
        </h3>
        <p className="mt-4 max-w-[58ch] text-[14.5px] leading-relaxed text-ink-700/80">
          {t("how.s1.body")}
        </p>
        <p className="mt-4 max-w-[58ch] border-l-2 border-saffron-500 pl-4 text-[13.5px] leading-relaxed text-ink-800 italic">
          {tl(REG.core)}
        </p>
      </div>

      {/* identity + land + bank = verified farmer profile */}
      <div aria-hidden className="flex flex-wrap items-center gap-2">
        {parts.map((part, i) => {
          const Icon = part.icon;
          return (
            <div key={part.key} className="flex items-center gap-2">
              {i > 0 && <span className="font-mono text-[14px] text-ink-700/35">+</span>}
              <span className="flex flex-col items-center gap-1.5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-900/12 bg-white text-ink-800 shadow-lift">
                  <Icon size={18} strokeWidth={1.9} />
                </span>
                <span className="max-w-[6.5rem] text-center text-[10.5px] leading-tight text-ink-700/55">
                  {tl(REG[part.key])}
                </span>
              </span>
            </div>
          );
        })}
        <span className="font-mono text-[14px] text-ink-700/35">=</span>
        <span className="flex flex-col items-center gap-1.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-agri-600 text-white shadow-lift">
            <ShieldCheck size={18} strokeWidth={2} />
          </span>
          <span className="max-w-[7rem] text-center text-[10.5px] leading-tight font-semibold text-agri-700">
            {tl(REG.statusVerified)}
          </span>
        </span>
      </div>
    </div>
  );
}

/* ==================================================================
   PROGRESS RAIL
   ================================================================== */

function ProgressRail({ states }: { states: ("done" | "current" | "error" | "pending")[] }) {
  const { tl } = useI18n();
  return (
    <ol className="mt-8 grid grid-cols-3 gap-y-4 rounded-2xl border border-ink-900/10 bg-white px-4 py-4 sm:grid-cols-6 sm:px-5">
      {RAIL.map((item, i) => {
        const s = states[i];
        return (
          <li key={item.key} className="relative flex flex-col items-center gap-2 text-center">
            {/* connector to the previous node */}
            {i > 0 && (
              <span
                aria-hidden
                className={cn(
                  "absolute top-[13px] right-1/2 hidden h-px w-full transition-colors duration-300 sm:block",
                  states[i - 1] === "done" ? "bg-agri-500/60" : "bg-ink-900/10",
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-300",
                s === "done" && "border-agri-500 bg-agri-500 text-white",
                s === "current" && "border-saffron-500 bg-white",
                s === "error" && "border-clay-500 bg-clay-100 text-clay-600",
                s === "pending" && "border-ink-900/15 bg-white text-ink-700/40",
              )}
            >
              {s === "done" ? (
                <Check size={13} strokeWidth={3.2} />
              ) : s === "current" ? (
                <span className="h-2 w-2 rounded-full bg-saffron-500 animate-blink" />
              ) : s === "error" ? (
                <span className="text-[12px] leading-none font-bold">!</span>
              ) : (
                <span className="font-mono text-[10px]">{i + 1}</span>
              )}
            </span>
            <span
              className={cn(
                "max-w-[7rem] text-[11px] leading-tight transition-colors",
                s === "done" || s === "current" ? "font-semibold text-ink-900" : "text-ink-700/55",
                s === "error" && "text-clay-600",
              )}
            >
              {tl(REG[item.key])}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* ==================================================================
   SECTION CARD
   ================================================================== */

function SectionCard({
  n,
  icon: Icon,
  title,
  sub,
  ready,
  footer,
  className,
  children,
}: {
  n?: string;
  icon: LucideIcon;
  title: string;
  sub: string;
  ready: boolean;
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const { tl } = useI18n();
  return (
    <section
      className={cn(
        // min-w-0: an input's intrinsic width would otherwise stretch the grid
        // track past a 360px screen.
        "flex min-w-0 flex-col rounded-2xl border border-ink-900/10 bg-white p-5 shadow-lift sm:p-6",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-900 text-ivory-50">
            <Icon size={16} strokeWidth={1.9} />
          </span>
          <div>
            {n && <p className="font-mono text-[9.5px] tracking-[0.16em] text-saffron-700">{n}</p>}
            <h4 className="font-display text-[17px] leading-tight font-semibold">{title}</h4>
          </div>
        </div>
        <StatusPill ready={ready} label={tl(ready ? REG.statusReady : REG.statusPending)} />
      </div>
      <p className="mt-3 text-[12.5px] leading-relaxed text-ink-700/65">{sub}</p>
      <div className="mt-5 flex-1">{children}</div>
      {footer && <div className="mt-5 border-t border-ink-900/8 pt-4">{footer}</div>}
    </section>
  );
}

function VerificationNote() {
  const { tl } = useI18n();
  return (
    <div className="flex items-center justify-between gap-2">
      <p className="flex items-center gap-2 text-[11px] text-ink-700/50">
        <ShieldCheck size={13} className="shrink-0 text-agri-600" strokeWidth={2.2} />
        {tl(REG.maskNote)}
      </p>
      <DemoTag label={tl(REG.prototypeVerification)} />
    </div>
  );
}

/* ==================================================================
   COMPLETION — status summary, then the hand-off to slot booking
   ================================================================== */

function Completion({ form, onEdit }: { form: RegistrationForm; onEdit: () => void }) {
  const { tl, lang } = useI18n();
  const region = getRegion(form.regionId);
  const centre = region.centres.find((c) => c.id === form.centreId) ?? region.centres[0];

  const rows: { icon: LucideIcon; title: RegCopyKey; status: RegCopyKey; detail: string }[] = [
    {
      icon: UserRound,
      title: "railProfile",
      status: "statusVerified",
      detail: `${tl(form.name)} · ${tl(form.village)}, ${tl(region.state)}`,
    },
    {
      icon: IdCard,
      title: "railIdentity",
      status: "statusSubmitted",
      detail: `${tl(REG[DOC_RULES[form.docType].label])} · ${maskTail(form.docNumber)}`,
    },
    {
      icon: LandPlot,
      title: "railLand",
      status: "statusSubmitted",
      detail: `${form.survey} · ${form.landArea} ${tl(REG.acres)}`,
    },
    {
      icon: Landmark,
      title: "railBank",
      status: "statusAdded",
      detail: `${tl(form.bank)} · ${maskTail(form.account)}`,
    },
  ];

  return (
    <div className="kq-swap mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_1fr]">
      {/* status */}
      <div className="grain relative overflow-hidden rounded-3xl border border-ink-950/40 bg-ink-900 p-6 text-ivory-100 sm:p-8">
        <div
          aria-hidden
          className="survey-grid pointer-events-none absolute inset-0 text-ivory-100 opacity-30"
        />
        <div className="relative">
          <p className="font-mono text-[10px] tracking-[0.18em] text-ivory-200/45 uppercase">
            {tl(REG.statusHeading)}
          </p>
          <ul className="mt-4">
            {rows.map((row, i) => {
              const Icon = row.icon;
              return (
                <li
                  key={row.title}
                  className="kq-slide flex items-center gap-3.5 border-b border-ivory-100/10 py-3.5 last:border-b-0"
                  style={{ animationDelay: `${0.08 * i}s` }}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-agri-500/15 text-agri-400">
                    <Icon size={15} strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-semibold">{tl(REG[row.title])}</p>
                    <p className="mt-0.5 truncate font-mono text-[11px] text-ivory-200/55">{row.detail}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-[11.5px] font-semibold text-agri-400">
                    <Check size={13} strokeWidth={3} />
                    {tl(REG[row.status])}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-agri-500/30 bg-agri-500/10 p-4">
            <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-agri-400" strokeWidth={2.2} />
            <div>
              <p className="font-display text-[19px] leading-tight font-semibold text-ivory-50">
                {tl(REG.completeTitle)}
              </p>
              <p className="mt-1 text-[12.5px] text-ivory-100/75">{tl(REG.completeSub)}</p>
              <p className="mt-2 font-mono text-[11px] text-ivory-200/55">
                {tl(REG.farmerId)}: {DEMO_FARMER_ID}
              </p>
            </div>
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-ivory-200/45">{tl(REG.demoComplete)}</p>
        </div>
      </div>

      {/* hand-off */}
      <div className="flex flex-col rounded-3xl border border-ink-900/10 bg-white p-6 shadow-lift sm:p-8">
        <ol className="flex-1">
          {[
            { icon: CheckCircle2, label: tl(REG.railComplete), detail: DEMO_FARMER_ID, done: true },
            {
              icon: MapPinned,
              label: tl(REG.nextMapped),
              detail: `${centreName(centre.place, lang)} · ${tl(centre.district)}`,
              done: true,
            },
            {
              icon: CalendarCheck,
              label: tl(REG.nextBook),
              detail: tl(CROPS[form.crop].name),
              done: false,
            },
          ].map((step, i, all) => {
            const Icon = step.icon;
            return (
              <li key={step.label} className="relative flex gap-4 pb-6 last:pb-0">
                {i < all.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute top-9 bottom-0 left-[17px] w-px bg-agri-500/40"
                  />
                )}
                <span
                  className={cn(
                    "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                    step.done ? "bg-agri-500 text-white" : "border-2 border-saffron-500 bg-white text-saffron-700",
                  )}
                >
                  <Icon size={16} strokeWidth={2} />
                </span>
                <div className="min-w-0 pt-1">
                  <p className="text-[14px] font-semibold text-ink-900">{step.label}</p>
                  <p className="mt-0.5 truncate text-[12px] text-ink-700/60">{step.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a
            href="#prototype"
            className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-[13px] font-semibold text-ivory-50 transition-colors hover:bg-ink-800"
          >
            {tl(REG.nextBook)}
            <ArrowRight size={15} strokeWidth={2.4} />
          </a>
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink-900/15 px-4 py-2.5 text-[12.5px] font-semibold text-ink-700/75 transition-colors hover:border-ink-900/35 hover:text-ink-900"
          >
            <Pencil size={13} strokeWidth={2.2} />
            {tl(REG.edit)}
          </button>
        </div>
      </div>
    </div>
  );
}
