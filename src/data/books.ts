/**
 * What to actually buy, and what not to.
 *
 * Two rules, both of which exist because every other "best books" page on the
 * Indian internet breaks them:
 *
 *   1. **No affiliate links, anywhere.** Aryan is 17 and cannot hold an Amazon
 *      Associates account anyway, but the reason to keep it that way after
 *      April 2027 is simpler: a recommendation you earn a cut on is not a
 *      recommendation, it's an ad. The page says so out loud, because saying it
 *      is the point.
 *   2. **A subject only gets a book if he actually used one.** Maths gets a
 *      "don't buy anything" entry, which is the most useful row on the page and
 *      the one no bookshop-funded list will ever print.
 */

export interface Shelf {
  id: string
  subject: string
  /** null when the honest answer is "don't buy a book for this". */
  book: string | null
  /** His own words on why, or why not. */
  note: string
  /** What to do instead of, or alongside, the book. */
  instead?: string[]
}

export const SHELF: Shelf[] = [
  {
    id: 'physics',
    subject: 'Physics',
    book: 'MTG Previous 10 Years Questions',
    note: 'Ten years of real board questions in one place. Physics repeats itself far more than it feels like it does while you are panicking, and after thirty of these you stop meeting genuinely new questions — you start recognising which of about ten shapes you are looking at.',
  },
  {
    id: 'chemistry',
    subject: 'Chemistry',
    book: 'MTG Previous 10 Years Questions',
    note: 'Same reason, and it matters more here. Organic especially is pattern-based: the conversions and named reactions come round again and again, and the only way to get fast at them is volume.',
  },
  {
    id: 'english',
    subject: 'English Core',
    book: 'MTG Previous 10 Years Questions',
    note: 'People do not buy books for English and then wonder why the writing section costs them marks. The formats — notice, letter, article, report — are fixed, and previous years show you exactly what a full-mark one looks like.',
  },
  {
    id: 'maths',
    subject: 'Mathematics',
    book: null,
    note: 'Do not buy a book for Maths. I did not, and it is the paper I scored highest in relative to effort — 71 out of 80, untouched by moderation. NCERT plus past papers is genuinely enough, and a reference book mostly gives you a way to feel busy without solving anything.',
    instead: [
      'Previous year papers. All of them you can find.',
      'The NCERT exercises — every one, not the ones that look interesting.',
      'The NCERT miscellaneous exercises especially. They are harder than the chapter exercises and they are the ones people skip.',
      'Ushank sir’s question videos and question marathons, on the same channel as Ashu sir.',
      'Follow a few accounts that post integration questions and solve them. Not for the teaching — for meeting a question you did not choose, every day, on a screen you were opening anyway.',
    ],
  },
]

/** Links out, so nobody has to take the shelf's word for what a book is. */
export const BOOK_SOURCES = [
  { label: 'NCERT textbooks', href: 'https://ncert.nic.in/textbook.php' },
  { label: 'CBSE sample papers', href: 'https://cbseacademic.nic.in/SQP_CLASSXII_2025-26.html' },
]

export const NO_AFFILIATE_NOTE =
  'There are no affiliate links on this page and there never will be. Nobody pays me to name a book, I do not earn anything if you buy one, and I have not linked to a shop — search the title wherever you normally buy things. A recommendation someone earns a cut on is an advert wearing a recommendation’s clothes.'
