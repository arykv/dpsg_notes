import type { ResourceLink } from './types'

/**
 * Every link here has been opened and checked. If one rots, delete it rather
 * than leaving a dead card on the page — a directory is only worth having if
 * you can trust every row in it.
 *
 * School-specific portals (ERP, the school site, section Classroom codes) are
 * deliberately absent: they change per batch and a wrong link wastes more time
 * than no link. The page asks students to send those in instead.
 */
export const LINKS: ResourceLink[] = [
  // --- Straight from the board --------------------------------------------
  {
    id: 'cbse-curriculum',
    label: 'Syllabus for every subject',
    href: 'https://cbseacademic.nic.in/curriculum.html',
    description: 'Official syllabus PDFs by class and year. Check this before trusting anything else.',
    category: 'cbse',
  },
  {
    id: 'cbse-curriculum-2026',
    label: 'Curriculum & chapter-wise weightage 2025–26',
    href: 'https://cbseacademic.nic.in/curriculum_2026.html',
    description: 'The official syllabus per subject, including how many marks each unit carries. Plan revision from this, not from a guess.',
    category: 'cbse',
  },
  {
    id: 'cbse-curriculum-2027',
    label: 'Curriculum & weightage 2026–27',
    href: 'https://cbseacademic.nic.in/curriculum_2027.html',
    description: 'Next session’s syllabus, for whoever is starting the year.',
    category: 'cbse',
  },
  {
    id: 'cbse-sqp-12',
    label: 'Class 12 sample papers',
    href: 'https://cbseacademic.nic.in/SQP_CLASSXII_2025-26.html',
    description: 'Sample papers with marking schemes. The marking scheme is the useful half.',
    category: 'cbse',
  },
  {
    id: 'cbse-sqp-10',
    label: 'Class 10 sample papers',
    href: 'https://cbseacademic.nic.in/SQP_CLASSX_2025-26.html',
    description: 'Sample papers with marking schemes, published by the board.',
    category: 'cbse',
  },
  {
    id: 'cbse-pyq',
    label: 'Past board papers',
    href: 'https://www.cbse.gov.in/cbsenew/question-paper.html',
    description: 'Previous years’ question papers, year by year, from CBSE itself.',
    category: 'cbse',
  },
  {
    id: 'cbse-academic',
    label: 'CBSE Academic',
    href: 'https://cbseacademic.nic.in/',
    description: 'Circulars, curriculum and everything the board publishes first.',
    category: 'cbse',
  },
  {
    id: 'cbse-main',
    label: 'CBSE main site',
    href: 'https://www.cbse.gov.in/',
    description: 'Date sheets and notices. Believe this over anything forwarded on WhatsApp.',
    category: 'cbse',
  },

  // --- Textbooks -----------------------------------------------------------
  {
    id: 'ncert-textbooks',
    label: 'NCERT textbooks',
    href: 'https://ncert.nic.in/textbook.php',
    description: 'Every NCERT book, free. Papers are set from these — everything else is commentary.',
    category: 'books',
  },
  {
    id: 'ncert-exemplar',
    label: 'NCERT Exemplar problems',
    href: 'https://ncert.nic.in/exemplar-problems.php',
    description: 'Harder than the textbook, and where the tricky board questions come from.',
    category: 'books',
  },
  {
    id: 'diksha',
    label: 'DIKSHA',
    href: 'https://diksha.gov.in/',
    description: 'Government platform with videos and practice tied to NCERT chapters.',
    category: 'books',
  },

  // --- Notes and practice --------------------------------------------------
  {
    id: 'padhle-notes',
    label: 'Padhle',
    href: 'https://padhle.in/',
    description: 'Free handwritten-style chapter notes and one-shot revision PDFs for CBSE.',
    category: 'notes',
  },
  {
    id: 'learnohub-notes',
    label: 'LearnoHub',
    href: 'https://www.learnohub.com/',
    description: 'Notes, worked questions and videos for Physics, Chemistry and Biology.',
    category: 'notes',
  },
  {
    id: 'selfstudys',
    label: 'SelfStudys',
    href: 'https://www.selfstudys.com/',
    description: 'Big archive of notes and past papers. Ad-heavy, but the material is there.',
    category: 'notes',
  },
  {
    id: 'khan-academy',
    label: 'Khan Academy',
    href: 'https://www.khanacademy.org/',
    description: 'Free lessons that explain the why. Strong for maths and physics.',
    category: 'notes',
  },

  // --- Tools you'll actually open ------------------------------------------
  {
    id: 'desmos',
    label: 'Desmos graphing calculator',
    href: 'https://www.desmos.com/calculator',
    description: 'Plot anything instantly. Best way to see what a function is doing.',
    category: 'tools',
  },
  {
    id: 'geogebra',
    label: 'GeoGebra',
    href: 'https://www.geogebra.org/',
    description: 'Geometry, 3D and calculus you can drag around. Free.',
    category: 'tools',
  },
  {
    id: 'wolfram',
    label: 'Wolfram Alpha',
    href: 'https://www.wolframalpha.com/',
    description: 'Checks your answer and shows the steps. Use it after you’ve tried, not before.',
    category: 'tools',
  },
  {
    id: 'phet',
    label: 'PhET simulations',
    href: 'https://phet.colorado.edu/',
    description: 'Interactive physics and chemistry sims. Worth an hour before a practical.',
    category: 'tools',
  },
  {
    id: 'pubchem',
    label: 'PubChem',
    href: 'https://pubchem.ncbi.nlm.nih.gov/',
    description: 'Structure and properties of any compound you’re asked about.',
    category: 'tools',
  },

  // --- Exams and results ---------------------------------------------------
  {
    id: 'cbse-results',
    label: 'CBSE results',
    href: 'https://cbseresults.nic.in/',
    description: 'Board results, the day they’re out.',
    category: 'exams',
  },
  {
    id: 'nta',
    label: 'NTA',
    href: 'https://www.nta.ac.in/',
    description: 'JEE, NEET and CUET — registration windows and official notices.',
    category: 'exams',
  },

  // --- After school --------------------------------------------------------
  {
    id: 'nsp',
    label: 'National Scholarship Portal',
    href: 'https://scholarships.gov.in/',
    description: 'Central and state scholarships in one place. The deadlines are unforgiving.',
    category: 'careers',
  },
  {
    id: 'swayam',
    label: 'SWAYAM',
    href: 'https://swayam.gov.in/',
    description: 'Free university-level courses. A real head start if you know your stream.',
    category: 'careers',
  },
  {
    id: 'nptel',
    label: 'NPTEL',
    href: 'https://nptel.ac.in/',
    description: 'IIT lecture series, free. Heavy, but excellent once you’re past Class 11.',
    category: 'careers',
  },

  // --- School accounts -----------------------------------------------------
  {
    id: 'classroom',
    label: 'Google Classroom',
    href: 'https://classroom.google.com/',
    description: 'Sign in with your school account to reach your class streams.',
    category: 'school',
    requiresLogin: true,
  },
]

export const LINK_CATEGORIES = [
  {
    id: 'cbse',
    label: 'From the board',
    blurb: 'Straight from CBSE. These settle arguments.',
  },
  { id: 'books', label: 'Textbooks', blurb: 'The books the papers are actually set from.' },
  { id: 'notes', label: 'Notes & practice', blurb: 'Free material worth your time.' },
  { id: 'tools', label: 'Things to think with', blurb: 'Open these while you study, not instead of.' },
  { id: 'exams', label: 'Exams & results', blurb: 'Where announcements land first.' },
  { id: 'careers', label: 'Beyond school', blurb: 'For when Class 12 stops feeling like the whole world.' },
  { id: 'school', label: 'School accounts', blurb: 'Needs your school-issued login.' },
] as const
