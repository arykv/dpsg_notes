/**
 * CBSE marking maths, in one place.
 *
 * Every rule here is the board's, not ours — the calculators are only useful if
 * they agree with the certificate.
 */

export interface BestOfFive {
  /** Aggregate percentage over the five subjects that counted. */
  percentage: number
  /** The marks that were counted, highest first. */
  counted: number[]
  /** The mark that got dropped, if there were more than five. */
  dropped?: number
  total: number
}

/**
 * The aggregate schools print: the best five scores out of however many were
 * entered. With five or fewer, nothing is dropped and it's a plain average.
 */
export function bestOfFive(marks: number[]): BestOfFive {
  const clean = marks.filter((m) => Number.isFinite(m))
  const sorted = [...clean].sort((a, b) => b - a)
  const counted = sorted.slice(0, 5)
  const total = counted.reduce((sum, m) => sum + m, 0)
  const result: BestOfFive = {
    counted,
    total,
    percentage: counted.length ? total / counted.length : 0,
  }
  if (sorted.length > 5) result.dropped = sorted[5]
  return result
}

export interface Grade {
  label: string
  points: number
  /** Inclusive lower bound. */
  from: number
}

/** The CBSE nine-point scale, top band first. */
export const GRADE_BANDS: Grade[] = [
  { label: 'A1', points: 10, from: 91 },
  { label: 'A2', points: 9, from: 81 },
  { label: 'B1', points: 8, from: 71 },
  { label: 'B2', points: 7, from: 61 },
  { label: 'C1', points: 6, from: 51 },
  { label: 'C2', points: 5, from: 41 },
  { label: 'D', points: 4, from: 33 },
  { label: 'E', points: 0, from: 0 },
]

export function gradeFor(mark: number): Grade {
  return GRADE_BANDS.find((g) => mark >= g.from) ?? GRADE_BANDS[GRADE_BANDS.length - 1]!
}

/** CGPA from a set of subject marks, using the nine-point scale. */
export function cgpa(marks: number[]): number {
  const clean = marks.filter((m) => Number.isFinite(m))
  if (!clean.length) return 0
  const points = clean.reduce((sum, m) => sum + gradeFor(m).points, 0)
  return points / clean.length
}

/** The board's own conversion: multiply CGPA by 9.5. */
export function cgpaToPercentage(value: number): number {
  return value * 9.5
}

export interface AttendanceRead {
  current: number
  /** Classes you can still miss and stay at or above the requirement. */
  canMiss: number
  /** Classes you must attend in a row to climb back to the requirement. */
  mustAttend: number
  meets: boolean
  /** True when the requirement is out of reach for the classes remaining. */
  impossible: boolean
}

export function readAttendance(
  attended: number,
  held: number,
  remaining: number,
  requiredPct: number,
): AttendanceRead {
  const required = requiredPct / 100
  const current = held > 0 ? (attended / held) * 100 : 0
  const meets = current >= requiredPct

  // How many of the remaining classes you can skip and still land on target.
  const totalAtEnd = held + remaining
  const canMiss = Math.max(0, Math.floor(attended + remaining - required * totalAtEnd))

  // Attending n more in a row: (attended + n) / (held + n) >= required
  const mustAttend = meets
    ? 0
    : Math.ceil((required * held - attended) / (1 - required || Number.EPSILON))

  return {
    current,
    canMiss: Math.min(canMiss, remaining),
    mustAttend: Math.max(0, mustAttend),
    meets,
    impossible: !meets && mustAttend > remaining,
  }
}

/** What the last paper has to score for the whole set to average `target`. */
export function marksNeeded(scored: number[], target: number, papersLeft: number): number | null {
  if (papersLeft <= 0) return null
  const totalPapers = scored.length + papersLeft
  const needed = target * totalPapers - scored.reduce((s, m) => s + m, 0)
  return needed / papersLeft
}
