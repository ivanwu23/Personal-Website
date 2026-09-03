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

export default function ContactBar({ delay = 0 }: ContactBarProps) {
  return (
    <div className="contact-bar">
      {CONTACT_LINKS.map((link, i) => {
        const external = link.href.startsWith('http')
        return (
          <a
            key={link.label}
            className="contact-button"
            href={link.href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noreferrer' : undefined}
            aria-label={link.label}
            style={{ animationDelay: `${delay + i * 0.07}s` }}
          >
            <span className="contact-label" aria-hidden="true">
              {displayValue(link.href)}
            </span>
            <img className="contact-icon" src={link.icon} alt="" />
          </a>
        )
      })}
    </div>
  )
}
