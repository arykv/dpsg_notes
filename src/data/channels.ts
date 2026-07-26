export interface StudySource {
  id: string
  /** Channel or tool name. */
  name: string
  /** @handle for YouTube, empty for anything else. */
  handle: string
  /** Omitted for anything that isn't a link. */
  href?: string
  /** Subjects this covers, as a student would say them. */
  subjects: string[]
  /** Aryan's own words. First person, because it's his experience. */
  note: string
  /** An optional single link worth calling out — one video, one page. */
  highlight?: { label: string; href: string }
  /** A second channel the same teacher posts on. */
  alsoAt?: { label: string; href: string }
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
    name: 'Ashu Ghai sir',
    handle: '@AshuGhai11th12th',
    href: 'https://www.youtube.com/@AshuGhai11th12th',
    subjects: ['Physics', 'Chemistry'],
    alsoAt: {
      label: 'Also on @ScienceAndFunEducation',
      href: 'https://www.youtube.com/@ScienceAndFunEducation',
    },
    note: 'Ashu Ghai sir carried both my Physics and Chemistry across 11th and 12th. Full chapters, free, explained slowly enough that they actually stick. Most of my physics happened in the week before the paper and this is why it was survivable.',
  },
  {
    id: 'ncert-wallah',
    name: 'NCERT Wallah',
    handle: '@NCERTWallahClass12PW',
    href: 'https://www.youtube.com/@NCERTWallahClass12PW',
    subjects: ['Chemistry'],
    note: 'Second option for Chemistry when Ashu sir’s explanation isn’t landing. Two people explaining the same chapter differently is often what makes it click.',
  },
  {
    id: 'ushank-ghai',
    name: 'Ushank Ghai sir',
    handle: '@UshankGhai',
    href: 'https://www.youtube.com/@UshankGhai',
    subjects: ['Mathematics'],
    alsoAt: {
      label: 'Also on @ScienceAndFunEducation',
      href: 'https://www.youtube.com/@ScienceAndFunEducation',
    },
    note: 'All my maths came from here. I never watched ahead of class — it was always the night before, and it still worked. A chapter you thought was impossible turns out to be about forty minutes of video.',
  },
  {
    id: 'grand-academy',
    name: 'GrandAcad',
    handle: '@GrandAcad',
    href: 'https://www.youtube.com/@GrandAcad',
    subjects: ['English'],
    note: 'English is the paper everyone assumes they’ll be fine in and then isn’t. One-shot revisions here got me the answer structure and the writing formats the night before, which is genuinely all it takes for this paper.',
  },
  {
    id: 'taniya-sharma',
    name: 'English by Taniya Sharma',
    handle: '@EnglishClassesbyTaniyaSharma',
    href: 'https://www.youtube.com/@EnglishClassesbyTaniyaSharma',
    subjects: ['English'],
    note: 'Used alongside GrandAcad for English. Good for chapters and characters when you’ve not opened the book all year and need the whole thing in one sitting.',
  },
  {
    id: 'mosh',
    name: 'Programming with Mosh',
    handle: '@programmingwithmosh',
    href: 'https://www.youtube.com/@programmingwithmosh',
    subjects: ['Computer Science', 'Python'],
    note: 'For Python, this one six-hour video covers more than the syllabus needs. Do it in one or two sittings and type along instead of just watching — that’s the difference between it working and not.',
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
    note: 'Genuinely underrated if you use it properly. Upload the NCERT chapter or your school’s PDF, then make it quiz you on that document, explain what you’re stuck on, and mark your answers. Working from your own syllabus beats asking it from memory. It’s also the fastest way to get through a chapter at 1am — just check anything important against the book before you write it in a paper.',
  },
  {
    id: 'school-material',
    name: 'The material school gave you',
    handle: '',
    subjects: ['Computer Science theory', 'SQL'],
    note: 'For CS theory and SQL I just followed what school handed out and it was enough — I never needed a channel for either. Not everything needs a playlist. Dig out the sheets you were given; they’re usually closer to the paper than anything online.',
  },
]

/** The result, stated plainly. It's why any of the above is worth reading. */
export const MY_RESULT = {
  percentage: '92.8%',
  label: 'Class 12 CBSE',
  note: 'I was a last-minute studier the whole way through, and this is still what it came to. If it’s the night before and you feel like you know nothing — it is genuinely not over. Me and my friends did it this way more than once.',
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
