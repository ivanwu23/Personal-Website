import { useEffect, useState } from 'react'
import { useEasterEgg } from '../easter-egg/EasterEggContext'
import './ShootingStars.css'

type Star = {
  id: string
  /** Starting position, as % of the section box. */
  top: number
  left: number
  /** Travel angle below horizontal, in degrees. */
  angle: number
  /** Flight time in milliseconds. */
  duration: number
  /** Easter egg only (see Mode below); null = the usual gray streak. */
  variant: 'red' | 'white' | null
  /** How strong this particular star's glow/opacity is, so some read
   *  brighter than others — only meaningful alongside `variant`. */
  brightness: number
  /** Size multiplier — only meaningful alongside `variant`. Most land
   *  near 1; occasionally one is much bigger (see makeStar). */
  sizeScale: number
}

// How the stars look and how often they fly:
// normal  the usual gray streaks every few seconds
// party   the easter egg's party mode (see src/easter-egg/): a
//         near-constant shower of fast red/white 4-point stars
// intro   a few red/white stars crossing the easter egg's black screen
//         before its captions
type Mode = {
  minGap: number
  maxGap: number
  /** Delay before the first streak. */
  firstDelay: () => number
  isEgg: boolean
  fast: boolean
}

// A fresh gap is picked after each spawn.
const MODES = {
  // Roughly one or two streaks every 5 seconds.
  normal: {
    minGap: 1800,
    maxGap: 3800,
    firstDelay: () => 600 + Math.random() * 1600,
    isEgg: false,
    fast: false,
  },
  // Kicks off right away, so the shower is already going as the burst
  // clears.
  party: { minGap: 35, maxGap: 100, firstDelay: () => 0, isEgg: true, fast: true },
  intro: {
    minGap: 1000,
    maxGap: 2400,
    firstDelay: () => 400,
    isEgg: true,
    fast: false,
  },
} satisfies Record<string, Mode>

function makeStar(mode: Mode): Star {
  return {
    id: crypto.randomUUID(),
    top: -8 + Math.random() * 32,
    left: -8 + Math.random() * 30,
    angle: 12 + Math.random() * 6,
    // A wide spread (flight time is inverse to on-screen speed), so a
    // given batch clearly mixes somewhat-slow streaks with fast ones
    // rather than all crossing at roughly the same pace.
    duration: mode.fast ? 350 + Math.random() * 850 : 700 + Math.random() * 1300,
    variant: mode.isEgg ? (Math.random() < 0.5 ? 'red' : 'white') : null,
    // A wide-ish range so the dimmest and brightest in a shower are
    // clearly different, without any going fully dark.
    brightness: mode.isEgg ? 0.55 + Math.random() * 0.45 : 1,
    // Squared so it's weighted toward 1 (most stars roughly normal
    // size) with only an occasional one landing up near 2x — "some"
    // larger, not the whole shower.
    sizeScale: mode.isEgg ? 1 + Math.random() ** 2 : 1,
  }
}

export default function ShootingStars({ intro = false }: { intro?: boolean }) {
  const [stars, setStars] = useState<Star[]>([])
  const isParty = useEasterEgg().isDark
  const modeName = intro ? 'intro' : isParty ? 'party' : 'normal'

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const mode: Mode = MODES[modeName]
    let timeoutId = 0
    function spawn() {
      setStars((prev) => [...prev, makeStar(mode)])
      timeoutId = window.setTimeout(spawn, mode.minGap + Math.random() * (mode.maxGap - mode.minGap))
    }
    function start() {
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(spawn, mode.firstDelay())
    }

    // In a background tab, CSS animations don't run so onAnimationEnd never
    // fires, while throttled timers keep queuing stars. Both add up and then
    // stampede on return. Stop spawning and drop the backlog while hidden.
    function handleVisibility() {
      if (document.hidden) {
        window.clearTimeout(timeoutId)
        setStars([])
      } else {
        start()
      }
    }

    if (!document.hidden) start()
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.clearTimeout(timeoutId)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [modeName])

  function removeStar(id: string) {
    setStars((prev) => prev.filter((star) => star.id !== id))
  }

  return (
    <div className="shooting-stars" aria-hidden="true">
      {stars.map((star) => (
        <span
          key={star.id}
          className={
            star.variant === null
              ? 'shooting-star'
              : `shooting-star shooting-star--egg shooting-star--${star.variant}`
          }
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            animationDuration: `${star.duration}ms`,
            ['--angle' as string]: `${star.angle}deg`,
            ...(star.variant !== null && {
              ['--brightness' as string]: star.brightness,
              ['--star-scale' as string]: star.sizeScale,
            }),
          }}
          onAnimationEnd={() => removeStar(star.id)}
        />
      ))}
    </div>
  )
}
