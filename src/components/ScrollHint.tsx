import { useEffect, useState } from 'react'
import './ScrollHint.css'

// How close to the bottom (px) counts as "there", so the hint doesn't
// linger over a couple of stray pixels of overflow.
const BOTTOM_THRESHOLD = 24

// A small bouncing arrow, fixed to the bottom of the viewport, that shows
// only while the current page has more content below the fold. Tracks
// scroll position and content height (including route swaps, which change
// the document's height without firing a resize event) and hides itself
// once there's nothing left to scroll to.
export default function ScrollHint() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function update() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      if (scrollable <= BOTTOM_THRESHOLD) {
        setVisible(false)
        return
      }
      const scrolledToBottom = window.scrollY >= scrollable - BOTTOM_THRESHOLD
      setVisible(!scrolledToBottom)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    // Body height changes on route swaps and image loads too, not just
    // window resizes — this catches those without needing a scroll event.
    const observer = new ResizeObserver(update)
    observer.observe(document.body)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      observer.disconnect()
    }
  }, [])

  return (
    <div
      className={visible ? 'scroll-hint' : 'scroll-hint is-hidden'}
      aria-hidden="true"
    >
      <span className="scroll-hint-arrow" />
    </div>
  )
}
