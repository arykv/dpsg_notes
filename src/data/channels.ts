export interface Channel {
  id: string
  name: string
  handle: string
  href: string
  /** What it's genuinely good for — not a description of the channel. */
  bestFor: string
  subjects: string[]
  grades: (11 | 12)[]
  /** A first-person note. Only on the ones actually used. */
  note?: string
  /** The one to try first. */
  pick?: boolean
}

/**
 * Channels, not a directory dump.
 *
 * Every one here has been checked and is free. The ordering is opinionated on
 * purpose — a list of thirty channels helps nobody at 11pm.
 */
export const CHANNELS: Channel[] = [
  {
    id: 'science-and-fun',
    name: 'Science and Fun',
    handle: '@ScienceandFun',
    href: 'https://www.youtube.com/@ScienceandFun',
    bestFor: 'Class 11 and 12 Chemistry, taught slowly enough to actually follow',
    subjects: ['Chemistry'],
    grades: [11, 12],
    pick: true,
    note:
      'Ashu Sir is who I actually studied chemistry from, and my marks came out decent because of it. If organic is not clicking in class, start here — full chapters, free, no catch.',
  },
  {
    id: 'physics-wallah',
    name: 'Physics Wallah',
    handle: '@PhysicsWallah',
    href: 'https://www.youtube.com/@PhysicsWallah',
    bestFor: 'Physics and Chemistry, boards plus JEE/NEET level',
    subjects: ['Physics', 'Chemistry', 'Maths'],
    grades: [11, 12],
  },
  {
    id: 'magnet-brains',
    name: 'Magnet Brains',
    handle: '@MagnetBrainsEducation',
    href: 'https://www.youtube.com/@MagnetBrainsEducation',
    bestFor: 'Full NCERT chapter-by-chapter coverage across almost every subject',
    subjects: ['Physics', 'Chemistry', 'Maths', 'Biology', 'Accountancy', 'Business Studies'],
    grades: [11, 12],
  },
  {
    id: 'learnohub',
    name: 'LearnoHub',
    handle: '@LearnoHub',
    href: 'https://www.youtube.com/@LearnoHub',
    bestFor: 'Physics and Biology explained without assuming you already get it',
    subjects: ['Physics', 'Biology', 'Chemistry'],
    grades: [11, 12],
  },
  {
    id: 'rajat-arora',
    name: 'Rajat Arora',
    handle: '@RajatAroraofficial',
    href: 'https://www.youtube.com/@RajatAroraofficial',
    bestFor: 'Commerce — Accountancy and Business Studies, board-answer focused',
    subjects: ['Accountancy', 'Business Studies', 'Economics'],
    grades: [11, 12],
  },
  {
    id: 'padhle',
    name: 'Padhle',
    handle: '@padhle',
    href: 'https://www.youtube.com/@padhle',
    bestFor: 'Quick one-shot revisions the week before a paper',
    subjects: ['Physics', 'Chemistry', 'Maths', 'Science'],
    grades: [11, 12],
  },
  {
    id: 'khan-academy-india',
    name: 'Khan Academy India',
    handle: '@khanacademyindia',
    href: 'https://www.youtube.com/@khanacademyindia',
    bestFor: 'Maths fundamentals when a chapter needs rebuilding from scratch',
    subjects: ['Maths', 'Physics'],
    grades: [11, 12],
  },
]
