import { useEffect, useRef, useState } from 'react'
import type { ComponentType } from 'react'
import { NAV_LINKS } from '../data/site'
import Home from './Home'
import About from './About'
import Resume from './Resume'
import Projects from './Projects'
import Contact from './Contact'
import Footer from '../components/Footer'
import NavBar from '../components/NavBar'
import ContactBar from '../components/ContactBar'
import { SharedBarsContext } from '../components/SharedBars'
import { INTRO_DURATION, LOADING_DURATION, hasShownLoadingScreen } from '../data/intro'
import './Preview.css'

// The site's single real page ("/"): every page stacked on one
// scrollable view instead of separate routes you navigate between. Each
// is rendered exactly as it normally is, so nothing about how they work
// changed, there's just several of them down the page instead of one.
// The exceptions are the Footer, NavBar and ContactBar, which are
// deliberately not repeated per page here (see bottom of this file):
// on a single continuous scroll the footer just reads as the same one
// popping up four times rather than "the end of the page", and the two
// fixed bars would pile up on the same spot (see SharedBars.ts).
//
// The ids here are what NavBar scroll-targets — see the `isSinglePage`
// branch in NavBar.tsx — and must match NAV_LINKS' `to` paths (minus
// the leading slash, "/" -> "home") for that lookup to find them.
function sectionId(to: string): string {
  return to === '/' ? 'home' : to.slice(1)
}

// Each page's entrance animations (the hero sliding in, resume bubbles
// revealing, etc.) are written to play on mount — correct for what each
// one used to be, a standalone route you'd navigate to one at a time.
// Here all five mount together at the initial page load, so by the time
// you've scrolled down to one, its animation already played off-screen
// before you could see it.
//
// This remounts a section's page component (via a `key` bump, which makes
// React tear it down and build it fresh) the first time it's actually
// scrolled into view, so its mount animations fire for real right as you
// reach it — same thing visiting it as its own route used to do, just
// re-triggered by scroll position instead of by navigating. Until that
// happens it stays hidden — not just un-animated, but actually hidden —
// since otherwise the already-mounted-and-settled page would sit there
// fully visible (its mount animation already played, off-screen) until
// the scroll crosses the threshold, then visibly reset and replay —
// looking like it "was already loaded" and only then decided to animate.
//
// `skipReveal` is for Home only: it's visible immediately at mount, same
// as it always was at "/", so it should just render normally with its
// one natural play and never go through any of this.
//
// Telling "already in view at mount" (e.g. a reload landing mid-scroll,
// which should just show instantly, no replay) apart from "scrolled into
// view later" (which should replay) used to be done by hand — reading
// the section's position with getBoundingClientRect and comparing it to
// window.innerHeight. That was fighting the browser on its own turf: the
// exact boundary it was testing against is also exactly where sections
// sit (Home is min-height: 100svh, so the next one's top lands right at
// window.innerHeight), and small, real discrepancies between svh and
// innerHeight — which shift depending on the exact rendered height of
// whatever's inside each page, among other things — kept landing right
// on the wrong side of it. Rather than continuing to patch that with
// bigger tolerance margins, this now just asks IntersectionObserver
// directly, since answering exactly that question is what it's for: an
// observer's very first callback always reports the current state
// immediately on `.observe()`, so if the first callback already reports
// intersecting, that's a reload-style "was already in view" and it just
// reveals as-is; a later one reporting intersecting is a real
// scroll-triggered entry, and that's what replays it.
function RevealSection({
  id,
  Component,
  skipReveal,
}: {
  id: string
  Component: ComponentType
  skipReveal?: boolean
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [replayKey, setReplayKey] = useState(0)
  const [isRevealed, setIsRevealed] = useState(() => !!skipReveal)

  useEffect(() => {
    if (skipReveal) return
    const el = wrapRef.current
    if (!el) return

    let isFirstCallback = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true)
          if (!isFirstCallback) {
            setReplayKey((k) => k + 1)
          }
          observer.disconnect()
        }
        isFirstCallback = false
      },
      // The -1px bottom margin keeps a section sitting exactly at the
      // fold (About's top lands right at the bottom of the 100svh Home)
      // from counting as in view: IntersectionObserver treats a
      // zero-area, edge-touching target as intersecting, so without it
      // the first callback would reveal About as-is at load instead of
      // replaying it once it's actually scrolled into view.
      { threshold: 0, rootMargin: '0px 0px -1px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [skipReveal])

  return (
    <div
      ref={wrapRef}
      id={id}
      className={isRevealed ? 'preview-section' : 'preview-section preview-section--hidden'}
    >
      <Component key={replayKey} />
    </div>
  )
}

export default function Preview() {
  const [home, about, resume, projects, contact] = NAV_LINKS.map((link) => sectionId(link.to))

  // Same timing Home's own bars use: come in once its intro finishes,
  // plus the loading screen's length if that's still going to play
  // first. Read once at mount, before Home's loading timer marks it seen.
  const [barDelay] = useState(
    () => (hasShownLoadingScreen() ? 0 : LOADING_DURATION / 1000) + INTRO_DURATION,
  )

  return (
    <div className="preview-stack">
      <SharedBarsContext.Provider value={true}>
        <RevealSection id={home} Component={Home} skipReveal />
        <RevealSection id={about} Component={About} />
        <RevealSection id={resume} Component={Resume} />
        <RevealSection id={projects} Component={Projects} />
        <RevealSection id={contact} Component={Contact} />
      </SharedBarsContext.Provider>

      {/* One nav bar and contact bar for the whole stack, not one per page. */}
      <NavBar delay={barDelay} />
      <ContactBar delay={barDelay} />

      {/* One footer for the whole stack, not one per page. */}
      <Footer />
    </div>
  )
}
