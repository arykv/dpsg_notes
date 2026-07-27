/**
 * The Computer Science answer script, page by page.
 *
 * Published because evidence nobody can look at isn't evidence. The rest of the
 * site makes claims about what CBSE does to a paper; this is the document those
 * claims are read off, so a student can check them rather than trust them.
 *
 * **What is covered, and nothing else:** the barcode number on page 1, the
 * office-use block on the cover (QR code plus the IDEN / SUB / BAG / CHK
 * numbers), and the small blue stamp the scanning centre applies to every page.
 * All three are the *script's* identity, not Aryan's. Every mark, every tick,
 * every correction and every word of handwriting is untouched.
 *
 * There was never a name or a roll number to remove: CBSE's own instructions,
 * printed inside the front cover and reproduced on page 3, forbid writing your
 * roll number, name or school anywhere in your answers.
 *
 * Generated and verified by scripts/redact.py, which fails the build rather
 * than emit a page where a QR code still decodes.
 */

export interface ScriptPage {
  /** Page of the PDF, 1-based — also the image filename suffix. */
  n: number
  /** Number printed on the booklet itself, where it has one. */
  booklet?: number
  /** What this page is. */
  caption: string
  /** Section of the paper this page opens, if any. */
  section?: string
  blank?: boolean
}

const SUBJECT = 'computer-science'

export const scriptImage = (n: number) => `/script/${SUBJECT}-${String(n).padStart(2, '0')}.webp`

export const CS_SCRIPT: ScriptPage[] = [
  { n: 1, caption: 'Answer Script Details — the question-wise marks summary. The one page that is real text rather than a scan.' },
  { n: 2, caption: 'The front cover. Subject, code, date and medium in my handwriting; the office-use block covered.' },
  { n: 3, caption: 'Instructions to Candidates — including the rule that forbids writing your roll number, name or school in any answer.' },
  { n: 4, caption: "The inner cover: the examiner's marks grid, the totals boxes, and the chain of certifications and signatures." },

  { n: 5, booklet: 2, section: 'Section A', caption: 'Q1–Q6. One mark each. Q2 is the zero.' },
  { n: 6, booklet: 3, caption: 'Q7–Q12, with my reasoning written out beside Q8.' },
  { n: 7, booklet: 4, caption: 'Q13–Q18.' },
  { n: 8, booklet: 5, caption: 'Q19–Q21, the assertion-and-reason pair.' },

  { n: 9, booklet: 6, section: 'Section B', caption: 'Q22 — default versus positional parameters.' },
  { n: 10, booklet: 7, caption: 'Q23 and Q24. Both alternatives of Q24 answered; only one counted.' },
  { n: 11, booklet: 8, caption: 'Q25 and Q26. Note the separate ticks inside the Q26 function.' },
  { n: 12, booklet: 9, caption: 'Q27 — SQL. Both alternatives again.' },
  { n: 13, booklet: 10, caption: 'Q28 — bus topology, advantages and disadvantages.' },

  { n: 14, booklet: 11, section: 'Section C', caption: 'Q29 — counting digits in a text file. Five ticks on five separate lines.' },
  { n: 15, booklet: 12, caption: 'Q30 — the stack push-and-display function, with a correction mid-answer.' },
  { n: 16, booklet: 13, caption: 'Q31 — short output questions.' },

  { n: 17, booklet: 14, section: 'Section D', caption: 'Q32 — SQL queries and their output tables.' },
  { n: 18, booklet: 15, caption: 'Q33 — the CSV question. Four marks.' },
  { n: 19, booklet: 16, caption: 'Q34 — more SQL, including a join.' },
  { n: 20, booklet: 17, caption: 'Q35 — the database connectivity program. Four marks.' },

  { n: 21, booklet: 18, section: 'Section E', caption: 'Q36 (i) — the pickle append function.' },
  { n: 22, booklet: 19, caption: 'Q36 (ii) — the update function. Two red crosses here: this is where I lost marks.' },
  { n: 23, booklet: 20, caption: 'Q37 (i) and (ii) — the network case study and my cable layout diagram.' },
  { n: 24, booklet: 21, caption: 'Q37 (iii) to (v).' },

  ...Array.from({ length: 10 }, (_, i) => ({
    n: 25 + i,
    booklet: 22 + i,
    caption: 'Blank, and stamped as such.',
    blank: true,
  })),

  { n: 35, booklet: 32, caption: 'Rough work, scanned like everything else and stamped RW.' },
]

export const CS_SCRIPT_PAGES = CS_SCRIPT.length
export const CS_SCRIPT_BLANKS = CS_SCRIPT.filter((p) => p.blank).length
