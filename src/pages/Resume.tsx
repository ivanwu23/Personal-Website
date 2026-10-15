import { useMemo } from 'react'
import NavBar from '../components/NavBar'
import ContactBar from '../components/ContactBar'
import { EXPERIENCES, TIMELINE_END_YEAR, TIMELINE_START_YEAR } from '../data/site'
import type { CSSProperties } from 'react'
import './Resume.css'

// Two-digit year label, e.g. 2024 -> "24". startYear/endYear can carry a
// fractional part for month precision (see `date` in site.ts) — the
// label only ever shows the whole year, so that part is dropped here.
function shortYear(year: number): string {
  return String(Math.floor(year)).slice(2)
}

export default function Resume() {
  const span = TIMELINE_END_YEAR - TIMELINE_START_YEAR

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

      <section className="resume resume--intro">
        <header className="resume-head">
          <p className="resume-eyebrow">Resume</p>
          <h1 className="resume-title">My Experiences</h1>
        </header>

        <div className="resume-timeline-wrap">
          <ul className="resume-bubbles">
            {EXPERIENCES.map((exp, i) => {
              // 'current' always reaches the bar's own far right edge
              // (TIMELINE_END_YEAR), not whatever today's actual year is —
              // ongoing experiences should visually extend all the way,
              // not stop short at "now".
              const endValue = exp.endYear === 'current' ? TIMELINE_END_YEAR : exp.endYear
              // Where the experience's start and end years fall along the
              // timeline, as fractions of its span.
              const startFraction = Math.min(
                1,
                Math.max(0, (exp.startYear - TIMELINE_START_YEAR) / span),
              )
              const endFraction = Math.min(
                1,
                Math.max(0, (endValue - TIMELINE_START_YEAR) / span),
              )
              // The bubble's own `width: <percentage>` (in CSS) resolves
              // against .resume-row's content box — which excludes the
              // padding-right that --row-offset itself adds, i.e. a box
              // that's only (rowWidth × endFraction) wide, not the row's
              // full width. Dividing by endFraction here compensates for
              // that, so the rendered pixel width still comes out to
              // exactly (endFraction - startFraction) of the full row
              // (and therefore of the timeline itself) — without it,
              // every bubble rendered narrower than its true span, more
              // so for older ones (whose endFraction is smaller).
              const rowStyle = {
                '--row-offset': `${(1 - endFraction) * 100}%`,
                '--row-width': `${endFraction > 0 ? ((endFraction - startFraction) / endFraction) * 100 : 0}%`,
              } as CSSProperties
              // Set as a CSS custom property (rather than animationDelay
              // directly) because the reveal animation lives on ::after,
              // which inline styles can't target.
              const bubbleStyle = {
                '--reveal-delay': `${0.25 + i * 0.09}s`,
              } as CSSProperties
              // 21-25 reads as 2021-2025: two-digit start year, two-digit
              // end year (or "~" while still ongoing). A start and end
              // within the same calendar year (e.g. Jan-May 2026) would
              // otherwise read as "26-26" — just the one year instead.
              const dateLabel =
                exp.endYear === 'current'
                  ? `${shortYear(exp.startYear)}~`
                  : Math.floor(exp.startYear) === Math.floor(exp.endYear)
                    ? shortYear(exp.startYear)
                    : `${shortYear(exp.startYear)}-${shortYear(exp.endYear)}`

              return (
                <li key={`${exp.title}-${exp.subtitle}`} className="resume-row" style={rowStyle}>
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
