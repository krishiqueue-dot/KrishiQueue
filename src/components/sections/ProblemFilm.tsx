import { motion } from "framer-motion";
import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Eyebrow, Reveal } from "@/components/ui/primitives";
import { FILM_SECONDS, FilmStage, SCENE_COUNT, SCENE_SECONDS } from "@/components/film/FilmStage";
import { useI18n } from "@/i18n";
import type { DictKey } from "@/i18n/en";
import { cn } from "@/lib/cn";

/**
 * Drop a produced film at this path and the player switches to it
 * automatically — poster, controls and captions all keep working.
 */
const VIDEO_SRC = "/assets/video/krishiqueue-problem.mp4";
const POSTER_SRC = "/assets/img/film-poster.jpg";

const SCENES: { title: DictKey; caption: DictKey }[] = [
  { title: "film.scene1Title", caption: "film.scene1Cap" },
  { title: "film.scene2Title", caption: "film.scene2Cap" },
  { title: "film.scene3Title", caption: "film.scene3Cap" },
  { title: "film.scene4Title", caption: "film.scene4Cap" },
  { title: "film.scene5Title", caption: "film.scene5Cap" },
  { title: "film.scene6Title", caption: "film.scene6Cap" },
];

export function ProblemFilm() {
  const { t } = useI18n();
  const [hasVideo, setHasVideo] = useState<boolean | null>(null);

  // Probe once for a produced film; fall back to the storyboard otherwise.
  useEffect(() => {
    let cancelled = false;
    fetch(VIDEO_SRC, { method: "HEAD" })
      .then((res) => {
        const type = res.headers.get("content-type") ?? "";
        if (!cancelled) setHasVideo(res.ok && type.startsWith("video"));
      })
      .catch(() => {
        if (!cancelled) setHasVideo(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="film"
      className="relative isolate overflow-hidden bg-ink-900 text-ivory-100 scroll-mt-20"
    >
      <div
        aria-hidden
        className="survey-grid pointer-events-none absolute inset-0 text-ivory-100 opacity-30"
      />
      <div className="relative mx-auto w-full max-w-[1180px] px-5 py-20 sm:px-8 md:py-28">
        <div className="max-w-[38rem]">
          <Reveal>
            <Eyebrow tone="light">{t("film.eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-[clamp(1.9rem,4.4vw,3.1rem)] font-semibold">
              {t("film.title")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-ivory-200/70">
              {t("film.sub")}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="mt-10">
          {hasVideo === null ? (
            <div className="aspect-video w-full animate-pulse rounded-3xl border border-ivory-100/10 bg-ink-800" />
          ) : hasVideo ? (
            <VideoPlayer />
          ) : (
            <StoryboardPlayer />
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ==================================================================
   PLAYER CHROME — shared by both modes
   ================================================================== */

function PlayerFrame({
  children,
  controls,
  caption,
  chapters,
}: {
  children: React.ReactNode;
  controls: React.ReactNode;
  caption?: React.ReactNode;
  chapters?: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-ivory-100/12 bg-ink-950 shadow-lift-lg">
      <div className="relative aspect-video w-full overflow-hidden bg-ink-950">
        {children}
        {caption}
      </div>
      <div className="flex flex-wrap items-center gap-3 border-t border-ivory-100/10 bg-ink-900 px-4 py-3 sm:px-5">
        {controls}
      </div>
      {chapters}
    </div>
  );
}

function ControlButton({
  onClick,
  label,
  children,
  primary = false,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12.5px] font-semibold transition-colors",
        primary
          ? "bg-ivory-50 text-ink-900 hover:bg-white"
          : "border border-ivory-100/15 text-ivory-100/80 hover:border-ivory-100/35 hover:text-ivory-50",
      )}
    >
      {children}
    </button>
  );
}

/* ==================================================================
   STORYBOARD MODE
   ================================================================== */

function StoryboardPlayer() {
  const { t } = useI18n();
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [started, setStarted] = useState(false);
  /** Wall-clock anchor: when playback started, and where in the film. */
  const anchorRef = useRef({ at: 0, offset: 0 });
  /** Always holds the latest elapsed value, so resuming picks up in place. */
  const elapsedRef = useRef(0);

  elapsedRef.current = elapsed;

  const scene = Math.min(SCENE_COUNT - 1, Math.floor(elapsed / SCENE_SECONDS));
  const progress = Math.min(1, elapsed / FILM_SECONDS);
  const ended = elapsed >= FILM_SECONDS;

  // Driven by wall-clock time on an interval rather than by animation frames.
  // Frames stop being delivered in a background tab; the film should behave
  // like a video and simply be further along when you look at it again.
  useEffect(() => {
    if (!playing) return;
    anchorRef.current = { at: performance.now(), offset: elapsedRef.current };
    const id = window.setInterval(() => {
      const { at, offset } = anchorRef.current;
      const next = offset + (performance.now() - at) / 1000;
      if (next >= FILM_SECONDS) {
        setElapsed(FILM_SECONDS);
        setPlaying(false);
      } else {
        setElapsed(next);
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [playing]);

  const play = useCallback(() => {
    setStarted(true);
    if (elapsedRef.current >= FILM_SECONDS) {
      elapsedRef.current = 0;
      setElapsed(0);
    }
    setPlaying(true);
  }, []);

  const replay = useCallback(() => {
    elapsedRef.current = 0;
    setElapsed(0);
    setStarted(true);
    setPlaying(true);
  }, []);

  const jumpTo = useCallback((i: number) => {
    const at = i * SCENE_SECONDS + 0.01;
    elapsedRef.current = at;
    setElapsed(at);
    setStarted(true);
    setPlaying(true);
    // Re-anchor immediately so the running interval continues from the new
    // point rather than from where the film was before the jump.
    anchorRef.current = { at: performance.now(), offset: at };
  }, []);

  return (
    <PlayerFrame
      caption={
        started ? (
          <SceneCaption sceneIndex={scene} />
        ) : (
          <PosterOverlay onPlay={play} label={t("film.play")} />
        )
      }
      controls={
        <>
          {playing ? (
            <ControlButton onClick={() => setPlaying(false)} label={t("film.pause")} primary>
              <Pause size={14} className="fill-current" />
              {t("film.pause")}
            </ControlButton>
          ) : (
            <ControlButton onClick={play} label={t("film.play")} primary>
              <Play size={14} className="fill-current" />
              {ended ? t("film.replay") : t("film.play")}
            </ControlButton>
          )}
          <ControlButton onClick={replay} label={t("film.replay")}>
            <RotateCcw size={14} />
          </ControlButton>

          <div className="flex min-w-[140px] flex-1 items-center gap-3">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-ivory-100/12">
              <div
                className="h-full rounded-full bg-saffron-500 transition-[width] duration-100 ease-linear"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <span className="font-mono text-[11px] tabular text-ivory-200/50">
              {formatClock(elapsed)} / {formatClock(FILM_SECONDS)}
            </span>
          </div>
        </>
      }
      chapters={<Chapters active={scene} onSelect={jumpTo} />}
    >
      <FilmStage scene={scene} />
    </PlayerFrame>
  );
}

/* ==================================================================
   VIDEO MODE — used automatically once a film asset exists
   ================================================================== */

function VideoPlayer() {
  const { t } = useI18n();
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [started, setStarted] = useState(false);

  const toggle = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      setStarted(true);
      void el.play();
    } else {
      el.pause();
    }
  }, []);

  const replay = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.currentTime = 0;
    setStarted(true);
    void el.play();
  }, []);

  return (
    <PlayerFrame
      caption={!started ? <PosterOverlay onPlay={toggle} label={t("film.play")} /> : undefined}
      controls={
        <>
          <ControlButton onClick={toggle} label={playing ? t("film.pause") : t("film.play")} primary>
            {playing ? (
              <Pause size={14} className="fill-current" />
            ) : (
              <Play size={14} className="fill-current" />
            )}
            {playing ? t("film.pause") : t("film.play")}
          </ControlButton>
          <ControlButton onClick={replay} label={t("film.replay")}>
            <RotateCcw size={14} />
          </ControlButton>
          <ControlButton
            onClick={() => {
              const el = ref.current;
              if (!el) return;
              el.muted = !el.muted;
              setMuted(el.muted);
            }}
            label={muted ? t("film.unmute") : t("film.mute")}
          >
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </ControlButton>
          <div className="h-1 min-w-[120px] flex-1 overflow-hidden rounded-full bg-ivory-100/12">
            <div
              className="h-full rounded-full bg-saffron-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </>
      }
    >
      <video
        ref={ref}
        className="h-full w-full object-cover"
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        preload="metadata"
        playsInline
        muted={muted}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          setProgress(el.duration ? el.currentTime / el.duration : 0);
        }}
      />
    </PlayerFrame>
  );
}

/* ==================================================================
   SHARED PIECES
   ================================================================== */

function PosterOverlay({ onPlay, label }: { onPlay: () => void; label: string }) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={onPlay}
      className="group absolute inset-0 flex flex-col items-center justify-center gap-5 bg-ink-950/45 backdrop-blur-[1px] transition-colors hover:bg-ink-950/35"
      aria-label={label}
    >
      <span className="relative flex h-[68px] w-[68px] items-center justify-center rounded-full bg-ivory-50 text-ink-900 shadow-lift-lg transition-transform duration-300 group-hover:scale-105">
        <span className="animate-pulse-ring absolute inset-0 rounded-full bg-ivory-50/40" />
        <Play size={24} className="relative ml-1 fill-current" />
      </span>
      <span className="max-w-[26ch] text-center text-[13px] font-medium text-ivory-100/80">
        {t("film.eyebrow")}
      </span>
    </button>
  );
}

function SceneCaption({ sceneIndex }: { sceneIndex: number }) {
  const { t } = useI18n();
  const scene = SCENES[sceneIndex];
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/85 via-ink-950/45 to-transparent p-5 pt-16 sm:p-7 sm:pt-20">
      <div key={sceneIndex} className="kq-swap">
        <p className="font-mono text-[10px] tracking-[0.18em] text-saffron-400 uppercase">
          {String(sceneIndex + 1).padStart(2, "0")} · {t(scene.title)}
        </p>
        <p className="mt-2 max-w-[42ch] font-display text-[clamp(1.05rem,2.4vw,1.6rem)] leading-snug font-semibold text-ivory-50">
          {t(scene.caption)}
        </p>
      </div>
    </div>
  );
}

function Chapters({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const { t } = useI18n();
  return (
    <div
      className="scroll-hint no-scrollbar flex gap-px overflow-x-auto border-t border-ivory-100/10 bg-ink-900"
      style={{ "--kq-hint": "var(--color-ink-900)" } as React.CSSProperties}
    >
      {SCENES.map((scene, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          className={cn(
            "group relative min-w-[132px] flex-1 px-3.5 py-3 text-left transition-colors sm:min-w-0",
            active === i ? "bg-ink-800" : "hover:bg-ink-800/60",
          )}
        >
          <span
            className={cn(
              "font-mono text-[9.5px] tracking-[0.16em] uppercase",
              active === i ? "text-saffron-400" : "text-ivory-200/35",
            )}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <span
            className={cn(
              "mt-1 block truncate text-[12px] font-medium",
              active === i ? "text-ivory-50" : "text-ivory-200/55",
            )}
          >
            {t(scene.title)}
          </span>
          {active === i && (
            <motion.span
              layoutId="chapter-active"
              className="absolute inset-x-0 top-0 h-[2px] bg-saffron-500"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

function formatClock(seconds: number): string {
  const s = Math.floor(seconds);
  return `0:${String(s).padStart(2, "0")}`;
}
