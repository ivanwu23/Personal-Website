import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { EasterEggContext } from './EasterEggContext'
import type { EasterEggPhase } from './EasterEggContext'
import { getMusicTime, playBoom, startMusic, stopMusic } from './audio'
import {
  BURST_AT,
  EXPLODE_DURATION,
  FADE_TO_BLACK,
  MUSIC_DROP_AT,
  STAR_IN,
} from './timeline'

type SongEvent = { at: number; run: () => void }

// Runs the easter egg's timeline (see EasterEggContext.ts for the phases
// and timeline.ts for the timings). Nothing here is persisted: a reload
// always comes back to the normal site — and browsers wouldn't let the
// music restart on its own after a reload anyway.
export default function EasterEggProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<EasterEggPhase>('idle')
  const [isDark, setIsDark] = useState(false)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  // Everything that has to be cancelled if the sequence is exited midway.
  const cleanupsRef = useRef<(() => void)[]>([])

  const clearTimeline = useCallback(() => {
    for (const cleanup of cleanupsRef.current) cleanup()
    cleanupsRef.current = []
  }, [])

  const trigger = useCallback(() => {
    if (phase !== 'idle') return
    const cleanups = cleanupsRef.current

    // The song's position drives the build-up from the blackout on, so
    // the burst lands on the beat drop even if playback starts a beat
    // late. If there's no music (failed to load, blocked), it falls back
    // to plain elapsed time on the same schedule.
    function startBuildUp() {
      setPhase('ready')
      setAnalyser(startMusic())
      const startedAt = performance.now()
      const songTime = () => getMusicTime() ?? (performance.now() - startedAt) / 1000

      const events: SongEvent[] = [
        { at: STAR_IN, run: () => setPhase('void') },
        { at: BURST_AT, run: () => setPhase('explode') },
        {
          at: MUSIC_DROP_AT,
          run: () => {
            setIsDark(true)
            playBoom()
          },
        },
        { at: BURST_AT + EXPLODE_DURATION / 1000, run: () => setPhase('party') },
      ]

      let next = 0
      let frame = 0
      function tick() {
        const t = songTime()
        while (next < events.length && t >= events[next].at) events[next++].run()
        if (next < events.length) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
      cleanups.push(() => cancelAnimationFrame(frame))
    }

    setPhase('fade')
    const timer = window.setTimeout(startBuildUp, FADE_TO_BLACK)
    cleanups.push(() => window.clearTimeout(timer))
  }, [phase])

  const exit = useCallback(() => {
    clearTimeline()
    stopMusic()
    setIsDark(false)
    setAnalyser(null)
    setPhase('idle')
  }, [clearTimeline])

  useEffect(() => clearTimeline, [clearTimeline])

  // The dark theme is plain CSS keyed off this attribute (see index.css).
  useEffect(() => {
    const root = document.documentElement
    if (isDark) root.dataset.theme = 'dark'
    else delete root.dataset.theme
  }, [isDark])

  const value = useMemo(
    () => ({ phase, isDark, analyser, trigger, exit }),
    [phase, isDark, analyser, trigger, exit],
  )

  return <EasterEggContext.Provider value={value}>{children}</EasterEggContext.Provider>
}
