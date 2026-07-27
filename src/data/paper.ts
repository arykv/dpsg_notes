/**
 * What happens to a CBSE answer script after you hand it in.
 *
 * Every line here comes from reading one real evaluated script — Aryan's Class
 * 12 Computer Science paper, bought back from CBSE — page by page. Nothing is
 * repeated from a forum post, and where the document doesn't actually settle a
 * question, this file says so instead of guessing.
 *
 * The script itself is never published. Per VISION.md §4 the analysis is the
 * product; the scans are only ever the evidence, and they stay out of the repo.
 */

/* --- The journey ---------------------------------------------------------- */

export interface Stage {
  id: string
  label: string
  title: string
  body: string
  /** Something on the real script that proves this step happened. */
  evidence?: string
}

export const JOURNEY: Stage[] = [
  {
    id: 'hall',
    label: 'The hall',
    title: 'You hand it in, and it stops being yours',
    body: 'The invigilator collects the booklets, ties them into bundles and seals them. Whatever you meant to add, you cannot. This is the last time the paper exists as paper in your story.',
  },
  {
    id: 'scan',
    label: 'The scanning centre',
    title: 'It gets photographed, not posted',
    body: 'CBSE marks on screen — the whole system is called OSM, On-Screen Marking, which is also why you can buy back a PDF rather than a photocopy. Every sheet is scanned at speed, one page at a time, and each page picks up a small QR stamp and a printed page number as it goes.',
    evidence: 'Every single page of my script carries a small blue QR stamp near the top and a printed page number, including the blank ones.',
  },
  {
    id: 'evaluator',
    label: 'The examiner',
    title: 'A teacher marks your handwriting on a monitor',
    body: 'Somewhere a teacher is looking at your page on a screen, not at your booklet. The ticks and the little mark boxes are applied digitally over the scan — they sit perfectly crisp on top of ballpoint handwriting, which is how you can tell they were never drawn on paper.',
    evidence: 'The green ticks and the red-boxed mark chips on my script are sharp vector shapes over a slightly blurred photograph of my writing.',
  },
  {
    id: 'perpoint',
    label: 'The marking',
    title: 'Marks are awarded line by line, not answer by answer',
    body: 'This is the part that changes how you should write. On the longer answers there is a separate green tick against individual correct lines — the right import, the right loop header, the right closing statement — and then one box carrying the total for that question. An answer is not judged as a whole. It is scanned for the specific things worth marks.',
    evidence: 'On my four-mark file-handling answer there are five separate ticks against five separate lines, and a single chip reading 4.',
  },
  {
    id: 'total',
    label: 'The totalling',
    title: 'The system adds it up, question by question',
    body: 'Each chip is tagged with the exact sub-question it belongs to — not "Q24" but "24_ia". Page one of the returned script prints every one of those as a table, and the total is computed from it rather than added by hand at the bottom of a page.',
    evidence:
      'My summary lists 67 separate scoring slots for a paper of 37 questions. Add up the ones without an asterisk and you get 68 — exactly the total printed at the top of the same page.',
  },
  {
    id: 'moderation',
    label: 'Moderation',
    title: 'Then the subject total can move',
    body: 'After evaluation, marks can be adjusted at subject level. This is the step everyone argues about and nobody documents. Two of my five papers gained marks here; three did not move at all.',
    evidence: 'Chemistry went 52 → 59 and Physics 58 → 60, while Maths, Computer Science and English matched to the mark.',
  },
  {
    id: 'osm',
    label: 'Getting it back',
    title: 'You can buy the marked script back',
    body: 'For a few weeks after the result, CBSE sells you a PDF of your own evaluated answer books. The window is short and it does not reopen. It is worth the money even if you have no intention of applying for re-evaluation, because it is the only way you will ever see what your writing looked like to an examiner.',
  },
]

/* --- Anatomy of the script ------------------------------------------------ */

export interface Anatomy {
  id: string
  thing: string
  what: string
  /** Why a student should care. Omitted where it's just trivia. */
  soWhat?: string
}

export const ANATOMY: Anatomy[] = [
  {
    id: 'perforation',
    thing: 'A perforated “CBSE 2026” across every sheet',
    what: 'Punched dots spelling the board and year, running across the top of every page in the booklet.',
    soWhat: 'It is anti-substitution, not decoration. You cannot slip a page in later.',
  },
  {
    id: 'iden',
    thing: 'IDEN, SUB, BAG, CHK — and a QR code on the cover',
    what: 'A set of numbers identifying the script, the subject, the bundle it travelled in, and a check digit. The QR code holds the same script number that is printed on page one.',
    soWhat: 'None of it is your roll number. The booklet identifies itself, not you.',
  },
  {
    id: 'nopii',
    thing: 'Your name and roll number, nowhere',
    what: 'The instructions printed inside the front cover forbid writing your roll number, your school or your place of examination anywhere in your answers, and warn that doing so is treated as unfair means.',
    soWhat: 'This is why it is safe to talk about an evaluated script in public at all. The document is designed not to know who you are.',
  },
  {
    id: 'qnum',
    thing: 'A margin column headed “Space for writing Question Number”',
    what: 'A narrow ruled column down the left of every page, separated by the red margin line.',
    soWhat: 'Use it. The examiner is scrolling a monitor looking for question numbers, and an unnumbered answer is an answer they have to hunt for.',
  },
  {
    id: 'chip',
    thing: 'A red-boxed mark chip beside each answer',
    what: 'A small digital box carrying the mark, labelled with the exact sub-question — 07S1, 23_iS1, 24_iaORS1, 32b_iiS1.',
    soWhat: 'Every sub-part is scored in its own right, so half an answer still banks half the marks.',
  },
  {
    id: 'ticks',
    thing: 'Green circled ticks in the middle of long answers',
    what: 'Individual ticks against individual correct lines, separate from the mark chip for the whole question.',
    soWhat: 'Marks are being hunted for line by line. Put each scoring point on its own line and you make them easy to find.',
  },
  {
    id: 'crosses',
    thing: 'Red circled crosses',
    what: 'The same treatment for a line that is wrong, applied to the specific line rather than the whole answer.',
    soWhat: 'A wrong step inside a mostly right answer costs that step, not the answer.',
  },
  {
    id: 'blank',
    thing: '“Blank Page” stamped in red',
    what: 'Every unused page in the booklet carries it. On my script that is pages 22 to 31.',
    soWhat: 'Blank space is recorded, not ignored. There is no such thing as a page nobody looked at.',
  },
  {
    id: 'rough',
    thing: 'Rough work, scanned and marked RW',
    what: 'The rough work page is photographed like everything else and stamped RW in blue.',
    soWhat: 'Somebody sees your working out. Keep it on the page meant for it.',
  },
]

/* --- The real marks summary ----------------------------------------------- */

export interface MarkRow {
  /** Exactly as printed — "01", "24_iaOR", "32b_iii". */
  q: string
  /** Marks awarded, or null where the summary prints NA (not attempted). */
  marks: number | null
  /** Printed with an asterisk: evaluated, but omitted from the total. */
  omitted: boolean
}

const row = (q: string, marks: number | null, omitted = false): MarkRow => ({ q, marks, omitted })

/**
 * Every line of the question-wise marks summary from page one of the Computer
 * Science script, transcribed exactly. The footnote on the real page reads:
 * "'*' marked marks are omitted for totaling."
 */
export const CS_MARKS: MarkRow[] = [
  ...Array.from({ length: 20 }, (_, i) =>
    row(String(i + 1).padStart(2, '0'), i + 1 === 2 ? 0 : 1),
  ),
  row('21', 1),
  row('22', 2),
  row('23_i', 1),
  row('23_ii', 1),
  row('24_iaOR', 1),
  row('24_ib', 1, true),
  row('24_iiaOR', 1),
  row('24_iib', 1, true),
  row('25', 2),
  row('26', 2),
  row('27_iaOR', 1),
  row('27_ib', 1, true),
  row('27_iiaOR', 1),
  row('27_iib', 1, true),
  row('28aOR', 2),
  row('28b', 2, true),
  row('29aOR', 3),
  row('29b', null, true),
  row('30a_iOR', null, true),
  row('30a_iiOR', null, true),
  row('30a_iiiOR', null, true),
  row('30b', 3),
  row('31aOR', 3),
  row('31b', 3, true),
  row('32a_iOR', 1),
  row('32a_iiOR', 1),
  row('32a_iiiOR', 1),
  row('32a_ivOR', 1),
  row('32b_i', 1, true),
  row('32b_ii', 1, true),
  row('32b_iii', 1, true),
  row('32b_iv', 1, true),
  row('33', 4),
  row('34_i', 1),
  row('34_ii', 1),
  row('34_iii', 1),
  row('34_ivaOR', 1),
  row('34_ivb', 1, true),
  row('35', 4),
  row('36_i', 2),
  row('36_ii', 2),
  row('37_i', 1),
  row('37_ii', 1),
  row('37_iii', 1),
  row('37_iv', 1),
  row('37_vaOR', 1),
  row('37_vb', 1, true),
]

/** What the summary actually totals to. Computed, not copied. */
export const CS_TOTAL = CS_MARKS.filter((r) => !r.omitted).reduce((n, r) => n + (r.marks ?? 0), 0)

/** The figure printed in the "Total Marks" field on the same page. */
export const CS_PRINTED_TOTAL = 68

export const CS_SLOTS = CS_MARKS.length

/** Sub-parts that were evaluated but asterisked out of the total. */
export const BOTH_ATTEMPTED_SLOTS = CS_MARKS.filter((r) => r.omitted && r.marks !== null).length

/** How many distinct questions those slots belong to — "24_ib" and "24_iib" are one question. */
export const BOTH_ATTEMPTED_QUESTIONS = new Set(
  CS_MARKS.filter((r) => r.omitted && r.marks !== null).map((r) => r.q.match(/^\d+/)?.[0]),
).size

/* --- Lessons -------------------------------------------------------------- */

export interface Lesson {
  id: string
  rule: string
  body: string
}

export const LESSONS: Lesson[] = [
  {
    id: 'points',
    rule: 'Write in scoring points, one per line',
    body: 'The ticks land on individual lines. A dense paragraph containing four correct things is harder to award four marks to than four short lines each containing one. This is the single biggest thing I would tell my own Class 11 self.',
  },
  {
    id: 'number',
    rule: 'Number everything, in the margin column',
    body: 'There is a column printed for it. An examiner moving through hundreds of scripts on a screen should never have to work out which question they are looking at.',
  },
  {
    id: 'partial',
    rule: 'Never leave a sub-part blank because the rest defeated you',
    body: 'Every sub-part carries its own chip. On a five-part question you can lose four and still bank the fifth, and the summary will record it.',
  },
  {
    id: 'both',
    rule: 'Attempting both alternatives neither helps nor hurts',
    body: 'On seven either/or questions I answered both. The summary scores both and then omits one from the total — the footnote says so, and the arithmetic proves it. It cost me time I could have spent checking the rest of the paper.',
  },
  {
    id: 'rough',
    rule: 'Assume your rough work is read',
    body: 'It is scanned and stamped like every other page. Keep it on the page meant for it, and do not write anything there you would not want an examiner to see.',
  },
  {
    id: 'nopii',
    rule: 'Never write your name or roll number in an answer',
    body: 'The instructions inside the cover list it as unfair means, alongside making any special mark on the booklet. There is no upside and a serious downside.',
  },
]
