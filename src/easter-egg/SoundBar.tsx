import { useEffect, useRef } from 'react'
import { useEasterEgg } from './EasterEggContext'
import { isMusicPlaying } from './audio'
import './SoundBar.css'

const BAR_COUNT = 64
// With fftSize 256 each of the 128 bins spans ~170Hz; past roughly bin
// 90 (~15kHz) a typical MP3 has almost nothing, so bars stop there.
const MAX_BIN = 90
// The resting height of a silent bar, in pixels — fixed regardless of
// how tall the strip's max height is (.soundbar in SoundBar.css).
const MIN_PX = 1.75
// Levels below this (of 255) count as silence. Most bins idle well above
// zero while music plays, so without a floor every bar hovers half-raised
// and the beats barely stand out; subtracting it and then curving the
// rest (CONTRAST) lets bars drop low between hits and spike on them.
const NOISE_FLOOR = 70
const CONTRAST = 1.8

// Bins are spread across the bars on a log scale — that's how pitch is
// heard, so the bass doesn't get squashed into the first two bars while
// the near-silent highs take up the other sixty.
const BAR_BINS = Array.from({ length: BAR_COUNT }, (_, i) => {
  const lo = Math.floor(MAX_BIN ** (i / BAR_COUNT))
  const hi = Math.max(lo + 1, Math.floor(MAX_BIN ** ((i + 1) / BAR_COUNT)))
  return [lo, hi] as const
})

// The rainbow strip along the top of the page in party mode, moving to
// the music. Each frame writes straight to the bars' transforms through
// refs instead of through React state, so it's not re-rendering 64
// elements sixty times a second. (requestAnimationFrame already stops on
// its own in a background tab.)
export default function SoundBar() {
  const { phase, isDark, analyser, exit } = useEasterEgg()
  const barsRef = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    if (!isDark) return
    const data = analyser ? new Uint8Array(analyser.frequencyBinCount) : null
    let frame = 0

    function tick(now: number) {
      // Bars scale down from the strip's full height, so the resting
      // height as a fraction of it. Read each frame since the max height
      // changes at the mobile breakpoint.
      const maxPx = barsRef.current[0]?.offsetHeight || 1
      const minScale = Math.min(1, MIN_PX / maxPx)
      const live = analyser && data && isMusicPlaying()
      if (live) analyser.getByteFrequencyData(data)

      for (let i = 0; i < BAR_COUNT; i++) {
        let level: number
        if (live) {
          const [lo, hi] = BAR_BINS[i]
          let peak = 0
          for (let b = lo; b < hi; b++) peak = Math.max(peak, data[b])
          level = Math.max(0, (peak - NOISE_FLOOR) / (255 - NOISE_FLOOR)) ** CONTRAST
        } else {
          // No music (missing file, still buffering): a gentle idle wave.
          level = 0.25 + 0.15 * Math.sin(now * 0.003 + i * 0.35)
        }
        const scale = minScale + (1 - minScale) * level
        const bar = barsRef.current[i]
        if (bar) bar.style.transform = `scaleY(${scale.toFixed(3)})`
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isDark, analyser])

  if (phase === 'idle') return null

  return (
    <>
      {isDark && (
        <div className="soundbar" aria-hidden="true">
          {Array.from({ length: BAR_COUNT }, (_, i) => (
            <span
              key={i}
              ref={(el) => {
                barsRef.current[i] = el
              }}
              className="soundbar-bar"
              style={{ color: `hsl(${(i / BAR_COUNT) * 360}, 95%, 62%)` }}
            />
          ))}
        </div>
      )}
      {/* Up through the whole ~45s build-up too, not just party mode —
          there should always be a way back out of a black screen. */}
      <button type="button" className="soundbar-exit" onClick={exit} aria-label="Exit party mode">
        ✕
      </button>
    </>
  )
}
