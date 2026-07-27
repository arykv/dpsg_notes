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
  /** Which years this was used for. */
  grades: (10 | 11 | 12)[]
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
    grades: [11, 12],
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
    grades: [11, 12],
    subjects: ['Chemistry'],
    note: 'Second option for Chemistry when Ashu sir’s explanation isn’t landing. Two people explaining the same chapter differently is often what makes it click.',
  },
  {
    id: 'ushank-ghai',
    name: 'Ushank Ghai sir',
    // Same channel as Ashu sir — the two of them post under one roof, so
    // there's no separate handle to send anyone to.
    handle: '@AshuGhai11th12th',
    href: 'https://www.youtube.com/@AshuGhai11th12th',
    grades: [11, 12],
    subjects: ['Mathematics'],
    alsoAt: {
      label: 'Also on @ScienceAndFunEducation',
      href: 'https://www.youtube.com/@ScienceAndFunEducation',
    },
    note: 'Maths, on the same channel as Ashu sir. I never watched ahead of class — it was always the night before, and it still worked. A chapter you thought was impossible turns out to be about forty minutes of video.',
  },
  {
    id: 'grand-academy',
    name: 'GrandAcad',
    handle: '@GrandAcad',
    href: 'https://www.youtube.com/@GrandAcad',
    grades: [11, 12],
    subjects: ['English — writing & long answers'],
    note: 'This is the one for the writing section and long answers — notices, letters, articles, and the structure a 5 or 6 marker actually needs. I got all of that here the night before, which is genuinely all it takes for that half of the paper.',
  },
  {
    id: 'taniya-sharma',
    name: 'English by Taniya Sharma',
    handle: '@EnglishClassesbyTaniyaSharma',
    href: 'https://www.youtube.com/@EnglishClassesbyTaniyaSharma',
    grades: [11, 12],
    subjects: ['English — literature'],
    note: 'This one’s for literature — the chapters, the poems, the characters. Pair it with GrandAcad and you’ve covered the whole English paper between them. Fine even if you’ve not opened the book all year and need it in one sitting.',
  },
  {
    id: 'mosh',
    name: 'Programming with Mosh',
    handle: '@programmingwithmosh',
    href: 'https://www.youtube.com/@programmingwithmosh',
    grades: [11, 12],
    subjects: ['Computer Science', 'Python'],
    note: 'For Python, this one six-hour video covers more than the syllabus needs. Do it in one or two sittings and type along instead of just watching — that’s the difference between it working and not.',
    highlight: {
      label: 'Python Full Course for Beginners (6 hrs)',
      href: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
    },
  },
  {
    id: 'experiential-physics',
    name: 'Experiential Physics',
    handle: '@experientialphysics',
    href: 'https://www.youtube.com/@experientialphysics',
    grades: [11, 12],
    subjects: ['Physics practicals'],
    note: 'This is my own school physics teacher, and the videos are lovely. Practicals are 30 marks and most people prepare for them the night before — this is the shortcut to doing them properly.',
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    handle: '',
    href: 'https://chatgpt.com/',
    grades: [11, 12],
    subjects: ['Every subject'],
    note: 'Genuinely underrated if you use it properly. Upload the NCERT chapter or your school’s PDF, then make it quiz you on that document, explain what you’re stuck on, and mark your answers. Working from your own syllabus beats asking it from memory. It’s also the fastest way to get through a chapter at 1am — just check anything important against the book before you write it in a paper.',
  },
  {
    id: 'school-material',
    name: 'The material school gave you',
    handle: '',
    grades: [11, 12],
    subjects: ['Computer Science theory', 'SQL'],
    note: 'For CS theory and SQL I just followed what school handed out and it was enough — I never needed a channel for either. Not everything needs a playlist. Dig out the sheets you were given; they’re usually closer to the paper than anything online.',
  },
]

/**
 * Class 10, same rule: only what Aryan actually used, in his own words.
 * Different year, different teachers — a Class 10 student following a Class 12
 * list would waste weeks.
 */
export const MY_RESOURCES_10: StudySource[] = [
  {
    id: 'ashu-10',
    name: 'Ashu Ghai sir',
    // He runs separate channels per year — this is the 9th/10th one. Sending a
    // Class 10 student to the 11th/12th channel is the wrong syllabus entirely.
    handle: '@AshuGhai9th10th',
    href: 'https://www.youtube.com/@AshuGhai9th10th',
    grades: [10],
    subjects: ['Science'],
    note: 'The same sir who carried me through 11th and 12th, and I started with him in 10th. Full chapters, free, slow enough to actually follow. Make sure you’re on his 9th & 10th channel, not the 11th & 12th one.',
    alsoAt: {
      label: 'Also on @ScienceAndFunEducation',
      href: 'https://www.youtube.com/@ScienceAndFunEducation',
    },
  },
  {
    id: 'prashant-kirad',
    name: 'Prashant Kirad',
    handle: '@Exphub',
    href: 'https://www.youtube.com/@Exphub',
    grades: [10],
    subjects: ['Science'],
    note: 'Used alongside Ashu sir for Science. Good for the last-minute one-shots when the paper is days away and you need the whole chapter fast.',
  },
  {
    id: 'ushank-10',
    name: 'Ushank Ghai sir',
    handle: '@AshuGhai9th10th',
    href: 'https://www.youtube.com/@AshuGhai9th10th',
    grades: [10],
    subjects: ['Mathematics'],
    note: 'Maths, on the same 9th & 10th channel as Ashu sir.',
    alsoAt: {
      label: 'Also on @ScienceAndFunEducation',
      href: 'https://www.youtube.com/@ScienceAndFunEducation',
    },
  },
  {
    id: 'ritik-mishra',
    name: 'Ritik Mishra sir',
    handle: '@RitikMishraClass9-10',
    href: 'https://www.youtube.com/@RitikMishraClass9-10',
    grades: [10],
    subjects: ['Mathematics'],
    note: 'The other maths option, from PW. Worth having two explanations of the same chapter — whichever clicks, clicks.',
    alsoAt: {
      label: 'Also on @PW-Foundation',
      href: 'https://www.youtube.com/@PW-Foundation',
    },
  },
  {
    id: 'digraj',
    name: 'Digraj Singh Rajput sir',
    handle: '@DigrajSinghRajputOfficial',
    href: 'https://www.youtube.com/@DigrajSinghRajputOfficial',
    grades: [10],
    subjects: ['Social Science'],
    note: 'SST is the subject people leave until last and then panic about. This is where I got mine — and I ended up with 96 in it.',
  },
  {
    id: 'sunlike-study',
    name: 'Sunlike Study',
    handle: '@SunlikeStudy',
    href: 'https://www.youtube.com/@SunlikeStudy',
    grades: [10],
    subjects: ['Social Science'],
    note: 'Used with Digraj sir for SST. Between the two of them the whole paper is covered.',
  },
  {
    id: 'students-heaven',
    name: 'Students Heaven',
    handle: '@StudentsHeaven',
    href: 'https://www.youtube.com/@StudentsHeaven',
    grades: [10],
    subjects: ['English'],
    note: 'English in Class 10 — chapters, and the writing formats that carry the second half of the paper.',
  },
]

/** The result, stated plainly. It's why any of the above is worth reading. */
export const MY_RESULTS = [
  { percentage: '95.2%', label: 'Class 10 CBSE, 2024', grade: 10 as const },
  { percentage: '92.8%', label: 'Class 12 CBSE, 2026', grade: 12 as const },
]

export const MY_RESULT_NOTE =
  'I was a last-minute studier both years, and this is still what it came to. If it’s the night before and you feel like you know nothing — it is genuinely not over. Me and my friends did it this way more than once.'

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
