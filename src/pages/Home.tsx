import { useEffect, useRef } from 'react'
import NavBar from '../components/NavBar'
import ContactBar from '../components/ContactBar'
import Sparkle from '../components/Sparkle'
import { NAME, TAGLINE } from '../data/site'
import './Home.css'

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

  return (
    <section className="home">
      <div className="home-mountain" aria-hidden="true">
        <img src="/mountain.png" alt="" className="home-mountain-img" />
      </div>

      <div ref={starLeftRef} className="home-star home-star-left" aria-hidden="true">
        <Sparkle />
      </div>
      <div ref={starRightRef} className="home-star home-star-right" aria-hidden="true">
        <Sparkle />
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
