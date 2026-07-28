import { useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { AlertTriangle, ArrowUpRight, Play } from 'lucide-react'
import {
  branchTotals,
  guideBySlug,
  unitTotal,
  type SubjectGuide,
} from '@/data/guides'
import { SectionHead } from '@/components/ui/primitives'
import { ButtonLink } from '@/components/ui/Button'
import NotFound from '@/routes/NotFound'
import { inView, rise, stagger } from '@/lib/motion'

/**
 * A subject guide.
 *
 * Everything in here is free somewhere else. The point is that it is scattered
 * across a syllabus PDF nobody opens, ten coaching blogs that copy each other,
 * and a hundred YouTube channels — and that assembling it is a day of work every
 * student repeats alone. This does it once, with the analysis attached.
 */
export default function Guide() {
  const { slug } = useParams()
  const guide = slug ? guideBySlug(slug) : undefined
  if (!guide) return <NotFound />

  return (
    <div className="register mx-auto max-w-3xl px-4 pt-12 pb-8 pl-5 sm:px-6 sm:pl-16">
      <SectionHead
        eyebrow={`Class ${guide.grade} · ${guide.subject} · ${guide.code}`}
        title={`${guide.subject}, put together properly`}
        description="All of this exists free somewhere. It's spread across a syllabus PDF, a dozen blogs that copy each other's mistakes, and a hundred channels. Here it is in one place, with what I'd actually do."
      />

      <Mine guide={guide} />
      <Weightage guide={guide} />
      <Analysis guide={guide} />
      <Watch guide={guide} />

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={inView}
        variants={stagger(0.04)}
        className="mt-16"
      >
        <h2 className="text-2xl">Now go and solve something</h2>
        <p className="text-muted mt-2 text-[15px] leading-relaxed">
          Reading a guide is the same trap as watching a one-shot — it feels like work and produces
          nothing on its own. Set a daily question target and start today; the number compounds much
          faster than it feels like it should.
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <ButtonLink to="/tools#questions" size="sm" variant="mark">
            Set a question target
          </ButtonLink>
          <ButtonLink to="/strategy#solve-dont-watch" size="sm" variant="secondary">
            Why solving beats watching
          </ButtonLink>
        </div>
      </motion.section>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

/** His own marks, first. Advice from someone who won't show you theirs is worth nothing. */
function Mine({ guide }: { guide: SubjectGuide }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="surface border-line-strong mt-8 rounded-[6px] border p-5"
    >
      <p className="eyebrow">What I got in this subject</p>
      <div className="mt-2.5 flex flex-wrap items-baseline gap-x-6 gap-y-1">
        <span className="font-display text-mark text-3xl font-bold tabular">
          {guide.mine.total}
          <span className="text-faint text-lg">/100</span>
        </span>
        <span className="text-muted font-mono text-[12px] tabular">
          {guide.mine.theory} theory + {guide.mine.practical} practical
        </span>
      </div>
      <p className="text-muted mt-3 text-[14px] leading-relaxed">{guide.mine.verdict}</p>
    </motion.section>
  )
}

function Weightage({ guide }: { guide: SubjectGuide }) {
  const branches = branchTotals(guide)
  const max = Math.max(...guide.units.map((u) => u.marks))

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={stagger(0.03)}
      className="mt-16"
      id="weightage"
    >
      <h2 className="text-2xl">Every unit, and what it's worth</h2>
      <p className="text-muted mt-1.5 text-sm">
        {unitTotal(guide)} marks of theory across {guide.units.length} units ·{' '}
        {guide.paper.questions} questions · {guide.paper.duration}
      </p>

      {/* The three chemistries at a glance — the number that should drive your order. */}
      <div className="mt-5 flex flex-wrap gap-2">
        {Object.entries(branches)
          .sort((a, b) => b[1] - a[1])
          .map(([branch, marks]) => (
            <span
              key={branch}
              className="surface-2 border-line rounded-[5px] border px-2.5 py-1 text-[13px]"
            >
              {branch} <span className="text-mark font-mono font-medium tabular">{marks}</span>
            </span>
          ))}
      </div>

      <div className="mt-6 space-y-2.5">
        {guide.units.map((u) => (
          <motion.article
            key={u.n}
            variants={rise}
            className="surface border-line rounded-[6px] border p-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-[15px]">
                <span className="text-faint mr-2 font-mono text-[11px]">
                  {String(u.n).padStart(2, '0')}
                </span>
                {u.name}
              </h3>
              <span className="text-mark font-mono text-[13px] font-medium tabular">
                {u.marks} marks
              </span>
            </div>

            {/* A bar, because a table of numbers doesn't show you where the paper is. */}
            <div
              className="bg-[var(--surface-2)] mt-2.5 h-1 w-full overflow-hidden rounded-full"
              aria-hidden
            >
              <div
                className="bg-[var(--mark)] h-full rounded-full"
                style={{ width: `${(u.marks / max) * 100}%` }}
              />
            </div>

            <p className="text-muted mt-3 text-[14px] leading-relaxed">{u.asked}</p>
          </motion.article>
        ))}
      </div>
    </motion.section>
  )
}

function Analysis({ guide }: { guide: SubjectGuide }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={stagger(0.04)}
      className="mt-16"
    >
      <div className="space-y-12">
        {guide.sections.map((s) => (
          <motion.article key={s.id} variants={rise} id={s.id} className="scroll-mt-24">
            <h2 className="text-2xl">{s.heading}</h2>
            <div className="text-muted mt-3 space-y-3 text-[15px] leading-relaxed">
              {s.body.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
            {s.rule && (
              <p className="border-[var(--mark)]/50 bg-[var(--mark)]/[0.06] mt-4 flex gap-2.5 rounded-[5px] border-l-2 px-4 py-3 text-[14px] font-medium">
                <AlertTriangle className="text-mark mt-0.5 size-3.5 shrink-0" aria-hidden />
                {s.rule}
              </p>
            )}
          </motion.article>
        ))}
      </div>
    </motion.section>
  )
}

function Watch({ guide }: { guide: SubjectGuide }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={stagger(0.04)}
      className="mt-16"
      id="watch"
    >
      <h2 className="text-2xl">Who to learn it from</h2>
      <p className="text-muted mt-1.5 text-sm">
        Two channels, not twenty. Both checked by hand — plenty of dead accounts carry exactly the
        name you'd expect.
      </p>

      <div className="mt-6 space-y-2.5">
        {guide.watch.map((w) => (
          <motion.a
            key={w.handle}
            variants={rise}
            href={w.href}
            target="_blank"
            rel="noreferrer noopener"
            className="surface border-line hover:border-line-strong block rounded-[6px] border p-4 transition-colors"
          >
            <div className="flex items-baseline gap-2">
              <Play className="text-mark size-3.5 shrink-0 translate-y-0.5" aria-hidden />
              <h3 className="text-[15px]">{w.name}</h3>
              <span className="text-faint font-mono text-[11px]">{w.handle}</span>
              <ArrowUpRight className="text-faint ml-auto size-3.5 shrink-0" aria-hidden />
            </div>
            <p className="text-muted mt-1.5 text-[14px] leading-relaxed">{w.note}</p>
          </motion.a>
        ))}
      </div>

      <p className="text-faint mt-6 text-[12px] leading-relaxed">
        Checked against{' '}
        {guide.sources.map((s, i) => (
          <span key={s.href}>
            {i > 0 && ' · '}
            <a
              href={s.href}
              target="_blank"
              rel="noreferrer noopener"
              className="underline decoration-dotted underline-offset-2"
            >
              {s.label}
            </a>
          </span>
        ))}
        . Weightage is CBSE's own and is checked at build time to sum to {guide.theoryMarks}.
      </p>
    </motion.section>
  )
}
