import { Link } from 'react-router-dom'
import { ABOUT_HEADSHOT, CONTACT_LINKS, FULL_NAME, NAV_LINKS } from '../data/site'
import './Footer.css'

// Shown at the bottom of every page except Home.
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-footer-card">
        <div className="site-footer-top">
          <div className="site-footer-brand">
            <img src={ABOUT_HEADSHOT} alt={FULL_NAME} className="site-footer-avatar" />
            <span className="site-footer-name">{FULL_NAME}</span>
          </div>

          <div className="site-footer-columns">
            <div className="site-footer-column">
              <h3 className="site-footer-heading">Pages</h3>
              <ul className="site-footer-list">
                {NAV_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="site-footer-column">
              <h3 className="site-footer-heading">Connect</h3>
              <ul className="site-footer-list">
                {CONTACT_LINKS.map((link) => {
                  const external = link.href.startsWith('http')
                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noreferrer' : undefined}
                      >
                        {link.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>

        <hr className="site-footer-divider" />

        <div className="site-footer-bottom">
          <span>
            ©{FULL_NAME} {year}. All rights reserved.
          </span>
          <span>Don’t think, just do</span>
        </div>
      </div>
    </footer>
  )
}
