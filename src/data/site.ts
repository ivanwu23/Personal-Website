// Central place to edit your personal details — nothing else in the app
// should need to change when you update these.

export const NAME = 'IVAN WU'
export const TAGLINE = 'Front End Developer'

export const FULL_NAME = 'Ivan Wu'
export const EMAIL = 'ivanwu1061@gmail.com'

export const ABOUT_HEADSHOT = '/headshot.png'

export const ABOUT_PROFILE =
  'I’m a Computer Science major at UB with a background in architecture and design. ' +
  'I create innovative, user-centered software solutions by combining technical skill ' +
  'with creativity. Open to opportunities in software engineering and product development. ' +
  EMAIL

// Skills shown by the interactive tab on the About page.
export const SKILLS = {
  Languages: ['Java', 'C Programming', 'JavaScript', 'Python', 'CSS', 'HTML'],
  Frameworks: ['React', 'Node.js', 'Express', 'Vite', 'Tailwind CSS', 'Bootstrap'],
} as const

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Resume', to: '/resume' },
  { label: 'Projects', to: '/projects' },
  { label: 'Activities', to: '/activities' },
  { label: 'Contact', to: '/contact' },
]

export type Experience = {
  title: string
  subtitle: string
  startYear: number
  /** A year, or 'current' for experiences still ongoing. */
  endYear: number | 'current'
}

// Shown as bubbles on the Resume timeline, most recent first.
export const EXPERIENCES: Experience[] = [
  { title: 'Match-A-Room', subtitle: 'Developer', startYear: 2024, endYear: 2026 },
  { title: 'HeatSeek', subtitle: 'Developer', startYear: 2024, endYear: 2026 },
  { title: 'Alpha Kappa Psi', subtitle: 'Beta Iota', startYear: 2024, endYear: 'current' },
  { title: 'Multi-Media Database', subtitle: 'Developer', startYear: 2023, endYear: 2025 },
  { title: 'Teaching Assistant', subtitle: 'CPC Brooklyn', startYear: 2021, endYear: 2025 },
]

// The timeline bar on the Resume page always starts here and runs through
// the current year, so it never needs manual updates.
export const TIMELINE_START_YEAR = 2020

export type ContactLink = {
  label: string
  href: string
  icon: string
}

export const CONTACT_LINKS: ContactLink[] = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/ivanwu23', icon: '/linkedin.png' },
  { label: 'GitHub', href: 'https://github.com/ivanwu23', icon: '/github.png' },
  { label: 'Email', href: 'mailto:ivanwu1061@gmail.com', icon: '/email.png' },
  { label: 'Phone', href: 'tel:+1 (347)425-5405', icon: '/phone-call.png' },
]
