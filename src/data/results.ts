/**
 * Aryan's two board results, and the evidence behind them.
 *
 * Two rules govern this file.
 *
 * 1. **Never a screenshot.** The real marksheets carry a roll number, both
 *    parents' names and a date of birth. Everything here is rebuilt from the
 *    numbers alone, so there is nothing to redact and nothing to leak.
 * 2. **Nothing hand-typed twice.** Percentages, totals and the moderation
 *    difference are all computed from the per-subject marks below. A typo in a
 *    subject row shows up as a wrong percentage rather than as a quiet lie.
 */

export interface SubjectMark {
  subject: string
  /** Written paper. This is the number CBSE moderates. */
  theory: number
  /** Practical or internal assessment — moderation never touches it. */
  internal: number
  /** What the internal column is actually called on that year's marksheet. */
  internalLabel: 'Practical' | 'Internal'
}

export interface Marksheet {
  id: string
  /** Route-safe anchor. */
  grade: 10 | 12
  examName: string
  year: number
  subjects: SubjectMark[]
  /** CBSE counts the best five subjects; a sixth is taken as a spare. */
  countedSubjects: number
  /** Set when the year's result was computed by dropping a subject. */
  droppedNote?: string
}

const total = (s: SubjectMark) => s.theory + s.internal

/* --- The two marksheets --------------------------------------------------- */

export const CLASS_12: Marksheet = {
  id: 'class-12',
  grade: 12,
  examName: 'Senior School Certificate Examination',
  year: 2026,
  countedSubjects: 5,
  subjects: [
    { subject: 'Computer Science', theory: 68, internal: 30, internalLabel: 'Practical' },
    { subject: 'English Core', theory: 76, internal: 20, internalLabel: 'Internal' },
    { subject: 'Mathematics', theory: 71, internal: 20, internalLabel: 'Internal' },
    { subject: 'Physics', theory: 60, internal: 30, internalLabel: 'Practical' },
    { subject: 'Chemistry', theory: 59, internal: 30, internalLabel: 'Practical' },
  ],
}

export const CLASS_10: Marksheet = {
  id: 'class-10',
  grade: 10,
  examName: 'Secondary School Examination',
  year: 2024,
  countedSubjects: 5,
  droppedNote: 'Six subjects sat, best five counted. Hindi was the one dropped.',
  subjects: [
    { subject: 'Computer Applications', theory: 98, internal: 0, internalLabel: 'Internal' },
    { subject: 'Social Science', theory: 96, internal: 0, internalLabel: 'Internal' },
    { subject: 'Science', theory: 95, internal: 0, internalLabel: 'Internal' },
    { subject: 'Mathematics', theory: 94, internal: 0, internalLabel: 'Internal' },
    { subject: 'English', theory: 93, internal: 0, internalLabel: 'Internal' },
    { subject: 'Hindi', theory: 89, internal: 0, internalLabel: 'Internal' },
  ],
}

export const MARKSHEETS = [CLASS_12, CLASS_10]

/* --- Derived numbers ------------------------------------------------------ */

/** Per-subject totals, highest first — which is the order CBSE counts them in. */
export function rankedTotals(sheet: Marksheet): number[] {
  return sheet.subjects.map(total).sort((a, b) => b - a)
}

/** Marks out of 500 after the best-five rule. */
export function aggregate(sheet: Marksheet): number {
  return rankedTotals(sheet)
    .slice(0, sheet.countedSubjects)
    .reduce((a, b) => a + b, 0)
}

export function percentage(sheet: Marksheet): number {
  return aggregate(sheet) / (sheet.countedSubjects * 100) * 100
}

/** One decimal place, the way a marksheet prints it. */
export function formatPercent(n: number): string {
  return `${n.toFixed(1)}%`
}

/** True when this subject is one of the five that counted. */
export function counted(sheet: Marksheet, mark: SubjectMark): boolean {
  const cut = rankedTotals(sheet)[sheet.countedSubjects - 1] ?? 0
  return total(mark) >= cut
}

export { total as subjectTotal }

/**
 * The two headline percentages, shared with the strategy page and the search
 * index so there is only one place they can be wrong.
 */
export const MY_RESULTS = [
  { percentage: formatPercent(percentage(CLASS_10)), label: 'Class 10 CBSE, 2024', grade: 10 as const },
  { percentage: formatPercent(percentage(CLASS_12)), label: 'Class 12 CBSE, 2026', grade: 12 as const },
]

/* --- The moderation evidence ---------------------------------------------- */

export interface ModerationRow {
  subject: string
  /** "Total Marks" as printed on page 1 of the evaluated answer script. */
  osm: number
  /** Theory marks as printed on the marksheet months later. */
  marksheet: number
}

/**
 * CBSE lets you buy back your own evaluated answer scripts. Almost nobody then
 * lines them up against the marksheet — which is a shame, because doing it
 * turns "moderation" from a rumour into a number.
 *
 * Three subjects match to the mark. That is what makes the other two readable:
 * if the OSM figure were a raw total before some other adjustment, or a
 * different quantity altogether, it would not land exactly on the marksheet
 * three times out of five. It is the same field. So where it differs, marks
 * were genuinely added afterwards.
 */
export const MODERATION: ModerationRow[] = [
  { subject: 'Chemistry', osm: 52, marksheet: 59 },
  { subject: 'Physics', osm: 58, marksheet: 60 },
  { subject: 'Mathematics', osm: 71, marksheet: 71 },
  { subject: 'Computer Science', osm: 68, marksheet: 68 },
  { subject: 'English Core', osm: 76, marksheet: 76 },
]

export const moderationGain = (r: ModerationRow) => r.marksheet - r.osm

/** Total marks added across all five papers. */
export const TOTAL_MODERATION = MODERATION.reduce((n, r) => n + moderationGain(r), 0)

export const EXACT_MATCHES = MODERATION.filter((r) => moderationGain(r) === 0).length

/** What the aggregate would have been on the raw evaluated marks alone. */
export const PERCENT_WITHOUT_MODERATION =
  (aggregate(CLASS_12) - TOTAL_MODERATION) / (CLASS_12.countedSubjects * 100) * 100
