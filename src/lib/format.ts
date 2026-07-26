import type { ResourceKind, Stream } from '@/data/types'

export const KIND_LABELS: Record<ResourceKind, string> = {
  notes: 'Notes',
  pyq: 'Past paper',
  'sample-paper': 'Sample paper',
  syllabus: 'Syllabus',
  'formula-sheet': 'Formula sheet',
  practical: 'Practical file',
  homework: 'Homework',
  revision: 'Revision sheet',
}

export const STREAM_LABELS: Record<Stream, string> = {
  science: 'Science',
  commerce: 'Commerce',
  arts: 'Humanities',
  common: 'All streams',
}

/** "22 Dec 2024" — short enough for a card, unambiguous enough to trust. */
export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** "3 days ago" for anything recent, a plain date once it stops mattering. */
export function relativeDate(iso: string): string {
  const then = new Date(`${iso}T00:00:00`).getTime()
  if (Number.isNaN(then)) return iso
  const days = Math.floor((Date.now() - then) / 86_400_000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days} days ago`
  if (days < 365) {
    const months = Math.floor(days / 30)
    return months === 1 ? 'last month' : `${months} months ago`
  }
  // Past a year the exact day stops mattering, and the short form fits the card.
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', {
    month: 'short',
    year: 'numeric',
  })
}

export function formatSize(mb?: number): string | undefined {
  if (mb === undefined) return undefined
  return mb < 1 ? `${Math.round(mb * 1024)} KB` : `${mb.toFixed(1)} MB`
}

/** Rounds to at most `places`, then drops any trailing zeros. */
export function trim(n: number, places = 2): string {
  if (!Number.isFinite(n)) return '—'
  return String(Number(n.toFixed(places)))
}
