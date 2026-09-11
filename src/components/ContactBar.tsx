import { useEffect, useState } from 'react'
import { CONTACT_LINKS } from '../data/site'
import './ContactBar.css'

type ContactBarProps = {
  /** Seconds to wait before the first button starts sliding in. */
  delay?: number
}

// Turns an href into the plain-text value it points to, so hovering a
// button reveals the actual link, phone number, or email address
// instead of a generic label.
function displayValue(href: string): string {
  if (href.startsWith('mailto:')) return href.slice('mailto:'.length)
  if (href.startsWith('tel:')) return href.slice('tel:'.length)
  return href.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

// Same treatment as the nav bar: it renders fresh on every page (it's part
// of each page's own JSX, not persistent across routes), so without this
// it would slide in on every navigation. This flag makes it play only the
// very first time it appears at all, on whichever page that happens to
// be, then stay static for the rest of the session.
let hasContactBarPlayed = false

export default function ContactBar({ delay = 0 }: ContactBarProps) {
  const [playIntro] = useState(() => !hasContactBarPlayed)

  useEffect(() => {
    hasContactBarPlayed = true
  }, [])

  return (
    <div className="contact-bar">
      {CONTACT_LINKS.map((link, i) => {
        const external = link.href.startsWith('http')
        return (
          <a
            key={link.label}
            className={playIntro ? 'contact-button is-entering' : 'contact-button'}
            href={link.href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noreferrer' : undefined}
            aria-label={link.label}
            style={playIntro ? { animationDelay: `${delay + i * 0.07}s` } : undefined}
          >
            <span className="contact-label" aria-hidden="true">
              {link.displayText ?? displayValue(link.href)}
            </span>
            <img className="contact-icon" src={link.icon} alt="" />
          </a>
        )
      })}
    </div>
  )
}
