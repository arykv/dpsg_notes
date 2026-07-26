import type { Period } from './types'

/**
 * The school day, in minutes from midnight.
 *
 * These are a sensible senior-school default, not a scan of the notice board —
 * the UI says so, and every student can edit them once and have it stick
 * (see `useSchedule`). Editing beats guessing: sections run different timings
 * and a wrong bell is worse than no bell.
 */
export const DEFAULT_PERIODS: Period[] = [
  { name: 'Assembly', start: 7 * 60 + 45, end: 8 * 60, kind: 'assembly' },
  { name: 'Period 1', start: 8 * 60, end: 8 * 60 + 40, kind: 'class' },
  { name: 'Period 2', start: 8 * 60 + 40, end: 9 * 60 + 20, kind: 'class' },
  { name: 'Period 3', start: 9 * 60 + 20, end: 10 * 60, kind: 'class' },
  { name: 'Short break', start: 10 * 60, end: 10 * 60 + 15, kind: 'break' },
  { name: 'Period 4', start: 10 * 60 + 15, end: 10 * 60 + 55, kind: 'class' },
  { name: 'Period 5', start: 10 * 60 + 55, end: 11 * 60 + 35, kind: 'class' },
  { name: 'Lunch', start: 11 * 60 + 35, end: 12 * 60 + 10, kind: 'break' },
  { name: 'Period 6', start: 12 * 60 + 10, end: 12 * 60 + 50, kind: 'class' },
  { name: 'Period 7', start: 12 * 60 + 50, end: 13 * 60 + 30, kind: 'class' },
  { name: 'Period 8', start: 13 * 60 + 30, end: 14 * 60 + 10, kind: 'class' },
]

/** Monday–Saturday school week; Sunday off. 0 = Sunday. */
export const SCHOOL_DAYS = [1, 2, 3, 4, 5, 6]

export interface DayState {
  /** What's happening right now, if school is in session. */
  current?: Period
  /** What's next today. */
  next?: Period
  /** Minutes remaining in `current`, or until `next` starts. */
  minutesLeft: number
  /** 0–1 through the current period. */
  progress: number
  status: 'before' | 'during' | 'after' | 'holiday'
}

export function minutesNow(d: Date): number {
  return d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60
}

/** Where in the school day we are. Pure, so it's trivial to reason about. */
export function readDay(now: Date, periods: Period[]): DayState {
  const first = periods[0]
  const last = periods[periods.length - 1]
  if (!first || !last) return { minutesLeft: 0, progress: 0, status: 'holiday' }

  if (!SCHOOL_DAYS.includes(now.getDay())) {
    return { minutesLeft: 0, progress: 0, status: 'holiday' }
  }

  const m = minutesNow(now)

  if (m < first.start) {
    return {
      next: first,
      minutesLeft: Math.ceil(first.start - m),
      progress: 0,
      status: 'before',
    }
  }

  if (m >= last.end) {
    return { minutesLeft: 0, progress: 1, status: 'after' }
  }

  const index = periods.findIndex((p) => m >= p.start && m < p.end)
  const current = index >= 0 ? periods[index] : undefined
  const next = index >= 0 ? periods[index + 1] : undefined

  if (!current) {
    // Sitting in a gap between two periods — treat the upcoming one as next.
    const upcoming = periods.find((p) => p.start > m)
    return {
      next: upcoming,
      minutesLeft: upcoming ? Math.ceil(upcoming.start - m) : 0,
      progress: 0,
      status: 'during',
    }
  }

  return {
    current,
    next,
    minutesLeft: Math.ceil(current.end - m),
    progress: (m - current.start) / (current.end - current.start),
    status: 'during',
  }
}

export function formatClock(minutes: number): string {
  const total = Math.round(minutes)
  const h24 = Math.floor(total / 60)
  const mm = String(total % 60).padStart(2, '0')
  const suffix = h24 >= 12 ? 'pm' : 'am'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${mm} ${suffix}`
}

export function formatCountdown(minutes: number): string {
  if (minutes <= 0) return 'now'
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h}h ${m}m` : `${h}h`
}
