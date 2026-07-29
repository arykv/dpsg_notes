/**
 * The evaluated answer scripts, page by page.
 *
 * Published because evidence nobody can look at isn't evidence. The rest of the
 * site makes claims about what CBSE does to a paper; these are the documents
 * those claims are read off, so a student can check them rather than trust them.
 *
 * **What is covered, and nothing else:** the barcode number on page 1, the
 * office-use block on the cover (QR code plus the IDEN / SUB / BAG / CHK
 * numbers), and the small blue stamp the scanning centre applies to every page.
 * All three are the *script's* identity, not Aryan's. Every mark, every tick,
 * every correction and every word of handwriting is untouched.
 *
 * There was never a name or a roll number to remove: CBSE's own instructions,
 * printed inside the front cover, forbid writing your roll number, name or
 * school anywhere in your answers.
 *
 * Generated and verified by scripts/redact.py, which fails rather than emit a
 * page where a QR code still decodes. **Every page of every script here has
 * also been looked at individually** — that is not a formality, it is how the
 * one real mistake was caught (an early run boxed three chunks of an answer).
 */

export interface ScriptPage {
  /** Page of the PDF, 1-based — also the image filename suffix. */
  n: number
  /** Number printed on the booklet itself, where it has one. */
  booklet?: number
  caption: string
  /** Section of the paper this page opens, if any. */
  section?: string
  blank?: boolean
}

export interface Script {
  slug: string
  subject: string
  code: string
  /** Theory marks as printed on the script's own first page. */
  scriptTotal: number
  /** Theory marks as printed on the marksheet months later. */
  marksheetTotal: number
  /** One line on what this particular document is worth looking at for. */
  lede: string
  pages: ScriptPage[]
}

export const scriptImage = (slug: string, n: number) =>
  `/script/${slug}-${String(n).padStart(2, '0')}.webp`

/** The four preliminary pages every CBSE 32-page answer book opens with. */
const PRELIMS = (subject: string): ScriptPage[] => [
  {
    n: 1,
    caption: `Answer Script Details — the question-wise marks summary for ${subject}. The one page that is real text rather than a scan.`,
  },
  {
    n: 2,
    caption:
      'The front cover. Subject, code, date and medium in my handwriting; the office-use block covered.',
  },
  {
    n: 3,
    caption:
      'Instructions to Candidates — including the rule that forbids writing your roll number, name or school in any answer.',
  },
  {
    n: 4,
    caption: "The inner cover: the examiner's marks grid, the totals boxes, and the certifications.",
  },
]

const blanks = (from: number, count: number): ScriptPage[] =>
  Array.from({ length: count }, (_, i) => ({
    n: from + i,
    booklet: from + i - 3,
    caption: 'Blank, and stamped as such.',
    blank: true,
  }))

/* --- Computer Science ----------------------------------------------------- */

export const CS_SCRIPT: Script = {
  slug: 'computer-science',
  subject: 'Computer Science',
  code: '083',
  scriptTotal: 68,
  marksheetTotal: 68,
  lede: 'My best paper, and the cleanest one to read: marked entirely in whole marks, with the ticks sitting on individual lines so you can see exactly what earned what.',
  pages: [
    ...PRELIMS('Computer Science'),
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
    ...blanks(25, 10),
    { n: 35, booklet: 32, caption: 'Rough work, scanned like everything else and stamped RW.' },
  ],
}

/* --- Physics -------------------------------------------------------------- */

export const PHYSICS_SCRIPT: Script = {
  slug: 'physics',
  subject: 'Physics',
  code: '042',
  scriptTotal: 58,
  marksheetTotal: 60,
  lede: 'The interesting one. Physics is marked in half marks, and the evaluator has written the arithmetic out on the page — "31a : 1 + 0.5 + 0.5 + 0.5 + 0.5 + 0.5 = 3.5". You can watch a long answer being scored fragment by fragment.',
  pages: [
    ...PRELIMS('Physics'),
    { n: 5, booklet: 2, section: 'Section A', caption: 'Q1–Q8, the MCQs. Rough working squeezed in beside Q6.' },
    { n: 6, booklet: 3, caption: 'Q9–Q16. Two zeros here, on Q9 and Q11.' },
    {
      n: 7,
      booklet: 4,
      section: 'Section E',
      caption:
        'Q31a — the transformer. I jumped to the long answers straight after the MCQs rather than working front to back. The red box shows the mark being built: 1 + 0.5 + 0.5 + 0.5 + 0.5 + 0.5 = 3.5.',
    },
    { n: 8, booklet: 5, caption: 'Q31b — the numerical half of the transformer question.' },
    {
      n: 9,
      booklet: 6,
      caption:
        'Q32a — electrostatics. Scored 0 + 0 + 0 + 0 + 0 = 0. A full page of algebra worth nothing, and the most useful page in the document.',
    },
    { n: 10, booklet: 7, caption: 'Q32b — the alternative, which scraped 1 of 5.' },
    { n: 11, booklet: 8, caption: 'Q33a — the lens maker formula derivation. 3 of 5.' },
    { n: 12, booklet: 9, caption: 'Q33 continued, and Q33b on lens combinations.' },
    { n: 13, booklet: 10, section: 'Section B', caption: 'Q17b — Young’s double slit numerical. Four half-marks, four ticks.' },
    { n: 14, booklet: 11, caption: 'Q18 — de Broglie wavelength for an alpha particle and a proton.' },
    { n: 15, booklet: 12, caption: 'Q19 — drift velocity, derived and then evaluated.' },
    { n: 16, booklet: 13, caption: 'Q20 — torque on square versus circular loops.' },
    { n: 17, booklet: 14, caption: 'Q21 — the binding energy per nucleon curve.' },
    {
      n: 18,
      booklet: 15,
      section: 'Section C',
      caption: 'Q22 — scored 0.5 + 0 + 0 + 0 + 0 + 0 = 0.5. Crossings-out everywhere; I did not know what I was doing.',
    },
    { n: 19, booklet: 16, caption: 'Q23 — total internal reflection.' },
    { n: 20, booklet: 17, caption: 'Q23 continued.' },
    { n: 21, booklet: 18, caption: 'Q24a — the Wheatstone bridge derivation.' },
    { n: 22, booklet: 19, caption: 'Q24a concluded.' },
    { n: 23, booklet: 20, caption: 'Q24b — equivalent resistance of the network.' },
    { n: 24, booklet: 21, caption: 'Q25 — diodes and the rectifier circuit.' },
    { n: 25, booklet: 22, caption: 'Q25c — the voltage divider numerical.' },
    {
      n: 26,
      booklet: 23,
      caption: 'Q26 — capacitors in parallel. 0.5 + 0 + 0 + 0 + 0 + 0 = 0.5. Six scoring slots, five of them empty.',
    },
    { n: 27, booklet: 24, caption: 'Q27 — semiconductors and the energy band diagram.' },
    { n: 28, booklet: 25, caption: 'Q28 — the compound microscope, ray diagram and magnification.' },
    { n: 29, booklet: 26, caption: 'Q28 concluded.' },
    { n: 30, booklet: 27, section: 'Section D', caption: 'Q29 — the photoelectric effect case study. Four for four.' },
    { n: 31, booklet: 28, caption: 'Q30 — the moving coil galvanometer case study. Four for four.' },
    ...blanks(32, 2),
    { n: 34, booklet: 31, caption: 'Rough work, stamped RW.' },
    { n: 35, booklet: 32, caption: 'More rough work — the messiest page in the document, and the most honest.' },
  ],
}


/* --- Chemistry ------------------------------------------------------------ */

export const CHEMISTRY_SCRIPT: Script = {
  slug: 'chemistry',
  subject: 'Chemistry',
  code: '043',
  scriptTotal: 52,
  marksheetTotal: 59,
  lede: 'My worst paper, and the one with the most to learn from. Evaluated at 51.5, rounded up to 52, then moderated to 59 — the biggest jump of my five subjects. Almost every long answer here is scored in halves.',
  pages: [
    ...PRELIMS('Chemistry'),
    { n: 5, booklet: 2, section: 'Section A', caption: 'Q1–Q9, the MCQs. Two zeros already, on Q1 and Q5.' },
    { n: 6, booklet: 3, caption: 'Q10–Q16, including the assertion-and-reason pairs. Two more zeros.' },
    { n: 7, booklet: 4, section: 'Section B', caption: 'Q17–Q19. The first red summary box: "17 : 0.5 + 0.5 + 0.5 = 1.5".' },
    { n: 8, booklet: 5, caption: 'Q20 and Q21 — kinetics and amino acids.' },
    { n: 9, booklet: 6, section: 'Section C', caption: 'Q22 — SN1 versus SN2. "22a : 0.5 + 0 = 0.5".' },
    { n: 10, booklet: 7, caption: 'Q22b, Q22c and the start of Q23 — racemic mixtures and the phenol conversion.' },
    { n: 11, booklet: 8, caption: 'Q23 continued — Reimer–Tiemann and Friedel–Crafts.' },
    { n: 12, booklet: 9, caption: 'Q24 — acidity of carboxylic acids. Q24b scored zero.' },
    { n: 13, booklet: 10, caption: 'Q25 — anomers, invert sugar and glycosidic linkage.' },
    { n: 14, booklet: 11, caption: 'Q26 — the first-order kinetics numerical. Full marks, and the cleanest working in the paper.' },
    { n: 15, booklet: 12, caption: 'Q27b on primary cells, and the start of Q28 — elevation of boiling point.' },
    { n: 16, booklet: 13, caption: 'Q28 concluded. "28 : 0.5 + 0.5 + 1 + 0.5 = 2.5".' },
    { n: 17, booklet: 14, section: 'Section D', caption: 'Q29 — crystal field splitting, then coordination compounds. The first of several zeros on electron configurations.' },
    { n: 18, booklet: 15, caption: 'Q29 continued — the hexaammine and hexacyano complexes.' },
    { n: 19, booklet: 16, caption: 'Q30 — amine basicity, diazotisation and why aniline is acetylated before nitration.' },
    { n: 20, booklet: 17, caption: 'Q30a(ii) — the Hofmann degradation chain. Scored 0.5 of 1.' },
    { n: 21, booklet: 18, section: 'Section E', caption: 'A false start on Section E, crossed straight out. Left in because it is what actually happened.' },
    { n: 22, booklet: 19, caption: 'Q31a — the Nernst equation done properly. Three ticks in a row.' },
    { n: 23, booklet: 20, caption: 'Q31a concluded at 5 of 5, and the start of Q32 on carbonyl identification.' },
    { n: 24, booklet: 21, caption: 'Q32a(ii) — two oxidation conversions, both marked wrong.' },
    { n: 25, booklet: 22, caption: 'Q33 — d-block reduction potentials and the irregular trend.' },
    { n: 26, booklet: 23, caption: 'Q33 continued — the copper and manganese explanations, both zero.' },
    { n: 27, booklet: 24, caption: 'Q33a(ii) permanganate equations, and Q33b on lanthanoids.' },
    { n: 28, booklet: 25, caption: 'Q33b(iv) — potassium permanganate on heating. "33b_iv : 0 + 0 = 0".' },
    ...blanks(29, 5),
    { n: 34, booklet: 31, caption: 'Rough work, stamped RW.' },
    { n: 35, booklet: 32, caption: 'The densest page in any of the three scripts — every formula I could not hold in my head.' },
  ],
}


/* --- Mathematics ---------------------------------------------------------- */

export const MATHS_SCRIPT: Script = {
  slug: 'mathematics',
  subject: 'Mathematics',
  code: '041',
  scriptTotal: 71,
  marksheetTotal: 71,
  lede: 'The cleanest paper of the five, and the longest booklet — 43 pages, because Maths comes with graph paper bound in. Marked in halves throughout, and the only script where I never attempted both alternatives of an either/or.',
  pages: [
    ...PRELIMS('Mathematics'),
    { n: 5, booklet: 2, section: 'Section A', caption: 'Q1–Q8, the MCQs. Q7 is the only zero here.' },
    { n: 6, booklet: 3, caption: 'Q9–Q17. All correct.' },
    { n: 7, booklet: 4, caption: 'Q18–Q20, the assertion-and-reason questions. Q19 wrong.' },
    { n: 8, booklet: 5, section: 'Section B', caption: 'Q21 vector projection and Q22 on diagonals. "22 : 0.5 + 0.5 + 0 = 1".' },
    { n: 9, booklet: 6, caption: 'Q23b inverse trig, and the start of Q24b implicit differentiation.' },
    { n: 10, booklet: 7, caption: 'Q24b concluded, and Q25a — the cot inverse simplification. Both full marks.' },
    { n: 11, booklet: 8, section: 'Section C', caption: 'Q26 — two definite integrals, using the even-function property.' },
    { n: 12, booklet: 9, caption: 'Q26 concluded and Q27b, the differential equation. Both 3 of 3.' },
    { n: 13, booklet: 10, caption: 'Q28 — linear programming, worked as a table of corner points.' },
    { n: 14, booklet: 11, caption: 'Q29 abandoned and restarted — the probability question, crossed out and begun again.' },
    { n: 15, booklet: 12, caption: 'Q29a — the two-bag problem. "29aOR : 0.5 + 1 + 0 + 0 = 1.5".' },
    {
      n: 16,
      booklet: 13,
      caption: 'Q30 — integration by parts. "30 : 1 + 0 + 0 = 1". Set up correctly, then the working simply stops.',
    },
    { n: 17, booklet: 14, caption: 'Q31a — the surd integral, split into two and solved in parallel columns.' },
    { n: 18, booklet: 15, section: 'Section D', caption: 'Q32 — the parametric second derivative. Two pages of it.' },
    { n: 19, booklet: 16, caption: 'Q32 concluded. "32 : 1 + 1 + 0.5 + 0.5 + 1 + 0 = 4".' },
    { n: 20, booklet: 17, caption: 'Q33 — the shortest distance between two lines, worked to 5 of 5.' },
    { n: 21, booklet: 18, caption: 'Q33 concluded — the intersection point and the line through the origin.' },
    { n: 22, booklet: 19, caption: 'The LPP graph, drawn on the bound-in graph paper. 1.5 marks for the shading alone.' },
    { n: 23, caption: 'The reverse of the graph sheet. Blank.', blank: true },
    { n: 24, caption: 'A second graph sheet, unused.', blank: true },
    { n: 25, caption: 'Its reverse. Blank.', blank: true },
    { n: 26, caption: 'A third graph sheet, unused.', blank: true },
    { n: 27, booklet: 23, caption: 'Q34b — proving the function is one-one. 2.5 of 5 so far.' },
    { n: 28, booklet: 24, caption: 'Q34b concluded — proving onto. "34b : 2.5 + 2.5 = 5".' },
    { n: 29, booklet: 25, caption: 'Q35a — the 3×3 matrix inverse, with a false start crossed through.' },
    { n: 30, booklet: 26, caption: 'Q35a continued — the system of equations as a matrix product.' },
    { n: 31, booklet: 27, caption: 'Q35a concluded. "35aOR : 1 + 1.5 + 0.5 + 0.5 + 1.5 = 5".' },
    { n: 32, booklet: 28, section: 'Section E', caption: 'Q36 — the lottery case study.' },
    { n: 33, booklet: 29, caption: 'Q36 (iii) — exactly one jackpot. Half marks, and a red cross on the arithmetic.' },
    { n: 34, booklet: 30, caption: 'Q37 — the two concentric circles, with the region sketched.' },
    { n: 35, booklet: 31, caption: 'Q37 (iii) — the area integral, with a long crossed-out attempt beside it.' },
    { n: 36, booklet: 32, caption: 'Q37 concluded at 4π square units. "37_iiib : 1 + 1 = 2".' },
    { n: 37, caption: 'Blank, and stamped as such.', blank: true },
    { n: 38, booklet: 33, caption: 'Q38 — the subscription revenue maximisation. Full marks.' },
    { n: 39, caption: 'Blank, and stamped as such.', blank: true },
    { n: 40, booklet: 37, caption: 'Rough work, stamped RW.' },
    { n: 41, booklet: 38, caption: 'More rough work — matrix cofactors and half-remembered identities.' },
    { n: 42, booklet: 39, caption: 'Rough work, still going.' },
    { n: 43, booklet: 40, caption: 'The last page. Every formula I could not hold in my head.' },
  ],
}

/* -------------------------------------------------------------------------- */

export const SCRIPTS: Script[] = [CS_SCRIPT, PHYSICS_SCRIPT, CHEMISTRY_SCRIPT, MATHS_SCRIPT]

export const scriptBySlug = (slug: string) => SCRIPTS.find((s) => s.slug === slug)

export const blankCount = (s: Script) => s.pages.filter((p) => p.blank).length

// A caption list that has drifted out of step with the images on disk would
// mislabel someone's evidence, so the page count is asserted rather than assumed.
for (const s of SCRIPTS) {
  const expected = s.pages.length
  const numbers = s.pages.map((p) => p.n)
  const contiguous = numbers.every((n, i) => n === i + 1)
  if (!contiguous) {
    throw new Error(`${s.subject} script pages are not 1..${expected} in order`)
  }
}
