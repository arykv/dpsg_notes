import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const SITE = {
  name: 'All Nighter',
  origin: 'https://dps-gandhinagar.in',
  /** Used when a page has nothing more specific to say. */
  image: 'https://dps-gandhinagar.in/school-campus.jpg',
}

export interface PageMeta {
  path: string
  title: string
  description: string
  /** Extra terms this page should be findable by. Not a keywords meta tag —
   *  these are worked into the visible copy, which is what actually counts. */
  intent: string[]
}

/**
 * Titles and descriptions per route.
 *
 * The prerender step reads this to write real `<title>` and `<meta>` tags into
 * each page's HTML, and `useSeo` applies the same values on client-side
 * navigation. One source, so the two can't drift.
 *
 * Descriptions are written for a student reading a search result, not for a
 * crawler: say what's on the page and why it's worth the click.
 */
export const PAGES: PageMeta[] = [
  {
    path: '/',
    title: 'All Nighter — everything you need at 11pm the night before',
    description:
      'Free CBSE study site for Class 10, 11 and 12. All 395 NCERT chapters, handwritten notes, percentage and attendance calculators, and honest exam strategy from a student who scored 95.2% and 92.8% studying last minute. No login, no ads.',
    intent: [
      'cbse study material class 10 11 12',
      'ncert chapters pdf free',
      'last minute cbse revision',
      'dps gandhinagar notes',
    ],
  },
  {
    path: '/chapters/class-10',
    title: 'NCERT Class 10 chapters — every PDF, chapter by chapter',
    description:
      'Every NCERT Class 10 chapter as a direct PDF: Science, Maths, Social Science (History, Geography, Civics, Economics), English First Flight and Footprints, and Hindi. No ads, no sign-up, straight from ncert.nic.in.',
    intent: [
      'ncert class 10 pdf download chapter wise',
      'class 10 science ncert pdf',
      'class 10 sst ncert chapter pdf',
    ],
  },
  {
    path: '/chapters/class-11',
    title: 'NCERT Class 11 chapters — every PDF, chapter by chapter',
    description:
      'Every NCERT Class 11 chapter as a direct PDF: Physics, Chemistry, Maths, Biology, Computer Science, Accountancy, Business Studies, Economics, History, Political Science, Psychology and English. No ads, no sign-up, straight from ncert.nic.in.',
    intent: [
      'ncert class 11 pdf download chapter wise',
      'class 11 physics ncert pdf',
      'class 11 chemistry ncert chapter pdf',
    ],
  },
  {
    path: '/chapters/class-12',
    title: 'NCERT Class 12 chapters — every PDF, chapter by chapter',
    description:
      'Every NCERT Class 12 chapter as a direct PDF: Physics, Chemistry, Maths, Biology, Computer Science, Accountancy, Business Studies, Economics, History, Political Science, Psychology and English. No ads, no sign-up, straight from ncert.nic.in.',
    intent: [
      'ncert class 12 pdf download chapter wise',
      'class 12 physics ncert pdf',
      'class 12 chemistry ncert chapter pdf',
    ],
  },
  {
    path: '/library',
    title: 'Handwritten notes library — Class 11 & 12',
    description:
      'Handwritten notes scanned and shared by students, filterable by class, stream and subject. Every file credited to whoever wrote it. Free to read and download.',
    intent: ['class 11 handwritten notes pdf', 'physics handwritten notes class 11'],
  },
  {
    path: '/tools',
    title: 'CBSE calculators — best of five, attendance, grade points',
    description:
      'Work out your CBSE percentage with best of five, check whether you meet the 75% attendance rule, convert marks to grade points and CGPA, and see what your last paper needs to score. Nothing leaves your browser.',
    intent: [
      'cbse best of five calculator',
      'cbse percentage calculator class 12',
      '75 percent attendance calculator',
      'cgpa to percentage cbse',
    ],
  },
  {
    path: '/strategy',
    title: 'CBSE exam strategy from a 95.2% and 92.8% student — what actually worked',
    description:
      'How to use the 15 minutes of reading time, what order to attempt in, why you should never cut an answer, what to do when you run out of time, and an honest subject-by-subject account including the paper I got wrong. Plus what CBSE moderation really looks like.',
    intent: [
      'cbse exam strategy class 12',
      'how to score good marks in cbse boards',
      'cbse reading time 15 minutes tips',
      'cbse moderation grace marks',
      'how to write board exam answers',
    ],
  },
  {
    path: '/resources',
    title: 'Best free YouTube channels & sites for CBSE Class 11 and 12',
    description:
      'The channels I actually studied from for Physics, Chemistry, Maths, English and Computer Science, plus checked links to CBSE syllabus, sample papers, NCERT books and exemplars. All free.',
    intent: [
      'best youtube channel for class 12 chemistry',
      'free cbse study resources',
      'cbse sample papers download',
    ],
  },
  {
    path: '/day',
    title: 'School day & bell timings',
    description:
      'See which period is running right now and how many minutes are left. Set your section’s bell timings once and this device remembers them.',
    intent: ['school bell timings', 'what period is it'],
  },
  {
    path: '/about',
    title: 'About All Nighter & how to add your notes',
    description:
      'A student-run study library — who made it, why it’s free, and how to send in your own notes to be published with your name on them.',
    intent: ['dpsg notes contribute', 'submit notes dps gandhinagar'],
  },
]

const BY_PATH = new Map(PAGES.map((p) => [p.path, p]))

export function metaFor(path: string): PageMeta {
  return BY_PATH.get(path) ?? PAGES[0]!
}

/**
 * Keeps the tab title and meta description correct as you navigate.
 *
 * Prerendered HTML already carries the right tags for the first paint; this
 * handles every route change after that.
 */
export function useSeo(override?: { title?: string; description?: string }) {
  const { pathname } = useLocation()

  useEffect(() => {
    const base = metaFor(pathname)
    const title = override?.title ?? base.title
    const description = override?.description ?? base.description

    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', SITE.origin + pathname)
    setLink('canonical', SITE.origin + pathname)
  }, [pathname, override?.title, override?.description])
}

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}
