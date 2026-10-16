import { createContext, useContext } from 'react'

// Holding the right-hand star on Home for a few seconds plays a short
// cinematic (blackout, captions, spinning star, burst) and drops the
// whole site into a dark, rainbow "party" mode with music. This is the
// state of that sequence — see EasterEggProvider.tsx for the timeline.
//
// idle     normal site
// fade     the site fades to black
// ready    the song starts; a few shooting stars, then the captions
// void     still black, the star spinning up through the song's build
// explode  the burst; the site turns dark on the beat drop, overlay fades
// party    dark site, music, soundbar — until exit() or a reload
export type EasterEggPhase = 'idle' | 'fade' | 'ready' | 'void' | 'explode' | 'party'

export type EasterEggState = {
  phase: EasterEggPhase
  /** Whether the dark theme is applied — flips partway through `explode`. */
  isDark: boolean
  /** Feeds the soundbar; null until the music starts or if it failed to load. */
  analyser: AnalyserNode | null
  trigger: () => void
  exit: () => void
}

export const EasterEggContext = createContext<EasterEggState>({
  phase: 'idle',
  isDark: false,
  analyser: null,
  trigger: () => {},
  exit: () => {},
})

export function useEasterEgg(): EasterEggState {
  return useContext(EasterEggContext)
}
