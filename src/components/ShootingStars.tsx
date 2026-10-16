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
  /** Rainbow tint (see Mode below); null = the usual gray. */
  hue: number | null
}

// How the stars look and how often they fly:
// normal  the usual gray streaks every few seconds
// party   the easter egg's party mode (see src/easter-egg/): a
//         near-constant shower of fast rainbow streaks
// intro   a few rainbow streaks crossing the easter egg's black screen
//         before its captions
type Mode = {
  minGap: number
  maxGap: number
  /** Delay before the first streak. */
  firstDelay: () => number
  rainbow: boolean
  fast: boolean
}

// A fresh gap is picked after each spawn.
const MODES = {
  // Roughly one or two streaks every 5 seconds.
  normal: {
    minGap: 1800,
    maxGap: 3800,
    firstDelay: () => 600 + Math.random() * 1600,
    rainbow: false,
    fast: false,
  },
  // Kicks off right away, so the shower is already going as the burst
  // clears.
  party: { minGap: 35, maxGap: 100, firstDelay: () => 0, rainbow: true, fast: true },
  intro: {
    minGap: 1000,
    maxGap: 2400,
    firstDelay: () => 400,
    rainbow: true,
    fast: false,
  },
} satisfies Record<string, Mode>

function makeStar(mode: Mode): Star {
  return {
    id: crypto.randomUUID(),
    top: -8 + Math.random() * 32,
    left: -8 + Math.random() * 30,
    angle: 12 + Math.random() * 6,
    duration: mode.fast ? 500 + Math.random() * 350 : 900 + Math.random() * 600,
    hue: mode.rainbow ? Math.floor(Math.random() * 360) : null,
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
          className={star.hue === null ? 'shooting-star' : 'shooting-star shooting-star--rainbow'}
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            animationDuration: `${star.duration}ms`,
            ['--angle' as string]: `${star.angle}deg`,
            ...(star.hue !== null && { ['--hue' as string]: star.hue }),
          }}
          onAnimationEnd={() => removeStar(star.id)}
        />
      ))}
    </div>
  )
}
