/**
 * Subject guides — the scattered free stuff, put in one place with the analysis
 * nobody bothers to write.
 *
 * The pitch is not "here is content". Everything here exists free somewhere on
 * the internet already. The pitch is that it is scattered across ten sites, a
 * syllabus PDF nobody opens, and a hundred YouTube channels, and that assembling
 * it is a day of work every student repeats alone. This does it once.
 *
 * Rules for anything added here:
 *
 *   1. **Weightage comes from CBSE's published curriculum, and must sum to 70.**
 *      There is an assertion below that fails the build if it doesn't. Coaching
 *      sites copy each other's typos.
 *   2. **No channel goes in that hasn't been verified by hand.** An HTTP 200 and
 *      a plausible title is not verification — several dead accounts carry
 *      exactly the expected name. See HANDOVER §4.
 *   3. **Nothing invented.** If the source doesn't settle it, say so on the page
 *      rather than filling the gap. That is the only reason to trust the rest.
 */

export interface Unit {
  n: number
  name: string
  marks: number
  /** The grouping a student actually thinks in — "Organic", "Optics & waves".
   *  Rendered as a summary chip row so the shape of the paper is visible
   *  before the unit list is. */
  branch: string
  /** What actually gets asked from it, in plain terms. */
  asked: string
}

export interface GuideSection {
  id: string
  heading: string
  body: string[]
  rule?: string
}

export interface SubjectGuide {
  slug: string
  subject: string
  code: string
  grade: 12
  /** Theory marks. Practicals and IA are separate and are not moderated. */
  theoryMarks: number
  paper: {
    questions: number
    sections: string
    duration: string
  }
  /** Aryan's own result in this subject, stated before any advice is given. */
  mine: {
    theory: number
    practical: number
    total: number
    /** The honest line about how it went. */
    verdict: string
  }
  units: Unit[]
  sections: GuideSection[]
  /** Verified — see rule 2 above. */
  watch: { name: string; handle: string; href: string; note: string }[]
  sources: { label: string; href: string }[]
}

/* -------------------------------------------------------------------------- */

export const CHEMISTRY_12: SubjectGuide = {
  slug: 'class-12-chemistry',
  subject: 'Chemistry',
  code: '043',
  grade: 12,
  theoryMarks: 70,
  paper: {
    questions: 33,
    sections: 'Five — A: MCQs, B: very short, C: short, D: case-based, E: long answer',
    duration: '3 hours',
  },
  mine: {
    theory: 59,
    practical: 30,
    total: 89,
    verdict:
      'My worst paper, and the one I have most to say about. It was evaluated at 51.5, rounded to 52, and moderation took it to 59 — the biggest jump of my five subjects. I am not going to pretend I did this one well.',
  },

  // CBSE's published unit-wise weightage. Sums to 70; asserted below.
  units: [
    {
      n: 1,
      name: 'Solutions',
      marks: 7,
      branch: 'Physical',
      asked:
        'Colligative properties, and almost always a numerical — molality, elevation of boiling point, depression of freezing point, or a van’t Hoff factor question.',
    },
    {
      n: 2,
      name: 'Electrochemistry',
      marks: 9,
      branch: 'Physical',
      asked:
        'The heaviest unit in the paper, and the one the 2026 paper leaned on hardest. Nernst equation, cell EMF, conductivity and molar conductivity, and electrolysis calculations.',
    },
    {
      n: 3,
      name: 'Chemical Kinetics',
      marks: 7,
      branch: 'Physical',
      asked:
        'Rate law and order, the first-order integrated rate equation, half-life, and Arrhenius. Reliably numerical.',
    },
    {
      n: 4,
      name: 'd- and f-Block Elements',
      marks: 7,
      branch: 'Inorganic',
      asked:
        'Reason-based questions: why this oxidation state, why that colour, why this magnetic moment. Lanthanoid contraction turns up constantly.',
    },
    {
      n: 5,
      name: 'Coordination Compounds',
      marks: 7,
      branch: 'Inorganic',
      asked:
        'IUPAC naming, isomerism, and crystal field theory — hybridisation, geometry, magnetic behaviour. Very predictable once you have done thirty of them.',
    },
    {
      n: 6,
      name: 'Haloalkanes and Haloarenes',
      marks: 6,
      branch: 'Organic',
      asked: 'SN1 versus SN2 reasoning, reactivity order, and named conversions.',
    },
    {
      n: 7,
      name: 'Alcohols, Phenols and Ethers',
      marks: 6,
      branch: 'Organic',
      asked: 'Distinction tests, acidity comparisons, and mechanism-flavoured conversions.',
    },
    {
      n: 8,
      name: 'Aldehydes, Ketones and Carboxylic Acids',
      marks: 8,
      branch: 'Organic',
      asked:
        'The biggest organic unit. Named reactions, distinguishing tests, and a conversion chain almost every year.',
    },
    {
      n: 9,
      name: 'Amines',
      marks: 6,
      branch: 'Organic',
      asked: 'Basicity order with reasons, diazotisation, and identification tests.',
    },
    {
      n: 10,
      name: 'Biomolecules',
      marks: 7,
      branch: 'Biochemistry',
      asked:
        'Almost pure recall — carbohydrates, proteins, vitamins, nucleic acids. The cheapest marks in the paper.',
    },
  ],

  sections: [
    {
      id: 'where-marks-are',
      heading: 'Where the marks actually are',
      body: [
        'Organic is 26 of the 70. Physical is 23. Inorganic is 14, and Biomolecules is 7 on its own. If you are short on time, that ordering is your ordering — and it is not the order the textbook is in, which is why people who study front-to-back run out of time inside Physical and never give Organic a proper pass.',
        'Biomolecules is the anomaly worth exploiting. Seven marks, essentially no problem-solving, almost entirely recall. It is the single best marks-per-hour unit in the subject and it is routinely left until the night before, at which point people are too tired to memorise anything.',
        'Electrochemistry is nine marks on its own — more than any other unit — and it is where the 2026 paper concentrated. It is also the unit most people are weakest at, because it is the one where the numericals actually bite.',
      ],
      rule: 'If you have one week: Biomolecules, then Organic, then Electrochemistry. In that order.',
    },
    {
      id: 'the-halves',
      heading: 'Chemistry is marked in half marks, and it costs you',
      body: [
        'I only found this by adding up my own evaluated script. Chemistry had eleven half-marks in it — more than any of my other four papers, which had ten, four, two and none. Physics is the only other one that comes close.',
        'That tells you something about how the subject is marked. Long answers are broken into small scoring points and a half mark is awarded for each fragment you got — the correct reagent, the correct condition, the balanced equation, the right final product. You are not being awarded a mark for a good answer. You are being awarded fragments.',
        'The practical consequence is that a half-finished organic conversion is worth real marks and a beautifully explained wrong answer is worth none. Write the reagent above the arrow even if you cannot finish the chain. Write the condition. Balance the equation even if the mechanism defeated you.',
      ],
      rule: 'Never leave an organic conversion blank. Write the reagents you are sure of — they are separately worth half a mark each.',
    },
    {
      id: 'what-i-got-wrong',
      heading: 'What I actually got wrong',
      body: [
        'My script says 51.5 out of 70 before rounding, which is not a good score, and I know exactly what caused it: I treated Chemistry as the subject I would deal with later, all year, and later turned out to be about four days.',
        'Organic was the part that survived, because it is pattern-based and patterns can be crammed. Physical was where I bled — the numericals need to have been done before, and you cannot acquire that in a week. That maps almost exactly onto what the 2026 cohort reported: organic scoring, physical numericals tricky.',
        'If I were doing it again the only change I would make is doing Electrochemistry and Kinetics numericals through the year instead of in the last week. Not the whole subject. Just the numericals, because they are the only part that does not respond to cramming.',
      ],
    },
    {
      id: 'deleted',
      heading: 'Check the deleted list before you study anything',
      body: [
        'The syllabus was rationalised and a meaningful amount of Class 12 Chemistry is no longer examinable. Older question banks, older one-shots and most YouTube playlists still contain it, so you can lose a genuine weekend studying topics that cannot be asked.',
        'I am deliberately not listing the deleted topics here, because the lists that circulate on coaching sites contradict each other and I have not verified any of them against the source. Open CBSE’s own rationalised curriculum PDF and check your chapter against it before you start. It takes two minutes and it is the highest-value two minutes in your preparation.',
      ],
      rule: 'Verify against cbseacademic.nic.in, not against a blog. Including this one.',
    },
  ],

  // Verified by hand. See HANDOVER §4 for the ones that look right and are not.
  watch: [
    {
      name: 'Ashu Ghai sir',
      handle: '@AshuGhai11th12th',
      href: 'https://www.youtube.com/@AshuGhai11th12th',
      note: 'What I actually used, for both Physics and Chemistry. Full chapters, free, explained slowly enough to stick.',
    },
    {
      name: 'NCERT Wallah',
      handle: '@NCERTWallahClass12PW',
      href: 'https://www.youtube.com/@NCERTWallahClass12PW',
      note: 'The second opinion when Ashu sir’s explanation is not landing. Two people explaining the same chapter differently is often what makes it click.',
    },
  ],

  sources: [
    { label: 'CBSE Academic — curriculum and rationalised syllabus', href: 'https://cbseacademic.nic.in/' },
    { label: 'NCERT textbooks', href: 'https://ncert.nic.in/textbook.php' },
  ],
}

/* -------------------------------------------------------------------------- */

export const PHYSICS_12: SubjectGuide = {
  slug: 'class-12-physics',
  subject: 'Physics',
  code: '042',
  grade: 12,
  theoryMarks: 70,
  paper: {
    questions: 33,
    sections: 'Five — A: MCQs, B: very short, C: short, D: case-based, E: long answer',
    duration: '3 hours',
  },
  mine: {
    theory: 60,
    practical: 30,
    total: 90,
    verdict:
      'Evaluated at 58, moderated to 60. A respectable total hiding a bad paper: I scored full marks on both case studies and zero on a five-mark electrostatics question. My whole script is published, so you can see exactly where it went wrong.',
  },

  // Unit weightage. The chapter-level numbers below reconstruct CBSE's official
  // paired totals exactly — I+II 16, III+IV 17, V+VI 18, VII+VIII 12, IX 7 —
  // which is the check that says the table is right rather than copied.
  units: [
    {
      n: 1,
      name: 'Electrostatics',
      marks: 10,
      branch: 'Electricity & magnetism',
      asked:
        'Field and potential from charge distributions, Gauss’s law, capacitors in combination. Ten marks, heavily numerical, and the unit I personally lost the most on.',
    },
    {
      n: 2,
      name: 'Current Electricity',
      marks: 6,
      branch: 'Electricity & magnetism',
      asked: 'Drift velocity, Kirchhoff’s laws, the Wheatstone bridge, potentiometer.',
    },
    {
      n: 3,
      name: 'Magnetic Effects of Current and Magnetism',
      marks: 11,
      branch: 'Electricity & magnetism',
      asked:
        'Biot–Savart and Ampère’s law, force on conductors, torque on a loop, the moving coil galvanometer. Second-heaviest unit in the paper.',
    },
    {
      n: 4,
      name: 'Electromagnetic Induction and Alternating Current',
      marks: 6,
      branch: 'Electricity & magnetism',
      asked: 'Faraday and Lenz, self and mutual inductance, LCR circuits, the transformer.',
    },
    {
      n: 5,
      name: 'Electromagnetic Waves',
      marks: 4,
      branch: 'Optics & waves',
      asked:
        'Almost pure recall — the spectrum in order, and the uses and sources of each band. Four marks for memorising one table.',
    },
    {
      n: 6,
      name: 'Optics',
      marks: 14,
      branch: 'Optics & waves',
      asked:
        'The heaviest unit by a distance. Ray optics — mirrors, lenses, the lens maker formula, microscopes and telescopes — plus wave optics: interference, Young’s double slit, diffraction.',
    },
    {
      n: 7,
      name: 'Dual Nature of Radiation and Matter',
      marks: 4,
      branch: 'Modern physics',
      asked:
        'Photoelectric effect and de Broglie wavelength. Small, self-contained, and a frequent case study.',
    },
    {
      n: 8,
      name: 'Atoms and Nuclei',
      marks: 8,
      branch: 'Modern physics',
      asked:
        'Bohr’s model and spectral series, then binding energy per nucleon, fission and fusion. More conceptual than most of the paper.',
    },
    {
      n: 9,
      name: 'Electronic Devices',
      marks: 7,
      branch: 'Modern physics',
      asked:
        'Semiconductors, p-n junctions, diodes and rectifiers, energy band diagrams. Short syllabus, seven marks, and rarely tricky.',
    },
  ],

  sections: [
    {
      id: 'where-marks-are',
      heading: 'Optics is 14 marks and it sits at the back of the book',
      body: [
        'Optics alone is a fifth of the paper — more than Electrostatics, more than any other unit — and it is chapters 9 and 10, which is exactly where people run out of year. Electrostatics and Magnetism together are 21, and they are at the front, which is why everyone is comfortable with the first quarter of the syllabus and shaky on the part that carries the most marks.',
        'The two cheapest units are Electromagnetic Waves at 4 and Electronic Devices at 7. Between them that is 11 marks for a very short syllabus, and Electromagnetic Waves in particular is essentially one table of the spectrum and its uses. If you are triaging, those two are the highest return per hour in the subject.',
      ],
      rule: 'If you are behind: Electromagnetic Waves and Electronic Devices first — 11 marks for the least reading in the paper. Then Optics, because it is 14.',
    },
    {
      id: 'half-marks',
      heading: 'Physics is scored in half marks, and the examiner shows the arithmetic',
      body: [
        'This is the thing my script makes visible that nothing else does. The evaluator writes the sum on the page: a five-mark answer of mine reads "31a : 1 + 0.5 + 0.5 + 0.5 + 0.5 + 0.5 = 3.5". Every fragment is scored separately, and you can watch the mark being assembled.',
        'What that means is that a Physics long answer is not one answer, it is six to ten scoring slots. The formula quoted correctly is a slot. The diagram is a slot. The substitution is a slot. The final value with units is a slot. You can get the final answer wrong and still take most of the marks — and you can get it right, skip the derivation, and take very few.',
        'It also means the reverse, and this is the part that cost me. Q26 on my paper reads "0.5 + 0 + 0 + 0 + 0 + 0 = 0.5". Six slots, five empty, on a question I had genuinely half understood. Being nearly right in your head and putting almost nothing on the page is the specific way Physics marks disappear.',
      ],
      rule: 'Write the formula, then the diagram, then the substitution, then the answer with units — as separate lines. Each is a separate half mark whether or not you finish.',
    },
    {
      id: 'my-zero',
      heading: 'A full page of algebra that scored zero',
      body: [
        'Question 32 on my paper was a five-mark electrostatics question. I filled a page: field due to a dipole, the algebra expanded and simplified, a boxed final expression. It reads as a confident answer.',
        'It scored 0 + 0 + 0 + 0 + 0 = 0.',
        'I had answered a different question from the one asked. Nothing about my working was rewarded, because the marking scheme had five specific things in it and none of them were what I wrote. That is the single most expensive mistake available in a Physics paper, and it is not a knowledge failure — it is a reading failure.',
        'The alternative I also attempted, 32b, scraped 1 out of 5. Between them I put nearly two pages of work into ten marks and came away with one.',
        'This is why the fifteen minutes of reading time matter more in Physics than anywhere else. You cannot recover a misread question with effort. The page is published if you want to see what a confident zero looks like.',
      ],
      rule: 'In reading time, for every long question, write down what is actually being asked in four words before you write anything else.',
    },
    {
      id: 'case-studies',
      heading: 'The case studies are free marks and nobody treats them that way',
      body: [
        'Section D is two case-based questions, four marks each — eight marks of the paper. On my script both are full marks, 4/4 and 4/4, and they were the easiest eight marks I got.',
        'They are built to be answerable from the passage plus one standard idea. The photoelectric one gave me the setup and asked four short questions about it; the galvanometer one did the same. There is no derivation, no long numerical, and no risk of misreading a five-marker.',
        'People leave these until last because they look long on the page. They are not long. Do them early while you are fresh and bank eight marks.',
      ],
    },
  ],

  watch: [
    {
      name: 'Ashu Ghai sir',
      handle: '@AshuGhai11th12th',
      href: 'https://www.youtube.com/@AshuGhai11th12th',
      note: 'What I actually used. Most of my Physics happened in the week before the paper and this is why it was survivable at all.',
    },
    {
      name: 'Experiential Physics',
      handle: '@experientialphysics',
      href: 'https://www.youtube.com/@experientialphysics',
      note: 'My own school teacher, and the one to use for the practical side — the 30 marks that are not moderated and that everyone treats as automatic.',
    },
  ],

  sources: [
    { label: 'CBSE Academic — curriculum and rationalised syllabus', href: 'https://cbseacademic.nic.in/' },
    { label: 'NCERT textbooks', href: 'https://ncert.nic.in/textbook.php' },
  ],
}

export const GUIDES: SubjectGuide[] = [PHYSICS_12, CHEMISTRY_12]

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug)

export const unitTotal = (g: SubjectGuide) => g.units.reduce((n, u) => n + u.marks, 0)

export const branchTotals = (g: SubjectGuide) =>
  g.units.reduce<Record<string, number>>((acc, u) => {
    acc[u.branch] = (acc[u.branch] ?? 0) + u.marks
    return acc
  }, {})

// Weightage that doesn't add up to the paper is weightage someone mistyped.
// Better to fail the build than to publish a table a student plans around.
for (const g of GUIDES) {
  const sum = unitTotal(g)
  if (sum !== g.theoryMarks) {
    throw new Error(
      `${g.subject} unit weightage sums to ${sum}, but the theory paper is ${g.theoryMarks} marks`,
    )
  }
}
