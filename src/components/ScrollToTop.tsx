import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

// A client-side route change doesn't reset scroll position on its own
// (only a real full-page load does that natively) — without this,
// navigating to a new page via the nav bar leaves the viewport wherever
// it happened to be scrolled to on the previous page. useLayoutEffect
// (rather than useEffect) so this happens before the new page paints,
// instead of flashing the old scroll position first.
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
