import { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import ContactBar from '../components/ContactBar'
import {
  ABOUT_HEADSHOT,
  ABOUT_PROFILE,
  EMAIL,
  FULL_NAME,
  SKILLS,
} from '../data/site'
import './About.css'

type SkillGroup = keyof typeof SKILLS

// The entrance animation runs once per full page load. Navigating away and
// back re-mounts this component, but this module-level flag persists across
// those re-mounts, so the content just appears already settled.
let hasIntroPlayed = false

export default function About() {
  const [playIntro] = useState(() => !hasIntroPlayed)
  const [group, setGroup] = useState<SkillGroup>('Languages')

  useEffect(() => {
    hasIntroPlayed = true
  }, [])

  return (
    <>
      <NavBar />
      <ContactBar />

      <section className={playIntro ? 'about about--intro' : 'about'}>
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
      </section>
    </>
  )
}
