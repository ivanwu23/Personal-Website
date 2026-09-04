import { useMemo } from 'react'
import NavBar from '../components/NavBar'
import ContactBar from '../components/ContactBar'
import { EXPERIENCES, TIMELINE_START_YEAR } from '../data/site'
import type { CSSProperties } from 'react'
import './Resume.css'

// Two-digit year label, e.g. 2024 -> "24".
function shortYear(year: number): string {
  return String(year).slice(2)
}

export default function Resume() {
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

      <section className="resume">
        <header className="resume-head">
          <p className="resume-eyebrow">Resume</p>
          <h1 className="resume-title">My Experiences</h1>
        </header>

        <div className="resume-timeline-wrap">
          <ul className="resume-bubbles">
            {EXPERIENCES.map((exp) => {
              const endValue = exp.endYear === 'current' ? currentYear : exp.endYear
              const fraction = Math.min(
                1,
                Math.max(0, (endValue - TIMELINE_START_YEAR) / span),
              )
              const rowStyle = {
                '--row-offset': `${(1 - fraction) * 100}%`,
              } as CSSProperties
              const dateLabel =
                exp.endYear === 'current'
                  ? `${shortYear(exp.startYear)}~`
                  : `${shortYear(exp.startYear)}-${shortYear(exp.endYear)}`

              return (
                <li key={exp.title} className="resume-row" style={rowStyle}>
                  <div className="resume-bubble">
                    <div className="resume-bubble-text">
                      <p className="resume-bubble-title">{exp.title}</p>
                      <p className="resume-bubble-sub">{exp.subtitle}</p>
                    </div>
                    <p className="resume-bubble-date">{dateLabel}</p>
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
