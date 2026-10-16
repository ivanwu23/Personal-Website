import { useEffect, useState } from 'react'
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

// Every page's images (mountain photo, headshot, project mockups, ...)
// load at once on this one combined route, and none of them reserve
// their rendered size up front — so as each one finishes loading after a
// click, it pushes later sections further down the page. scrollIntoView's
// smooth animation locks onto the target's position at the moment it's
// called and doesn't re-read it as that shifts, so the scroll lands
// short of the section by however much it moved after the click — this
// re-issues the scroll once those loads have had time to settle,
// correcting any drift from the first pass.
function scrollToSection(id: string) {
  const el = document.getElementById(id)
  el?.scrollIntoView({ behavior: 'smooth' })
  window.setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, 500)
}

export default function NavBar({ delay = 0 }: NavBarProps) {
  const [playIntro] = useState(() => !hasNavBarPlayed)
  const isSinglePage = useLocation().pathname === '/'

  useEffect(() => {
    hasNavBarPlayed = true
  }, [])

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
