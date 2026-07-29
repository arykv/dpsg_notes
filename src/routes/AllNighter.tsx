import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, BedDouble, RotateCcw } from 'lucide-react'
import { GUIDES } from '@/data/guides'
import { PREP_OPTIONS, buildPlan, fmtMinutes, type Prep } from '@/lib/allnighter'
import { ButtonLink } from '@/components/ui/Button'
import { useLocalStorage } from '@/lib/hooks'
import { rise, stagger } from '@/lib/motion'

/**
 * Pull an all nighter.
 *
 * The whole site in one screen. Three taps — no typing, because at 11pm on a
 * phone in the dark typing is a tax — and then an honest verdict and a plan
 * that spends your remaining hours where the marks actually are.
 *
 * The two rules from VISION.md §2 live in `lib/allnighter.ts`: never flatter,
 * never hopeless. The sleep line is not decoration and must not be softened —
 * a study site telling you to stop studying is the moment this becomes worth
 * sending to a friend.
 */
export default function AllNighter() {
  const [subject, setSubject] = useLocalStorage<string>('dpsg.an.subject', '')
  const [when, setWhen] = useLocalStorage<string>('dpsg.an.when', '')
  const [prep, setPrep] = useLocalStorage<Prep | ''>('dpsg.an.prep', '')
  const [started, setStarted] = useState(false)

  const plan = useMemo(
    () => (subject && when && prep ? buildPlan(subject, when, prep as Prep) : null),
    [subject, when, prep],
  )

  const ready = Boolean(subject && when && prep)

  return (
    <div className="register mx-auto max-w-3xl px-4 pt-12 pb-8 pl-5 sm:px-6 sm:pl-16">
      <AnimatePresence mode="wait">
        {!started || !plan ? (
          <motion.div key="ask" exit={{ opacity: 0, y: -8 }}>
            <p className="eyebrow">Tomorrow's exam?</p>
            <h1 className="mt-2 text-4xl sm:text-5xl">
              Let's <span className="marked">survive it</span>.
            </h1>
            <p className="text-muted mt-4 max-w-xl text-[15px] leading-relaxed">
              Three taps. You'll get an honest read on where you stand and a plan for the hours you
              actually have — spent where the marks are, not where the textbook starts.
            </p>

            {/* 1 — subject */}
            <fieldset className="mt-10">
              <legend className="eyebrow mb-3">Which paper</legend>
              <div className="flex flex-wrap gap-2">
                {GUIDES.map((g) => (
                  <button
                    key={g.slug}
                    onClick={() => setSubject(g.slug)}
                    aria-pressed={subject === g.slug}
                    className={`rounded-[6px] border px-3.5 py-2 text-[14px] font-medium transition-colors ${
                      subject === g.slug
                        ? 'border-[var(--mark)] bg-[var(--mark)]/10 text-[var(--text)]'
                        : 'surface border-line text-muted hover:border-line-strong'
                    }`}
                  >
                    {g.subject}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* 2 — when */}
            <fieldset className="mt-8">
              <legend className="eyebrow mb-3">When is it</legend>
              <input
                type="datetime-local"
                value={when}
                onChange={(e) => setWhen(e.target.value)}
                aria-label="Date and time of the paper"
                className="surface border-line hover:border-line-strong focus:border-[var(--mark)] h-12 w-full max-w-xs rounded-[6px] border px-3 text-[15px] transition-colors focus:outline-none"
              />
              <p className="text-faint mt-2 text-xs">Most CBSE papers start at 10:30 am.</p>
            </fieldset>

            {/* 3 — prep */}
            <fieldset className="mt-8">
              <legend className="eyebrow mb-3">How much have you done</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {PREP_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => setPrep(o.value)}
                    aria-pressed={prep === o.value}
                    className={`rounded-[6px] border p-3.5 text-left transition-colors ${
                      prep === o.value
                        ? 'border-[var(--mark)] bg-[var(--mark)]/10'
                        : 'surface border-line hover:border-line-strong'
                    }`}
                  >
                    <span className="block text-[14px] font-medium">{o.label}</span>
                    <span className="text-muted mt-0.5 block text-[12px] leading-snug">{o.sub}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <button
              disabled={!ready}
              onClick={() => setStarted(true)}
              className="bg-[var(--mark)] mt-10 inline-flex h-12 items-center gap-2 rounded-[6px] px-6 text-[15px] font-medium text-[#241703] transition-[filter,transform] hover:brightness-108 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
            >
              Pull an all nighter
              <ArrowRight className="size-4" />
            </button>
            {!ready && (
              <p className="text-faint mt-3 text-xs">Pick all three and the plan appears.</p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="plan"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* The verdict. Honest first, plan second. */}
            <p className="eyebrow">
              {plan.guide.subject} · {Math.round(plan.hoursLeft)} hours away
            </p>
            <h1
              className={`mt-2 text-3xl sm:text-4xl ${
                plan.verdict.tone === 'brutal' ? 'text-pen' : ''
              }`}
            >
              {plan.verdict.headline}
            </h1>
            <p className="text-muted mt-4 text-[15px] leading-relaxed">{plan.verdict.body}</p>

            <div className="border-line-strong mt-8 flex flex-wrap items-baseline gap-x-8 gap-y-2 border-y py-4">
              <span className="flex items-baseline gap-2.5">
                <span className="font-display text-mark text-3xl font-bold tabular">
                  {Math.round(plan.studyHours)}h
                </span>
                <span className="eyebrow">to actually study</span>
              </span>
              <span className="flex items-baseline gap-2.5">
                <span className="font-display text-2xl font-bold tabular">
                  {plan.marksCovered}/{plan.guide.theoryMarks}
                </span>
                <span className="eyebrow">marks this plan reaches</span>
              </span>
            </div>

            {/* The plan. */}
            <motion.ol
              initial="hidden"
              animate="show"
              variants={stagger(0.05)}
              className="mt-8 space-y-2.5"
            >
              {plan.blocks
                .filter((b) => !b.dropped)
                .map((b, i) => (
                  <motion.li
                    key={b.unit.n}
                    variants={rise}
                    className="surface border-line flex gap-4 rounded-[6px] border p-4"
                  >
                    <span className="surface-2 border-line-strong text-mark grid size-7 shrink-0 place-items-center rounded-full border font-mono text-[11px] font-medium">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                        <h2 className="text-[15px]">{b.unit.name}</h2>
                        <span className="text-mark font-mono text-[12px] tabular">
                          {fmtMinutes(b.minutes)} · {b.unit.marks} marks
                        </span>
                      </div>
                      <p className="text-muted mt-1.5 text-[13px] leading-relaxed">{b.unit.asked}</p>
                    </div>
                  </motion.li>
                ))}
            </motion.ol>

            {/* Sleep. The most important line on the page. */}
            {plan.sleepHours > 0 && (
              <motion.div
                variants={rise}
                initial="hidden"
                animate="show"
                className="border-[var(--mark)]/50 bg-[var(--mark)]/[0.06] mt-4 flex gap-3 rounded-[6px] border-l-2 px-4 py-4"
              >
                <BedDouble className="text-mark mt-0.5 size-4 shrink-0" aria-hidden />
                <div>
                  <p className="text-[15px] font-medium">
                    Then sleep for {plan.sleepHours} hours. Seriously.
                  </p>
                  <p className="text-muted mt-1.5 text-[14px] leading-relaxed">
                    This is not padding. Past about this point another hour of revision is worth
                    less than being able to think in the hall, and you cannot write a five-marker on
                    four hours' sleep. Set an alarm and stop.
                  </p>
                </div>
              </motion.div>
            )}

            {/* What's being dropped, named out loud. */}
            {plan.blocks.some((b) => b.dropped) && (
              <div className="mt-8">
                <p className="eyebrow mb-2.5">Not doing tonight — on purpose</p>
                <div className="flex flex-wrap gap-2">
                  {plan.blocks
                    .filter((b) => b.dropped)
                    .map((b) => (
                      <span
                        key={b.unit.n}
                        className="surface-2 border-line text-faint rounded-[5px] border px-2.5 py-1 text-[13px] line-through"
                      >
                        {b.unit.name} · {b.unit.marks}
                      </span>
                    ))}
                </div>
                <p className="text-muted mt-3 text-[13px] leading-relaxed">
                  Deciding this now is the whole point. The way a night before actually fails is
                  running out of time halfway through something that mattered, because you never
                  chose what to skip.
                </p>
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-2.5">
              <ButtonLink to={`/guide/${plan.guide.slug}`} size="sm" variant="mark">
                The full {plan.guide.subject} guide
              </ButtonLink>
              <ButtonLink to="/strategy#solve-dont-watch" size="sm" variant="secondary">
                Solve, don't watch
              </ButtonLink>
              <button
                onClick={() => setStarted(false)}
                className="text-muted hover:text-[var(--text)] inline-flex h-8 items-center gap-1.5 rounded-[5px] px-3 text-[13px] font-medium transition-colors"
              >
                <RotateCcw className="size-3.5" />
                Change something
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
