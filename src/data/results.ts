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
  /** What the written paper was out of. Not 100, and not the same for every subject. */
  theoryMax: number
  /** Practical or internal assessment — moderation never touches it. */
  internal: number
  /** What the internal component was out of. */
  internalMax: number
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
  /** The honest paragraph about what the internal column is worth that year. */
  internalNote: string
}

const total = (s: SubjectMark) => s.theory + s.internal

/* --- The two marksheets --------------------------------------------------- */

export const CLASS_12: Marksheet = {
  id: 'class-12',
  grade: 12,
  examName: 'Senior School Certificate Examination',
  year: 2026,
  countedSubjects: 5,
  internalNote:
    'Don’t read too much into the practical marks. At my school they only ever ran 28 to 30 out of 30 — I never saw 25 or 26 on anyone’s, and getting less than that would have meant something had actually gone wrong. Other schools may mark them differently. It’s the theory column that’s earned in the exam hall, and it’s the only one CBSE moderates.',
  subjects: [
    { subject: 'Computer Science', theory: 68, theoryMax: 70, internal: 30, internalMax: 30, internalLabel: 'Practical' },
    { subject: 'English Core', theory: 76, theoryMax: 80, internal: 20, internalMax: 20, internalLabel: 'Internal' },
    { subject: 'Mathematics', theory: 71, theoryMax: 80, internal: 20, internalMax: 20, internalLabel: 'Internal' },
    { subject: 'Physics', theory: 60, theoryMax: 70, internal: 30, internalMax: 30, internalLabel: 'Practical' },
    { subject: 'Chemistry', theory: 59, theoryMax: 70, internal: 30, internalMax: 30, internalLabel: 'Practical' },
  ],
}

/**
 * Class 10, and this table was wrong on this site for months.
 *
 * It listed the subject totals in the theory column and left internals at zero,
 * which quietly claimed I had written a 98-mark paper in Computer Applications.
 * I hadn't. Five of the six subjects are 80 theory plus 20 internal, and I got
 * the full 20 in every one of them — so a chunk of every number in the right
 * column was never earned in an exam hall at all.
 *
 * Computer Applications is different again. It is CBSE code 165, a skill
 * subject, and it runs 50 theory plus 50 practical rather than 80 plus 20 —
 * so the 98 that led the list is 48 in the paper and a full practical. It is
 * still my highest mark; it is just not the mark it looked like.
 */
export const CLASS_10: Marksheet = {
  id: 'class-10',
  grade: 10,
  examName: 'Secondary School Examination',
  year: 2024,
  countedSubjects: 5,
  droppedNote: 'Six subjects sat, best five counted. Hindi was the one dropped.',
  internalNote:
    'Every one of those internal marks is full, and that is worth being suspicious about rather than impressed by. Twenty marks of internal assessment is periodic tests, notebooks and subject enrichment, marked by your own school — nearly everybody gets 19 or 20, so it lifts the whole class equally and tells you nothing about who can write a paper. Read the theory column instead. That one was 80 marks in a hall with a stranger marking it.',
  subjects: [
    { subject: 'Computer Applications', theory: 48, theoryMax: 50, internal: 50, internalMax: 50, internalLabel: 'Practical' },
    { subject: 'Social Science', theory: 76, theoryMax: 80, internal: 20, internalMax: 20, internalLabel: 'Internal' },
    { subject: 'Science', theory: 75, theoryMax: 80, internal: 20, internalMax: 20, internalLabel: 'Internal' },
    { subject: 'Mathematics', theory: 74, theoryMax: 80, internal: 20, internalMax: 20, internalLabel: 'Internal' },
    { subject: 'English', theory: 73, theoryMax: 80, internal: 20, internalMax: 20, internalLabel: 'Internal' },
    { subject: 'Hindi', theory: 69, theoryMax: 80, internal: 20, internalMax: 20, internalLabel: 'Internal' },
  ],
}

export const MARKSHEETS = [CLASS_12, CLASS_10]

/**
 * Marks that exceed what the component was out of are a typo, and a typo here
 * is the site claiming a mark that was never awarded. Fail the build instead.
 */
for (const sheet of MARKSHEETS) {
  for (const s of sheet.subjects) {
    if (s.theoryMax + s.internalMax !== 100) {
      throw new Error(
        `Class ${sheet.grade} ${s.subject}: ${s.theoryMax} + ${s.internalMax} is not a 100-mark subject`,
      )
    }
    if (s.theory > s.theoryMax || s.internal > s.internalMax || s.theory < 0 || s.internal < 0) {
      throw new Error(`Class ${sheet.grade} ${s.subject}: marks fall outside what it was out of`)
    }
  }
}

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
 * The same result, counting only the papers actually written in an exam hall.
 *
 * Every aggregate CBSE prints has the internal column folded into it, and the
 * internal column is marked by your own school and runs near full for almost
 * everybody. So the headline percentage is always a bit kinder than the writing
 * behind it. This is the unkind version of both of mine, and publishing it
 * costs about two points — which is the price of the number above meaning
 * something.
 */
export function theoryPercentage(sheet: Marksheet): number {
  const counting = sheet.subjects
    .filter((s) => counted(sheet, s))
    .slice(0, sheet.countedSubjects)
  const got = counting.reduce((n, s) => n + s.theory, 0)
  const outOf = counting.reduce((n, s) => n + s.theoryMax, 0)
  return outOf ? (got / outOf) * 100 : 0
}

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

/**
 * Chemistry's question-wise marks add up to 51.5, and the script prints 52.
 *
 * It is the only one of the five that doesn't reconcile exactly, and there's a
 * clean reason: it's the only paper with an *odd* number of half-marks (11).
 * Physics had 10, English 4, Maths 2 — all even, so they landed on whole
 * numbers and needed no rounding at all. Computer Science was marked in whole
 * marks throughout.
 *
 * So a fractional script total is rounded up before moderation is applied,
 * which makes Chemistry's real journey 51.5 → 52 → 59.
 */
export const CHEMISTRY_RAW = 51.5

/** Half-marks counted in each script's question-wise summary. */
export const HALF_MARKS: Record<string, number> = {
  'Computer Science': 0,
  Mathematics: 2,
  'English Core': 4,
  Physics: 10,
  Chemistry: 11,
}

/** Total marks added across all five papers. */
export const TOTAL_MODERATION = MODERATION.reduce((n, r) => n + moderationGain(r), 0)

export const EXACT_MATCHES = MODERATION.filter((r) => moderationGain(r) === 0).length

/** What the aggregate would have been on the raw evaluated marks alone. */
export const PERCENT_WITHOUT_MODERATION =
  (aggregate(CLASS_12) - TOTAL_MODERATION) / (CLASS_12.countedSubjects * 100) * 100
