// Central place to edit your personal details — nothing else in the app
// should need to change when you update these.

export const NAME = 'IVAN WU'
export const TAGLINE = 'Front End Developer'

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export type ContactLink = {
  label: string
  href: string
  icon: string
}

export const CONTACT_LINKS: ContactLink[] = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/ivanwu23', icon: '/linkedin.png' },
  { label: 'GitHub', href: 'https://github.com/ivanwu23', icon: '/github.png' },
  { label: 'Email', href: 'mailto:ivanwu1061@gmail.com', icon: '/email.png' },
  { label: 'Phone', href: 'tel:+1 (347)-425-5405', icon: '/phone-call.png' },
]
