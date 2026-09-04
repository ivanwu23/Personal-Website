import type { ReactNode } from 'react'
import { Navigate, useNavigationType } from 'react-router-dom'

type RequireNavAccessProps = {
  children: ReactNode
}

// Every route but Home is only reachable by clicking a NavBar link.
//
// - A real page refresh should NOT redirect. The browser reports that kind
//   of load as "reload" via the Navigation Timing API, and we trust it
//   unconditionally, regardless of anything else below.
// - Everything else that produces a *fresh* document load — typing a URL,
//   pasting one (even the exact URL already showing in the address bar),
//   following an outside link, opening a new tab — should redirect Home.
//
// We can't use router state for that second part: pasting the *same* URL
// you're already on doesn't count as a reload, but Chromium still reuses
// the current history entry (and whatever state a Link previously set on
// it), so a plain `location.state` check can't tell it apart from a real
// click. `useNavigationType()` doesn't have that problem — it reports
// "POP" for the first render of any fresh document load (reload included),
// and only reports "PUSH"/"REPLACE" once an actual in-app link click has
// happened during this running session, which is exactly the signal we
// need.
export default function RequireNavAccess({ children }: RequireNavAccessProps) {
  const navigationType = useNavigationType()

  const [navEntry] = performance.getEntriesByType('navigation')
  const isReload = (navEntry as PerformanceNavigationTiming | undefined)?.type === 'reload'

  const reachedViaNavClick = navigationType === 'PUSH' || navigationType === 'REPLACE'

  if (!isReload && !reachedViaNavClick) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
