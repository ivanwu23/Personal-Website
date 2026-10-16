// Central place to edit your personal details — nothing else in the app
// should need to change when you update these.

export const NAME = 'IVAN WU'
export const TAGLINE = 'Developer • Designer'

export const FULL_NAME = 'Ivan Wu'
export const EMAIL = 'ivanwu1061@gmail.com'

export const ABOUT_HEADSHOT = '/headshot.png'

export const ABOUT_PROFILE =
  'I’m a Computer Science major at UB with a background in architecture and graphic design. ' +
  'I create innovative, user-centered software solutions by combining technical skill ' +
  'with creativity. Open to opportunities in software engineering and product development. ' +
  EMAIL

// Skills shown by the interactive tab on the About page.
export const SKILLS = {
  Languages: ['Java', 'C Programming', 'TypeScript', 'Python', 'CSS', 'HTML'],
  Frameworks: ['React', 'Node.js', 'Express', 'Vite', 'Tailwind CSS', 'Figma'],
} as const

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Resume', to: '/resume' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact', to: '/contact' },
]

export type AboutPoint = {
  title: string
  description: string
}

// The scroll-pinned "01/03" section near the bottom of the About page.
export const ABOUT_POINTS: AboutPoint[] = [
  {
    title: 'Keep Building',
    description:
      'I believe the best way to learn is by building. Every project, mistake, and challenge gives me something new to understand. I want to keep pushing myself to learn new technologies, explore new ideas, and become a better developer along the way.',
  },
  {
    title: 'Design With Purpose',
    description:
      'I see development as more than just writing code. I care about how something looks, feels, and works for the person using it. I enjoy finding the balance between creativity and functionality to create experiences that are both enjoyable and useful.',
  },
  {
    title: 'Make Ideas Real',
    description:
      'I’m drawn to the process of turning an idea into something real. Whether it starts as a sketch, a simple thought, or a problem that needs solving, I enjoy experimenting, building, and seeing an idea come to life through technology.',
  },
]

export type Personality = {
  title: string
  description: string
  /** One image is shown statically; more than one rotates on a timer. */
  images: string[]
}

// The "Behind the scenes" cards near the bottom of the About page.
export const PERSONALITIES: Personality[] = [
  {
    title: 'Drawing & Painting',
    description:
      'I’ve always enjoyed drawing and painting, whether it’s anime, realism, or just experimenting with something new.',
    images: ['/personality/drawing1.png', '/personality/drawing2.png', '/personality/drawing3.png'],
  },
  {
    title: 'Music & Dance',
    description:
      'Music is a big part of how I relax. I’m always listening to K-pop and J-pop, and every now and then I’ll try learning a dance just for fun.',
    images: ['/personality/music.png'],
  },
  {
    title: 'Spending Time With Friends',
    description:
      'Outside of work, I enjoy spending time with the people around me. Whether it’s trying something new or just hanging out, I value the time I get to spend with friends.',
    images: ['/personality/friends1.jpeg', '/personality/friends2.jpeg', '/personality/friends3.jpeg'],
  },
]

export type Experience = {
  title: string
  subtitle: string
  /** May carry a fractional part for month precision — see `date` below. */
  startYear: number
  /** A year (same month precision as startYear), or 'current'. */
  endYear: number | 'current'
}

// A year plus a specific month (1-12), as the single fractional number
// Experience.startYear/endYear expect — e.g. date(2025, 1) is Jan 2025.
// Lets the Resume timeline position a bubble by month rather than only by
// whole year, while the bubble's own label (see Resume.tsx) still always
// displays just the year.
function date(year: number, month: number): number {
  return year + (month - 1) / 12
}

// Shown as bubbles on the Resume timeline, most recent first. (Roles
// that are really showcase projects rather than positions — e.g. a
// "Developer" credit — belong on the Projects page instead, not here.)
export const EXPERIENCES: Experience[] = [
  { title: 'UB Forge', subtitle: 'Fellow', startYear: date(2026, 1), endYear: 'current' },
  {
    title: 'UB Forge',
    subtitle: 'Marketing Director',
    startYear: date(2026, 1),
    endYear: date(2026, 5),
  },
  {
    title: 'Alpha Kappa Psi',
    subtitle: 'Marketing Assistant',
    startYear: date(2025, 8),
    endYear: date(2026, 9),
  },
  {
    title: 'Alpha Kappa Psi',
    subtitle: 'Technical Director',
    startYear: date(2025, 1),
    endYear: 'current',
  },
  { title: 'Alpha Kappa Psi', subtitle: 'Beta Iota Member', startYear: 2024, endYear: 'current' },
]

// The timeline bar on the Resume page always spans this fixed range —
// ongoing ('current') experiences always draw out to TIMELINE_END_YEAR
// (the bar's own far right edge), not to whatever today's actual year is.
export const TIMELINE_START_YEAR = 2022
export const TIMELINE_END_YEAR = 2027

export type Project = {
  title: string
  subtitle: string
  image: string
  description: string
}

// Shown in the carousel on the Projects page, left to right. Clicking the
// centered project opens a popup with its description.
//
// TODO: the descriptions below are placeholders — swap in the real copy.
export const PROJECTS: Project[] = [
  {
    title: 'Personal Website',
    subtitle: 'Creator • UI / UX',
    image: '/PJ1.png',
    description:
      'A personal portfolio site built to showcase my work and background, with a focus on clean typography, smooth page transitions, and thoughtful micro-interactions throughout.',
  },
  {
    title: 'Multi-Media Database',
    subtitle: 'School Project • Dev',
    image: '/PJ2.png',
    description:
      'A school project exploring graph algorithms and data modeling — a searchable movie and media database with a custom ratings and recommendation system.',
  },
  {
    title: 'MatchARoom',
    subtitle: 'Dev • Full-Stack',
    image: '/PJ3.png',
    description:
      'A full-stack roommate-matching platform where users can post listings, browse rooms, and connect with potential roommates through a community-style feed.',
  },
  {
    title: 'UnGatekeep',
    subtitle: 'Dev • Full-Stack',
    image: '/PJ4.png',
    description:
      'A full-stack community platform for sharing clothing finds and cheaper alternatives — post what you tracked down, or ask for help finding a similar (and more affordable) version of something you can’t.',
  },
]

export type ContactLink = {
  label: string
  href: string
  icon: string
  /** Text shown on hover — falls back to the href itself when omitted. */
  displayText?: string
}

export const CONTACT_LINKS: ContactLink[] = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/ivanwu23', icon: '/linkedin.png' },
  { label: 'GitHub', href: 'https://github.com/ivanwu23', icon: '/github.png' },
  { label: 'Email', href: 'mailto:ivanwu1061@gmail.com', icon: '/email.png' },
  { label: 'Phone', href: 'tel:+1 (347) 425-5405', icon: '/phone-call.png' },
  {
    label: 'Resume',
    href: 'https://drive.google.com/file/d/1aq-06SZWicrWKI3l1RT4zVCVjTV_gLTP/view?usp=drive_link',
    icon: '/form.png',
    displayText: 'Resume',
  },
]
