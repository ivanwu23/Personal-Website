// Timing for Home's loading screen and landing intro. Shared so Preview
// can time the single NavBar/ContactBar it renders for the whole "/"
// stack to come in right after Home's intro, the same as Home's own
// bars do when it's visited on its own.

// How long the loading screen stays up before the landing page shows.
// Matches the loading-screen fade-out (delay 1.4s + 0.4s) in LoadingScreen.css.
export const LOADING_DURATION = 1800

// How long the mountain/name entrance takes (seconds) — the nav and
// contact buttons wait this long before they start animating in.
export const INTRO_DURATION = 1.05

// The loading screen runs once per browser tab session, not once per Home
// mount — sessionStorage (rather than a plain module-level flag) is what
// makes that distinction hold up: a module-level flag resets on any full
// page reload, even a reload on a completely different page like /about,
// which has no memory of Home's loading screen already having played
// earlier in the session — so navigating to Home afterward looked like
// the first time all over again. sessionStorage survives that reload,
// while still resetting for a genuinely new tab/visit. The hero entrance
// animation below it is not similarly gated: it replays every time Home
// is (re)mounted, same as every other page's entrance animation.
const LOADING_SEEN_KEY = 'home-loading-seen'

export function hasShownLoadingScreen(): boolean {
  try {
    return sessionStorage.getItem(LOADING_SEEN_KEY) === '1'
  } catch {
    return false
  }
}

export function markLoadingScreenShown() {
  try {
    sessionStorage.setItem(LOADING_SEEN_KEY, '1')
  } catch {
    // Ignore — e.g. storage disabled/restricted. Worst case, the loading
    // screen plays again on the next full reload.
  }
}
