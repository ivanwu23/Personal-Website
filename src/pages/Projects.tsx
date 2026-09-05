import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { createPortal } from 'react-dom'
import NavBar from '../components/NavBar'
import ContactBar from '../components/ContactBar'
import { PROJECTS } from '../data/site'
import type { Project } from '../data/site'
import './Projects.css'

// How far the pointer has to move (in px) during a press before it counts
// as a drag rather than a click — below this, releasing over a slide opens
// its popup (or navigates to it, for a peek slide) instead.
const DRAG_THRESHOLD = 6

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    panelRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [onClose])

  return createPortal(
    <div className="project-modal-backdrop" onClick={onClose}>
      <div
        className="project-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        tabIndex={-1}
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="project-modal-close" aria-label="Close" onClick={onClose}>
          ×
        </button>
        <img className="project-modal-image" src={project.image} alt={project.title} />
        <h2 id="project-modal-title" className="project-modal-title">
          {project.title}
        </h2>
        <p className="project-modal-subtitle">{project.subtitle}</p>
        <p className="project-modal-description">{project.description}</p>
      </div>
    </div>,
    document.body,
  )
}

// The entrance animation runs once per full page load, same as About/Resume.
let hasIntroPlayed = false

type DragState = {
  startX: number
  startScrollLeft: number
  // The slide pressed on, so a release without meaningful movement can
  // open/navigate to *that* slide — not read from the native click event,
  // since track.setPointerCapture() (needed so dragging keeps tracking
  // the pointer outside the track's bounds) retargets the resulting click
  // to the track itself rather than the slide actually under the cursor.
  pressedDomIndex: number | null
}

const COUNT = PROJECTS.length

// Three full copies of the project list back-to-back — not just one clone
// on each end. With only one clone per side, resting on it (even briefly,
// mid-scroll or during the settle delay before the invisible reposition)
// left it with no further neighbor to peek at, since nothing was rendered
// past it — a visible blank gap on that side until the reposition fired.
// With three copies, every position always has real slides on both sides,
// so there's never a moment with a missing peek to wait out. DOM indices
// COUNT..2*COUNT-1 are the canonical "real" copy; the settle effect below
// keeps snapping back into that range after any wrap.
const LOOP_SLIDES = [...PROJECTS, ...PROJECTS, ...PROJECTS]
const REAL_OFFSET = COUNT

function realIndexForDom(domIndex: number) {
  return ((domIndex % COUNT) + COUNT) % COUNT
}

export default function Projects() {
  const [playIntro] = useState(() => !hasIntroPlayed)
  useEffect(() => {
    hasIntroPlayed = true
  }, [])

  // The real project index (0..COUNT-1) — drives the header text and dots.
  const [activeIndex, setActiveIndex] = useState(0)
  // Whether the title/subtitle should play their little swap-in animation.
  // Starts false so mounting (including remounting after navigating away
  // and back) never animates them — only an actual carousel navigation
  // during this mount does, via the effect below.
  const [swapAnimEnabled, setSwapAnimEnabled] = useState(false)
  const prevActiveIndexRef = useRef(activeIndex)
  // The raw DOM slide index currently centered — drives which rendered
  // slide gets the "is-active" look, and which two get the edge-blur peek
  // treatment.
  const [activeDomIndex, setActiveDomIndex] = useState(REAL_OFFSET)

  const trackRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const dragState = useRef<DragState | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const settleTimer = useRef<number | undefined>(undefined)
  // Set during a pointer gesture once movement exceeds DRAG_THRESHOLD, so
  // the resulting click (on release) can be told apart from a genuine tap.
  const dragMoved = useRef(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  // Centers a slide by computing its target scrollLeft directly (rather
  // than via scrollIntoView, which proved unreliable here). Uses
  // getBoundingClientRect deltas rather than offsetLeft, since offsetLeft
  // is relative to the nearest *positioned* ancestor — not necessarily
  // .projects-track, which has no `position` set — and would give
  // distances relative to the wrong element entirely.
  //
  // suppressTransition is for the invisible loop-wrap jump specifically:
  // that reposition moves "is-active" onto a *different* DOM element (the
  // real slide, not the clone it was just resting on), and even though
  // both look identical, that class landing on a fresh element would
  // otherwise replay its opacity/scale transition from the dimmed peek
  // state — a visible flash/bounce for a jump that's supposed to be
  // imperceptible.
  function scrollToDom(domIndex: number, behavior: ScrollBehavior, suppressTransition = false) {
    const track = trackRef.current
    const slide = slideRefs.current[domIndex]
    if (!track || !slide) return
    if (suppressTransition) {
      track.classList.add('is-repositioning')
      window.setTimeout(() => track.classList.remove('is-repositioning'), 60)
    }
    const trackRect = track.getBoundingClientRect()
    const slideRect = slide.getBoundingClientRect()
    const target =
      track.scrollLeft + (slideRect.left - trackRect.left) - (track.clientWidth - slideRect.width) / 2
    if (behavior === 'smooth') {
      track.scrollTo({ left: target, behavior: 'smooth' })
    } else {
      track.scrollLeft = target
    }
  }

  // Arms the swap animation only once activeIndex has genuinely changed
  // from the previous render — never on mount (prevActiveIndexRef starts
  // equal to activeIndex, so the first comparison is always a no-op).
  // Deliberately a plain ref comparison with no cleanup function: an
  // earlier version used a "has this effect run before" ref instead, but
  // React runs an effect's cleanup before every re-run — including for
  // real activeIndex changes, not just React 18 StrictMode's dev-only
  // double-invoke-on-mount — so that cleanup ended up resetting the flag
  // on every single change, permanently preventing the animation from
  // ever arming. This comparison has no such failure mode either way.
  useEffect(() => {
    if (prevActiveIndexRef.current !== activeIndex) {
      setSwapAnimEnabled(true)
    }
    prevActiveIndexRef.current = activeIndex
  }, [activeIndex])

  // Land on the first real slide of the canonical (middle) copy before
  // paint. The rAF defer is load-bearing: right after mount, the track's
  // scrollWidth still equals its clientWidth (the browser hasn't yet
  // recognized the horizontal overflow, even though the slides themselves
  // already measure correctly), so scrollLeft assignments are clamped to
  // 0 until a frame passes.
  useLayoutEffect(() => {
    requestAnimationFrame(() => scrollToDom(REAL_OFFSET, 'auto'))
  }, [])

  function goNext() {
    scrollToDom(activeDomIndex + 1, 'smooth')
  }

  function goPrev() {
    scrollToDom(activeDomIndex - 1, 'smooth')
  }

  function goToRealIndex(index: number) {
    scrollToDom(REAL_OFFSET + index, 'smooth')
  }

  // Tracks which slide is centered as the user scrolls or drags, so the
  // header text and active dot always match what's on screen. Once
  // scrolling settles outside the canonical middle copy (dragged/scrolled
  // far enough to wrap), it instantly (no animation) repositions back into
  // it — invisible to the user, since every copy looks identical, and
  // what makes the loop feel seamless.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let raf = 0
    const updateActive = () => {
      raf = 0
      const trackRect = track.getBoundingClientRect()
      const center = trackRect.left + trackRect.width / 2
      let closest = 0
      let closestDist = Infinity
      slideRefs.current.forEach((el, i) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const dist = Math.abs(rect.left + rect.width / 2 - center)
        if (dist < closestDist) {
          closestDist = dist
          closest = i
        }
      })

      setActiveDomIndex((prev) => (prev === closest ? prev : closest))
      const real = realIndexForDom(closest)
      setActiveIndex((prev) => (prev === real ? prev : real))

      window.clearTimeout(settleTimer.current)
      settleTimer.current = window.setTimeout(() => {
        if (closest < REAL_OFFSET) {
          scrollToDom(closest + COUNT, 'auto', true)
        } else if (closest >= REAL_OFFSET + COUNT) {
          scrollToDom(closest - COUNT, 'auto', true)
        }
      }, 140)
    }

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(updateActive)
    }

    // No initial updateActive() call here — the useState defaults above
    // (activeIndex 0, activeDomIndex REAL_OFFSET) already match where the
    // layout effect positions the scroll. Calling it immediately would
    // race against that scroll call (its scrollLeft update isn't
    // guaranteed to be visible synchronously yet), misreading the
    // still-0 scrollLeft as resting elsewhere and "correcting" to the
    // wrong slide.
    track.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      track.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
      window.clearTimeout(settleTimer.current)
    }
  }, [])

  // Click-and-drag for mouse users — touch/trackpad already scroll the
  // track natively, so this only engages for mouse-type pointers.
  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    dragMoved.current = false
    if (e.pointerType === 'touch') return
    const track = trackRef.current
    if (!track) return
    const slideEl = (e.target as HTMLElement).closest<HTMLElement>('[data-dom-index]')
    const pressedDomIndex = slideEl ? Number(slideEl.dataset.domIndex) : null
    dragState.current = { startX: e.clientX, startScrollLeft: track.scrollLeft, pressedDomIndex }
    track.setPointerCapture(e.pointerId)
    setIsDragging(true)
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const state = dragState.current
    const track = trackRef.current
    if (!state || !track) return
    const delta = e.clientX - state.startX
    if (Math.abs(delta) > DRAG_THRESHOLD) dragMoved.current = true
    track.scrollLeft = state.startScrollLeft - delta
  }

  function endDrag(e: ReactPointerEvent<HTMLDivElement>) {
    const track = trackRef.current
    const state = dragState.current
    if (state) {
      setIsDragging(false)
      // Handled here rather than via each slide's onClick: with mouse
      // pointer capture in play, the native click that would normally
      // reach the pressed slide gets retargeted to the track instead.
      if (e.pointerType !== 'touch' && !dragMoved.current && state.pressedDomIndex !== null) {
        onSlideClick(state.pressedDomIndex)
      }
    }
    dragState.current = null
    if (track?.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId)
  }

  // A tap/click on the centered slide opens its description popup; on a
  // peek slide, it navigates to center it instead (a real drag past
  // DRAG_THRESHOLD suppresses this entirely, so it doesn't fire mid-swipe).
  function onSlideClick(domIndex: number) {
    if (dragMoved.current) return
    if (domIndex === activeDomIndex) {
      setSelectedProject(PROJECTS[realIndexForDom(domIndex)])
    } else {
      scrollToDom(domIndex, 'smooth')
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'ArrowLeft') goPrev()
    if (e.key === 'ArrowRight') goNext()
  }

  const active = PROJECTS[activeIndex]

  return (
    <>
      <NavBar />
      <ContactBar />

      <section className={playIntro ? 'projects projects--intro' : 'projects'}>
        <header className="projects-head">
          <p className="projects-eyebrow">Projects</p>
          <h1
            className={swapAnimEnabled ? 'projects-title is-swapping' : 'projects-title'}
            key={`title-${active.title}`}
          >
            {active.title}
          </h1>
          <p
            className={swapAnimEnabled ? 'projects-subtitle is-swapping' : 'projects-subtitle'}
            key={`sub-${active.title}`}
          >
            {active.subtitle}
          </p>
        </header>

        <div className="projects-carousel">
          <button
            type="button"
            className="projects-arrow projects-arrow--prev"
            aria-label="Previous project"
            onClick={goPrev}
          >
            ‹
          </button>

          <div
            className={isDragging ? 'projects-track is-dragging' : 'projects-track'}
            ref={trackRef}
            tabIndex={0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={onKeyDown}
          >
            {LOOP_SLIDES.map((project, domIndex) => {
              // The two immediate neighbors get a blur on their outer
              // (far-from-center) edge — the side actually receding out of
              // view, not the side facing the active slide.
              let peekClass = ''
              if (domIndex === activeDomIndex - 1) peekClass = ' is-peek-left'
              else if (domIndex === activeDomIndex + 1) peekClass = ' is-peek-right'

              return (
                <div
                  key={`slide-${domIndex}`}
                  className={
                    (domIndex === activeDomIndex ? 'projects-slide is-active' : 'projects-slide') + peekClass
                  }
                  ref={(el) => {
                    slideRefs.current[domIndex] = el
                  }}
                  data-dom-index={domIndex}
                  onClick={() => onSlideClick(domIndex)}
                >
                  <img src={project.image} alt={project.title} draggable={false} />
                  {peekClass && <div className="projects-slide-edge" aria-hidden="true" />}
                </div>
              )
            })}
          </div>

          <button
            type="button"
            className="projects-arrow projects-arrow--next"
            aria-label="Next project"
            onClick={goNext}
          >
            ›
          </button>
        </div>

        <div className="projects-dots" role="tablist" aria-label="Select project">
          {PROJECTS.map((project, i) => (
            <button
              key={project.title}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={project.title}
              className={i === activeIndex ? 'projects-dot is-active' : 'projects-dot'}
              onClick={() => goToRealIndex(i)}
            />
          ))}
        </div>
      </section>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </>
  )
}
