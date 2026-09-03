import { NavLink } from 'react-router-dom'
import { NAV_LINKS } from '../data/site'
import './NavBar.css'

type NavBarProps = {
  /** Seconds to wait before fading in — lets the hero animation finish first. */
  delay?: number
}

export default function NavBar({ delay = 0 }: NavBarProps) {
  return (
    <nav className="navbar" style={{ animationDelay: `${delay}s` }}>
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
