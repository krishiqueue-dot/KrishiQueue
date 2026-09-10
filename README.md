# KrishiQueue

**Smart Procurement. Zero Uncertainty.**

[![CI](https://github.com/krishiqueue-dot/KrishiQueue/actions/workflows/ci.yml/badge.svg)](https://github.com/krishiqueue-dot/KrishiQueue/actions/workflows/ci.yml)
&nbsp;React&nbsp;18 · TypeScript · Vite&nbsp;6 · Tailwind&nbsp;CSS&nbsp;4

An interactive website prototype built for Smart India Hackathon 2026,
Problem Statement **26032** — farmers facing long waiting times, missing
schedule information and no visibility of procurement status.

This repository is the **prototype website**, not the production application.
Everything a judge can click here is simulated in the browser and labelled as
such. The roadmap section on the site states plainly what exists now and what
would come next.

---

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5173

```bash
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build
```

---

## What the site demonstrates

| Section | What a judge can do |
| --- | --- |
| Hero | See a live token, queue position and estimated wait before reading a word |
| Problem film | Watch the 60-second film of a procurement day, jump between its six scenes |
| Problem | Read the five distinct failures behind the problem statement, and the shape of a wasted day |
| Solution | Compare today's undefined queue with the scheduled one |
| How it works | Step through registration → slot → token → queue → procurement & payment |
| Live queue | Advance the queue and watch token KQ-102 move up, with an SMS alert at position 3 |
| Prototype lab | Book a slot, carry the token into a phone mockup, advance procurement, complete payment |
| Congestion | Compare three centres and accept or decline a lower-wait recommendation |
| Roadmap | See the eight phases from prototype to national scale |

Every panel writes to one shared record, so booking a slot in one place
changes the token shown everywhere else.

---

## Design system

Built specifically for this project, not from a template.

- **Display** — Fraunces, a warm high-contrast serif; institutional rather than startup.
- **Interface** — Plus Jakarta Sans.
- **Data** — IBM Plex Mono for every token, amount, time and counter.
- **Indic** — Noto Sans Devanagari and Noto Sans Telugu, with their own
  letter-spacing and line-height rules so Hindi and Telugu are typeset, not
  merely substituted.
- **Colour** — deep institutional navy (`ink`), agricultural green (`agri`),
  government blue (`blue`), a sparing saffron accent, warm ivory paper, and a
  clay red reserved for congestion. Defined as Tailwind theme tokens in
  `src/index.css`.
- **Texture** — a furrow pattern for the field-side sections and a survey grid
  for the system-side ones; the two motifs carry the site's core argument.

---

## Languages

English, हिंदी and తెలుగు are all first-class. Every farmer-facing string is
translated — including centre names, districts, the administrative tier
(Mandal / Tehsil / Taluk / Taluka), crops and farmer names.

- `src/i18n/en.ts` defines the key set and is the source of truth.
- `src/i18n/hi.ts` and `src/i18n/te.ts` are typed against it, so a missing
  translation is a compile error rather than an English string leaking through.
- Data values carry their own `{ en, hi, te }` triples and are resolved with `tl()`.

### Adding a language

The selector is a dropdown (`src/components/layout/LanguageMenu.tsx`) driven
entirely off the `LANGUAGES` array in `src/i18n/index.tsx`, so the UI needs no
change as the list grows — it simply scrolls past about six entries. To add one:

1. Add a row to `LANGUAGES` (`code`, `label`, `native`, `english`).
2. Add `src/i18n/<code>.ts` typed as `Dict`, and register it in `DICTS`.
3. Run `npm run build`. TypeScript will then list every `Localized` value in
   `src/data/india.ts` that still needs the new key — centre names, districts,
   crops, farmers. That is deliberate: it prevents a half-translated language
   from shipping.

---

## Pan-India scope

The demo data models **six states × three centres**, each with the correct
local term for the tier below a district:

| State | Term | Centres |
| --- | --- | --- |
| Andhra Pradesh | Mandal | Tirupati, Chittoor, Renigunta |
| Punjab | Tehsil | Patiala, Amritsar, Ludhiana |
| Telangana | Mandal | Karimnagar, Warangal, Nizamabad |
| Maharashtra | Taluka | Nashik, Baramati, Nagpur |
| Uttar Pradesh | Tehsil | Lucknow, Kanpur, Agra |
| Karnataka | Taluk | Raichur, Davanagere, Belagavi |

Switching region in the prototype lab changes the centres, the terminology,
the crops and the farmer. Fourteen procurement crops are modelled.

All of it is fictional demonstration data. See `src/data/india.ts`.

---

## The problem film

`public/assets/video/krishiqueue-problem.mp4` — a 60-second, 1280×720 H.264
cut — is what plays. The six-scene chapter strip seeks into it, and a scene
marker names the current beat in the corner of the frame. Scene boundaries are
derived from the running time (even tenths of a minute); if a future edit gives
the scenes uneven lengths, set `SCENE_STARTS` in
`src/components/sections/ProblemFilm.tsx` and the chapters follow the new cut.

The current cut has no audio track, so the mute control is hidden — flip
`FILM_HAS_AUDIO` in the same file when a version with sound arrives.

If the video file is ever absent, the player falls back to a six-scene animated
storyboard rendered in SVG, with the same controls. The storyboard animates in
CSS rather than JavaScript, so a throttled or backgrounded tab cannot leave a
frame half-drawn.

---

## Honesty rules the code follows

- No invented statistics. The site quotes no percentage it has not measured.
- Every simulated surface is labelled `Simulated`, `Demo` or
  `Interactive Prototype`.
- The footer states that KrishiQueue is not an official Government of India
  application and that all data shown is demonstration data.
- The rate used for payment is described as a demonstration rate; production
  would read the declared procurement rate for the season.
- No claim is made about production security, throughput or field results.

---

## Accessibility & motion

- `prefers-reduced-motion` is honoured globally: durations *and delays*
  collapse, and no entrance animation ever starts from `opacity: 0`, so
  content can never be left invisible.
- Scroll-spy navigation, a skip link, `aria-pressed` / `aria-selected` on every
  toggle, and focus-visible rings throughout.
- Verified with no horizontal overflow at 360, 375, 390, 412, 768, 1024 and
  1440 px.

---

## Structure

```
src/
  App.tsx                    section order — the judge's path
  index.css                  design tokens, textures, CSS animation system
  i18n/                      en / hi / te dictionaries + provider
  data/india.ts              regions, centres, crops, slots, demo figures
  state/prototype.tsx        the one store every demo reads and writes
  components/
    layout/                  nav, footer, brand mark
    film/FilmStage.tsx       the six-scene SVG storyboard
    prototype/               booking, phone, procurement, payment demos
    sections/                one file per page section
    ui/primitives.tsx        design-system primitives
```

`state/prototype.tsx` is the seam for the future application: replace the
reducer with API calls plus a WebSocket subscription and the component tree
above it does not need to change.

---

## Stack

React 18 · TypeScript · Vite 6 · Tailwind CSS 4 · Framer Motion · Lucide.

`npm run build` type-checks and bundles in one step; CI runs it on every push
to `main` and every pull request.

---

## Deploying

The build output in `dist/` is a static site — any static host will serve it.
For GitHub Pages, set the base path first, because the site would be served
from a subdirectory rather than the domain root:

```ts
// vite.config.ts
export default defineConfig({
  base: "/KrishiQueue/",
  // ...
});
```

Then enable Pages in the repository settings and publish `dist/`. Hosts that
serve from the root (Netlify, Vercel, Cloudflare Pages) need no `base` change —
point them at `npm run build` with an output directory of `dist`.

---

Built for demonstration and evaluation purposes.
