import { useEffect, useState } from 'react'
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
}

// Roughly one or two streaks every 5 seconds — a fresh gap is picked
// after each spawn.
const MIN_GAP = 1800
const MAX_GAP = 3800

function makeStar(): Star {
  return {
    id: crypto.randomUUID(),
    top: -8 + Math.random() * 32,
    left: -8 + Math.random() * 30,
    angle: 12 + Math.random() * 6,
    duration: 900 + Math.random() * 600,
  }
}

export default function ShootingStars() {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let timeoutId = 0
    function spawn() {
      setStars((prev) => [...prev, makeStar()])
      timeoutId = window.setTimeout(spawn, MIN_GAP + Math.random() * (MAX_GAP - MIN_GAP))
    }
    timeoutId = window.setTimeout(spawn, 600 + Math.random() * 1600)
    return () => window.clearTimeout(timeoutId)
  }, [])

  function removeStar(id: string) {
    setStars((prev) => prev.filter((star) => star.id !== id))
  }

  return (
    <div className="shooting-stars" aria-hidden="true">
      {stars.map((star) => (
        <span
          key={star.id}
          className="shooting-star"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            animationDuration: `${star.duration}ms`,
            ['--angle' as string]: `${star.angle}deg`,
          }}
          onAnimationEnd={() => removeStar(star.id)}
        />
      ))}
    </div>
  )
}
