export interface StudySource {
  id: string
  /** Channel or tool name. */
  name: string
  /** @handle for YouTube, empty for anything else. */
  handle: string
  href: string
  /** Subjects this covers, as a student would say them. */
  subjects: string[]
  /** Aryan's own words. First person, because it's his experience. */
  note: string
  /** An optional single link worth calling out — one video, one page. */
  highlight?: { label: string; href: string }
}

/**
 * What Aryan actually studied from, in his own words.
 *
 * This is the section juniors will trust most, because it isn't a directory —
 * it's one person saying what worked for them and what it got them. Keep it
 * first person, keep it honest, and don't pad it with channels he didn't use.
 */
export const MY_RESOURCES: StudySource[] = [
  {
    id: 'science-and-fun',
    name: 'Science and Fun — Ashu Sir',
    handle: '@ScienceandFun',
    href: 'https://www.youtube.com/@ScienceandFun',
    subjects: ['Physics', 'Chemistry'],
    note: 'Ashu Ghai sir carried both my Physics and Chemistry across 11th and 12th. He goes slowly enough that it actually sticks, and the full chapters are free. If a topic isn’t clicking in class, start here.',
  },
  {
    id: 'ncert-wallah',
    name: 'NCERT Wallah',
    handle: '@NCERTWallah',
    href: 'https://www.youtube.com/@NCERTWallah',
    subjects: ['Chemistry'],
    note: 'Good second option for Chemistry. Useful when a chapter needs explaining a different way to the one you already heard.',
  },
  {
    id: 'ushank-ghai',
    name: 'Ushank Sir',
    handle: '@UshankGhai',
    href: 'https://www.youtube.com/@UshankGhai',
    subjects: ['Mathematics'],
    note: 'All my maths came from here. Worth watching the chapter before the class rather than after — it makes the school period make sense instead of the other way round.',
  },
  {
    id: 'grand-academy',
    name: 'The Grand Academy',
    handle: '@thegrandacademy',
    href: 'https://www.youtube.com/@thegrandacademy',
    subjects: ['English'],
    note: 'English is the paper everyone assumes they’ll be fine in and then isn’t. This is where I got the answer structure and the writing-section formats right.',
  },
  {
    id: 'taniya-sharma',
    name: 'Taniya Sharma',
    handle: '@TaniyaSharma',
    href: 'https://www.youtube.com/@TaniyaSharma',
    subjects: ['English'],
    note: 'Used alongside Grand Academy for English — good for chapter and character work when you need a second explanation of the same thing.',
  },
  {
    id: 'mosh',
    name: 'Programming with Mosh',
    handle: '@programmingwithmosh',
    href: 'https://www.youtube.com/@programmingwithmosh',
    subjects: ['Computer Science', 'Python'],
    note: 'For Python, watch the six-hour full course in one or two sittings and type along — don’t just watch it. That single video covers more than the syllabus needs.',
    highlight: {
      label: 'Python Full Course for Beginners (6 hrs)',
      href: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
    },
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    handle: '',
    href: 'https://chatgpt.com/',
    subjects: ['Every subject'],
    note: 'Genuinely underrated as a study tool if you use it properly. Upload the NCERT chapter or the material your school gave you as a PDF, then make it quiz you on that document, explain the parts you’re stuck on, and mark your answers. Studying from your own syllabus beats asking it questions from memory — and never paste an answer into a paper without checking it against the book.',
  },
  {
    id: 'school-material',
    name: 'Your school material',
    handle: '',
    href: '/library',
    subjects: ['Computer Science theory', 'SQL'],
    note: 'For CS theory and SQL I just followed what school gave us, and it was enough. Not everything needs a YouTube playlist — sometimes the printed material is already the right answer.',
  },
]

/** The result, stated plainly. It's why any of the above is worth reading. */
export const MY_RESULT = {
  percentage: '92.8%',
  label: 'Class 12 CBSE',
  note: 'Not a topper score, and that’s the point — this is what a normal amount of work with the right material gets you.',
}

export interface Channel {
  id: string
  name: string
  handle: string
  href: string
  bestFor: string
  subjects: string[]
}

/** Other channels worth knowing about, checked but not personally used. */
export const MORE_CHANNELS: Channel[] = [
  {
    id: 'physics-wallah',
    name: 'Physics Wallah',
    handle: '@PhysicsWallah',
    href: 'https://www.youtube.com/@PhysicsWallah',
    bestFor: 'Physics and Chemistry, boards plus JEE/NEET level',
    subjects: ['Physics', 'Chemistry', 'Maths'],
  },
  {
    id: 'magnet-brains',
    name: 'Magnet Brains',
    handle: '@MagnetBrainsEducation',
    href: 'https://www.youtube.com/@MagnetBrainsEducation',
    bestFor: 'Full NCERT chapter-by-chapter coverage across almost every subject',
    subjects: ['Physics', 'Chemistry', 'Maths', 'Biology', 'Accountancy'],
  },
  {
    id: 'learnohub',
    name: 'LearnoHub',
    handle: '@LearnoHub',
    href: 'https://www.youtube.com/@LearnoHub',
    bestFor: 'Physics and Biology explained without assuming you already get it',
    subjects: ['Physics', 'Biology', 'Chemistry'],
  },
  {
    id: 'rajat-arora',
    name: 'Rajat Arora',
    handle: '@RajatAroraofficial',
    href: 'https://www.youtube.com/@RajatAroraofficial',
    bestFor: 'Commerce — Accountancy and Business Studies, board-answer focused',
    subjects: ['Accountancy', 'Business Studies', 'Economics'],
  },
  {
    id: 'padhle',
    name: 'Padhle',
    handle: '@padhle',
    href: 'https://www.youtube.com/@padhle',
    bestFor: 'Quick one-shot revisions the week before a paper',
    subjects: ['Physics', 'Chemistry', 'Maths'],
  },
  {
    id: 'khan-academy-india',
    name: 'Khan Academy India',
    handle: '@khanacademyindia',
    href: 'https://www.youtube.com/@khanacademyindia',
    bestFor: 'Maths fundamentals when a chapter needs rebuilding from scratch',
    subjects: ['Maths', 'Physics'],
  },
]
