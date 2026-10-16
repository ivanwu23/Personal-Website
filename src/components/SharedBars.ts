import { createContext } from 'react'

// Every page renders its own NavBar and ContactBar, which is right when
// it's visited as its own route. On "/" though, every page is stacked on
// one scroll (see Preview.tsx), and since both bars are position: fixed,
// that meant five copies piled on the same spot — each playing its own
// entrance whenever its page mounted, so the bar would slide in twice
// (e.g. Home's, which is always mounted, on top of whichever page you
// reloaded on). Preview sets this to true around its pages so their
// bars render nothing, and renders a single pair of its own instead.
export const SharedBarsContext = createContext(false)
