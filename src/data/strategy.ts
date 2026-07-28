/**
 * Aryan's exam strategy, in his own words.
 *
 * This is the most personal content on the site and the reason to trust the
 * rest of it, so two rules when editing: keep it first person, and keep the
 * parts that make him look bad. The Valorant week and the abandoned chapter are
 * why the advice reads as true rather than as advice.
 */

export interface StrategyNote {
  id: string
  heading: string
  /** One line that carries the point on its own. */
  lede: string
  body: string[]
  /** Optional hard rule worth pulling out of the prose. */
  rule?: string
}

export const THESIS = {
  claim: 'Presentation only matters if you don’t know the answer.',
  body: 'If you actually know it, you get full marks however messy it looks. Presentation is the skill of selling half-knowledge — underlining, structure, making the examiner find the point. So learn it, but never spend time on it that you could have spent attempting another question.',
}

export const IN_THE_HALL: StrategyNote[] = [
  {
    id: 'reading-time',
    heading: 'The 15 minutes of reading time',
    lede: 'What you do here depends on how prepared you are, and being honest about that is the whole trick.',
    body: [
      'If your preparation is good, use it to analyse the paper — find the questions you’ll definitely get, spot the ones to leave for last, plan your order.',
      'If your preparation is not good, don’t analyse anything. Start solving the MCQs in your head immediately. You need marks on the board more than you need a plan.',
      'In English and Hindi, do the unseen passage in reading time. It needs no preparation, it’s pure comprehension, and getting it done frees the whole first stretch of writing time.',
    ],
    rule: 'English and Hindi: unseen passage, in reading time, every time.',
  },
  {
    id: 'order',
    heading: 'The order you attempt in',
    lede: 'There’s no universal order — but there is a rule about it.',
    body: [
      'Whatever order you use, decide it during practice papers and then follow it in the real exam. The point isn’t the order, it’s that you’ve already run it before.',
      'Mine for Maths was 5-markers first, because they take the longest and at the end, under pressure, I simply couldn’t do them.',
      'And then in the Class 12 finals I didn’t follow my own order, because I was confident in Maths. That’s exactly where it went wrong — 71 out of 80 in a subject I knew better than that.',
    ],
    rule: 'Pick your order in practice. Follow it in the exam even when you feel confident.',
  },
  {
    id: 'never-cut',
    heading: 'Never cut an answer',
    lede: 'A wrong answer left on the page can still earn step marks. A cut one earns nothing.',
    body: [
      'If you realise mid-answer that you’ve gone wrong, don’t strike it out. Leave it, skip a page ahead, and start again there.',
      'Only cut things right at the end if you’re out of time and it genuinely has to go.',
      'Examiners award step marks. Half a correct method with a wrong final answer is worth real marks — but only if it’s still readable.',
    ],
    rule: 'Don’t strike anything out until the last few minutes.',
  },
  {
    id: 'out-of-time',
    heading: 'When you’re running out of time',
    lede: 'Switch to marks-per-minute and stop trying to finish things properly.',
    body: [
      'Go to the highest-return questions first — the ones worth most for the least writing.',
      'On the rest, write the formula, write what’s given, and move on. That is the last resort and it does score.',
      'Ideally you never reach this. Manage time so you finish early, not exactly on the bell.',
    ],
  },
  {
    id: 'know-nothing',
    heading: 'When you don’t know it at all',
    lede: 'Write something. A blank space is a guaranteed zero.',
    body: [
      'Write "Given" properly with everything the question hands you.',
      'Write whatever you know that’s related, even loosely. Waffle your way through it.',
      'But cap the time — a couple of minutes, or leave it for the very end. Don’t let one question you can’t do eat the ones you can.',
    ],
  },
]

export const THE_YEAR: StrategyNote[] = [
  {
    id: 'solve-dont-watch',
    heading: 'Watching a one-shot will do nothing for you',
    lede: 'It feels like studying. It is not studying. You have to solve questions.',
    body: [
      'A ten-hour one-shot at 2x is the most comfortable way to spend a day and feel productive. You understand everything while it is on the screen, and then you sit down with a paper and cannot start. Understanding an explanation and being able to produce one are different skills, and only the second one is examined.',
      'So watch the video if a chapter is genuinely new to you — that is what it is for. Then close it and solve. If you have a choice between the next video and twenty questions, it is the twenty questions, every time.',
      'Here is the part nobody tells you, and it is the reason people give up on this. When you start solving, it feels like the teacher is doing the questions and you are getting nothing. You watch a solution, it makes sense, you meet the next question and you are blank again. That stage is horrible and completely normal, and most people quit inside it and go back to watching videos because watching feels better.',
      'Push through it, because the thing you are actually building is not knowledge. It is pattern recognition. What feels like a hundred impossible questions is about ten approaches wearing different clothes. One day you read a question and realise it is the same shape as one you have already done, and after that it is not hard any more — it never was hard, you just did not know the approach. Once you know it you can take a thousand questions like it.',
      'That is the whole game. Every question you solve is not one question. It is one more pattern you will recognise in the exam hall.',
    ],
    rule: 'If a chapter is new: one video, then solve. Never two videos in a row.',
  },
  {
    id: 'school-exams',
    heading: 'The one thing that actually carried me',
    lede: 'Take every school exam seriously — even if it’s one all-nighter each.',
    body: [
      'I did not study through the year. What I did do was lock in one or two days before every single school test, PT and preboard, and study properly in the gap days between preboard papers.',
      'An all-nighter for me was about eight hours. Once per exam, seriously, for two years.',
      'That residue is everything. When the finals come, you are not meeting the syllabus for the first time — you’ve already been through all of it once, under pressure, which is a completely different thing from having read it.',
      'People say "no way you got that from just gap days". They’re right. It wasn’t gap days. It was one serious night before every school exam for two years, and then gap days on top.',
    ],
    rule: 'Never skip a PT or preboard. Familiarity with the syllabus is what you’re buying.',
  },
  {
    id: 'friends',
    heading: 'Study with people, on call',
    lede: 'My friends and I would get on a call during gap days and work through it together.',
    body: [
      'Discuss it, argue about it, quiz each other. It keeps you at the desk far longer than willpower does.',
      'Find the group that makes you study during exam periods rather than the one that makes you feel fine about not studying.',
    ],
  },
  {
    id: 'roadmaps',
    heading: 'Three honest roadmaps',
    lede: 'Pick the one you’ll actually follow, not the one that sounds best.',
    body: [
      'Study consistently all year. Genuinely best, and almost nobody does it.',
      'Study only on gap days and in exam weeks. Workable, and it’s roughly what I did — but only because of the school-exam habit underneath it.',
      'Study only before each school exam. The bare minimum that still works, and far better than nothing, because it forces you through the syllabus repeatedly.',
    ],
  },
]

export const SUBJECTS: {
  id: string
  subject: string
  marks: string
  lede: string
  body: string[]
}[] = [
  {
    id: 'chemistry',
    subject: 'Chemistry',
    marks: '89 · theory 59/80',
    lede: 'My worst paper, and the most honest story on this site.',
    body: [
      'I had an eight-day gap before Chemistry. I wasted the first five of them playing Valorant. That is the actual reason this number isn’t higher.',
      'I’d left Biomolecules almost entirely — a chapter with about 7 marks of weightage — and never went back to it.',
      'The paper itself was easy. I wasn’t prepared for it, so I waffled through and squeezed out marks where I could. I expected barely 50 out of 80.',
      'I got 59. My evaluated sheet says 52. That gap is moderation, and it’s why I say grace marks are real — but it is a terrible thing to rely on.',
      'For Chemistry in 11th and 12th, NCERT is the resource. Not a reference book, not notes — the actual NCERT, line by line. My friends preparing for JEE tell me that if you do NCERT Chemistry in full detail, JEE Mains chemistry is essentially covered.',
    ],
  },
  {
    id: 'maths',
    subject: 'Mathematics',
    marks: '91 · theory 71/80',
    lede: 'Not a knowledge problem. A time-management problem.',
    body: [
      'I knew the material well. I still got 71, because I did a lot of it wrong.',
      'I abandoned my own rule about doing 5-markers first, ran out of time, and left them.',
      'And I lost marks on MCQs to silly mistakes — the cheapest marks on the paper, thrown away.',
      'Maths punishes disorder more than any other subject. Knowing it is not the same as scoring it.',
    ],
  },
  {
    id: 'computer-science',
    subject: 'Computer Science',
    marks: '98 · theory 68/70',
    lede: 'My best paper, and the least dramatic story.',
    body: [
      'For Python I used one six-hour video and typed along with it instead of watching passively.',
      'For the theory and SQL I just followed what school handed out. No channel, no extra material — the school sheets were closer to the paper than anything online.',
    ],
  },
  {
    id: 'english',
    subject: 'English Core',
    marks: '96 · theory 76/80',
    lede: 'Keywords. Each chapter only has a few things they can actually ask.',
    body: [
      'Work out what those few things are per chapter and know them properly. That’s most of the literature section.',
      'Your school teacher will mark you strictly. The board will not — there are multiple valid readings of most questions, and a lot of answers get accepted.',
      'So don’t panic at a harsh school score in English. It isn’t predictive.',
    ],
  },
  {
    id: 'practicals',
    subject: 'Practicals & internals',
    marks: '30/30 in Physics, Chemistry and CS',
    lede: 'In my experience schools mark these generously — but don’t treat that as a promise.',
    body: [
      'At my school, 28 to 30 was the standard and the worst I saw was around 25 or 26. Schools want their results up.',
      'Prepare for them, but not obsessively. Know your experiments, keep the file complete, and be well-mannered with the external examiner — that last part matters more than people expect.',
      'For Physics practicals, Experiential Physics is a channel run by my own school physics teacher, and the videos are genuinely lovely.',
    ],
  },
]

export const WALL: { id: string; grade: string; items: string[]; note: string }[] = [
  {
    id: 'wall-10',
    grade: 'Class 10',
    items: ['SST maps — every one that carries marks', 'Trigonometry formulae', 'Facts you keep forgetting'],
    note: 'The SST maps helped me more than anything else on the wall. Map questions are marks you can simply have, and you get them by looking at the same sheet for months.',
  },
  {
    id: 'wall-1112',
    grade: 'Class 11 & 12',
    items: [
      'Organic chemistry conversions',
      'Physics formulae by unit',
      'Trigonometry and calculus identities',
      'Whatever you personally keep getting wrong',
    ],
    note: 'Stick them up and read them honestly once. After that, just look at them when you’re bored. That’s the whole method — it works because it costs you nothing.',
  },
]

export const APOLOGY_LETTER = {
  intro:
    'I bunked something like a hundred classes and wrote a lot of apology letters. Genuinely, I think that’s part of why my English improved. Here’s the format, since somebody always needs it.',
  template: `The Principal
[School Name]
[City]

Date: [DD/MM/YYYY]

Subject: Apology for [what you did]

Respected Sir/Ma'am,

I am [Your Name], a student of Class [X-Section], Roll No. [__].
I am writing to sincerely apologise for [state exactly what happened,
without excuses] on [date].

I understand that my behaviour was inappropriate and that it disrupted
[class / the school's discipline]. I take full responsibility for it and
I regret my actions.

I assure you that this will not be repeated, and I will conduct myself
properly going forward. I request you to kindly excuse me this time.

Thank you for your understanding.

Yours obediently,
[Your Name]
Class [X-Section]
Roll No. [__]`,
  tips: [
    'Own it in the first line. Excuses make it worse and teachers can see them coming.',
    'Say specifically what you did — vagueness reads as insincerity.',
    'Keep it short. Half a page, handwritten, neat.',
    'One clear promise at the end, and nothing dramatic.',
  ],
}
