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
  startYear: number
  /** A year, or 'current' for experiences still ongoing. */
  endYear: number | 'current'
}

// Shown as bubbles on the Resume timeline, most recent first.
export const EXPERIENCES: Experience[] = [
  { title: 'UB Forge', subtitle: 'Marketing Director', startYear: 2025, endYear: 2026 },
  { title: 'Match-A-Room', subtitle: 'Developer', startYear: 2024, endYear: 2026 },
  { title: 'HeatSeek', subtitle: 'Developer', startYear: 2024, endYear: 2026 },
  { title: 'Alpha Kappa Psi', subtitle: 'Beta Iota Member', startYear: 2024, endYear: 'current' },
  { title: 'Multi-Media Database', subtitle: 'Developer', startYear: 2023, endYear: 2025 },
  { title: 'CPC Brooklyn', subtitle: 'Teaching Assistant', startYear: 2021, endYear: 2025 },
]

// The timeline bar on the Resume page always starts here and runs through
// the current year, so it never needs manual updates.
export const TIMELINE_START_YEAR = 2020

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
    subtitle: 'Creator • Full-Stack',
    image: '/PJ3.png',
    description:
      'A full-stack roommate-matching platform where users can post listings, browse rooms, and connect with potential roommates through a community-style feed.',
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
    href: 'https://drive.google.com/file/d/1MjsfaldPtZgiWjEuWBHdGtGabl3fkTVR/view?usp=drive_link',
    icon: '/form.png',
    displayText: 'Resume',
  },
]
