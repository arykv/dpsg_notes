import type { Unit } from '@/data/guides'
import { paperBySlug, passMark, type Paper } from '@/data/papers'

/**
 * The plan behind "Pull an all nighter".
 *
 * Three rules govern every line of this file. The first two are from VISION.md
 * §2 and predate it; the third is why it was rewritten.
 *
 *   1. **Never flatter.** If there isn't time, the plan says there isn't time.
 *      The credibility of this whole site is that it doesn't lie about marks.
 *   2. **Never hopeless.** Brutal about the situation, never about the person.
 *      There is always a plan, even when the plan is small.
 *   3. **Never promise a night it cannot deliver.** The first version of this
 *      file divided the hours to the exam by the marks in the paper and printed
 *      the result. That produces a plan in which a chapter takes fifteen
 *      minutes, twelve hours of clock time is twelve hours of work, and the
 *      figure at the top reads like a score you are going to get. All three are
 *      false, and a student who follows a plan built on them runs out of night
 *      somewhere in the middle and blames themselves for it.
 *
 * So this version models four things the old one didn't:
 *
 *   - **Clock time is not study time.** Breaks are real, and 3am is not 9pm.
 *     `studyMinutesBetween` walks the actual hours and discounts them.
 *   - **A unit has a minimum.** Below about three quarters of an hour you have
 *     not met a chapter, you have looked at it. Units that don't fit are
 *     dropped by name rather than given a token fifteen minutes.
 *   - **Coverage is not marks.** Studying a unit tonight converts maybe half of
 *     its marks if you're starting cold. The headline figure is a range, and it
 *     is compared against the pass mark, because for a lot of people reading
 *     this at 1am the pass mark is the real question.
 *   - **The night has a shape.** Study, then sleep, then revise in the morning.
 *     New material at 6am on exam day does not survive to 10:30.
 */

export type Prep = 'nothing' | 'some' | 'most'

export const PREP_OPTIONS: { value: Prep; label: string; sub: string }[] = [
  { value: 'nothing', label: 'Basically nothing', sub: 'Haven’t opened it properly' },
  { value: 'some', label: 'About half', sub: 'Some chapters are fine, most aren’t' },
  { value: 'most', label: 'Most of it', sub: 'Revising rather than learning' },
]

/* --- The constants, each with the reason it is that number ---------------- */

const MIN_MS = 60_000

/**
 * Minutes between closing the book and the paper starting. CBSE wants you in
 * the hall thirty minutes early; getting there is thirty more; washing, eating
 * and finding your admit card is the rest. Counting these as study hours is the
 * single easiest way to make a plan that cannot be followed.
 */
const GETTING_THERE = 105

/** Ten minutes off in every hour. Not optional, and not padding. */
const BREAK_FACTOR = 60 / 70

/** Morning revision, capped. Past two hours you are re-reading, not revising. */
const MORNING_CAP = 120

/** The evening is taken to start at 8pm. Before that it is still daytime. */
const NIGHT_START_HOUR = 20
const DAY_START_HOUR = 9
const DAY_END_HOUR = 22

/** Six good hours is a full day of study, however many hours the day contains. */
const DAY_CAP = 6 * 60

/**
 * Minutes a mark costs, by how much you've already done. Learning something for
 * the first time is not three times revising it, it is more — which is why the
 * gap between `nothing` and `most` here is a factor of three rather than the
 * factor of two it feels like from the inside at 11pm.
 */
const MINUTES_PER_MARK: Record<Prep, number> = { nothing: 12, some: 7, most: 4 }

/**
 * Not every mark costs the same. A Society-Law-and-Ethics mark is memorisable
 * in an evening; a rotational-motion mark needs numericals you cannot acquire
 * overnight. Ranking purely by marks drops the cheap recall units first, which
 * is the exact opposite of what every guide on this site advises.
 */
const EFFORT_COST: Record<NonNullable<Unit['effort']>, number> = {
  recall: 0.7,
  standard: 1,
  heavy: 1.4,
}

/**
 * The floor under a block. **No chapter is done in half an hour.** The previous
 * version rounded a cheap unit up to fifteen minutes so it wouldn't get
 * dropped; the effect was a plan full of units nobody could possibly have
 * covered, which is worse than a shorter plan that is true.
 */
const MIN_BLOCK: Record<Prep, number> = { nothing: 45, some: 30, most: 20 }

/**
 * What a night actually converts.
 *
 * `BASELINE` is what a unit scores with no work done on it at all — objective
 * questions, assertion–reason, case-based comprehension, and the parts of a
 * subject that leak in from everywhere else. `CONVERSION` is what it scores
 * after the block below. Neither is ever 1, because a unit studied once at
 * midnight is not a unit you have mastered, and printing a number that implies
 * otherwise is the thing this rewrite exists to stop.
 */
const BASELINE: Record<Prep, number> = { nothing: 0.12, some: 0.35, most: 0.55 }
const CONVERSION: Record<Prep, number> = { nothing: 0.5, some: 0.68, most: 0.82 }

/** Unseen passages score about this whatever you did last night. */
const UNSEEN = 0.6

/* --- Time ----------------------------------------------------------------- */

const at = (d: Date, h: number, m = 0) => {
  const x = new Date(d)
  x.setHours(h, m, 0, 0)
  return x
}
const addDays = (d: Date, n: number) => {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}
const minutesBetween = (a: Date, b: Date) => Math.max(0, Math.round((b.getTime() - a.getTime()) / MIN_MS))

/**
 * How much an hour is worth, by which hour of the day it is.
 *
 * This is the part students argue with and then agree with by about 2am. The
 * hours either side of midnight are nearly full value. The ones after are not,
 * and no amount of coffee changes the fact that you will re-read the same
 * paragraph four times at 3:40am. The morning after sleep is the best study
 * time in the whole window, which is the argument for going to bed.
 */
function quality(hour: number): number {
  if (hour < 1) return 0.85
  if (hour < 3) return 0.65
  if (hour < 5) return 0.45
  if (hour < 6) return 0.55
  if (hour < 9) return 1.05
  if (hour < 13) return 1
  if (hour < 16) return 0.9
  if (hour < 20) return 1
  if (hour < 23) return 0.95
  return 0.85
}

/** Wall-clock minutes between two times, converted into work that will happen. */
export function studyMinutesBetween(from: Date, to: Date): number {
  let total = 0
  const stepMs = 15 * MIN_MS
  for (let t = from.getTime(); t < to.getTime(); t += stepMs) {
    const slice = Math.min(15, (to.getTime() - t) / MIN_MS)
    total += slice * quality(new Date(t + (slice / 2) * MIN_MS).getHours())
  }
  return Math.round(total * BREAK_FACTOR)
}

/**
 * How long to sleep, given how much night is left.
 *
 * Under four and a half hours a full night is off the table, so the advice
 * becomes one 90-minute sleep cycle — waking at the end of a cycle rather than
 * out of the middle of one is most of the difference between four hours that
 * help and four hours that don't. Under three hours it is a single nap, which
 * is genuinely better than none.
 */
function sleepFor(nightMinutes: number): number {
  if (nightMinutes >= 20 * 60) return 480
  if (nightMinutes >= 14 * 60) return 420
  if (nightMinutes >= 11 * 60) return 360
  if (nightMinutes >= 9 * 60) return 300
  if (nightMinutes >= 7.5 * 60) return 300
  if (nightMinutes >= 6 * 60) return 270
  if (nightMinutes >= 4.5 * 60) return 90
  if (nightMinutes >= 3 * 60) return 25
  return 0
}

/* --- Shape ---------------------------------------------------------------- */

export type SessionKind = 'day' | 'tonight' | 'sleep' | 'morning'

export interface Session {
  id: string
  kind: SessionKind
  label: string
  from: Date
  to: Date
  /** Minutes on the clock. */
  clockMinutes: number
  /** Minutes of that which are worth anything, after breaks and the hour. */
  studyMinutes: number
  /** Set when a day was capped because six good hours is a full day. */
  capped?: boolean
}

export interface Block {
  unit: Unit
  minutes: number
  sessionId: string
  /** A second sitting on a unit that didn't fit into one. */
  continued?: boolean
  /** There was never enough time to finish this; it's here to get as far as possible. */
  partial?: boolean
  depth: { label: string; detail: string }
}

export interface Plan {
  paper: Paper
  prep: Prep
  now: Date
  exam: Date
  sessions: Session[]
  blocks: Block[]
  /** Named out loud, because choosing what to lose is the whole skill. */
  dropped: Unit[]
  /** Marks there is no point revising for. Listed, never scheduled. */
  unpreppable: Unit[]
  clockMinutes: number
  studyMinutes: number
  sleepMinutes: number
  morningMinutes: number
  /**
   * True when there is no usable night left and the morning has become the
   * study time rather than a revision slot. Changes what the page says, not
   * just what it schedules.
   */
  morningIsStudy: boolean
  /** Marks sitting in units the plan actually reaches. */
  marksReached: number
  droppedMarks: number
  expected: { low: number; high: number }
  passMark: number
  /** True when the honest expectation is below CBSE's pass mark. */
  atRisk: boolean
  verdict: { headline: string; body: string; objective: string; tone: Tone }
}

export type Tone = 'early' | 'calm' | 'tight' | 'brutal' | 'none'

/* --- The plan ------------------------------------------------------------- */

const effortOf = (u: Unit) => EFFORT_COST[u.effort ?? 'standard']
const costOf = (u: Unit, prep: Prep) => Math.round(u.marks * MINUTES_PER_MARK[prep] * effortOf(u))
const wantOf = (u: Unit, prep: Prep) => Math.max(MIN_BLOCK[prep], costOf(u, prep))

/**
 * What "doing" a unit means at the pace the plan can afford. Without this the
 * list is just chapter names and minutes, and every student reads every block
 * as "learn this properly" — then feels like they failed when forty minutes
 * bought them a skim. Naming the depth up front turns the same forty minutes
 * from a shortfall into an instruction.
 */
const DEPTHS: Record<Prep, { skim: Block['depth']; partial: Block['depth']; full: Block['depth'] }> = {
  nothing: {
    skim: {
      label: 'Skim',
      detail:
        'Definitions, statements and formulae only — you will not understand this unit tonight and you are not trying to. You are buying the one-markers and the objective questions, and those are real marks.',
    },
    partial: {
      label: 'As far as you get',
      detail:
        'Start at the beginning and stop when the time is up. Don’t skip ahead to the "important" bits — in a unit you have never read, you cannot yet tell which those are.',
    },
    full: {
      label: 'First pass',
      detail:
        'Read it once, then work two or three solved examples with the solution covered. Skip the derivations — there isn’t time and they aren’t where tonight’s marks are.',
    },
  },
  some: {
    skim: {
      label: 'Skim',
      detail:
        'Just the parts you know you never got to. Don’t start at page one — you have read page one already, and it is the most reassuring way to waste twenty minutes there is.',
    },
    partial: {
      label: 'Patch the worst gaps',
      detail:
        'Go straight at the bits you would rather not look at. Working from most-uncomfortable to least is unpleasant and it is where every mark in this block is.',
    },
    full: {
      label: 'Fill the gaps',
      detail:
        'Work questions first, and read only where a question catches you out. Finding the holes is most of the job here, and reading front to back hides them.',
    },
  },
  most: {
    skim: {
      label: 'Quick look',
      detail:
        'A pass over the formulae and the standard results. You know this one — this is about it being at the front of your head tomorrow, not about learning it.',
    },
    partial: {
      label: 'Questions only',
      detail:
        'No reading. Do past-paper questions from this unit until one catches you out, then read only that bit and go back to questions.',
    },
    full: {
      label: 'Revision pass',
      detail:
        'Don’t re-read it — re-reading something you know feels productive and changes nothing. Do questions unaided until you stop reaching for the book.',
    },
  },
}

/**
 * What "doing" a unit means at the pace the plan can afford, and at the level
 * the student actually said they were at.
 *
 * This was density-only to begin with, and it produced the worst sentence this
 * page has ever shown: a student who had ticked "basically nothing" was told
 * *"You know this one. Don't re-read it"* about a 45-mark Python unit, because
 * the block happened to be short relative to its size. Time-per-mark tells you
 * how deep a block can go; only `prep` tells you what depth *means* for the
 * person reading it. Both are needed, and getting this wrong breaks the one
 * rule the file exists to keep.
 */
function depthFor(u: Unit, minutes: number, prep: Prep): Block['depth'] {
  // 1.0 is the full block this unit was costed at for this preparation level.
  const share = minutes / (u.marks * effortOf(u) * MINUTES_PER_MARK[prep])
  const set = DEPTHS[prep]
  if (share < 0.35) return set.skim
  if (share < 0.75) return set.partial
  if (share <= 1.25) return set.full
  return {
    label: 'Learn it properly',
    detail:
      'More time than this unit strictly needs, so use it: read, work the examples, then do one past-paper question with the book shut. The only depth here that reliably survives to the morning.',
  }
}

function buildSessions(now: Date, penDown: Date, prep: Prep): Session[] {
  const sessions: Session[] = []

  // The night before the paper. If it's already past 8pm on that day, the night
  // has started and it started without you.
  const evening = at(addDays(penDown, -1), NIGHT_START_HOUR)
  const nightStart = evening < now ? now : evening

  // Anything before that is daytime, and daytime has a ceiling on it.
  if (nightStart > now) {
    let cursor = new Date(now)
    let guard = 0
    while (cursor < nightStart && guard++ < 40) {
      const dayEnd = at(cursor, DAY_END_HOUR)
      const to = dayEnd < nightStart ? dayEnd : nightStart
      if (to > cursor) {
        const raw = studyMinutesBetween(cursor, to)
        const capped = raw > DAY_CAP
        sessions.push({
          id: `day-${sessions.length}`,
          kind: 'day',
          label: dayLabel(cursor, now),
          from: new Date(cursor),
          to,
          clockMinutes: minutesBetween(cursor, to),
          studyMinutes: Math.min(raw, DAY_CAP),
          capped,
        })
      }
      cursor = at(addDays(cursor, 1), DAY_START_HOUR)
    }
  }

  const nightClock = minutesBetween(nightStart, penDown)
  let sleep = sleepFor(nightClock)
  // Morning revision is carved out before tonight is, because it is the best
  // study time in the window and the easiest one to lose by accident. It takes
  // a share of what's left after sleep rather than a flat two hours, or a short
  // night ends up being all morning and no night.
  const morning =
    sleep >= 90 ? Math.min(MORNING_CAP, Math.round(Math.max(0, nightClock - sleep) * 0.35)) : 0
  let tonight = Math.max(0, nightClock - sleep - morning)
  // A stub of a session before bed is not a session — you would spend it
  // finding the page. The test is against what the hours are *worth*, not how
  // many there are: an hour that starts at 2:45am is twenty-five minutes of
  // work, and twenty-five minutes does not open a chapter. Below the minimum
  // block the honest instruction is to sleep now and use the morning.
  if (studyMinutesBetween(nightStart, new Date(nightStart.getTime() + tonight * MIN_MS)) < MIN_BLOCK[prep]) {
    sleep += tonight
    tonight = 0
  }

  let mark = new Date(nightStart)

  if (tonight > 0) {
    const to = new Date(mark.getTime() + tonight * MIN_MS)
    sessions.push({
      id: 'tonight',
      kind: 'tonight',
      label: sessions.length ? 'The night before' : windowWord(mark),
      from: new Date(mark),
      to,
      clockMinutes: tonight,
      studyMinutes: studyMinutesBetween(mark, to),
    })
    mark = to
  }

  if (sleep > 0) {
    const to = new Date(mark.getTime() + sleep * MIN_MS)
    sessions.push({
      id: 'sleep',
      kind: 'sleep',
      label: sleep >= 90 ? 'Sleep' : 'Nap',
      from: new Date(mark),
      to,
      clockMinutes: sleep,
      studyMinutes: 0,
    })
    mark = to
  }

  if (morning > 0) {
    sessions.push({
      id: 'morning',
      kind: 'morning',
      label: 'The morning of',
      from: new Date(mark),
      to: penDown,
      clockMinutes: minutesBetween(mark, penDown),
      studyMinutes: studyMinutesBetween(mark, penDown),
    })
  }

  return sessions
}

/**
 * What to call the block of hours before the paper. Plenty of people open this
 * page at 7am on the day, and calling that "tonight" is the kind of small
 * wrongness that makes a page feel like it isn't really looking at your
 * situation.
 */
function windowWord(start: Date): string {
  const h = start.getHours()
  if (h >= 20 || h < 4) return 'Tonight'
  if (h < 11) return 'This morning'
  return 'The hours you have left'
}

function dayLabel(day: Date, now: Date): string {
  const sameDay = day.toDateString() === now.toDateString()
  if (sameDay) return 'The rest of today'
  return day.toLocaleDateString(undefined, { weekday: 'long' })
}

export function buildPlan(slug: string, examISO: string, prep: Prep, now = new Date()): Plan | null {
  const paper = paperBySlug(slug)
  if (!paper || !examISO) return null

  const exam = new Date(examISO)
  if (Number.isNaN(exam.getTime())) return null

  const penDown = new Date(exam.getTime() - GETTING_THERE * MIN_MS)
  const clockMinutes = minutesBetween(now, exam)
  if (exam <= now) return null

  const sessions = penDown > now ? buildSessions(now, penDown, prep) : []
  const sleepMinutes = sessions.filter((s) => s.kind === 'sleep').reduce((n, s) => n + s.clockMinutes, 0)
  const morningMinutes = sessions.filter((s) => s.kind === 'morning').reduce((n, s) => n + s.studyMinutes, 0)

  // The morning is deliberately not in the learning budget. It is reserved for
  // going back over last night's units, and putting a new chapter in it is how
  // you arrive at the hall having half-learnt one more thing and forgotten two.
  //
  // Unless there is no night — at 3am with nothing done, the right answer is
  // sleep now and start in the morning, and then the morning *is* the study
  // time rather than a revision slot for work that never happened.
  const hasNight = sessions.some((s) => s.kind === 'tonight')
  const morningIsStudy = !hasNight && morningMinutes > 0
  const studySessions = sessions.filter(
    (s) => s.kind === 'day' || s.kind === 'tonight' || (morningIsStudy && s.kind === 'morning'),
  )
  const studyMinutes = studySessions.reduce((n, s) => n + s.studyMinutes, 0)

  const unpreppable = paper.units.filter((u) => u.unpreppable)
  const preppable = paper.units.filter((u) => !u.unpreppable)

  const ranked = [...preppable].sort(
    (a, b) => b.marks / wantOf(b, prep) - a.marks / wantOf(a, prep),
  )

  // Pass one — decide what is in and what is lost, against the whole budget.
  let budget = studyMinutes
  const chosen: { unit: Unit; minutes: number; partial?: boolean }[] = []
  for (const u of ranked) {
    const want = wantOf(u, prep)
    if (budget >= want) {
      chosen.push({ unit: u, minutes: want })
      budget -= want
    }
  }

  // Whatever is left over goes to the biggest thing that got dropped, as far as
  // it gets. This is what a student does anyway, and pretending otherwise
  // leaves two hours unaccounted for at the bottom of the page.
  if (budget >= MIN_BLOCK[prep]) {
    const next = ranked.find((u) => !chosen.some((c) => c.unit === u))
    if (next) {
      chosen.push({ unit: next, minutes: budget, partial: true })
      budget = 0
    }
  }

  // Nothing fit at all. Spend everything on the single best-value unit and be
  // explicit that it will not be finished.
  const best = ranked[0]
  if (!chosen.length && studyMinutes >= 20 && best) {
    chosen.push({ unit: best, minutes: studyMinutes, partial: true })
  }

  // Pass two — lay the blocks into the sessions they'll actually happen in.
  const blocks: Block[] = []
  let si = 0
  let left = studySessions[0]?.studyMinutes ?? 0
  for (const c of chosen) {
    let remaining = c.minutes
    let pieces = 0
    let session = studySessions[si]
    while (remaining > 0 && session) {
      if (left < 15) {
        si += 1
        session = studySessions[si]
        left = session?.studyMinutes ?? 0
        continue
      }
      const take = Math.min(left, remaining)
      blocks.push({
        unit: c.unit,
        minutes: take,
        sessionId: session.id,
        continued: pieces > 0,
        partial: c.partial,
        depth: depthFor(c.unit, c.minutes, prep),
      })
      remaining -= take
      left -= take
      pieces += 1
    }
  }

  const dropped = preppable.filter((u) => !chosen.some((c) => c.unit === u))
  const marksReached = chosen.reduce((n, c) => n + c.unit.marks, 0)
  const droppedMarks = dropped.reduce((n, u) => n + u.marks, 0)

  // What the paper is honestly worth at the end of this.
  let expected = 0
  for (const u of paper.units) {
    if (u.unpreppable) {
      expected += u.marks * UNSEEN
      continue
    }
    const c = chosen.find((x) => x.unit === u)
    if (!c) {
      expected += u.marks * BASELINE[prep]
      continue
    }
    const share = Math.min(1, c.minutes / wantOf(u, prep))
    expected += u.marks * (BASELINE[prep] + (CONVERSION[prep] - BASELINE[prep]) * share)
  }

  const clamp = (n: number) => Math.max(0, Math.min(paper.theoryMarks, n))
  const low = clamp(Math.floor(expected * 0.85))
  const high = clamp(Math.ceil(expected * 1.15))
  const pass = passMark(paper)

  // A day nothing landed in is noise — it happens whenever the paper is further
  // off than it needs to be, and a column of empty days reads as a plan that
  // ran out rather than one that finished early.
  const usedSessions = sessions.filter(
    (s) => s.kind !== 'day' || blocks.some((b) => b.sessionId === s.id),
  )

  return {
    paper,
    prep,
    now,
    exam,
    sessions: usedSessions,
    blocks,
    dropped,
    unpreppable,
    clockMinutes,
    studyMinutes,
    sleepMinutes,
    morningMinutes,
    morningIsStudy,
    marksReached,
    droppedMarks,
    expected: { low, high },
    passMark: pass,
    atRisk: low < pass,
    verdict: verdictFor({
      paper,
      prep,
      studyMinutes,
      clockMinutes,
      expected,
      pass,
      dropped,
      morningIsStudy,
      sleepMinutes,
    }),
  }
}

/* --- What it says --------------------------------------------------------- */

function verdictFor(a: {
  paper: Paper
  prep: Prep
  studyMinutes: number
  clockMinutes: number
  expected: number
  pass: number
  dropped: Unit[]
  morningIsStudy: boolean
  sleepMinutes: number
}): Plan['verdict'] {
  const share = a.expected / a.paper.theoryMarks
  const mid = Math.round(a.expected)

  // The night is already gone, but the morning isn't. This is the single most
  // useful thing this page says, and it only says it because it models sleep
  // as a block of the night rather than as a nice idea at the bottom.
  if (a.morningIsStudy && a.studyMinutes >= 20) {
    return {
      tone: 'brutal',
      headline: 'Stop. Go to sleep, and do this in the morning.',
      body: `It is late enough that the next few hours would cost you more than they bought — you would read the same paragraph four times and remember none of it. ${fmtMinutes(a.sleepMinutes)} of sleep and then ${fmtMinutes(a.studyMinutes)} of clear-headed work before the paper beats grinding through the night and arriving unable to think. This is not the comforting answer. It is the one that scores more marks.`,
      objective: 'Sleep now. Set an alarm. The plan below is your morning, not your night.',
    }
  }

  if (a.studyMinutes < 20) {
    return {
      tone: 'none',
      headline: 'You are out of time, and that is fine.',
      body: 'There is no plan that fits in what is left. Read your own summary notes once, drink some water, and go in. Opening something new now will only push out something you already know — that is not a figure of speech, it is how the last hour before a paper actually works.',
      objective: 'Get there calm rather than get there having read one more page.',
    }
  }

  if (a.clockMinutes > 7 * 24 * 60) {
    return {
      tone: 'early',
      headline: 'This is not an all nighter. You have time.',
      body: 'More than a week out, the plan below is the right order to do things in rather than a night to survive. Do the top two units this week and come back the evening before — the same three taps will give you a much sharper plan when the hours are actually scarce.',
      objective: 'Start at the top. There is no need to rush and no need for this page yet.',
    }
  }

  if (a.expected < a.pass) {
    return {
      tone: 'brutal',
      headline: 'This one is about passing, not about a percentage.',
      body: `Honestly: this comes out around ${mid} of ${a.paper.theoryMarks}, and the pass mark is ${a.pass}. That is the real situation and there is no version of tonight where you learn this subject properly. There is a version where you walk in able to answer the cheapest units cleanly and get over the line, and that is worth doing properly. Follow the order below and do not look at what it drops.`,
      objective: `Clear ${a.pass}. Everything past that is a bonus, not the target.`,
    }
  }

  if (share >= 0.75) {
    return {
      tone: 'calm',
      headline: 'You are in decent shape. Don’t waste the hours.',
      body: 'There is enough time to reach most of this paper at a pace that will still be in your head in the morning. The trap now is comfort — re-reading the chapters you already like feels like revision and isn’t. The order below is by marks per hour, not by what is pleasant.',
      objective: 'Work down the list in order. Stop when the plan says stop.',
    }
  }

  if (share >= 0.5) {
    return {
      tone: 'tight',
      headline: 'You can get most of the marks. Not all of them.',
      body: `About ${mid} of ${a.paper.theoryMarks} is the honest read — enough time for the units that carry the paper, not enough for the tail. ${a.dropped.length ? 'The units below the line are marked dropped on purpose.' : ''} Deciding now what you are not doing is exactly what stops you running out of night halfway through something that mattered.`,
      objective: 'Take the list in order and accept the losses at the bottom of it.',
    }
  }

  return {
    tone: 'brutal',
    headline: 'Tight. Pick your battles and commit to them.',
    body: `Around ${mid} of ${a.paper.theoryMarks} on an honest reading. Not enough hours for the whole paper, so the plan spends them where the marks are cheapest, and everything below the line is a deliberate loss rather than an accident. That is a better position than it sounds — a chosen loss costs you those marks, an unchosen one costs you those marks plus the twenty minutes you spent panicking about them.`,
    objective: 'Work down the list in order, and don’t reopen the decisions at the bottom of it.',
  }
}

/* --- Formatting ----------------------------------------------------------- */

export const fmtMinutes = (m: number) =>
  m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ''}` : `${m}m`

/**
 * Always 12-hour with am/pm, and deliberately not the browser's locale default.
 * Left to itself a UK-locale phone renders this window as "2:56 → 20:00", which
 * mixes both clocks in one line and is genuinely hard to read at 3am. Everyone
 * this is written for reads times as "2:56 am".
 */
export const fmtClock = (d: Date) =>
  d
    .toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
    .toLowerCase()
    .replace(/\s+/g, ' ')

export const fmtWindow = (s: Session) => `${fmtClock(s.from)} → ${fmtClock(s.to)}`

/** Blocks belonging to a session, in the order they happen. */
export const blocksIn = (plan: Plan, sessionId: string) =>
  plan.blocks.filter((b) => b.sessionId === sessionId)

export { MIN_BLOCK }
