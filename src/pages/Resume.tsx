import { useEffect, useMemo, useState } from 'react'
import NavBar from '../components/NavBar'
import ContactBar from '../components/ContactBar'
import { EXPERIENCES, TIMELINE_START_YEAR } from '../data/site'
import type { CSSProperties } from 'react'
import './Resume.css'

// Two-digit year label, e.g. 2024 -> "24".
function shortYear(year: number): string {
  return String(year).slice(2)
}

// The entrance animation runs once per full page load, same as About's.
let hasIntroPlayed = false

export default function Resume() {
  const [playIntro] = useState(() => !hasIntroPlayed)

  useEffect(() => {
    hasIntroPlayed = true
  }, [])

  const currentYear = new Date().getFullYear()
  const timelineEnd = Math.max(currentYear, TIMELINE_START_YEAR + 1)
  const span = timelineEnd - TIMELINE_START_YEAR

  const years = useMemo(
    () => Array.from({ length: span + 1 }, (_, i) => TIMELINE_START_YEAR + i),
    [span],
  )

  // Minor (unlabeled) ticks at the quarter-year marks between each pair of
  // years, positioned as a percentage along the timeline.
  const minorTicks = useMemo(() => {
    const ticks: number[] = []
    for (let y = 0; y < span; y++) {
      for (let q = 1; q <= 3; q++) {
        ticks.push(((y + q / 4) / span) * 100)
      }
    }
    return ticks
  }, [span])

  return (
    <>
      <NavBar />
      <ContactBar />

      <section className={playIntro ? 'resume resume--intro' : 'resume'}>
        <header className="resume-head">
          <p className="resume-eyebrow">Resume</p>
          <h1 className="resume-title">My Experiences</h1>
        </header>

        <div className="resume-timeline-wrap">
          <ul className="resume-bubbles">
            {EXPERIENCES.map((exp, i) => {
              const endValue = exp.endYear === 'current' ? currentYear : exp.endYear
              // Where the experience's start and end years fall along the
              // 2020 -> current-year timeline, as fractions of its span.
              const startFraction = Math.min(
                1,
                Math.max(0, (exp.startYear - TIMELINE_START_YEAR) / span),
              )
              const endFraction = Math.min(
                1,
                Math.max(0, (endValue - TIMELINE_START_YEAR) / span),
              )
              const rowStyle = {
                '--row-offset': `${(1 - endFraction) * 100}%`,
                '--row-width': `${(endFraction - startFraction) * 100}%`,
              } as CSSProperties
              // Set as a CSS custom property (rather than animationDelay
              // directly) because the reveal animation lives on ::after,
              // which inline styles can't target.
              const bubbleStyle = playIntro
                ? ({ '--reveal-delay': `${0.25 + i * 0.09}s` } as CSSProperties)
                : undefined
              // 21-25 reads as 2021-2025: two-digit start year, two-digit
              // end year (or "~" while still ongoing).
              const dateLabel =
                exp.endYear === 'current'
                  ? `${shortYear(exp.startYear)}~`
                  : `${shortYear(exp.startYear)}-${shortYear(exp.endYear)}`

              return (
                <li key={exp.title} className="resume-row" style={rowStyle}>
                  <div className="resume-bubble" style={bubbleStyle}>
                    <div className="resume-bubble-text">
                      <p className="resume-bubble-title">{exp.title}</p>
                      <p className="resume-bubble-sub">{exp.subtitle}</p>
                    </div>
                    <p className="resume-bubble-date">{dateLabel}</p>
                    {/* Clips the sliding reveal cover to the bubble's own
                        rounded silhouette, without clipping the parent's
                        box-shadow (which needs to stay unclipped). */}
                    <div className="resume-bubble-cover-mask" aria-hidden="true" />
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="resume-timeline" aria-hidden="true">
            <div className="resume-timeline-track">
              {minorTicks.map((pct, i) => (
                <span
                  key={i}
                  className="resume-tick"
                  style={{ left: `${pct}%` }}
                />
              ))}
              {years.map((year, i) => (
                <div
                  key={year}
                  className={
                    i === 0
                      ? 'resume-timeline-year resume-timeline-year--first'
                      : i === years.length - 1
                        ? 'resume-timeline-year resume-timeline-year--last'
                        : 'resume-timeline-year'
                  }
                  style={{ left: `${(i / span) * 100}%` }}
                >
                  <span className="resume-tick resume-tick--major" />
                  <span className="resume-timeline-label">{year}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
