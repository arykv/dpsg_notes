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
  // Empty for now — the Class 11 scans that were here have moved to
  // `archive/notes/` while their sharing permissions are sorted out. They are
  // still in git history, and restoring one is: move the PDF back into
  // `public/notes/` and paste its entry back here.
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
