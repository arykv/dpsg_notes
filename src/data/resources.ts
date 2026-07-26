import type { Resource } from './types'

/**
 * Everything the library knows about.
 *
 * Adding material is deliberately a one-object job — drop the file in
 * `public/notes/`, add an entry here, open a PR. Nothing else needs touching:
 * search, filters, the subject shelves and the command palette all read from
 * this array.
 *
 * `id` is the permalink (`/library/<id>`), so treat one as permanent once it
 * has shipped.
 */
export const RESOURCES: Resource[] = [
  // --- Class 11 Science · Physics ------------------------------------------
  {
    id: 'phy-11-uday-01',
    title: 'Physics notes — Part 1',
    subject: 'physics',
    grade: 11,
    stream: 'science',
    kind: 'notes',
    href: '/notes/phy-11-uday-01.pdf',
    contributor: 'Uday',
    handwritten: true,
    updated: '2024-12-22',
    sizeMb: 20.7,
    pages: 33,
  },
  {
    id: 'phy-11-uday-02',
    title: 'Physics notes — Part 2',
    subject: 'physics',
    grade: 11,
    stream: 'science',
    kind: 'notes',
    href: '/notes/phy-11-uday-02.pdf',
    contributor: 'Uday',
    handwritten: true,
    updated: '2024-12-22',
    sizeMb: 17.8,
    pages: 28,
  },
  {
    id: 'phy-11-uday-03',
    title: 'Physics notes — Part 3',
    subject: 'physics',
    grade: 11,
    stream: 'science',
    kind: 'notes',
    href: '/notes/phy-11-uday-03.pdf',
    contributor: 'Uday',
    handwritten: true,
    updated: '2024-12-22',
    sizeMb: 17.1,
    pages: 28,
  },
  {
    id: 'phy-11-uday-04',
    title: 'Physics notes — Part 4',
    subject: 'physics',
    grade: 11,
    stream: 'science',
    kind: 'notes',
    href: '/notes/phy-11-uday-04.pdf',
    contributor: 'Uday',
    handwritten: true,
    updated: '2024-12-22',
    sizeMb: 18.4,
    pages: 27,
  },
  {
    id: 'phy-11-uday-05',
    title: 'Physics notes — Part 5',
    subject: 'physics',
    grade: 11,
    stream: 'science',
    kind: 'notes',
    href: '/notes/phy-11-uday-05.pdf',
    contributor: 'Uday',
    handwritten: true,
    updated: '2024-12-22',
    sizeMb: 8.3,
    pages: 13,
  },

  // --- Class 11 Science · Chemistry ----------------------------------------
  {
    id: 'chem-11-uday-01',
    title: 'Chemistry notes',
    subject: 'chemistry',
    grade: 11,
    stream: 'science',
    kind: 'notes',
    href: '/notes/chem-11-uday-01.pdf',
    contributor: 'Uday',
    handwritten: true,
    updated: '2024-12-18',
    sizeMb: 19.4,
  },

  // --- Class 11 Science · Mathematics --------------------------------------
  {
    id: 'math-11-uday-01',
    title: 'Mathematics notes',
    subject: 'maths',
    grade: 11,
    stream: 'science',
    kind: 'notes',
    href: '/notes/math-11-uday-01.pdf',
    contributor: 'Uday',
    handwritten: true,
    updated: '2024-12-24',
    sizeMb: 15.8,
  },

  // --- Class 11 Science · Computer Science ---------------------------------
  {
    id: 'cs-11-uday-01',
    title: 'Computer Science notes',
    subject: 'computer-science',
    grade: 11,
    stream: 'science',
    kind: 'notes',
    href: '/notes/cs-11-uday-01.pdf',
    contributor: 'Uday',
    handwritten: true,
    updated: '2024-12-22',
    sizeMb: 8.8,
  },
]

/** Newest first — used by the home page and the "recently added" rail. */
export const RECENT_RESOURCES = [...RESOURCES].sort((a, b) =>
  b.updated.localeCompare(a.updated),
)

const BY_ID = new Map(RESOURCES.map((r) => [r.id, r]))

export function getResource(id: string): Resource | undefined {
  return BY_ID.get(id)
}

/** How many resources exist for a subject, optionally within one grade. */
export function countBySubject(subject: string, grade?: number): number {
  return RESOURCES.filter(
    (r) => r.subject === subject && (grade === undefined || r.grade === grade),
  ).length
}
