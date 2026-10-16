// All of the easter egg's sound. The boom is synthesized with the Web
// Audio API (no file); the background music is
// a real track, routed through an AnalyserNode so the soundbar can read
// its frequencies live.
//
// Browsers only allow audio to start from inside a user gesture.
// unlockAudio() is called on the star's pointerdown — the start of the
// hold — which is what lets everything here play several seconds later,
// once the hold completes, without being blocked.

export const MUSIC_SRC = '/easter-egg/crystallized.mp3'

const MUSIC_VOLUME = 0.8

let ctx: AudioContext | null = null
let master: DynamicsCompressorNode | null = null
let music: HTMLAudioElement | null = null
let musicGain: GainNode | null = null
let analyser: AnalyserNode | null = null
let musicFailed = false

function getContext(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext()
    // The synthesized boom peaks loud — a compressor in front of the
    // speakers keeps it from clipping.
    master = ctx.createDynamicsCompressor()
    master.connect(ctx.destination)
  }
  return ctx
}

export function unlockAudio() {
  try {
    const c = getContext()
    if (c.state === 'suspended') void c.resume()
  } catch {
    // No Web Audio — the sequence still plays, just silently.
    return
  }

  if (!music) {
    music = new Audio(MUSIC_SRC)
    music.preload = 'auto'
    music.loop = true
    music.addEventListener('error', () => {
      musicFailed = true
      console.warn(`Easter egg music failed to load (${MUSIC_SRC}) — the soundbar will idle instead.`)
    })
    // iOS Safari only lets a media element play later if it was started
    // inside a gesture at least once — a muted play/pause here does that.
    music.muted = true
    music
      .play()
      .then(() => {
        music?.pause()
        if (music) {
          music.currentTime = 0
          music.muted = false
        }
      })
      .catch(() => {
        if (music) music.muted = false
      })
  }
}

function noiseBuffer(c: AudioContext, seconds: number): AudioBuffer {
  const buffer = c.createBuffer(1, Math.ceil(c.sampleRate * seconds), c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return buffer
}

/** A deep thump with a burst of noise trailing off behind it. */
export function playBoom() {
  if (!ctx || !master) return
  const c = ctx
  const now = c.currentTime

  const kick = c.createOscillator()
  kick.frequency.setValueAtTime(120, now)
  kick.frequency.exponentialRampToValueAtTime(32, now + 0.6)
  const kickGain = c.createGain()
  kickGain.gain.setValueAtTime(1, now)
  kickGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2)
  kick.connect(kickGain).connect(master)
  kick.start(now)
  kick.stop(now + 1.2)

  const noise = c.createBufferSource()
  noise.buffer = noiseBuffer(c, 1.6)
  const low = c.createBiquadFilter()
  low.type = 'lowpass'
  low.frequency.setValueAtTime(4000, now)
  low.frequency.exponentialRampToValueAtTime(150, now + 1.2)
  const noiseGain = c.createGain()
  noiseGain.gain.setValueAtTime(0.8, now)
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.6)
  noise.connect(low).connect(noiseGain).connect(master)
  noise.start(now)
}

/** Starts the looping track `startAt` seconds in and returns its
 *  analyser, or null if there's no audio or the file couldn't be loaded. */
export function startMusic(startAt = 0): AnalyserNode | null {
  if (!ctx || !music || musicFailed) return null
  const c = ctx

  if (!analyser) {
    // A media element can only ever be wired into one source node, so
    // this graph is built once and reused across exit/re-trigger.
    const source = c.createMediaElementSource(music)
    analyser = c.createAnalyser()
    analyser.fftSize = 256
    // Low smoothing so the soundbar snaps to each hit instead of
    // gliding between them.
    analyser.smoothingTimeConstant = 0.5
    musicGain = c.createGain()
    source.connect(analyser).connect(musicGain).connect(c.destination)
  }

  // Near-instant fade-in, just enough to avoid a click.
  const now = c.currentTime
  musicGain!.gain.cancelScheduledValues(now)
  musicGain!.gain.setValueAtTime(0, now)
  musicGain!.gain.linearRampToValueAtTime(MUSIC_VOLUME, now + 0.03)

  music.currentTime = startAt
  music.play().catch((err) => {
    console.warn('Easter egg music could not start:', err)
  })
  return analyser
}

export function isMusicPlaying(): boolean {
  return !!music && !music.paused && !musicFailed
}

/** Where the track is right now, in seconds — or null if it isn't
 *  playing (no audio, failed to load). The easter egg's build-up is
 *  scheduled against this rather than a timer, so a slow start to
 *  playback can't knock the burst off the beat drop. */
export function getMusicTime(): number | null {
  return isMusicPlaying() ? music!.currentTime : null
}

/** Quick fade, then pause and rewind. */
export function stopMusic() {
  if (!ctx || !music || !musicGain) {
    music?.pause()
    return
  }
  const now = ctx.currentTime
  musicGain.gain.cancelScheduledValues(now)
  musicGain.gain.setValueAtTime(musicGain.gain.value, now)
  musicGain.gain.linearRampToValueAtTime(0, now + 0.3)
  const el = music
  window.setTimeout(() => {
    el.pause()
    el.currentTime = 0
  }, 320)
}
