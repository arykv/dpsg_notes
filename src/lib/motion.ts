import type { Transition, Variants } from 'motion/react'

/**
 * One motion vocabulary for the whole site.
 *
 * Two springs and one ease. `snap` is for anything the user just clicked —
 * it has to land before they look away. `settle` is for things arriving on
 * their own, where a little overshoot reads as alive rather than twitchy.
 */
export const snap: Transition = { type: 'spring', stiffness: 520, damping: 40, mass: 0.7 }
export const settle: Transition = { type: 'spring', stiffness: 260, damping: 26, mass: 0.9 }
export const glide: Transition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] }

/** Content rising into place — the site's default entrance. */
export const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: settle },
}

/** Parent that deals its children in one at a time. */
export function stagger(delay = 0.05, initial = 0): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: delay, delayChildren: initial } },
  }
}

/** Overlays: scale from just under 1 so it reads as approaching, not inflating. */
export const overlay: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: 8 },
  show: { opacity: 1, scale: 1, y: 0, transition: snap },
  exit: { opacity: 0, scale: 0.98, y: 4, transition: { duration: 0.14 } },
}

/** Route changes. Deliberately small — navigation shouldn't feel like a trip. */
export const page: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.16 } },
}

/** Viewport trigger shared by every scroll reveal, so they all fire alike. */
export const inView = { once: true, margin: '-12% 0px -12% 0px' } as const
