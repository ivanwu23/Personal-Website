import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
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

export default function NavBar({ delay = 0 }: NavBarProps) {
  const [playIntro] = useState(() => !hasNavBarPlayed)

  useEffect(() => {
    hasNavBarPlayed = true
  }, [])

  return (
    <nav
      className={playIntro ? 'navbar is-entering' : 'navbar'}
      style={playIntro ? { animationDelay: `${delay}s` } : undefined}
    >
      <ul className="navbar-links">
        {NAV_LINKS.map((link) => (
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
        ))}
      </ul>
    </nav>
  )
}
