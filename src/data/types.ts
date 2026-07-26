/** Grades the site currently carries content for. */
export type Grade = 9 | 10 | 11 | 12

export type Stream = 'science' | 'commerce' | 'arts' | 'common'

export type SubjectId =
  | 'physics'
  | 'chemistry'
  | 'maths'
  | 'biology'
  | 'computer-science'
  | 'english'
  | 'accountancy'
  | 'business-studies'
  | 'economics'
  | 'history'
  | 'political-science'
  | 'psychology'
  | 'hindi'
  | 'science'
  | 'social-science'

/** What kind of thing a resource is. Drives the icon, the filter and the copy. */
export type ResourceKind =
  | 'notes'
  | 'pyq'
  | 'sample-paper'
  | 'syllabus'
  | 'formula-sheet'
  | 'practical'
  | 'homework'
  | 'revision'

export interface Subject {
  id: SubjectId
  name: string
  /** Two-letter mark used on cards and in the palette. */
  code: string
  grades: Grade[]
  streams: Stream[]
  /** A student-facing line, not a syllabus blurb. */
  blurb: string
}

export interface Resource {
  /** Stable slug — this is the URL, so never rename one after it ships. */
  id: string
  title: string
  subject: SubjectId
  grade: Grade
  stream: Stream
  kind: ResourceKind
  /** Path under /public, or an absolute URL for anything hosted elsewhere. */
  href: string
  /** Who wrote or shared it. Credit is the whole reason people contribute. */
  contributor: string
  /** ISO date the material was made or last revised. */
  updated: string
  /** Rough file size in MB, for the "is this going to eat my data" question. */
  sizeMb?: number
  pages?: number
  /** Chapters or topics covered — the strongest search signal we have. */
  topics?: string[]
  /** Set once for anything a teacher or the school published. */
  official?: boolean
  /** Scanned handwriting rather than a typed document. */
  handwritten?: boolean
}

export interface ResourceLink {
  id: string
  label: string
  href: string
  description: string
  category: 'school' | 'cbse' | 'books' | 'notes' | 'tools' | 'exams' | 'careers'
  /** True when the link needs school-issued credentials. */
  requiresLogin?: boolean
}

export interface Period {
  /** Display name — "Period 4", "Short break", "Assembly". */
  name: string
  /** Minutes from midnight. */
  start: number
  end: number
  kind: 'class' | 'break' | 'assembly'
}
