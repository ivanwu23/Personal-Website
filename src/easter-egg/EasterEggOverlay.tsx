import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { CSSProperties } from 'react'
import ShootingStars from '../components/ShootingStars'
import { useEasterEgg } from './EasterEggContext'
import {
  BURST_AT,
  CAPTIONS,
  EXPLODE_DURATION,
  FADE_TO_BLACK,
  INTRO_STARS_OUT,
  STAR_FAST_AT,
  STAR_IN,
  THEME_SWITCH_AT,
} from './timeline'
import './EasterEggOverlay.css'

// The cinematic layered over the whole site between the hold completing
// and party mode: the fade to black (fade), a few rainbow shooting stars
// and then the captions (ready), the white star spinning up through the
// song's build (void), and the burst that fades out over the dark site
// (explode). Timings come in as custom properties so the keyframes in
// EasterEggOverlay.css always match timeline.ts.

// The star at its biggest, tip to tip, as a fraction of the screen's
// longer side.
const STAR_MAX_SPAN = 0.575
// Its tip-to-tip size at the start of the slow leg, and at the end of it.
const STAR_START_PX = 12
const STAR_MID_PX = 66
// The star's SVG box is this much bigger than the star itself, leaving
// room around it for the glow (see the viewBox below).
const SVG_PADDING = 1.8

// Spin speeds, in degrees per second. The slow leg turns steadily; the
// fast leg eases in from about the slow speed up to TOP_SPEED (its
// cubic-bezier, in the CSS, ends 4x steeper than its average). TOP_SPEED
// is kept just under 90deg per 60fps frame — past that, a four-point
// star's symmetry makes it read as standing still or spinning backwards.
const SLOW_SPEED = 100
const TOP_SPEED = 4500
const BURST_SPEED = TOP_SPEED

const SLOW_LEG = STAR_FAST_AT - STAR_IN
const FAST_LEG = BURST_AT - STAR_FAST_AT
// Both legs end on whole turns, so each picks up exactly where the last
// one left off (and the burst's spin from 0).
const SLOW_END_DEG = Math.round((SLOW_LEG * SLOW_SPEED) / 360) * 360
const FAST_END_DEG = SLOW_END_DEG + Math.round((FAST_LEG * TOP_SPEED) / 4 / 360) * 360

// The star's bass pulse: the lowest few analyser bins (roughly 0–700Hz,
// where the kick lives), averaged.
const BASS_BINS = [1, 2, 3, 4]
const PULSE_STRENGTH = 0.35

// A four-point star with deep concave sides and needle-sharp tips, drawn
// in a 0–100 box.
const STAR_PATH =
  'M50 0 C53 37 63 47 100 50 C63 53 53 63 50 100 C47 63 37 53 0 50 C37 47 47 37 50 0 Z'

export default function EasterEggOverlay() {
  const { phase, analyser } = useEasterEgg()
  const pulseRef = useRef<HTMLDivElement>(null)
  const hasStar = phase === 'void' || phase === 'explode'

  // Thumps the star along with the song's kick while it spins up — it's
  // on screen for a long stretch of the build, and this keeps it alive.
  // Written straight to the element each frame, not through React state.
  useEffect(() => {
    if (!hasStar || !analyser) return
    const data = new Uint8Array(analyser.frequencyBinCount)
    let frame = 0
    function tick() {
      analyser!.getByteFrequencyData(data)
      let sum = 0
      for (const bin of BASS_BINS) sum += data[bin]
      const level = sum / BASS_BINS.length / 255
      if (pulseRef.current) {
        pulseRef.current.style.transform = `scale(${(1 + PULSE_STRENGTH * level ** 2).toFixed(3)})`
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [hasStar, analyser])

  if (phase === 'idle' || phase === 'party') return null

  // The star is laid out at its full, final size and scaled *down* from
  // there, never up — so it's drawn once, sharp, at the biggest it gets,
  // and every frame after that is just the GPU rotating and scaling that
  // one image. (Its glow is part of that image too — see the SVG filter
  // below — rather than a CSS filter, which gets recomputed each frame.)
  const maxSpan = Math.max(window.innerWidth, window.innerHeight) * STAR_MAX_SPAN

  const vars = {
    '--egg-fade': `${FADE_TO_BLACK}ms`,
    '--egg-intro-stars-out': `${INTRO_STARS_OUT}s`,
    '--egg-star-size': `${Math.round(maxSpan * SVG_PADDING)}px`,
    '--egg-star-start': (STAR_START_PX / maxSpan).toFixed(4),
    '--egg-star-mid': (STAR_MID_PX / maxSpan).toFixed(4),
    '--egg-star-slow': `${SLOW_LEG}s`,
    '--egg-star-fast': `${FAST_LEG}s`,
    '--egg-spin-slow-end': `${SLOW_END_DEG}deg`,
    '--egg-spin-fast-end': `${FAST_END_DEG}deg`,
    '--egg-spin-burst': `${360 / BURST_SPEED}s`,
    '--egg-explode': `${EXPLODE_DURATION}ms`,
    '--egg-theme-switch': `${THEME_SWITCH_AT}ms`,
  } as CSSProperties

  return createPortal(
    <div className={`egg-overlay egg-overlay--${phase}`} style={vars} aria-hidden="true">
      <div className="egg-void" />
      {phase === 'ready' && (
        <div className="egg-intro-stars">
          <ShootingStars intro />
        </div>
      )}
      {phase === 'ready' &&
        CAPTIONS.map((caption) => (
          <p
            key={caption.text}
            className="egg-caption"
            style={
              {
                '--egg-caption-in': `${caption.in}s`,
                '--egg-caption-out': `${caption.out}s`,
              } as CSSProperties
            }
          >
            {caption.text}
          </p>
        ))}
      {hasStar && (
        <div className="egg-star">
          <div ref={pulseRef} className="egg-star-pulse">
            <div className="egg-star-halo" />
            <div className="egg-star-spin">
              <svg className="egg-star-shape" viewBox="-40 -40 180 180">
                <defs>
                  {/* Tight-to-wide white bloom, layered under the star. */}
                  <filter id="egg-star-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="tight" />
                    <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="mid" />
                    <feGaussianBlur in="SourceGraphic" stdDeviation="13" result="wide" />
                    <feMerge>
                      <feMergeNode in="wide" />
                      <feMergeNode in="wide" />
                      <feMergeNode in="mid" />
                      <feMergeNode in="tight" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path d={STAR_PATH} filter="url(#egg-star-glow)" />
              </svg>
            </div>
          </div>
        </div>
      )}
      {phase === 'explode' && <div className="egg-flash" />}
    </div>,
    document.body,
  )
}
