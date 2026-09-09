import { memo, type CSSProperties } from "react";

/**
 * The animated storyboard that plays inside the film player when no rendered
 * video asset is present. Six scenes carry the narrative from an ordinary
 * procurement day to the same day organised.
 *
 * The palette is the argument: scenes 1–4 sit in dust and heat, scene 5 cools
 * into ink and survey-grid geometry, scene 6 resolves into calm. Figures are
 * stylised silhouettes — deliberately dignified, never caricatured.
 *
 * Everything here animates in CSS, not JavaScript. A storyboard that stalls
 * mid-fade because a tab was throttled is worse than no storyboard at all,
 * and CSS animations keep running on the compositor. The global
 * prefers-reduced-motion rule collapses every duration, so a reduced-motion
 * viewer sees each scene composed and still.
 */

export const SCENE_COUNT = 6;
export const SCENE_SECONDS = 7.5;
export const FILM_SECONDS = SCENE_COUNT * SCENE_SECONDS;

type Palette = {
  skyTop: string;
  skyBottom: string;
  sun: string;
  sunGlow: string;
  hillFar: string;
  hillNear: string;
  ground: string;
  figure: string;
};

const PALETTES: Palette[] = [
  {
    // 1 — before sunrise
    skyTop: "#101d3a",
    skyBottom: "#3b3560",
    sun: "#cfd6ef",
    sunGlow: "rgba(207,214,239,0.20)",
    hillFar: "#1b2547",
    hillNear: "#131a33",
    ground: "#0d1226",
    figure: "#05080f",
  },
  {
    // 2 — arrival at dawn
    skyTop: "#4a4a78",
    skyBottom: "#e8a563",
    sun: "#ffd9a0",
    sunGlow: "rgba(255,200,130,0.38)",
    hillFar: "#6b5a5c",
    hillNear: "#463a3f",
    ground: "#372c2e",
    figure: "#1d1618",
  },
  {
    // 3 — the wait, sun overhead
    skyTop: "#bed0dd",
    skyBottom: "#efd9b4",
    sun: "#fff8e2",
    sunGlow: "rgba(255,240,200,0.6)",
    hillFar: "#b3ac97",
    hillNear: "#96907c",
    ground: "#877e66",
    figure: "#332f24",
  },
  {
    // 4 — uncertainty, dust and glare
    skyTop: "#d4c7ad",
    skyBottom: "#e9d7b3",
    sun: "#fff6de",
    sunGlow: "rgba(255,246,222,0.55)",
    hillFar: "#b0a48a",
    hillNear: "#948870",
    ground: "#7c7159",
    figure: "#2e2a1f",
  },
  {
    // 5 — the system takes over
    skyTop: "#0c1f33",
    skyBottom: "#17415c",
    sun: "#2a9d68",
    sunGlow: "rgba(42,157,104,0.3)",
    hillFar: "#12293d",
    hillNear: "#0d1f2f",
    ground: "#0a1826",
    figure: "#040d17",
  },
  {
    // 6 — zero uncertainty
    skyTop: "#0b1b2b",
    skyBottom: "#14507e",
    sun: "#f0a63f",
    sunGlow: "rgba(240,166,63,0.32)",
    hillFar: "#123049",
    hillNear: "#0c2237",
    ground: "#081724",
    figure: "#040d17",
  },
];

/** Lets a CSS-animated element declare its own final opacity and offsets. */
type AnimStyle = CSSProperties & Record<string, string | number>;

const delay = (s: number, extra?: AnimStyle): AnimStyle => ({
  animationDelay: `${s}s`,
  ...extra,
});

/* ------------------------------------------------------------------
   Shared silhouette pieces
   ------------------------------------------------------------------ */

function Person({
  x,
  y,
  scale = 1,
  fill,
  turban = false,
  carrying = false,
  className,
  style,
}: {
  x: number;
  y: number;
  scale?: number;
  fill: string;
  turban?: boolean;
  carrying?: boolean;
  className?: string;
  style?: AnimStyle;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g fill={fill} className={className} style={style}>
        {turban && <path d="M-6.6 -33.4 q6.6 -7.4 13.2 0 q1.5 3.1 -1 4.6 h-11.2 q-2.5 -1.5 -1 -4.6 Z" />}
        <circle cx="0" cy="-28" r="5.2" />
        <path d="M-5.6 -22 q5.6 -3.4 11.2 0 l2.4 15 q0.6 3.4 -2.8 3.4 h-10.4 q-3.4 0 -2.8 -3.4 Z" />
        <rect x="-4.6" y="-4" width="3.6" height="15" rx="1.6" />
        <rect x="1" y="-4" width="3.6" height="15" rx="1.6" />
        {carrying && <ellipse cx="0" cy="-38.5" rx="9.5" ry="4.8" />}
      </g>
    </g>
  );
}

function Trolley({
  x,
  y,
  scale = 1,
  fill,
  loaded = true,
  className,
  style,
}: {
  x: number;
  y: number;
  scale?: number;
  fill: string;
  loaded?: boolean;
  className?: string;
  style?: AnimStyle;
}) {
  return (
    <g className={className} style={style}>
      <g transform={`translate(${x} ${y}) scale(${scale})`} fill={fill}>
        {/* tractor */}
        <rect x="60" y="-26" width="26" height="18" rx="3" />
        <rect x="82" y="-17" width="10" height="11" rx="2" />
        <circle cx="66" cy="-2" r="9" />
        <circle cx="86" cy="-4" r="6.5" />
        {/* trolley bed */}
        <rect x="0" y="-22" width="56" height="16" rx="2" />
        <rect x="54" y="-18" width="8" height="4" rx="1.5" />
        <circle cx="14" cy="-2" r="6.5" />
        <circle cx="42" cy="-2" r="6.5" />
        {loaded &&
          [4, 16, 28, 40].map((sx, i) => (
            <ellipse key={sx} cx={sx + 6} cy={-27 - (i % 2) * 3} rx="7" ry="6" />
          ))}
      </g>
    </g>
  );
}

function Shed({
  x,
  y,
  scale = 1,
  fill,
  lit = false,
}: {
  x: number;
  y: number;
  scale?: number;
  fill: string;
  lit?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-12 -40 L75 -68 L162 -40 Z" fill={fill} />
      <rect x="0" y="-40" width="150" height="42" rx="2" fill={fill} />
      <rect
        x="58"
        y="-25"
        width="32"
        height="27"
        fill={lit ? "#f0a63f" : "#FAF7F1"}
        opacity={lit ? 0.9 : 0.2}
      />
      <rect x="14" y="-31" width="22" height="14" fill="#FAF7F1" opacity="0.15" />
      <rect x="112" y="-31" width="22" height="14" fill="#FAF7F1" opacity="0.15" />
    </g>
  );
}

function Backdrop({ p, sunX, sunY }: { p: Palette; sunX: number; sunY: number }) {
  return (
    <>
      <rect width="1200" height="675" fill="url(#kq-sky)" />
      <circle cx={sunX} cy={sunY} r="220" fill="url(#kq-glow)" />
      <circle cx={sunX} cy={sunY} r="34" fill={p.sun} opacity="0.95" />
      <path
        d="M0 430 C 160 400, 300 434, 450 418 C 610 400, 760 430, 910 414 C 1040 400, 1130 424, 1200 412 L1200 675 L0 675 Z"
        fill={p.hillFar}
      />
      <path
        d="M0 486 C 200 466, 380 494, 560 480 C 760 464, 940 492, 1120 478 L1200 474 L1200 675 L0 675 Z"
        fill={p.hillNear}
      />
      <rect y="528" width="1200" height="210" fill={p.ground} />
    </>
  );
}

/* ------------------------------------------------------------------
   Scene 1 — Before sunrise
   ------------------------------------------------------------------ */

function SceneLoading({ p }: { p: Palette }) {
  const stars: [number, number][] = [
    [170, 88],
    [312, 60],
    [468, 116],
    [700, 72],
    [858, 138],
    [1128, 84],
    [560, 46],
  ];
  return (
    <>
      <Backdrop p={p} sunX={1012} sunY={124} />
      {stars.map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="2.2"
          fill="#e8ecff"
          className="kq-twinkle"
          style={delay(i * 0.45)}
        />
      ))}
      {/* the single lamp they load by */}
      <circle cx="530" cy="500" r="140" fill="rgba(255,206,140,0.14)" className="kq-breathe" />
      <Trolley x={372} y={556} scale={1.5} fill={p.figure} />
      <Person x={318} y={556} scale={1.75} fill={p.figure} turban carrying className="kq-bob" />
      <Person x={648} y={558} scale={1.55} fill={p.figure} className="kq-bob" style={delay(1.1)} />
      {/* sacks still on the ground */}
      {[690, 726, 708].map((cx, i) => (
        <ellipse key={cx} cx={cx} cy={i === 2 ? 592 : 606} rx="17" ry="12" fill={p.figure} />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------
   Scene 2 — The arrival
   ------------------------------------------------------------------ */

function SceneArrival({ p }: { p: Palette }) {
  return (
    <>
      <Backdrop p={p} sunX={188} sunY={392} />
      <Shed x={880} y={492} scale={1.3} fill={p.figure} />
      {/* trolleys still rolling in, nose to tail */}
      {[
        { x: 40, d: 0 },
        { x: 290, d: 2.3 },
        { x: 540, d: 4.6 },
      ].map((tr) => (
        <Trolley
          key={tr.x}
          x={tr.x}
          y={558}
          scale={1.25}
          fill={p.figure}
          className="kq-roll"
          style={delay(-tr.d)}
        />
      ))}
      {/* already parked at the gate */}
      <Trolley x={700} y={562} scale={1.2} fill={p.figure} />
      <ellipse
        cx="440"
        cy="572"
        rx="260"
        ry="22"
        fill="rgba(255,225,180,0.2)"
        className="kq-breathe"
      />
    </>
  );
}

/* ------------------------------------------------------------------
   Scene 3 — The wait
   ------------------------------------------------------------------ */

function SceneWaiting({ p }: { p: Palette }) {
  // Deliberately irregular: this is a crowd, not a queue.
  const crowd: [number, number, number][] = [
    [170, 596, 1.3],
    [246, 578, 1.12],
    [326, 606, 1.4],
    [400, 574, 1.05],
    [468, 600, 1.24],
    [556, 580, 1.12],
    [640, 608, 1.34],
    [712, 576, 1.02],
    [788, 600, 1.24],
  ];
  return (
    <>
      <Backdrop p={p} sunX={618} sunY={88} />
      <Shed x={906} y={500} scale={1.32} fill={p.figure} />
      <rect y="466" width="1200" height="66" fill="rgba(255,247,214,0.24)" className="kq-breathe" />
      {crowd.map(([x, y, s], i) => (
        <Person
          key={i}
          x={x}
          y={y}
          scale={s}
          fill={p.figure}
          turban={i % 3 === 0}
          className="kq-bob"
          style={delay(i * 0.24)}
        />
      ))}
      {[856, 898, 940, 876, 918].map((cx, i) => (
        <ellipse
          key={cx}
          cx={cx}
          cy={i < 3 ? 610 : 590}
          rx="19"
          ry="13"
          fill={p.figure}
          opacity="0.9"
        />
      ))}
      {/* the clock that will not stop */}
      <g transform="translate(1046 160)">
        <circle r="54" fill="rgba(255,252,242,0.35)" />
        <circle r="54" fill="none" stroke={p.figure} strokeOpacity="0.55" strokeWidth="5" />
        <line x1="0" y1="0" x2="0" y2="-36" stroke={p.figure} strokeOpacity="0.75" strokeWidth="4" strokeLinecap="round" className="kq-spin" />
        <line x1="0" y1="0" x2="0" y2="-23" stroke={p.figure} strokeOpacity="0.6" strokeWidth="6" strokeLinecap="round" className="kq-spin-slow" />
        <circle r="4" fill={p.figure} fillOpacity="0.8" />
      </g>
    </>
  );
}

/* ------------------------------------------------------------------
   Scene 4 — The uncertainty
   ------------------------------------------------------------------ */

function SceneUncertainty({ p }: { p: Palette }) {
  return (
    <>
      <Backdrop p={p} sunX={986} sunY={100} />
      {/* an empty notice board */}
      <g transform="translate(432 236)">
        <rect x="152" y="200" width="16" height="150" fill={p.figure} />
        <rect x="0" y="0" width="330" height="206" rx="6" fill="rgba(255,252,242,0.92)" />
        <rect x="0" y="0" width="330" height="206" rx="6" fill="none" stroke={p.figure} strokeWidth="7" />
        {[46, 84, 122, 160].map((y) => (
          <line key={y} x1="32" y1={y} x2="298" y2={y} stroke={p.figure} strokeOpacity="0.13" strokeWidth="4" />
        ))}
      </g>
      {[
        { x: 486, d: 0 },
        { x: 610, d: 1.2 },
        { x: 700, d: 2.4 },
      ].map((q) => (
        <text
          key={q.x}
          x={q.x}
          y="212"
          fontFamily="Fraunces, Georgia, serif"
          fontSize="62"
          fontWeight="600"
          fill={p.figure}
          className="kq-ask"
          style={delay(q.d)}
        >
          ?
        </text>
      ))}
      <Person x={318} y={604} scale={2.15} fill={p.figure} turban className="kq-bob" />
      <Person x={880} y={608} scale={1.95} fill={p.figure} className="kq-bob" style={delay(1.4)} />
      {[762, 806, 850].map((cx) => (
        <ellipse key={cx} cx={cx} cy={618} rx="21" ry="14" fill={p.figure} opacity="0.9" />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------
   Scene 5 — A different design
   ------------------------------------------------------------------ */

function SceneSystem({ p }: { p: Palette }) {
  const scatter: [number, number][] = [
    [-46, 30],
    [92, -18],
    [-74, 22],
    [124, -26],
    [-22, 14],
    [64, -12],
  ];
  return (
    <>
      <Backdrop p={p} sunX={132} sunY={116} />
      {/* survey grid resolving over the field */}
      <g className="kq-fade" style={delay(0.15, { "--kq-op": 0.55 })}>
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="675" stroke="#2a9d68" strokeOpacity="0.22" />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 96} x2="1200" y2={i * 96} stroke="#2a9d68" strokeOpacity="0.15" />
        ))}
      </g>

      {/* the crowd falls into an ordered row */}
      {scatter.map(([dx, dy], i) => (
        <g
          key={i}
          className="kq-settle"
          style={delay(0.3 + i * 0.13, { "--kq-dx": `${dx}px`, "--kq-dy": `${dy}px` })}
        >
          <Person x={196 + i * 104} y={604} scale={1.35} fill={p.figure} turban={i % 3 === 1} />
          <rect
            x={196 + i * 104 - 26}
            y={616}
            width="52"
            height="6"
            rx="3"
            fill="#2a9d68"
            opacity="0.7"
            className="kq-grow-x"
            style={delay(1.1 + i * 0.11)}
          />
        </g>
      ))}

      {/* a phone materialising with the booked slot */}
      <g className="kq-rise" style={delay(1.4)}>
        <rect x="856" y="140" width="200" height="336" rx="28" fill="#0b1b2b" stroke="#2a9d68" strokeOpacity="0.45" strokeWidth="2" />
        <rect x="870" y="158" width="172" height="300" rx="18" fill="#0e2436" />
        <rect x="888" y="188" width="92" height="9" rx="4.5" fill="#f0a63f" />
        <rect x="888" y="209" width="136" height="7" rx="3.5" fill="#FAF7F1" opacity="0.26" />
        <rect x="888" y="240" width="136" height="62" rx="9" fill="#2a9d68" opacity="0.16" />
        <text x="902" y="281" fontFamily="IBM Plex Mono, monospace" fontSize="31" fill="#FAF7F1">
          KQ-102
        </text>
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x="888"
            y={322 + i * 30}
            width={[136, 108, 78][i]}
            height="14"
            rx="7"
            fill="#FAF7F1"
            className="kq-slide"
            style={delay(2 + i * 0.22, { "--kq-op": 0.16 })}
          />
        ))}
      </g>
    </>
  );
}

/* ------------------------------------------------------------------
   Scene 6 — Zero uncertainty
   ------------------------------------------------------------------ */

const CLARITY_TICKS = ["Slot booked", "Weighment", "Quality check", "Payment"];

function SceneClarity({ p }: { p: Palette }) {
  return (
    <>
      <Backdrop p={p} sunX={286} sunY={352} />
      <Shed x={64} y={524} scale={1.22} fill={p.figure} lit />
      {[0, 1, 2, 3].map((i) => (
        <Person key={i} x={290 + i * 88} y={612} scale={1.26} fill={p.figure} turban={i === 1} />
      ))}

      <g className="kq-rise">
        <rect x="632" y="92" width="492" height="306" rx="24" fill="#0b1b2b" fillOpacity="0.95" stroke="#f0a63f" strokeOpacity="0.4" strokeWidth="2" />
        <text x="668" y="142" fontFamily="IBM Plex Mono, monospace" fontSize="15" fill="#FAF7F1" fillOpacity="0.45" letterSpacing="3.4">
          YOUR TOKEN
        </text>
        <text x="668" y="198" fontFamily="IBM Plex Mono, monospace" fontSize="52" fontWeight="600" fill="#f0a63f">
          KQ-102
        </text>
        <text x="668" y="244" fontFamily="IBM Plex Mono, monospace" fontSize="15" fill="#FAF7F1" fillOpacity="0.45" letterSpacing="3.4">
          POSITION #4 · 32 MIN
        </text>
        {CLARITY_TICKS.map((label, i) => (
          <g key={label} className="kq-slide" style={delay(0.45 + i * 0.24)}>
            <circle cx="680" cy={284 + i * 27} r="8" fill="#2a9d68" />
            <path
              d={`M675.5 ${284 + i * 27} l3.2 3.4 l6.2 -6.6`}
              stroke="#0b1b2b"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text x="702" y={289 + i * 27} fontFamily="Plus Jakarta Sans, sans-serif" fontSize="15.5" fill="#FAF7F1" fillOpacity="0.82">
              {label}
            </text>
          </g>
        ))}
      </g>
    </>
  );
}

const SCENES = [
  SceneLoading,
  SceneArrival,
  SceneWaiting,
  SceneUncertainty,
  SceneSystem,
  SceneClarity,
];

export const FilmStage = memo(function FilmStage({ scene }: { scene: number }) {
  const index = Math.min(Math.max(scene, 0), SCENE_COUNT - 1);
  const Scene = SCENES[index];
  const p = PALETTES[index];

  return (
    <svg
      viewBox="0 0 1200 675"
      className="h-full w-full"
      role="img"
      aria-label={`Storyboard scene ${index + 1} of ${SCENE_COUNT}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Keyed so the gradients swap cleanly with the scene. */}
        <linearGradient id="kq-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.skyTop} />
          <stop offset="100%" stopColor={p.skyBottom} />
        </linearGradient>
        <radialGradient id="kq-glow">
          <stop offset="0%" stopColor={p.sunGlow} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <radialGradient id="kq-vignette" cx="50%" cy="46%" r="74%">
          <stop offset="55%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.42)" />
        </radialGradient>
      </defs>

      {/* key forces a remount so the CSS cross-fade restarts on every cut */}
      {/* Riding the scene up keeps the figures clear of the caption gradient. */}
      <g key={index} className="kq-scene" transform="translate(0 -46)">
        <Scene p={p} />
      </g>

      <rect width="1200" height="675" fill="url(#kq-vignette)" />
    </svg>
  );
});
