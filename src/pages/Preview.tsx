import { useLayoutEffect, useRef, useState } from 'react'
import type { ComponentType } from 'react'
import { NAV_LINKS } from '../data/site'
import Home from './Home'
import About from './About'
import Resume from './Resume'
import Projects from './Projects'
import Contact from './Contact'
import Footer from '../components/Footer'
import './Preview.css'

// The site's single real page ("/"): every page stacked on one
// scrollable view instead of separate routes you navigate between. Each
// is rendered exactly as it normally is — own NavBar/ContactBar
// included — so nothing about how they work changed, there's just
// several of them down the page instead of one. Only the Footer is
// deliberately not repeated per page here (see bottom of this file)
// since on a single continuous scroll it just reads as the same footer
// popping up four times rather than "the end of the page".
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
// re-triggered by scroll position instead of by navigating.
//
// A section that isn't already in view at mount (i.e. every page but
// Home) starts hidden — not just un-animated, but actually hidden —
// until that first reveal, specifically so there's nothing to see there
// yet: without that, the already-mounted-and-settled page would be
// sitting there fully visible (its mount animation already played,
// off-screen, same as above) for however long it takes the scroll to
// cross the intersection threshold, then visibly reset and replay —
// looking like it "was already loaded" and only then decided to animate.
//
// Home is exempted from all of this — it's visible immediately at mount,
// same as it always was at "/", so it only ever gets that one natural
// play. Without this exemption, the mount-time intersection check below
// would still count as "entering view" and trigger an extra replay of
// its own; and even guarding against only that specific redundant first
// check (an earlier version of this did) wasn't enough — the *next*
// legitimate transition back into view, i.e. scrolling away and back,
// would still trigger a real replay, which is the "it plays again" bug
// that approach had.
//
// That "already in view at mount" check is deferred one frame (rather
// than reading it synchronously pre-paint) specifically so it isn't
// racing the browser's own scroll restoration on a reload: reading it
// immediately sometimes ran before that restoration had applied, so a
// section the visitor had actually reloaded already (partway) into —
// most commonly About, given how close it sits to Home — could get
// misjudged as not yet in view and get the hide-and-reveal treatment
// applied mid-restoration, which was throwing off exactly where the
// browser ultimately settled the scroll. One frame is enough for
// restoration to have landed, and is short enough that even a genuinely
// off-screen section being briefly un-hidden before this runs isn't
// perceptible.
function RevealSection({ id, Component }: { id: string; Component: ComponentType }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [replayKey, setReplayKey] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return

    let observer: IntersectionObserver | null = null

    const frame = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect()
      // The buffer here matters more than it looks: Home is sized with
      // min-height: 100svh, so on a fresh load the very next section's
      // top sits right at window.innerHeight — a boundary so exact that
      // svh-vs-innerHeight rounding noise can tip `rect.top` a hair under
      // it. Without this margin that read as "already in view" (it's
      // only `<`, but by a sliver), which skipped the hide-and-reveal
      // treatment and let that section's own position: fixed ContactBar
      // render immediately too — stacking directly on Home's (both
      // pinned to the same spot on screen) and playing its entrance
      // animation independently on top of it.
      const alreadyInView = rect.top < window.innerHeight - 24 && rect.bottom > 0
      if (alreadyInView) {
        setIsRevealed(true)
        return
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsRevealed(true)
            setReplayKey((k) => k + 1)
            observer?.disconnect()
          }
        },
        // threshold: 0 (rather than requiring some fraction of the
        // section's own height to be visible, which for a section
        // taller than the viewport could mean scrolling through a lot
        // of dead, still-hidden space first) fires as soon as even a
        // sliver is visible — no rootMargin lookahead on top of that:
        // with sections sitting flush against each other (Home is
        // min-height: 100svh with no gap before About), a positive
        // bottom rootMargin put About's trigger zone within reach of the
        // viewport before any scrolling happened at all, firing right at
        // mount — which is the same "already loaded" bug this is meant
        // to prevent, just caused here instead of by the mount-time
        // geometry check above.
        { threshold: 0 },
      )
      observer.observe(el)
    })

    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [])

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

  return (
    <div className="preview-stack">
      <RevealSection id={home} Component={Home} />
      <RevealSection id={about} Component={About} />
      <RevealSection id={resume} Component={Resume} />
      <RevealSection id={projects} Component={Projects} />
      <RevealSection id={contact} Component={Contact} />

      {/* One footer for the whole stack, not one per page. */}
      <Footer />
    </div>
  )
}
