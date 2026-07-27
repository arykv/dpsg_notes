import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const SITE = {
  name: 'All Nighter',
  origin: 'https://allnighter.in',
  /** Used when a page has nothing more specific to say. */
  image: 'https://allnighter.in/school-campus.jpg',
}

/**
 * The link preview.
 *
 * Most shares of this site are one student sending it to another the night
 * before a paper, and in that message the card *is* the product — it gets seen
 * far more often than the page does. So every route gets its own, and leads
 * with a number wherever there's an honest one to lead with.
 *
 * `scripts/og.mjs` renders these to PNG at build time.
 */
export interface OgCard {
  /** Mono caps line above everything. Two or three words. */
  kicker: string
  /** The claim. Wrapped and auto-shrunk to fit, but shorter always reads better. */
  headline: string
  /** The one big marigold figure. Omit when the page has no honest number. */
  stat?: string
  /** What the figure means, in mono caps beside it. */
  statLabel?: string
}

export interface PageMeta {
  path: string
  title: string
  description: string
  /** Extra terms this page should be findable by. Not a keywords meta tag —
   *  these are worked into the visible copy, which is what actually counts. */
  intent: string[]
  og: OgCard
}

/** Where a page's card lives once built. `/chapters/class-10` → `/og/chapters-class-10.png`. */
export function ogImageFor(path: string): string {
  const slug = path === '/' ? 'home' : path.replace(/^\/|\/$/g, '').replace(/\//g, '-')
  return `${SITE.origin}/og/${slug}.png`
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
    og: {
      kicker: 'Free CBSE study site',
      headline: 'Everything you need at 11pm the night before',
      stat: '395',
      statLabel: 'NCERT chapters',
    },
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
    og: {
      kicker: 'NCERT Class 10',
      headline: 'Every chapter, as a direct PDF',
      stat: '84',
      statLabel: 'chapters',
    },
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
    og: {
      kicker: 'NCERT Class 11',
      headline: 'Every chapter, as a direct PDF',
      stat: '161',
      statLabel: 'chapters',
    },
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
    og: {
      kicker: 'NCERT Class 12',
      headline: 'Every chapter, as a direct PDF',
      stat: '150',
      statLabel: 'chapters',
    },
  },
  {
    path: '/library',
    title: 'Handwritten notes library — Class 11 & 12',
    description:
      'Handwritten notes scanned and shared by students, filterable by class, stream and subject. Every file credited to whoever wrote it. Free to read and download.',
    intent: ['class 11 handwritten notes pdf', 'physics handwritten notes class 11'],
    og: {
      kicker: 'Notes library',
      headline: 'Handwritten notes, credited to whoever wrote them',
    },
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
    og: {
      kicker: 'CBSE calculators',
      headline: 'Best of five, attendance, and what your last paper needs',
      stat: '6',
      statLabel: 'calculators',
    },
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
    og: {
      kicker: 'Exam strategy',
      headline: 'What I actually did in the exam hall',
      stat: '92.8%',
      statLabel: 'studying last minute',
    },
  },
  {
    path: '/results',
    title: 'My CBSE marksheets, and proof that moderation is real',
    description:
      'Both my board marksheets in full — 95.2% in Class 10 and 92.8% in Class 12 — rebuilt subject by subject, never scanned. Then my evaluated answer scripts next to the marksheet they became: three subjects match exactly, two gained marks. Documented proof that CBSE moderation happens.',
    intent: [
      'is cbse moderation real',
      'cbse grace marks proof',
      'cbse moderation policy class 12',
      'osm answer sheet vs marksheet difference',
      'how many marks does cbse add',
    ],
    og: {
      kicker: 'The evidence',
      headline: 'CBSE moderation is real. Here’s the receipt.',
      stat: '+9',
      statLabel: 'marks, across five papers',
    },
  },
  {
    path: '/paper',
    title: 'What happens to your CBSE paper after you hand it in',
    description:
      'Inside a real evaluated Class 12 answer script, bought back from CBSE and read page by page. How papers are scanned and marked on screen, what every stamp and code on the booklet means, the full question-wise marks summary, and six things it changed about how I would write a paper.',
    intent: [
      'how are cbse papers checked',
      'cbse on screen marking osm',
      'cbse evaluated answer sheet photocopy',
      'what does a checked cbse answer sheet look like',
      'cbse question wise marks summary',
      'cbse re-evaluation photocopy process',
    ],
    og: {
      kicker: 'The answer script',
      headline: 'What happens to your paper after you hand it in',
      stat: '35',
      statLabel: 'pages, read one by one',
    },
  },
  {
    path: '/paper/script',
    title: 'A real evaluated CBSE answer script — all 35 pages',
    description:
      'My whole Class 12 Computer Science answer book exactly as CBSE returned it after evaluation: every page, every tick, every red cross, the blank pages and the rough work. Only the script barcode is covered. Probably the only complete evaluated CBSE script published anywhere.',
    intent: [
      'cbse evaluated answer sheet sample',
      'what does a checked cbse answer sheet look like',
      'cbse answer script photocopy example',
      'cbse topper answer sheet computer science',
      'osm answer book scan',
    ],
    og: {
      kicker: 'The whole document',
      headline: 'A real evaluated CBSE answer script, every page',
      stat: '35',
      statLabel: 'pages, nothing left out',
    },
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
    og: {
      kicker: 'Verified channels',
      headline: 'The channels I actually studied from, and nothing else',
    },
  },
  {
    path: '/day',
    title: 'School day & bell timings',
    description:
      'See which period is running right now and how many minutes are left. Set your section’s bell timings once and this device remembers them.',
    intent: ['school bell timings', 'what period is it'],
    og: {
      kicker: 'School day',
      headline: 'Which period is running, and how long is left',
    },
  },
  {
    path: '/about',
    title: 'About All Nighter & how to add your notes',
    description:
      'A student-run study library — who made it, why it’s free, and how to send in your own notes to be published with your name on them.',
    intent: ['all nighter contribute notes', 'submit cbse notes'],
    og: {
      kicker: 'About',
      headline: 'A study library run by students, free and staying that way',
    },
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

    // Only routes we actually have a card for; anything else keeps the last
    // one rather than pointing at a 404 image.
    const image = BY_PATH.has(pathname) ? ogImageFor(pathname) : undefined

    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', SITE.origin + pathname)
    if (image) {
      setMeta('property', 'og:image', image)
      setMeta('name', 'twitter:image', image)
    }
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
