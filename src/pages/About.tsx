import { useEffect, useRef, useState } from 'react'
import NavBar from '../components/NavBar'
import ContactBar from '../components/ContactBar'
import {
  ABOUT_HEADSHOT,
  ABOUT_POINTS,
  ABOUT_PROFILE,
  EMAIL,
  FULL_NAME,
  PERSONALITIES,
  SKILLS,
} from '../data/site'
import './About.css'

type SkillGroup = keyof typeof SKILLS

// How long each photo stays up before the gallery rotates to the next one.
const GALLERY_ROTATE_MS = 3500

function PersonalityGallery({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, GALLERY_ROTATE_MS)
    return () => window.clearInterval(id)
  }, [images.length])

  return (
    <div className="about-behind-gallery">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={alt}
          className={i === index ? 'about-behind-photo is-active' : 'about-behind-photo'}
        />
      ))}
    </div>
  )
}

// Always two digits: "01", "02", "03" (matching the reference design,
// rather than padding to ABOUT_POINTS.length's own digit count — which
// for a single-digit total like 3 would otherwise just be "1", "2", "3").
function pad(n: number) {
  return String(n).padStart(2, '0')
}

// Matches the roll keyframes' duration in About.css.
const ROLL_DURATION_MS = 450

export default function About() {
  const [group, setGroup] = useState<SkillGroup>('Languages')
  const [activePoint, setActivePoint] = useState(0)
  // The number the "exiting" digit should still show while it animates up
  // and out — null once nothing is transitioning. activePoint itself is
  // what the "entering" digit shows (see the effect below and the render).
  const [exitingPoint, setExitingPoint] = useState<number | null>(null)
  const prevActivePointRef = useRef(activePoint)
  const exitTimer = useRef<number | undefined>(undefined)
  const pointRefs = useRef<(HTMLDivElement | null)[]>([])

  // Whenever activePoint changes, keep the previous number around (in the
  // "exiting" slot) just long enough for it to animate up and out, while
  // the new one — rendered separately, keyed by activePoint — animates up
  // and in at the same time: a push, rather than the new number simply
  // appearing once the old one has already gone.
  useEffect(() => {
    if (prevActivePointRef.current !== activePoint) {
      setExitingPoint(prevActivePointRef.current)
      prevActivePointRef.current = activePoint
      window.clearTimeout(exitTimer.current)
      exitTimer.current = window.setTimeout(() => setExitingPoint(null), ROLL_DURATION_MS)
    }
    // Runs on every invocation (not just when a transition just started),
    // so a pending timer also gets cleared on unmount even if the last
    // render before that happened to be a no-op pass.
    return () => window.clearTimeout(exitTimer.current)
  }, [activePoint])

  // Tracks which of the three points is centered in the viewport, so the
  // "01/03" counter beside them stays in sync as the user scrolls.
  //
  // This used to be an IntersectionObserver watching a thin band across
  // the vertical center (rootMargin: '-45% 0px -45% 0px'), only acting on
  // entries becoming intersecting and ignoring the rest. That leaves
  // nothing to correct the count back on a reversal right at a
  // point-to-point boundary: if the callback's last actual signal was
  // "point 2 just entered," scrolling back up by only a little can undo
  // that crossing before the browser gets around to reporting point 1
  // re-intersecting — IntersectionObserver callbacks aren't guaranteed to
  // fire for every scroll position, only "as soon as possible" — leaving
  // the count stuck on 2 until it re-syncs much later, if ever, from that
  // small back-and-forth. Recomputing directly from live geometry on every
  // scroll frame has no such gap: whichever point is actually closest to
  // center right now is always knowable synchronously, independent of
  // direction or how the last crossing happened to be reported.
  useEffect(() => {
    const elements = pointRefs.current.filter((el): el is HTMLDivElement => el !== null)
    if (elements.length === 0) return

    let raf = 0
    const updateActive = () => {
      raf = 0
      const viewportCenter = window.innerHeight / 2
      let closest = 0
      let closestDist = Infinity
      elements.forEach((el, i) => {
        const rect = el.getBoundingClientRect()
        const dist = Math.abs(rect.top + rect.height / 2 - viewportCenter)
        if (dist < closestDist) {
          closestDist = dist
          closest = i
        }
      })
      setActivePoint((prev) => (prev === closest ? prev : closest))
    }

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(updateActive)
    }

    updateActive()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <NavBar />
      <ContactBar />

      <section className="about about--intro">
        <header className="about-head">
          <p className="about-eyebrow">About</p>
          <h1 className="about-title">Hi, I’m Ivan</h1>
        </header>

        <div className="about-body">
          <div className="about-photo">
            <img src={ABOUT_HEADSHOT} alt={FULL_NAME} />
          </div>

          <div className="about-profile">
            <h2 className="about-subtitle">Profile</h2>
            <p className="about-desc">{ABOUT_PROFILE}</p>

            <dl className="about-fields">
              <div className="about-field">
                <dt>Full Name:</dt>
                <dd>{FULL_NAME}</dd>
              </div>
              <div className="about-field">
                <dt>Email:</dt>
                <dd>
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="about-skills">
          <div className="about-skills-tabs" role="tablist" aria-label="Skills">
            {(Object.keys(SKILLS) as SkillGroup[]).map((name) => (
              <button
                key={name}
                type="button"
                role="tab"
                aria-selected={group === name}
                className={
                  group === name
                    ? 'about-skills-tab is-active'
                    : 'about-skills-tab'
                }
                onClick={() => setGroup(name)}
              >
                {name}
              </button>
            ))}
          </div>

          <ul className="about-skills-list" key={group}>
            {SKILLS[group].map((skill) => (
              <li key={skill} className="about-skill">
                {skill}
              </li>
            ))}
          </ul>
        </div>

        <div className="about-points">
          <div className="about-points-track">
            <div className="about-points-counter" aria-hidden="true">
              <span className="about-points-current-mask">
                {exitingPoint !== null && (
                  <span
                    className="about-points-current is-exiting"
                    key={`exit-${exitingPoint}`}
                  >
                    {pad(exitingPoint + 1)}
                  </span>
                )}
                <span className="about-points-current is-entering" key={`enter-${activePoint}`}>
                  {pad(activePoint + 1)}
                </span>
              </span>
              <span className="about-points-total">/{pad(ABOUT_POINTS.length)}</span>
            </div>

            <div className="about-points-list">
              {ABOUT_POINTS.map((point, i) => (
                <div
                  key={point.title}
                  className="about-point"
                  ref={(el) => {
                    pointRefs.current[i] = el
                  }}
                >
                  <span className="about-point-index" aria-hidden="true">
                    {pad(i + 1)}/{pad(ABOUT_POINTS.length)}
                  </span>
                  <h3 className="about-point-title">{point.title}</h3>
                  <p className="about-point-desc">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="about-behind">
          <h2 className="about-behind-title">Behind the scenes...</h2>
          <div className="about-behind-grid">
            {PERSONALITIES.map((p) => (
              <div key={p.title} className="about-behind-card">
                <h3 className="about-behind-card-title">{p.title}</h3>
                <p className="about-behind-card-desc">{p.description}</p>
                <PersonalityGallery images={p.images} alt={p.title} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
