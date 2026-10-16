import { useLayoutEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// A client-side route change doesn't reset scroll position on its own
// (only a real full-page load does that natively) — without this,
// navigating to a new page via the nav bar leaves the viewport wherever
// it happened to be scrolled to on the previous page. useLayoutEffect
// (rather than useEffect) so this happens before the new page paints,
// instead of flashing the old scroll position first.
//
// Only for an actual in-app navigation (PUSH/REPLACE), though — on the
// first render of any fresh document load (reload included; see the
// same useNavigationType() check in RequireNavAccess for why that's what
// "POP" means here), the browser is already mid-way through restoring
// wherever the visitor had scrolled to, and this used to run regardless,
// forcing scroll to 0 and racing that restoration — the two fighting
// over scroll position is what caused reloading mid-page to land a bit
// off from where it actually was.
export default function ScrollToTop() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()

  useLayoutEffect(() => {
    if (navigationType === 'PUSH' || navigationType === 'REPLACE') {
      window.scrollTo(0, 0)
    }
  }, [pathname, navigationType])

  return null
}
