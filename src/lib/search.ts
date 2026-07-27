import Fuse, { type IFuseOptions } from 'fuse.js'
import { RESOURCES } from '@/data/resources'
import { SUBJECTS, subjectName } from '@/data/subjects'
import { LINKS } from '@/data/links'
import { MORE_CHANNELS, MY_RESOURCES } from '@/data/channels'
import { TOOLS } from '@/data/tools'
import { KIND_LABELS } from './format'

/**
 * One index over everything the site can take you to — notes, subjects, tools,
 * outside links and the pages themselves. The command palette and the library
 * search share it, so "chem" finds the same things in both places.
 */
export interface SearchItem {
  id: string
  type: 'resource' | 'subject' | 'tool' | 'link' | 'channel' | 'page'
  title: string
  subtitle: string
  to: string
  /** Extra words worth matching that the student never sees. */
  keywords: string
  external?: boolean
}

const PAGES: SearchItem[] = [
  {
    id: 'page-library',
    type: 'page',
    title: 'Library',
    subtitle: 'Every note, paper and sheet',
    to: '/library',
    keywords: 'notes browse all downloads pdf search',
  },
  {
    id: 'page-tools',
    type: 'page',
    title: 'Tools',
    subtitle: 'Calculators built for CBSE marking',
    to: '/tools',
    keywords: 'calculator percentage attendance marks gpa converter',
  },
  {
    id: 'page-day',
    type: 'page',
    title: 'School day',
    subtitle: 'Bell timings and what period it is',
    to: '/day',
    keywords: 'timetable bell schedule period break lunch timings',
  },
  {
    id: 'page-chapters',
    type: 'page',
    title: 'NCERT chapters',
    subtitle: 'Every Class 11 and 12 chapter PDF',
    to: '/chapters/class-11',
    keywords: 'ncert chapter book textbook pdf class 11 12 chapterwise download',
  },
  {
    id: 'page-resources',
    type: 'page',
    title: 'Resources & channels',
    subtitle: 'Checked links, and who to learn from',
    to: '/resources',
    keywords: 'portals resources official websites cbse ncert youtube channel video science and fun',
  },
  {
    id: 'page-results',
    type: 'page',
    title: 'Results & proof',
    subtitle: 'Both marksheets, and proof moderation is real',
    to: '/results',
    keywords:
      'marksheet marks result 95.2 92.8 moderation grace marks osm answer script evidence proof boards',
  },
  {
    id: 'page-paper',
    type: 'page',
    title: 'What happens to your paper',
    subtitle: 'Inside a real evaluated CBSE answer script',
    to: '/paper',
    keywords:
      'answer script osm evaluated copy checking examiner marking scanned barcode question wise marks summary re-evaluation photocopy how are papers checked',
  },
  {
    id: 'page-script',
    type: 'page',
    title: 'My whole answer script',
    subtitle: 'All 35 pages of a real evaluated CBSE paper',
    to: '/paper/script',
    keywords:
      'answer sheet scan evaluated copy real example what does a checked paper look like osm computer science 083 evidence proof pages',
  },
  {
    id: 'page-about',
    type: 'page',
    title: 'About & contribute',
    subtitle: 'How this got built, and how to add to it',
    to: '/about',
    keywords: 'contribute upload credits aryan rao contact help',
  },
]

export const SEARCH_ITEMS: SearchItem[] = [
  ...RESOURCES.map<SearchItem>((r) => ({
    id: r.id,
    type: 'resource',
    title: r.title,
    subtitle: `Class ${r.grade} · ${subjectName(r.subject)} · ${KIND_LABELS[r.kind]}`,
    to: `/library/${r.id}`,
    keywords: [
      subjectName(r.subject),
      r.subject,
      r.contributor,
      r.stream,
      `class ${r.grade}`,
      KIND_LABELS[r.kind],
      r.handwritten ? 'handwritten scanned notes' : '',
      ...(r.topics ?? []),
    ].join(' '),
  })),
  ...SUBJECTS.map<SearchItem>((s) => ({
    id: `subject-${s.id}`,
    type: 'subject',
    title: s.name,
    subtitle: s.blurb,
    to: `/library?subject=${s.id}`,
    keywords: `${s.code} ${s.streams.join(' ')} ${s.grades.map((g) => `class ${g}`).join(' ')}`,
  })),
  ...TOOLS.map<SearchItem>((t) => ({
    id: `tool-${t.id}`,
    type: 'tool',
    title: t.name,
    subtitle: t.blurb,
    to: `/tools#${t.id}`,
    keywords: t.keywords,
  })),
  ...MY_RESOURCES.map<SearchItem>((r) => ({
    id: `used-${r.id}`,
    type: 'channel',
    title: r.name,
    subtitle: `What Aryan used for ${r.subjects.join(', ')}`,
    to: '/resources',
    keywords: `${r.handle} ${r.subjects.join(' ')} youtube channel studied recommended`,
  })),
  ...MORE_CHANNELS.map<SearchItem>((c) => ({
    id: `channel-${c.id}`,
    type: 'channel',
    title: c.name,
    subtitle: c.bestFor,
    to: '/resources',
    keywords: `${c.handle} ${c.subjects.join(' ')} youtube channel video`,
  })),
  ...LINKS.map<SearchItem>((l) => ({
    id: `link-${l.id}`,
    type: 'link',
    title: l.label,
    subtitle: l.description,
    to: l.href,
    keywords: l.category,
    external: true,
  })),
  ...PAGES,
]

const OPTIONS: IFuseOptions<SearchItem> = {
  includeScore: true,
  threshold: 0.36,
  ignoreLocation: true,
  minMatchCharLength: 2,
  keys: [
    { name: 'title', weight: 0.6 },
    { name: 'keywords', weight: 0.3 },
    { name: 'subtitle', weight: 0.1 },
  ],
}

const fuse = new Fuse(SEARCH_ITEMS, OPTIONS)

export function searchAll(query: string, limit = 12): SearchItem[] {
  const q = query.trim()
  if (!q) return []
  return fuse
    .search(q, { limit })
    .map((r) => r.item)
}

/** A narrower index for the library page, which only ever shows resources. */
const resourceFuse = new Fuse(
  SEARCH_ITEMS.filter((i) => i.type === 'resource'),
  { ...OPTIONS, threshold: 0.42 },
)

export function searchResourceIds(query: string): string[] | null {
  const q = query.trim()
  if (!q) return null
  return resourceFuse.search(q).map((r) => r.item.id)
}
