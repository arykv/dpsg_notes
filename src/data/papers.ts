import { GUIDES, type SubjectGuide, type Unit } from './guides'

/**
 * Papers you can plan a night around.
 *
 * "Pull an all nighter" used to run off `guides.ts`, which meant it only knew
 * about Class 12 — the only year with a full written guide behind it. But the
 * night before a Class 11 final is the same night, and pretending the feature
 * doesn't apply to half the school was an accident of how the data was stored
 * rather than a decision anybody made.
 *
 * So the shape of a paper lives here, separately from the analysis of it. Class
 * 12 papers are *derived* from the guides rather than retyped, so there is still
 * exactly one place the weightage can be wrong. Class 11 is new data, and every
 * number in it was read out of CBSE's own 2025–26 curriculum PDF — the files
 * under `cbseacademic.nic.in/web_material/CurriculumMain26/SrSec/`, not off a
 * coaching site. The build fails if any of it stops adding up.
 *
 * ## The one honesty rule that is different for Class 11
 *
 * Class 11 is not a board exam. CBSE publishes the syllabus and the unit
 * weightage, and schools set the paper to it — but nobody can tell you "this
 * always comes up", because there is no national paper for a pattern to exist
 * in. So Class 11 unit descriptions say what is *in* a unit and what it is
 * *worth*. They never claim to know what your school will ask.
 */

export interface Paper {
  /** Unique across both years: `class-11-physics`. */
  slug: string
  subject: string
  /** CBSE subject code. */
  code: string
  grade: 11 | 12
  /** The written paper. This is the number the plan is built against. */
  theoryMarks: number
  /** Practical or internal assessment. Not something a night before can move. */
  internalMarks: number
  units: Unit[]
  /** Where a full written guide exists for this paper. Class 11 has none yet. */
  guideSlug?: string
}

/* --- Class 11 -------------------------------------------------------------
   Source: CBSE Senior Secondary Curriculum 2025-26, subject by subject.
   Physics groups its ten units into four marked blocks and only publishes a
   figure per block — so that is what appears here. Splitting a block into
   per-unit marks would mean inventing numbers CBSE doesn't give, which is
   exactly the thing every coaching site does and this one doesn't.
-------------------------------------------------------------------------- */

const PHYSICS_11: Paper = {
  slug: 'class-11-physics',
  subject: 'Physics',
  code: '042',
  grade: 11,
  theoryMarks: 70,
  internalMarks: 30,
  units: [
    {
      n: 1,
      name: 'Measurement, kinematics and laws of motion',
      marks: 23,
      branch: 'Mechanics',
      effort: 'heavy',
      asked:
        'CBSE marks Units I–III as a single block of 23 — Units and Measurements, Motion in a Straight Line, Motion in a Plane, Laws of Motion. A third of the paper, almost entirely numerical, and the part everything later in the year is built on.',
    },
    {
      n: 2,
      name: 'Work, energy, power and rotational motion',
      marks: 17,
      branch: 'Mechanics',
      effort: 'heavy',
      asked:
        'Units IV–V together — work–energy theorem, conservation of energy, collisions, then centre of mass, torque, moment of inertia and angular momentum. Rotational motion is the hardest thing in the Class 11 course and it is not learnable in an evening.',
    },
    {
      n: 3,
      name: 'Gravitation, bulk matter, thermodynamics and kinetic theory',
      marks: 20,
      branch: 'Heat & matter',
      asked:
        'Units VI–IX as one block of 20 — gravitation, mechanical properties of solids and fluids, thermal properties, thermodynamics, kinetic theory. Broad rather than deep, and a lot of it is standard results you can hold in your head.',
    },
    {
      n: 4,
      name: 'Oscillations and waves',
      marks: 10,
      branch: 'Waves',
      asked:
        'SHM and its energy, the simple pendulum, then wave motion, superposition, standing waves and beats. Self-contained — you can do this one without the rest of the syllabus, which is rare.',
    },
  ],
}

const CHEMISTRY_11: Paper = {
  slug: 'class-11-chemistry',
  subject: 'Chemistry',
  code: '043',
  grade: 11,
  theoryMarks: 70,
  internalMarks: 30,
  units: [
    {
      n: 1,
      name: 'Some Basic Concepts of Chemistry',
      marks: 7,
      branch: 'Physical',
      effort: 'heavy',
      asked:
        'The mole concept, molar mass, empirical and molecular formulae, and stoichiometry. Seven marks, but it is the arithmetic the rest of the subject runs on — being shaky here costs you marks in units it is not even about.',
    },
    {
      n: 2,
      name: 'Structure of Atom',
      marks: 9,
      branch: 'Physical',
      asked:
        'Bohr’s model and its limits, de Broglie, the Heisenberg principle, quantum numbers, orbital shapes, and filling order — Aufbau, Pauli, Hund.',
    },
    {
      n: 3,
      name: 'Classification of Elements and Periodicity',
      marks: 6,
      branch: 'Inorganic',
      effort: 'recall',
      asked:
        'Periodic trends and the reasoning behind them: atomic radius, ionisation enthalpy, electron gain enthalpy, electronegativity. Six marks of almost pure recall — the cheapest marks in the paper when you are short of hours.',
    },
    {
      n: 4,
      name: 'Chemical Bonding and Molecular Structure',
      marks: 7,
      branch: 'Inorganic',
      asked:
        'Lewis structures, VSEPR shapes, valence bond theory and hybridisation, molecular orbital theory for simple diatomics, and hydrogen bonding.',
    },
    {
      n: 5,
      name: 'Chemical Thermodynamics',
      marks: 9,
      branch: 'Physical',
      effort: 'heavy',
      asked:
        'Internal energy, enthalpy and Hess’s law, entropy, and Gibbs free energy as the criterion for spontaneity. Nine marks and heavily numerical.',
    },
    {
      n: 6,
      name: 'Equilibrium',
      marks: 7,
      branch: 'Physical',
      effort: 'heavy',
      asked:
        'Both halves — the equilibrium constant and Le Chatelier, then ionic equilibrium: pH, buffers, solubility product, and the acid–base theories.',
    },
    {
      n: 7,
      name: 'Redox Reactions',
      marks: 4,
      branch: 'Physical',
      asked:
        'Oxidation numbers, balancing redox equations by the half-reaction method, and redox titration basics. Small, mechanical, and quick to secure.',
    },
    {
      n: 8,
      name: 'Organic Chemistry: Basic Principles and Techniques',
      marks: 11,
      branch: 'Organic',
      asked:
        'The largest single unit — IUPAC naming, isomerism, and the reaction mechanism vocabulary the whole of organic chemistry then assumes: inductive and resonance effects, electrophiles and nucleophiles, and the three kinds of bond fission.',
    },
    {
      n: 9,
      name: 'Hydrocarbons',
      marks: 10,
      branch: 'Organic',
      asked:
        'Alkanes, alkenes, alkynes and aromatics — preparation, properties, and the named reactions. Ten marks that reward memorising a reaction map more than they reward understanding.',
    },
  ],
}

const MATHS_11: Paper = {
  slug: 'class-11-maths',
  subject: 'Mathematics',
  code: '041',
  grade: 11,
  theoryMarks: 80,
  internalMarks: 20,
  units: [
    {
      n: 1,
      name: 'Sets and Functions',
      marks: 23,
      branch: 'Foundations',
      asked:
        'Sets and their operations, relations and functions with domain and range, and then trigonometric functions — identities, general solutions, and graphs. Trigonometry is most of the block and most of the difficulty.',
    },
    {
      n: 2,
      name: 'Algebra',
      marks: 25,
      branch: 'Algebra',
      asked:
        'The biggest block in the paper: complex numbers, linear inequalities, permutations and combinations, the binomial theorem, and sequences and series. Five separate topics that share nothing except the mark pool.',
    },
    {
      n: 3,
      name: 'Coordinate Geometry',
      marks: 12,
      branch: 'Geometry',
      asked:
        'Straight lines, then conic sections — circle, parabola, ellipse, hyperbola — and an introduction to three-dimensional geometry. Formula-heavy and very learnable in a night if you have the formula list.',
    },
    {
      n: 4,
      name: 'Calculus',
      marks: 8,
      branch: 'Calculus',
      asked:
        'Limits, derivatives from first principles, and the standard differentiation rules. Only eight marks here, but it is the foundation the whole of Class 12 calculus — 35 marks of it — sits on.',
    },
    {
      n: 5,
      name: 'Statistics and Probability',
      marks: 12,
      branch: 'Data',
      effort: 'recall',
      asked:
        'Mean deviation, variance and standard deviation, then basic probability. Almost entirely formula-and-substitute. Twelve marks at the lowest effort per mark in the paper.',
    },
  ],
}

const ENGLISH_11: Paper = {
  slug: 'class-11-english',
  subject: 'English Core',
  code: '301',
  grade: 11,
  theoryMarks: 80,
  internalMarks: 20,
  units: [
    {
      n: 1,
      name: 'Reading Skills',
      marks: 26,
      branch: 'Reading',
      unpreppable: true,
      asked:
        'Two unseen passages, then note-making and a summary. Twenty-six marks that no amount of revision touches — but note-making is a fixed format worth 5, and that part you can practise.',
    },
    {
      n: 2,
      name: 'Grammar and Creative Writing Skills',
      marks: 23,
      branch: 'Writing',
      effort: 'recall',
      asked:
        'Seven marks of grammar — gap filling, clauses, transformation — and sixteen of writing: classified advertisement, poster, speech, debate. Every one of those four has a published layout with the marks split between format, content and expression.',
    },
    {
      n: 3,
      name: 'Literature — Hornbill and Snapshots',
      marks: 31,
      branch: 'Literature',
      asked:
        'Extract-based questions on prose and poetry, short answers of 40–50 words, and long answers. Thirty-one marks, and the only part of this paper where knowing the chapters is what scores.',
    },
  ],
}

const CS_11: Paper = {
  slug: 'class-11-computer-science',
  subject: 'Computer Science',
  code: '083',
  grade: 11,
  theoryMarks: 70,
  internalMarks: 30,
  units: [
    {
      n: 1,
      name: 'Computer Systems and Organisation',
      marks: 10,
      branch: 'Systems',
      effort: 'recall',
      asked:
        'Hardware and software, the memory hierarchy and its units, what an operating system does, Boolean logic with truth tables and De Morgan’s laws, and number system conversions. Ten marks, and most of it is a table you can learn.',
    },
    {
      n: 2,
      name: 'Computational Thinking and Programming — 1',
      marks: 45,
      branch: 'Python',
      effort: 'heavy',
      asked:
        'Forty-five of the seventy marks. Python from the start: data types, operators, control flow, strings, lists, tuples and dictionaries. This is a skill rather than a syllabus — it does not go in overnight, and the honest move the night before is to secure the other twenty-five marks first.',
    },
    {
      n: 3,
      name: 'Society, Law and Ethics',
      marks: 15,
      branch: 'Ethics',
      effort: 'recall',
      asked:
        'Digital footprints, netiquette, intellectual property and licensing, cybercrime, the IT Act, e-waste, and health concerns around technology. Fifteen marks of straight recall, and by a distance the best value in the paper on a short night.',
    },
  ],
}

export const CLASS_11_PAPERS: Paper[] = [
  PHYSICS_11,
  CHEMISTRY_11,
  MATHS_11,
  ENGLISH_11,
  CS_11,
]

/* --- Class 12, derived from the guides so nothing is typed twice ---------- */

/** Practical or internal marks by Class 12 subject, from Aryan's own marksheet. */
const CLASS_12_INTERNAL: Record<string, number> = {
  'class-12-physics': 30,
  'class-12-chemistry': 30,
  'class-12-maths': 20,
  'class-12-english': 20,
  'class-12-computer-science': 30,
}

const fromGuide = (g: SubjectGuide): Paper => ({
  slug: g.slug,
  subject: g.subject,
  code: g.code,
  grade: 12,
  theoryMarks: g.theoryMarks,
  internalMarks: CLASS_12_INTERNAL[g.slug] ?? 20,
  units: g.units,
  guideSlug: g.slug,
})

export const CLASS_12_PAPERS: Paper[] = GUIDES.map(fromGuide)

export const PAPERS: Paper[] = [...CLASS_12_PAPERS, ...CLASS_11_PAPERS]

export const GRADES = [12, 11] as const
export type Grade = (typeof GRADES)[number]

export const papersFor = (grade: Grade) => PAPERS.filter((p) => p.grade === grade)

export const paperBySlug = (slug: string) => PAPERS.find((p) => p.slug === slug)

/**
 * CBSE's pass mark is 33% of the written paper, floored — which is why a
 * 70-mark paper passes at 23 and an 80-mark one at 26, the figures the board
 * itself publishes. For any subject with a practical you also need 33% of the
 * practical *separately*: a perfect practical cannot rescue a failed theory
 * paper, and this is the single most misunderstood rule in the whole system.
 */
export const passMark = (p: Paper) => Math.floor(p.theoryMarks * 0.33)

/**
 * Weightage that doesn't add up to the paper is weightage somebody mistyped,
 * and a student plans their week on it. Same assertion the guides carry — this
 * one covers Class 11, where there is no guide page to catch it.
 */
for (const p of PAPERS) {
  const sum = p.units.reduce((n, u) => n + u.marks, 0)
  if (sum !== p.theoryMarks) {
    throw new Error(
      `Class ${p.grade} ${p.subject}: units sum to ${sum}, but the paper is ${p.theoryMarks} marks`,
    )
  }
  if (p.units.some((u) => u.marks <= 0)) {
    throw new Error(`Class ${p.grade} ${p.subject}: a unit has no marks against it`)
  }
}

/** Two papers sharing a slug would silently shadow each other in the picker. */
{
  const seen = new Set<string>()
  for (const p of PAPERS) {
    if (seen.has(p.slug)) throw new Error(`Duplicate paper slug: ${p.slug}`)
    seen.add(p.slug)
  }
}
