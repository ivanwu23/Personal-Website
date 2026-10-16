import { FULL_NAME } from '../data/site'

// Every timing in the easter egg in one place — the provider's schedule
// and the overlay's CSS keyframes (passed in as custom properties) all
// read from here so they stay in sync if any is tuned.
//
// After the fade to black, everything is timed against the song itself
// (crystallized.mp3), which starts from the top once the screen is
// black: the whole build-up — a few shooting stars, the captions, then
// the star spinning up — runs over the song's intro so the burst and the
// dark/rainbow reveal land exactly on its beat drop.

/** How long the right-hand Home star has to be held to set it off (ms). */
export const HOLD_DURATION = 5000

/** The site fading to black once the hold completes (ms). */
export const FADE_TO_BLACK = 1500

// ---- Song time, in seconds from the start of the track ----

/** A few rainbow shooting stars cross the black screen until about here,
 *  clearing out ahead of the captions. */
export const INTRO_STARS_OUT = 18.5

export type Caption = {
  text: string
  /** When it starts fading in... */
  in: number
  /** ...and when it starts fading out. */
  out: number
}

/** Shown one after another, in the same spot. Each fades out just ahead
 *  of the next one fading in. The first sits on its own out among the
 *  intro's shooting stars; the rest run back to back after them. */
export const CAPTIONS: Caption[] = [
  { text: 'Camellia - Crystallized', in: 7, out: 12 },
  { text: 'Are you ready..', in: 20, out: 22.3 },
  { text: 'To turn the lights off?', in: 22.8, out: 25 },
  { text: `Made by: ${FULL_NAME}`, in: 25.5, out: 28 },
]

/** The star appears and starts its slow spin. */
export const STAR_IN = 31
/** It starts speeding up hard and growing. */
export const STAR_FAST_AT = 46

/** crystallized.mp3's beat drop — the moment the dark site is revealed. */
export const MUSIC_DROP_AT = 53

/** The burst, and the overlay fading out over the now-dark site (ms). */
export const EXPLODE_DURATION = 900
/** Into the burst, when the flash is at its brightest (ms) — the theme
 *  swaps under cover of it, so this is what lands on the drop. */
export const THEME_SWITCH_AT = 150

/** When the burst itself starts (song seconds): just early enough that
 *  the flash peaks — and the site turns dark — right on the drop. */
export const BURST_AT = MUSIC_DROP_AT - THEME_SWITCH_AT / 1000
