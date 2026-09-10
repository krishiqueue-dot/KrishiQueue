import { getRegion, type CropId, type Region } from "@/data/india";
import type { Localized } from "@/i18n";
import type { RegCopyKey } from "./copy";

/**
 * Form model, validation and masking for farmer registration.
 *
 * Everything here is pure — no React, no DOM — so the same rules can run on
 * the production server when this becomes a real onboarding flow.
 *
 * Privacy rule: an identity, account or mobile number is only ever rendered in
 * full while the farmer is typing it. Every other surface uses the masked form,
 * and the demonstration values are stored already masked, so a complete number
 * never exists in this prototype at all.
 */

export type DocType = "aadhaar" | "voter" | "pan" | "dl";

export type Upload =
  | { state: "idle" }
  | { state: "uploading"; name: string; size: number }
  | { state: "done"; name: string; size: number };

/** A text value that is either typed by the user or a translatable demo value. */
export type Text = Localized | string;

export type RegistrationForm = {
  // profile
  name: Text;
  mobile: string;
  regionId: string;
  district: Text;
  subdivision: Text;
  village: Text;
  crop: CropId;
  centreId: string;
  // identity
  docType: DocType;
  docNumber: string;
  idUpload: Upload;
  // land
  survey: string;
  landArea: string;
  landUpload: Upload;
  // bank
  holder: Text;
  bank: Text;
  account: string;
  accountConfirm: string;
  ifsc: string;
};

export type FieldKey = keyof RegistrationForm;
export type Errors = Partial<Record<FieldKey, RegCopyKey>>;

export const SECTIONS = {
  profile: ["name", "mobile", "regionId", "district", "subdivision", "village", "crop", "centreId"],
  identity: ["docType", "docNumber", "idUpload"],
  land: ["survey", "landArea", "landUpload"],
  bank: ["holder", "bank", "account", "accountConfirm", "ifsc"],
} as const satisfies Record<string, readonly FieldKey[]>;

export type SectionId = keyof typeof SECTIONS;

/** Field order, used to move focus to the first problem on submit. */
export const FIELD_ORDER: FieldKey[] = [
  ...SECTIONS.profile,
  ...SECTIONS.identity,
  ...SECTIONS.land,
  ...SECTIONS.bank,
];

/* ------------------------------------------------------------------
   Rules
   ------------------------------------------------------------------ */

const MOBILE = /^[6-9]\d{9}$/;
const ACCOUNT = /^\d{9,18}$/;
const IFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const SURVEY = /^[0-9A-Z][0-9A-Z/-]{0,19}$/i;

/** Masked demonstration values — accepted as-is, never expanded. */
const MASKED = /^X{4} X{4} [0-9A-Z]{4}$/;
const MASKED_MOBILE = /^[6-9]X{6}\d{3}$/;

export const isMasked = (v: string) => MASKED.test(v) || MASKED_MOBILE.test(v);

export const DOC_RULES: Record<
  DocType,
  { pattern: RegExp; max: number; numeric: boolean; error: RegCopyKey; placeholder: string; label: RegCopyKey }
> = {
  // Aadhaar numbers are 12 digits and are never issued starting with 0 or 1.
  aadhaar: { pattern: /^[2-9]\d{11}$/, max: 12, numeric: true, error: "errAadhaar", placeholder: "12 digits", label: "docAadhaar" },
  voter: { pattern: /^[A-Z]{3}\d{7}$/, max: 10, numeric: false, error: "errVoter", placeholder: "ABC1234567", label: "docVoter" },
  pan: { pattern: /^[A-Z]{5}\d{4}[A-Z]$/, max: 10, numeric: false, error: "errPan", placeholder: "ABCDE1234F", label: "docPan" },
  dl: { pattern: /^[A-Z]{2}\d{2}[0-9A-Z]{4,12}$/, max: 16, numeric: false, error: "errDl", placeholder: "XX00…", label: "docDl" },
};

export const DOC_TYPES: DocType[] = ["aadhaar", "voter", "pan", "dl"];

const text = (v: Text) => (typeof v === "string" ? v : v.en).trim();

export function validate(f: RegistrationForm): Errors {
  const e: Errors = {};

  for (const k of ["name", "village", "subdivision", "district", "holder", "bank"] as const) {
    if (!text(f[k])) e[k] = "errRequired";
  }

  if (!f.mobile) e.mobile = "errRequired";
  else if (!isMasked(f.mobile) && !MOBILE.test(f.mobile)) e.mobile = "errMobile";

  const rule = DOC_RULES[f.docType];
  if (!f.docNumber) e.docNumber = "errRequired";
  else if (!isMasked(f.docNumber) && !rule.pattern.test(f.docNumber)) e.docNumber = rule.error;
  if (f.idUpload.state !== "done") e.idUpload = "errUpload";

  if (!f.survey.trim()) e.survey = "errRequired";
  else if (!SURVEY.test(f.survey.trim())) e.survey = "errSurvey";

  const area = Number(f.landArea);
  if (!f.landArea.trim()) e.landArea = "errRequired";
  else if (!Number.isFinite(area) || area <= 0) e.landArea = "errArea";
  if (f.landUpload.state !== "done") e.landUpload = "errUpload";

  if (!f.account) e.account = "errRequired";
  else if (!isMasked(f.account) && !ACCOUNT.test(f.account)) e.account = "errAccount";

  if (!f.accountConfirm) e.accountConfirm = "errRequired";
  else if (f.accountConfirm !== f.account) e.accountConfirm = "errMatch";

  if (!f.ifsc) e.ifsc = "errRequired";
  else if (!IFSC.test(f.ifsc)) e.ifsc = "errIfsc";

  return e;
}

export const sectionValid = (errors: Errors, id: SectionId) =>
  SECTIONS[id].every((k) => !errors[k]);

/* ------------------------------------------------------------------
   Masking
   ------------------------------------------------------------------ */

/** "XXXX XXXX 4821" — the length is hidden as well as the digits. */
export function maskTail(value: string): string {
  if (!value || isMasked(value)) return value;
  if (value.length <= 4) return value;
  if (value.length <= 8) return "X".repeat(value.length - 4) + value.slice(-4);
  return `XXXX XXXX ${value.slice(-4)}`;
}

/** "9XXXXXX421" */
export function maskMobile(value: string): string {
  if (!value || isMasked(value) || value.length < 5) return value;
  return value[0] + "X".repeat(value.length - 4) + value.slice(-3);
}

/** Keep only what a field of this kind can contain. */
export const onlyDigits = (v: string, max: number) => v.replace(/\D/g, "").slice(0, max);
export const onlyAlnum = (v: string, max: number) =>
  v.toUpperCase().replace(/[^0-9A-Z]/g, "").slice(0, max);

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

/* ------------------------------------------------------------------
   Defaults
   ------------------------------------------------------------------ */

/** Location defaults for a state: its first demo centre and village. */
export function regionDefaults(region: Region) {
  const centre = region.centres[0];
  return {
    regionId: region.id,
    district: centre.district,
    subdivision: centre.subdivision,
    village: region.village,
    centreId: centre.id,
    crop: centre.crops.includes(region.primaryCrop) ? region.primaryCrop : centre.crops[0],
  };
}

export function emptyForm(regionId: string): RegistrationForm {
  const region = getRegion(regionId);
  return {
    name: "",
    mobile: "",
    ...regionDefaults(region),
    district: "",
    subdivision: "",
    village: "",
    docType: "aadhaar",
    docNumber: "",
    idUpload: { state: "idle" },
    survey: "",
    landArea: "",
    landUpload: { state: "idle" },
    holder: "",
    bank: "",
    account: "",
    accountConfirm: "",
    ifsc: "",
  };
}

const SBI: Localized = {
  en: "State Bank of India",
  hi: "भारतीय स्टेट बैंक",
  te: "స్టేట్ బ్యాంక్ ఆఫ్ ఇండియా",
};

export const SAMPLE_FILES = {
  id: { name: "identity_proof.pdf", size: 214_000 },
  land: { name: "land_record.pdf", size: 386_000 },
} as const;

/**
 * Demonstration farmer. Numbers are stored pre-masked; there is no complete
 * Aadhaar, account or mobile number behind them. The account ends 4417 to
 * match the account the payment demo credits.
 */
export function demoForm(regionId: string, withUploads: boolean): RegistrationForm {
  const region = getRegion(regionId);
  return {
    name: region.farmer,
    mobile: "9XXXXXX421",
    ...regionDefaults(region),
    docType: "aadhaar",
    docNumber: "XXXX XXXX 4821",
    idUpload: withUploads ? { state: "done", ...SAMPLE_FILES.id } : { state: "idle" },
    survey: "142/2A",
    landArea: "3.5",
    landUpload: withUploads ? { state: "done", ...SAMPLE_FILES.land } : { state: "idle" },
    holder: region.farmer,
    bank: SBI,
    account: "XXXX XXXX 4417",
    accountConfirm: "XXXX XXXX 4417",
    ifsc: "SBIN000XXXX",
  };
}

export const COMMON_BANKS = [
  "State Bank of India",
  "Bank of Baroda",
  "Punjab National Bank",
  "Canara Bank",
  "Union Bank of India",
  "Bank of India",
  "Indian Bank",
  "Central Bank of India",
  "Indian Overseas Bank",
  "UCO Bank",
  "Punjab & Sind Bank",
  "Bank of Maharashtra",
];
