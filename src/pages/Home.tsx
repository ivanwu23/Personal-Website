import { useEffect, useRef, useState } from 'react'
import NavBar from '../components/NavBar'
import ContactBar from '../components/ContactBar'
import ShootingStars from '../components/ShootingStars'
import LoadingScreen from '../components/LoadingScreen'
import { NAME, TAGLINE } from '../data/site'
import {
  INTRO_DURATION,
  LOADING_DURATION,
  hasShownLoadingScreen,
  markLoadingScreenShown,
} from '../data/intro'
import { useEasterEgg } from '../easter-egg/EasterEggContext'
import { useHoldTrigger } from '../easter-egg/useHoldTrigger'
import { useBeatScale } from '../easter-egg/useBeatScale'
import { unlockAudio } from '../easter-egg/audio'
import { HOLD_DURATION } from '../easter-egg/timeline'
import './Home.css'

// How much the name and the stars swell with the bass in the easter
// egg's party mode — kept slight; the stars, being small, by more.
const NAME_BEAT_SCALE = 0.04
const STAR_BEAT_SCALE = 0.12

// How far the stars drift from their resting spot, in pixels. Kept small
// and paired with a base position near the screen edges so their travel
// never reaches in over the name.
const STAR_DRIFT_X = 22
const STAR_DRIFT_Y = 16

export default function Home() {
  const starLeftRef = useRef<HTMLDivElement>(null)
  const starRightRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const [loading, setLoading] = useState(() => !hasShownLoadingScreen())

  // The easter egg: hold the right-hand star (see src/easter-egg/).
  // Deliberately gives no feedback until the hold completes.
  const { trigger, isDark, analyser } = useEasterEgg()
  const holdHandlers = useHoldTrigger({
    duration: HOLD_DURATION,
    onPressStart: unlockAudio,
    onHold: trigger,
  })

  // In party mode, the name and both stars pulse with the music.
  useBeatScale(
    [
      { ref: nameRef, strength: NAME_BEAT_SCALE },
      { ref: starLeftRef, strength: STAR_BEAT_SCALE },
      { ref: starRightRef, strength: STAR_BEAT_SCALE },
    ],
    isDark ? analyser : null,
  )

  useEffect(() => {
    if (hasShownLoadingScreen()) return
    const timer = window.setTimeout(() => {
      markLoadingScreenShown()
      setLoading(false)
    }, LOADING_DURATION)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      // Both axes, each -1 (top/left) to 1 (bottom/right), then
      // inverted — the stars drift away from wherever the cursor is,
      // on a full 2D path rather than a fixed horizontal line.
      const normalizedX = (event.clientX / window.innerWidth) * 2 - 1
      const normalizedY = (event.clientY / window.innerHeight) * 2 - 1
      const offsetX = -normalizedX * STAR_DRIFT_X
      const offsetY = -normalizedY * STAR_DRIFT_Y
      const transform = `translate(${offsetX.toFixed(2)}px, ${offsetY.toFixed(2)}px)`
      if (starLeftRef.current) starLeftRef.current.style.transform = transform
      if (starRightRef.current) starRightRef.current.style.transform = transform
    }

    window.addEventListener('pointermove', handlePointerMove)
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [])

  // The loading screen itself is position: fixed and takes up no space,
  // so it's wrapped in the same .home section (min-height: 100svh) the
  // real landing page uses. Without that, Home is 0px tall while loading
  // on "/", which pulls About up into the viewport — Preview's
  // RevealSection then sees it as "already in view" and reveals it
  // behind the loading screen, so it shows fully loaded as the loader
  // fades, before Home mounts and pushes it back down.
  if (loading) {
    return (
      <section className="home">
        <LoadingScreen />
      </section>
    )
  }

  return (
    <section className="home home--intro">
      <div className="home-mountain" aria-hidden="true">
        <img src="/mountain.png" alt="" className="home-mountain-img" />
      </div>

      <ShootingStars />

      <div ref={starLeftRef} className="home-star home-star-left" aria-hidden="true">
        <div className="home-star-icon" />
      </div>
      <div
        ref={starRightRef}
        className="home-star home-star-right"
        aria-hidden="true"
        {...holdHandlers}
      >
        <div className="home-star-icon" />
      </div>

      <div className="home-hero">
        <h1 ref={nameRef} className="home-name">{NAME}</h1>
        <p className="home-tagline">{TAGLINE}</p>
      </div>

      <NavBar delay={INTRO_DURATION} />
      <ContactBar delay={INTRO_DURATION} />
    </section>
  )
}
