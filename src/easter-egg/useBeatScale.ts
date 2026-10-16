import { useEffect } from 'react'
import type { RefObject } from 'react'

export type BeatTarget = {
  ref: RefObject<HTMLElement | null>
  /** How much bigger it gets on a full-strength hit — 0.05 = 5%. */
  strength: number
}

// The lowest few analyser bins (roughly 0–700Hz, where the kick lives).
const BASS_BINS = [1, 2, 3, 4]
// A hit is the bass jumping above its own recent average, not above a
// fixed level — after the drop this song's bass barely dips, so a fixed
// threshold left everything stuck enlarged instead of pulsing. AVERAGING
// is how slowly that average follows (closer to 1 = slower).
const AVERAGING = 0.95
// How far above the average (of 255) counts as a full-strength hit.
const HIT_RANGE = 10
// Per-frame falloff after a hit: jumps up instantly, eases back down.
const RELEASE = 0.85

// Swells elements slightly with the music's bass, while `analyser` is
// non-null. Uses the CSS `scale` property — separate from `transform` —
// so it layers on top of whatever already positions or moves them (the
// Home stars' cursor drift, for one). Written straight to the elements
// each frame rather than through React state.
export function useBeatScale(targets: BeatTarget[], analyser: AnalyserNode | null) {
  useEffect(() => {
    if (!analyser) return
    const data = new Uint8Array(analyser.frequencyBinCount)
    let average = 0
    let level = 0
    let frame = 0

    function tick() {
      analyser!.getByteFrequencyData(data)
      let sum = 0
      for (const bin of BASS_BINS) sum += data[bin]
      const bass = sum / BASS_BINS.length
      const hit = Math.min(1, Math.max(0, (bass - average) / HIT_RANGE))
      average = average * AVERAGING + bass * (1 - AVERAGING)
      level = Math.max(hit, level * RELEASE)
      for (const { ref, strength } of targets) {
        if (ref.current) ref.current.style.scale = (1 + strength * level).toFixed(4)
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      for (const { ref } of targets) {
        if (ref.current) ref.current.style.scale = ''
      }
    }
    // `targets` is a fresh array each render; the refs inside it are
    // stable, so only the analyser should restart this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analyser])
}
