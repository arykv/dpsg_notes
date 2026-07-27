import type { Subject, SubjectId } from './types'

export const SUBJECTS: Subject[] = [
  {
    id: 'physics',
    name: 'Physics',
    code: 'PH',
    grades: [11, 12],
    streams: ['science'],
    blurb: 'Mechanics through thermodynamics, plus every derivation worth memorising.',
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    code: 'CH',
    grades: [11, 12],
    streams: ['science'],
    blurb: 'Physical, organic and inorganic — including the reaction maps.',
  },
  {
    id: 'maths',
    name: 'Mathematics',
    code: 'MA',
    grades: [10, 11, 12],
    streams: ['science', 'commerce'],
    blurb: 'Worked solutions, not just answers. Sets to calculus.',
  },
  {
    id: 'biology',
    name: 'Biology',
    code: 'BI',
    grades: [11, 12],
    streams: ['science'],
    blurb: 'Diagram-heavy notes for the chapters that are all diagrams.',
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    code: 'CS',
    grades: [11, 12],
    streams: ['science', 'commerce'],
    blurb: 'Python, data structures and the SQL nobody revises until April.',
  },
  {
    id: 'english',
    name: 'English Core',
    code: 'EN',
    grades: [9, 10, 11, 12],
    streams: ['common'],
    blurb: 'Chapter summaries, character notes and writing-section formats.',
  },
  {
    id: 'accountancy',
    name: 'Accountancy',
    code: 'AC',
    grades: [11, 12],
    streams: ['commerce'],
    blurb: 'Formats, journal entries and the balance sheets that never tally.',
  },
  {
    id: 'business-studies',
    name: 'Business Studies',
    code: 'BS',
    grades: [11, 12],
    streams: ['commerce'],
    blurb: 'Point-wise notes built for the 6-markers.',
  },
  {
    id: 'economics',
    name: 'Economics',
    code: 'EC',
    grades: [11, 12],
    streams: ['commerce', 'arts'],
    blurb: 'Micro, macro and the graphs you have to draw exactly right.',
  },
  {
    id: 'history',
    name: 'History',
    code: 'HI',
    grades: [11, 12],
    streams: ['arts'],
    blurb: 'Timelines, themes and source-based question practice.',
  },
  {
    id: 'political-science',
    name: 'Political Science',
    code: 'PS',
    grades: [11, 12],
    streams: ['arts'],
    blurb: 'Structured answers for a paper that rewards structure.',
  },
  {
    id: 'psychology',
    name: 'Psychology',
    code: 'PY',
    grades: [11, 12],
    streams: ['arts'],
    blurb: 'Case studies and definitions in the words examiners expect.',
  },
  {
    id: 'hindi',
    name: 'Hindi',
    code: 'HN',
    grades: [9, 10, 11, 12],
    streams: ['common'],
    blurb: 'व्याकरण, सार और लेखन — chapter by chapter.',
  },
  {
    id: 'science',
    name: 'Science',
    code: 'SC',
    grades: [9, 10],
    streams: ['common'],
    blurb: 'The combined Class 9–10 paper: physics, chemistry and biology.',
  },
  {
    id: 'social-science',
    name: 'Social Science',
    code: 'SS',
    grades: [9, 10],
    streams: ['common'],
    blurb: 'History, geography, civics and economics in one place.',
  },
]

const BY_ID = new Map<SubjectId, Subject>(SUBJECTS.map((s) => [s.id, s]))

export function getSubject(id: SubjectId): Subject | undefined {
  return BY_ID.get(id)
}

export function subjectName(id: SubjectId): string {
  return BY_ID.get(id)?.name ?? id
}
