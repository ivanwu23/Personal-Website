import { useEffect, useRef, useState } from 'react'
import NavBar from '../components/NavBar'
import ContactBar from '../components/ContactBar'
import ShootingStars from '../components/ShootingStars'
import LoadingScreen from '../components/LoadingScreen'
import { NAME, TAGLINE } from '../data/site'
import './Home.css'

// How long the loading screen stays up before the landing page shows.
// Matches the loading-screen fade-out (delay 1.4s + 0.4s) in LoadingScreen.css.
const LOADING_DURATION = 1800

// The loading screen runs once per browser tab session, not once per Home
// mount — sessionStorage (rather than a plain module-level flag) is what
// makes that distinction hold up: a module-level flag resets on any full
// page reload, even a reload on a completely different page like /about,
// which has no memory of Home's loading screen already having played
// earlier in the session — so navigating to Home afterward looked like
// the first time all over again. sessionStorage survives that reload,
// while still resetting for a genuinely new tab/visit. The hero entrance
// animation below it is not similarly gated: it replays every time Home
// is (re)mounted, same as every other page's entrance animation.
const LOADING_SEEN_KEY = 'home-loading-seen'

function hasShownLoadingScreen(): boolean {
  try {
    return sessionStorage.getItem(LOADING_SEEN_KEY) === '1'
  } catch {
    return false
  }
}

function markLoadingScreenShown() {
  try {
    sessionStorage.setItem(LOADING_SEEN_KEY, '1')
  } catch {
    // Ignore — e.g. storage disabled/restricted. Worst case, the loading
    // screen plays again on the next full reload.
  }
}

// How long the mountain/name entrance takes (seconds) — the nav and
// contact buttons wait this long before they start animating in.
const INTRO_DURATION = 1.05

// How far the stars drift from their resting spot, in pixels. Kept small
// and paired with a base position near the screen edges so their travel
// never reaches in over the name.
const STAR_DRIFT_X = 22
const STAR_DRIFT_Y = 16

export default function Home() {
  const starLeftRef = useRef<HTMLDivElement>(null)
  const starRightRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(() => !hasShownLoadingScreen())

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

  if (loading) return <LoadingScreen />

  return (
    <section className="home home--intro">
      <div className="home-mountain" aria-hidden="true">
        <img src="/mountain.png" alt="" className="home-mountain-img" />
      </div>

      <ShootingStars />

      <div ref={starLeftRef} className="home-star home-star-left" aria-hidden="true">
        <div className="home-star-icon" />
      </div>
      <div ref={starRightRef} className="home-star home-star-right" aria-hidden="true">
        <div className="home-star-icon" />
      </div>

      <div className="home-hero">
        <h1 className="home-name">{NAME}</h1>
        <p className="home-tagline">{TAGLINE}</p>
      </div>

      <NavBar delay={INTRO_DURATION} />
      <ContactBar delay={INTRO_DURATION} />
    </section>
  )
}
