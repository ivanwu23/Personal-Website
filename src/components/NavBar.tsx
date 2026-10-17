import { useContext, useEffect, useState } from 'react'
import { SharedBarsContext } from './SharedBars'
import { NavLink, useLocation } from 'react-router-dom'
import { NAV_LINKS } from '../data/site'
import './NavBar.css'

type NavBarProps = {
  /** Seconds to wait before fading in — lets the hero animation finish first. */
  delay?: number
}

// Unlike every other entrance animation on the site (which now replay on
// every visit to their page), the nav bar renders fresh on every single
// page — it's part of each page's own JSX, not shared/persistent across
// routes — so without this it would slide in on every navigation. This
// flag makes it play only the very first time it appears at all, on
// whichever page that happens to be, then stay static for the rest of
// the session.
let hasNavBarPlayed = false

// The site's single real page ("/") stacks every page on one scrollable
// view instead of routing between them (see Preview.tsx) — navigating
// away would just leave that page, so links instead scroll to the
// matching in-page section. The /about, /resume, etc. routes still exist
// underneath (that's what Preview assembles), just nothing links to them
// directly anymore.
function sectionId(to: string): string {
  return to === '/' ? 'home' : to.slice(1)
}

// Only one of these runs at a time — a second click (on the same link or
// a different one) cancels whatever the last one was still doing.
let activeObserver: ResizeObserver | null = null
let settleTimer: number | undefined
let safetyTimeout: number | undefined

// Every page's images (mountain photo, headshot, project mockups, ...)
// load at once on this one combined route, and none of them reserve
// their rendered size up front — so as each one finishes loading after a
// click, it can push the target section further down the page.
//
// This used to call scrollIntoView immediately and then issue
// corrections as later layout shifts were detected. That doesn't really
// work: browsers can't smoothly retarget a scroll that's already
// animating, so a correction fired *during* it either cancels and
// restarts the animation (a visible direction change) or, done
// instantly, snaps straight there (a jarring mid-flight teleport) —
// neither is just "arriving a little later," it's a visible glitch, and
// it still wasn't reliably landing correctly either.
//
// Waiting for the page to actually stop shifting *before* ever starting
// the scroll sidesteps the problem rather than reacting to it: there's
// only ever one scrollIntoView call, so nothing is ever retargeted
// mid-flight. In the common case (nothing left to load) that's a ~150ms
// pause before the scroll starts, which is barely noticeable; a genuine
// straggler just pushes that pause out a bit further, up to a point.
function scrollToSection(id: string) {
  activeObserver?.disconnect()
  window.clearTimeout(settleTimer)
  window.clearTimeout(safetyTimeout)

  function go() {
    activeObserver?.disconnect()
    window.clearTimeout(safetyTimeout)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const observer = new ResizeObserver(() => {
    window.clearTimeout(settleTimer)
    settleTimer = window.setTimeout(go, 150)
  })
  observer.observe(document.body)
  activeObserver = observer
  settleTimer = window.setTimeout(go, 150)
  // However long it's taking to settle, don't wait forever — scroll to
  // wherever the target is by then rather than never scrolling at all.
  safetyTimeout = window.setTimeout(go, 4000)
}

export default function NavBar({ delay = 0 }: NavBarProps) {
  const [playIntro] = useState(() => !hasNavBarPlayed)
  const isSinglePage = useLocation().pathname === '/'

  // Rendered once for the whole stack instead on "/" — see SharedBars.ts.
  const isShared = useContext(SharedBarsContext)

  useEffect(() => {
    if (!isShared) hasNavBarPlayed = true
  }, [isShared])

  if (isShared) return null

  return (
    <nav
      className={playIntro ? 'navbar is-entering' : 'navbar'}
      style={playIntro ? { animationDelay: `${delay}s` } : undefined}
    >
      <ul className="navbar-links">
        {NAV_LINKS.map((link) =>
          isSinglePage ? (
            <li key={link.to}>
              <a
                href={`#${sectionId(link.to)}`}
                className="navbar-link"
                onClick={(event) => {
                  event.preventDefault()
                  scrollToSection(sectionId(link.to))
                }}
              >
                {link.label}
              </a>
            </li>
          ) : (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  isActive ? 'navbar-link is-active' : 'navbar-link'
                }
              >
                {link.label}
              </NavLink>
            </li>
          ),
        )}
      </ul>
    </nav>
  )
}
