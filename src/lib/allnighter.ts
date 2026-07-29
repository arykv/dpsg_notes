import { GUIDES, type SubjectGuide, type Unit } from '@/data/guides'

/**
 * The plan behind "Pull an all nighter".
 *
 * Two rules govern every line of this file, both from VISION.md §2:
 *
 *   1. **Never flatter.** If there isn't time, the plan says there isn't time.
 *      The credibility of this whole site is that it doesn't lie about marks.
 *   2. **Never hopeless.** Brutal about the situation, never about the person.
 *      There is always a plan, even when the plan is small.
 *
 * The allocation is not decorative. It divides the hours you actually have by
 * the marks each unit carries, so the time you spend maps onto the paper rather
 * than onto the textbook's running order — which is the single most common way
 * a night before goes wrong.
 */

export type Prep = 'nothing' | 'some' | 'most'

export const PREP_OPTIONS: { value: Prep; label: string; sub: string }[] = [
  { value: 'nothing', label: "Basically nothing", sub: "Haven't opened it properly" },
  { value: 'some', label: 'About half', sub: 'Some chapters are fine, most aren’t' },
  { value: 'most', label: 'Most of it', sub: 'Revising rather than learning' },
]

/** Minutes a mark is worth, per preparation level. Learning costs more than revising. */
const MINUTES_PER_MARK: Record<Prep, number> = { nothing: 9, some: 6, most: 3.5 }

/**
 * Not every mark costs the same. A Biomolecules mark is memorisable in an
 * evening; an Electrochemistry mark needs numericals you cannot acquire
 * overnight. Ranking purely by marks drops the cheap recall units first, which
 * is the exact opposite of what every guide on this site advises.
 */
const EFFORT_COST: Record<NonNullable<Unit['effort']>, number> = {
  recall: 0.6,
  standard: 1,
  heavy: 1.45,
}

const costOf = (u: Unit, perMark: number) => Math.round(u.marks * perMark * EFFORT_COST[u.effort ?? 'standard'])

export interface Block {
  unit: Unit
  minutes: number
  /** Set when there wasn't time and this unit is being consciously dropped. */
  dropped?: boolean
}

export interface Plan {
  guide: SubjectGuide
  prep: Prep
  /** Hours between now and the paper. */
  hoursLeft: number
  /** Hours of that which are actually usable, after sleep and the morning. */
  studyHours: number
  sleepHours: number
  blocks: Block[]
  /** Marks covered by the blocks that aren't dropped. */
  marksCovered: number
  verdict: { headline: string; body: string; tone: 'calm' | 'tight' | 'brutal' }
}

/**
 * Sleep is not the thing to cut, and this is where the site says so with its
 * whole chest. Below six hours the returns on another hour of revision are
 * worse than the returns on being able to think in the hall.
 */
function sleepFor(hoursLeft: number): number {
  if (hoursLeft >= 14) return 7
  if (hoursLeft >= 11) return 6
  if (hoursLeft >= 8) return 5
  if (hoursLeft >= 6) return 4
  return 0 // Under six hours to the paper, sleep isn't on the table anyway.
}

function verdictFor(prep: Prep, studyHours: number, marksCovered: number, total: number) {
  const share = marksCovered / total

  if (studyHours <= 0) {
    return {
      headline: 'You are out of time, and that is fine.',
      body: 'There is no plan that fits in what is left. Read your own summary notes once, sleep, and go in. Reading something new now will only push out something you already know.',
      tone: 'brutal' as const,
    }
  }
  if (share >= 0.85) {
    return {
      headline: 'You can cover this. Actually cover it.',
      body: 'There is enough time to reach nearly the whole paper at a sane pace. Do not spend it re-reading the chapters you already like — the plan below is in mark order, not comfort order.',
      tone: 'calm' as const,
    }
  }
  if (share >= 0.5) {
    return {
      headline: 'You can get most of the marks. Not all of them.',
      body: 'Enough time for the units that carry the paper, and not enough for the tail. The last few are marked as dropped on purpose — deciding now what you are not doing is what stops you running out halfway through something important.',
      tone: 'tight' as const,
    }
  }
  if (prep === 'nothing') {
    return {
      headline: 'You are cooked. You are not finished.',
      body: 'There is no version of tonight where you learn this subject. There is a version where you walk in able to answer the biggest units, and that is worth a lot of marks. Do the plan in order and do not look at what it drops.',
      tone: 'brutal' as const,
    }
  }
  return {
    headline: 'Tight. Pick your battles and commit to them.',
    body: 'Not enough hours for the whole paper, so the plan spends them where the marks are. Everything below the line is a deliberate loss, not an accident.',
    tone: 'brutal' as const,
  }
}

export function buildPlan(slug: string, examISO: string, prep: Prep, now = new Date()): Plan | null {
  const guide = GUIDES.find((g) => g.slug === slug)
  if (!guide || !examISO) return null

  const exam = new Date(examISO)
  if (Number.isNaN(exam.getTime())) return null

  const hoursLeft = (exam.getTime() - now.getTime()) / 3_600_000
  if (hoursLeft <= 0) return null

  const sleepHours = sleepFor(hoursLeft)
  // An hour for getting there, eating, and the fact that nobody studies right
  // up to the second. Pretending otherwise makes the plan a lie.
  const studyHours = Math.max(0, hoursLeft - sleepHours - 1)

  let budget = studyHours * 60
  const perMark = MINUTES_PER_MARK[prep]

  // Best marks-per-minute first. That is where the paper is *and* what your
  // remaining hours can actually reach — deliberately not the order the
  // textbook runs in, and deliberately not raw marks either.
  const ranked = [...guide.units].sort(
    (a, b) => b.marks / costOf(b, perMark) - a.marks / costOf(a, perMark),
  )

  const blocks: Block[] = ranked.map((unit) => {
    // A session shorter than fifteen minutes is a glance, not study — so a
    // cheap unit gets rounded *up* to fifteen rather than dropped. Dropping a
    // unit for being quick to learn would invert the whole point of ranking by
    // marks per minute.
    const want = Math.max(15, costOf(unit, perMark))
    if (budget < 15) return { unit, minutes: 0, dropped: true }
    const minutes = Math.round(Math.min(want, budget))
    budget -= minutes
    return { unit, minutes }
  })

  const marksCovered = blocks.filter((b) => !b.dropped).reduce((n, b) => n + b.unit.marks, 0)

  return {
    guide,
    prep,
    hoursLeft,
    studyHours,
    sleepHours,
    blocks,
    marksCovered,
    verdict: verdictFor(prep, studyHours, marksCovered, guide.theoryMarks),
  }
}

export const fmtMinutes = (m: number) =>
  m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ''}` : `${m}m`
