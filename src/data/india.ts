import type { Localized } from "@/i18n";

/**
 * Demonstration dataset for the KrishiQueue prototype.
 *
 * Every centre, farmer, token, quantity, rate and payment in this file is
 * FICTIONAL DEMO DATA. Nothing here is sourced from a live government
 * procurement system. The shape, however, is the shape the production data
 * model would use: India > State > District > Mandal/Tehsil/Taluk/Taluka >
 * Village > Procurement Centre.
 */

export type Congestion = "low" | "medium" | "high";

export type CropId =
  | "paddy"
  | "wheat"
  | "groundnut"
  | "redgram"
  | "chana"
  | "maize"
  | "cotton"
  | "soybean"
  | "mustard"
  | "bajra"
  | "jowar"
  | "ragi"
  | "sunflower"
  | "turmeric";

export type Crop = {
  id: CropId;
  name: Localized;
  /** Demonstration procurement rate in rupees per quintal. Not a live MSP feed. */
  demoRate: number;
};

export const CROPS: Record<CropId, Crop> = {
  paddy: {
    id: "paddy",
    name: { en: "Paddy", hi: "धान", te: "వరి" },
    demoRate: 2800,
  },
  wheat: {
    id: "wheat",
    name: { en: "Wheat", hi: "गेहूँ", te: "గోధుమ" },
    demoRate: 2600,
  },
  groundnut: {
    id: "groundnut",
    name: { en: "Groundnut", hi: "मूँगफली", te: "వేరుశనగ" },
    demoRate: 7300,
  },
  redgram: {
    id: "redgram",
    name: { en: "Red Gram (Tur)", hi: "अरहर (तूर)", te: "కందులు" },
    demoRate: 8200,
  },
  chana: {
    id: "chana",
    name: { en: "Chana", hi: "चना", te: "శనగలు" },
    demoRate: 5900,
  },
  maize: {
    id: "maize",
    name: { en: "Maize", hi: "मक्का", te: "మొక్కజొన్న" },
    demoRate: 2400,
  },
  cotton: {
    id: "cotton",
    name: { en: "Cotton", hi: "कपास", te: "పత్తి" },
    demoRate: 7900,
  },
  soybean: {
    id: "soybean",
    name: { en: "Soybean", hi: "सोयाबीन", te: "సోయాబీన్" },
    demoRate: 5300,
  },
  mustard: {
    id: "mustard",
    name: { en: "Mustard", hi: "सरसों", te: "ఆవాలు" },
    demoRate: 6000,
  },
  bajra: {
    id: "bajra",
    name: { en: "Bajra", hi: "बाजरा", te: "సజ్జలు" },
    demoRate: 2800,
  },
  jowar: {
    id: "jowar",
    name: { en: "Jowar", hi: "ज्वार", te: "జొన్నలు" },
    demoRate: 3500,
  },
  ragi: {
    id: "ragi",
    name: { en: "Ragi", hi: "रागी", te: "రాగులు" },
    demoRate: 4900,
  },
  sunflower: {
    id: "sunflower",
    name: { en: "Sunflower", hi: "सूरजमुखी", te: "ప్రొద్దుతిరుగుడు" },
    demoRate: 7700,
  },
  turmeric: {
    id: "turmeric",
    name: { en: "Turmeric", hi: "हल्दी", te: "పసుపు" },
    demoRate: 8500,
  },
};

export type Centre = {
  id: string;
  /** Place name only — the words "Procurement Centre" are appended per language. */
  place: Localized;
  district: Localized;
  subdivision: Localized;
  congestion: Congestion;
  /** Expected wait in minutes, as shown on the demo congestion board. */
  waitMin: number;
  slotsOpen: number;
  counters: number;
  /** Road distance from the region's demo village. */
  distanceKm: number;
  servedToday: number;
  avgServiceMin: number;
  crops: CropId[];
};

export type Region = {
  id: string;
  state: Localized;
  /** India uses different words for the tier below a district. */
  subdivisionType: Localized;
  farmer: Localized;
  village: Localized;
  primaryCrop: CropId;
  centres: Centre[];
};

/** "Procurement Centre" suffix, per language. */
export const CENTRE_SUFFIX: Localized = {
  en: "Procurement Centre",
  hi: "खरीद केंद्र",
  te: "సేకరణ కేంద్రం",
};

export const REGIONS: Region[] = [
  {
    id: "ap",
    state: { en: "Andhra Pradesh", hi: "आंध्र प्रदेश", te: "ఆంధ్రప్రదేశ్" },
    subdivisionType: { en: "Mandal", hi: "मंडल", te: "మండలం" },
    farmer: { en: "Ramesh Reddy", hi: "रमेश रेड्डी", te: "రమేష్ రెడ్డి" },
    village: { en: "Kothapalli", hi: "कोठापल्ली", te: "కొత్తపల్లి" },
    primaryCrop: "paddy",
    centres: [
      {
        id: "ap-tirupati",
        place: { en: "Tirupati", hi: "तिरुपति", te: "తిరుపతి" },
        district: { en: "Tirupati", hi: "तिरुपति", te: "తిరుపతి" },
        subdivision: { en: "Tirupati Rural", hi: "तिरुपति ग्रामीण", te: "తిరుపతి రూరల్" },
        congestion: "low",
        waitMin: 12,
        slotsOpen: 18,
        counters: 3,
        distanceKm: 22,
        servedToday: 64,
        avgServiceMin: 8,
        crops: ["paddy", "groundnut", "redgram", "maize"],
      },
      {
        id: "ap-chittoor",
        place: { en: "Chittoor", hi: "चित्तूर", te: "చిత్తూరు" },
        district: { en: "Chittoor", hi: "चित्तूर", te: "చిత్తూరు" },
        subdivision: { en: "Chittoor", hi: "चित्तूर", te: "చిత్తూరు" },
        congestion: "medium",
        waitMin: 24,
        slotsOpen: 7,
        counters: 2,
        distanceKm: 41,
        servedToday: 81,
        avgServiceMin: 10,
        crops: ["paddy", "groundnut", "sunflower"],
      },
      {
        id: "ap-renigunta",
        place: { en: "Renigunta", hi: "रेणिगुंटा", te: "రేణిగుంట" },
        district: { en: "Tirupati", hi: "तिरुपति", te: "తిరుపతి" },
        subdivision: { en: "Renigunta", hi: "रेणिगुंटा", te: "రేణిగుంట" },
        congestion: "high",
        waitMin: 47,
        slotsOpen: 2,
        counters: 2,
        distanceKm: 14,
        servedToday: 96,
        avgServiceMin: 11,
        crops: ["paddy", "maize", "redgram"],
      },
    ],
  },
  {
    id: "pb",
    state: { en: "Punjab", hi: "पंजाब", te: "పంజాబ్" },
    subdivisionType: { en: "Tehsil", hi: "तहसील", te: "తహసీల్" },
    farmer: { en: "Gurpreet Singh", hi: "गुरप्रीत सिंह", te: "గుర్‌ప్రీత్ సింగ్" },
    village: { en: "Dhandra", hi: "धंधरा", te: "ధంధ్రా" },
    primaryCrop: "wheat",
    centres: [
      {
        id: "pb-patiala",
        place: { en: "Patiala", hi: "पटियाला", te: "పటియాలా" },
        district: { en: "Patiala", hi: "पटियाला", te: "పటియాలా" },
        subdivision: { en: "Patiala", hi: "पटियाला", te: "పటియాలా" },
        congestion: "low",
        waitMin: 15,
        slotsOpen: 21,
        counters: 4,
        distanceKm: 38,
        servedToday: 118,
        avgServiceMin: 7,
        crops: ["wheat", "paddy", "maize"],
      },
      {
        id: "pb-amritsar",
        place: { en: "Amritsar", hi: "अमृतसर", te: "అమృత్‌సర్" },
        district: { en: "Amritsar", hi: "अमृतसर", te: "అమృత్‌సర్" },
        subdivision: { en: "Ajnala", hi: "अजनाला", te: "అజ్నాలా" },
        congestion: "medium",
        waitMin: 29,
        slotsOpen: 9,
        counters: 3,
        distanceKm: 62,
        servedToday: 134,
        avgServiceMin: 9,
        crops: ["wheat", "paddy"],
      },
      {
        id: "pb-ludhiana",
        place: { en: "Ludhiana", hi: "लुधियाना", te: "లూధియానా" },
        district: { en: "Ludhiana", hi: "लुधियाना", te: "లూధియానా" },
        subdivision: { en: "Jagraon", hi: "जगराओं", te: "జగ్రావ్" },
        congestion: "high",
        waitMin: 52,
        slotsOpen: 3,
        counters: 3,
        distanceKm: 11,
        servedToday: 152,
        avgServiceMin: 10,
        crops: ["wheat", "paddy", "maize"],
      },
    ],
  },
  {
    id: "ts",
    state: { en: "Telangana", hi: "तेलंगाना", te: "తెలంగాణ" },
    subdivisionType: { en: "Mandal", hi: "मंडल", te: "మండలం" },
    farmer: { en: "Lakshmi Devi", hi: "लक्ष्मी देवी", te: "లక్ష్మీ దేవి" },
    village: { en: "Ghanpur", hi: "घनपुर", te: "ఘన్‌పూర్" },
    primaryCrop: "redgram",
    centres: [
      {
        id: "ts-karimnagar",
        place: { en: "Karimnagar", hi: "करीमनगर", te: "కరీంనగర్" },
        district: { en: "Karimnagar", hi: "करीमनगर", te: "కరీంనగర్" },
        subdivision: { en: "Manakondur", hi: "मानकोंदुर", te: "మానకొండూర్" },
        congestion: "low",
        waitMin: 14,
        slotsOpen: 16,
        counters: 3,
        distanceKm: 27,
        servedToday: 58,
        avgServiceMin: 9,
        crops: ["redgram", "paddy", "maize", "turmeric"],
      },
      {
        id: "ts-warangal",
        place: { en: "Warangal", hi: "वारंगल", te: "వరంగల్" },
        district: { en: "Warangal", hi: "वारंगल", te: "వరంగల్" },
        subdivision: { en: "Wardhannapet", hi: "वर्धन्नापेट", te: "వర్ధన్నపేట" },
        congestion: "medium",
        waitMin: 26,
        slotsOpen: 8,
        counters: 2,
        distanceKm: 44,
        servedToday: 77,
        avgServiceMin: 11,
        crops: ["redgram", "paddy", "cotton"],
      },
      {
        id: "ts-nizamabad",
        place: { en: "Nizamabad", hi: "निज़ामाबाद", te: "నిజామాబాద్" },
        district: { en: "Nizamabad", hi: "निज़ामाबाद", te: "నిజామాబాద్" },
        subdivision: { en: "Bodhan", hi: "बोधन", te: "బోధన్" },
        congestion: "high",
        waitMin: 49,
        slotsOpen: 2,
        counters: 2,
        distanceKm: 19,
        servedToday: 103,
        avgServiceMin: 12,
        crops: ["turmeric", "redgram", "paddy"],
      },
    ],
  },
  {
    id: "mh",
    state: { en: "Maharashtra", hi: "महाराष्ट्र", te: "మహారాష్ట్ర" },
    subdivisionType: { en: "Taluka", hi: "तालुका", te: "తాలూకా" },
    farmer: { en: "Sanjay Patil", hi: "संजय पाटील", te: "సంజయ్ పాటిల్" },
    village: { en: "Lasalgaon", hi: "लासलगाव", te: "లాసల్‌గావ్" },
    primaryCrop: "soybean",
    centres: [
      {
        id: "mh-nashik",
        place: { en: "Nashik", hi: "नाशिक", te: "నాసిక్" },
        district: { en: "Nashik", hi: "नाशिक", te: "నాసిక్" },
        subdivision: { en: "Niphad", hi: "निफाड", te: "నిఫాడ్" },
        congestion: "low",
        waitMin: 13,
        slotsOpen: 19,
        counters: 3,
        distanceKm: 16,
        servedToday: 71,
        avgServiceMin: 8,
        crops: ["soybean", "maize", "bajra", "jowar"],
      },
      {
        id: "mh-baramati",
        place: { en: "Baramati", hi: "बारामती", te: "బారామతి" },
        district: { en: "Pune", hi: "पुणे", te: "పుణె" },
        subdivision: { en: "Baramati", hi: "बारामती", te: "బారామతి" },
        congestion: "medium",
        waitMin: 27,
        slotsOpen: 6,
        counters: 2,
        distanceKm: 58,
        servedToday: 88,
        avgServiceMin: 10,
        crops: ["soybean", "jowar", "maize"],
      },
      {
        id: "mh-nagpur",
        place: { en: "Nagpur", hi: "नागपुर", te: "నాగ్‌పూర్" },
        district: { en: "Nagpur", hi: "नागपुर", te: "నాగ్‌పూర్" },
        subdivision: { en: "Katol", hi: "कातोल", te: "కాటోల్" },
        congestion: "high",
        waitMin: 45,
        slotsOpen: 3,
        counters: 2,
        distanceKm: 24,
        servedToday: 99,
        avgServiceMin: 11,
        crops: ["cotton", "soybean", "redgram"],
      },
    ],
  },
  {
    id: "up",
    state: { en: "Uttar Pradesh", hi: "उत्तर प्रदेश", te: "ఉత్తరప్రదేశ్" },
    subdivisionType: { en: "Tehsil", hi: "तहसील", te: "తహసీల్" },
    farmer: { en: "Mahesh Yadav", hi: "महेश यादव", te: "మహేష్ యాదవ్" },
    village: { en: "Nagram", hi: "नगराम", te: "నగరం" },
    primaryCrop: "wheat",
    centres: [
      {
        id: "up-lucknow",
        place: { en: "Lucknow", hi: "लखनऊ", te: "లక్నో" },
        district: { en: "Lucknow", hi: "लखनऊ", te: "లక్నో" },
        subdivision: { en: "Mohanlalganj", hi: "मोहनलालगंज", te: "మోహన్‌లాల్‌గంజ్" },
        congestion: "low",
        waitMin: 16,
        slotsOpen: 17,
        counters: 3,
        distanceKm: 12,
        servedToday: 62,
        avgServiceMin: 9,
        crops: ["wheat", "paddy", "mustard", "chana"],
      },
      {
        id: "up-kanpur",
        place: { en: "Kanpur", hi: "कानपुर", te: "కాన్పూర్" },
        district: { en: "Kanpur Nagar", hi: "कानपुर नगर", te: "కాన్పూర్ నగర్" },
        subdivision: { en: "Bilhaur", hi: "बिल्हौर", te: "బిల్హౌర్" },
        congestion: "medium",
        waitMin: 31,
        slotsOpen: 8,
        counters: 2,
        distanceKm: 74,
        servedToday: 92,
        avgServiceMin: 10,
        crops: ["wheat", "chana", "mustard"],
      },
      {
        id: "up-agra",
        place: { en: "Agra", hi: "आगरा", te: "ఆగ్రా" },
        district: { en: "Agra", hi: "आगरा", te: "ఆగ్రా" },
        subdivision: { en: "Kiraoli", hi: "किरावली", te: "కిరావలి" },
        congestion: "high",
        waitMin: 51,
        slotsOpen: 2,
        counters: 2,
        distanceKm: 33,
        servedToday: 107,
        avgServiceMin: 12,
        crops: ["wheat", "mustard", "bajra"],
      },
    ],
  },
  {
    id: "ka",
    state: { en: "Karnataka", hi: "कर्नाटक", te: "కర్ణాటక" },
    subdivisionType: { en: "Taluk", hi: "तालुक", te: "తాలూకు" },
    farmer: { en: "Ravi Kumar", hi: "रवि कुमार", te: "రవి కుమార్" },
    village: { en: "Gorebal", hi: "गोरेबाल", te: "గోరేబాల్" },
    primaryCrop: "jowar",
    centres: [
      {
        id: "ka-raichur",
        place: { en: "Raichur", hi: "रायचूर", te: "రాయచూరు" },
        district: { en: "Raichur", hi: "रायचूर", te: "రాయచూరు" },
        subdivision: { en: "Sindhanur", hi: "सिंधनूर", te: "సింధనూరు" },
        congestion: "low",
        waitMin: 11,
        slotsOpen: 20,
        counters: 3,
        distanceKm: 18,
        servedToday: 55,
        avgServiceMin: 8,
        crops: ["jowar", "paddy", "cotton", "redgram"],
      },
      {
        id: "ka-davanagere",
        place: { en: "Davanagere", hi: "दावणगेरे", te: "దావణగెరె" },
        district: { en: "Davanagere", hi: "दावणगेरे", te: "దావణగెరె" },
        subdivision: { en: "Harihar", hi: "हरिहर", te: "హరిహర" },
        congestion: "medium",
        waitMin: 25,
        slotsOpen: 7,
        counters: 2,
        distanceKm: 66,
        servedToday: 84,
        avgServiceMin: 10,
        crops: ["maize", "jowar", "ragi"],
      },
      {
        id: "ka-belagavi",
        place: { en: "Belagavi", hi: "बेलगावी", te: "బెళగావి" },
        district: { en: "Belagavi", hi: "बेलगावी", te: "బెళగావి" },
        subdivision: { en: "Gokak", hi: "गोकाक", te: "గోకాక్" },
        congestion: "high",
        waitMin: 46,
        slotsOpen: 3,
        counters: 2,
        distanceKm: 29,
        servedToday: 101,
        avgServiceMin: 11,
        crops: ["jowar", "maize", "sunflower"],
      },
    ],
  },
];

export const DEFAULT_REGION_ID = "ap";

export function getRegion(id: string): Region {
  return REGIONS.find((r) => r.id === id) ?? REGIONS[0];
}

export function getCentre(regionId: string, centreId: string): Centre {
  const region = getRegion(regionId);
  return region.centres.find((c) => c.id === centreId) ?? region.centres[0];
}

/* ------------------------------------------------------------------
   Slot windows
   ------------------------------------------------------------------ */

export type SlotWindow = {
  id: string;
  label: string;
  capacity: number;
  booked: number;
};

/** Small deterministic hash so slot capacities are stable across renders. */
function seedFrom(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const WINDOW_LABELS = [
  "08:00–09:00",
  "09:00–10:00",
  "10:00–11:00",
  "11:00–12:00",
  "12:00–13:00",
  "14:00–15:00",
];

/**
 * Slot availability for a centre on a given day offset. Capacity scales with
 * the number of counters; morning windows fill first, which is exactly the
 * behaviour the platform is designed to flatten.
 */
export function slotsFor(centre: Centre, dayOffset: number): SlotWindow[] {
  const pressure = centre.congestion === "high" ? 0.92 : centre.congestion === "medium" ? 0.72 : 0.42;
  const relief = dayOffset === 0 ? 0 : dayOffset === 1 ? 0.16 : 0.3;

  return WINDOW_LABELS.map((label, i) => {
    const seed = seedFrom(`${centre.id}:${dayOffset}:${i}`);
    const capacity = centre.counters * 6 + (seed % 5);
    // Morning windows carry the heaviest demand.
    const morningBias = 1 - i * 0.11;
    const fillRatio = Math.min(1, Math.max(0, pressure * morningBias - relief + ((seed >> 8) % 12) / 100));
    const booked = Math.round(capacity * fillRatio);
    return { id: `${centre.id}-${dayOffset}-${i}`, label, capacity, booked };
  });
}

/* ------------------------------------------------------------------
   Demo procurement figures
   ------------------------------------------------------------------ */

export const DEMO = {
  token: "KQ-102",
  lotId: "LOT-KQ-102-A",
  paymentRef: "KQ-PAY-001245",
  accountMask: "••••4417",
  grossWeightQtl: 40.2,
  acceptedQtl: 39.6,
  moisturePct: 16.4,
  grade: "FAQ",
} as const;

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function centreName(place: Localized, lang: keyof Localized): string {
  return `${place[lang]} ${CENTRE_SUFFIX[lang]}`;
}
