import { motion } from 'motion/react'
import { AlertTriangle, Copy, Check, Quote } from 'lucide-react'
import {
  APOLOGY_LETTER,
  IN_THE_HALL,
  SUBJECTS,
  THESIS,
  THE_YEAR,
  WALL,
  type StrategyNote,
} from '@/data/strategy'
import { MY_RESULTS } from '@/data/channels'
import { SectionHead } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { useCopy } from '@/lib/hooks'
import { inView, rise, stagger } from '@/lib/motion'

/**
 * The exam strategy page.
 *
 * Everything here is one student's experience rather than general advice, which
 * is exactly why it's worth reading — including the parts where it went wrong.
 */
export default function Strategy() {
  return (
    <div className="register mx-auto max-w-3xl px-4 pt-12 pb-8 pl-5 sm:px-6 sm:pl-16">
      <SectionHead
        eyebrow="Exam strategy"
        title="What I actually did in the exam hall"
        description="Not general advice — what worked for me across two boards, including the papers I got wrong and why."
      />

      {/* Results first: they're the reason any of this is worth reading. */}
      <div className="border-line-strong flex flex-wrap items-baseline gap-x-8 gap-y-2 border-y py-4">
        {MY_RESULTS.map((r) => (
          <span key={r.label} className="flex items-baseline gap-2.5">
            <span className="font-display text-mark text-3xl font-bold tabular">
              {r.percentage}
            </span>
            <span className="eyebrow">{r.label}</span>
          </span>
        ))}
      </div>

      {/* The one claim everything else follows from. */}
      <motion.blockquote
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="border-[var(--pen)]/40 mt-10 border-l-2 pl-5"
      >
        <Quote className="text-pen mb-2 size-3.5" aria-hidden />
        <p className="dedication text-2xl leading-snug sm:text-[28px]">{THESIS.claim}</p>
        <p className="text-muted mt-3 text-[15px] leading-relaxed">{THESIS.body}</p>
      </motion.blockquote>

      <Section title="In the exam hall" notes={IN_THE_HALL} />
      <Section title="Across the year" notes={THE_YEAR} />

      {/* Subject by subject, with the real marks attached. */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={inView}
        variants={stagger(0.04)}
        className="mt-16"
      >
        <h2 className="text-2xl">Subject by subject</h2>
        <p className="text-muted mt-1.5 text-sm">
          My actual marks, and what happened in each paper.
        </p>

        <div className="mt-6 space-y-3">
          {SUBJECTS.map((s) => (
            <motion.article
              key={s.id}
              variants={rise}
              className="surface border-line rounded-[6px] border p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-[17px]">{s.subject}</h3>
                <span className="text-mark font-mono text-[12px] tabular">{s.marks}</span>
              </div>
              <p className="dedication mt-2 text-[15px] leading-relaxed">{s.lede}</p>
              <div className="text-muted mt-3 space-y-2.5 text-[14px] leading-relaxed">
                {s.body.map((p) => (
                  <p key={p.slice(0, 30)}>{p}</p>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      {/* Wall charts. */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={inView}
        variants={stagger(0.04)}
        className="mt-16"
      >
        <h2 className="text-2xl">What to stick on your wall</h2>
        <p className="text-muted mt-1.5 text-sm">
          The cheapest revision there is. You look at it for months without meaning to.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {WALL.map((w) => (
            <motion.div
              key={w.id}
              variants={rise}
              className="surface border-line rounded-[6px] border p-5"
            >
              <p className="eyebrow">{w.grade}</p>
              <ul className="mt-3 space-y-1.5">
                {w.items.map((i) => (
                  <li key={i} className="flex gap-2 text-[14px]">
                    <span className="text-mark mt-1.5 size-1 shrink-0 rounded-full bg-current" />
                    {i}
                  </li>
                ))}
              </ul>
              <p className="text-muted mt-4 text-[13px] leading-relaxed">{w.note}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <ApologyLetter />
    </div>
  )
}

/* -------------------------------------------------------------------------- */

function Section({ title, notes }: { title: string; notes: StrategyNote[] }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={stagger(0.04)}
      className="mt-16"
    >
      <h2 className="text-2xl">{title}</h2>

      <div className="mt-6 space-y-8">
        {notes.map((n) => (
          <motion.article key={n.id} variants={rise} id={n.id} className="scroll-mt-24">
            <h3 className="text-[17px]">{n.heading}</h3>
            <p className="dedication mt-1.5 text-[15px] leading-relaxed">{n.lede}</p>

            <div className="text-muted mt-3 space-y-2.5 text-[14px] leading-relaxed">
              {n.body.map((p) => (
                <p key={p.slice(0, 30)}>{p}</p>
              ))}
            </div>

            {n.rule && (
              <p className="border-[var(--mark)]/50 bg-[var(--mark)]/[0.06] mt-4 flex gap-2.5 rounded-[5px] border-l-2 px-4 py-3 text-[14px] font-medium">
                <AlertTriangle className="text-mark mt-0.5 size-3.5 shrink-0" aria-hidden />
                {n.rule}
              </p>
            )}
          </motion.article>
        ))}
      </div>
    </motion.section>
  )
}

function ApologyLetter() {
  const { copied, copy } = useCopy()

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={stagger(0.04)}
      className="mt-16"
    >
      <h2 className="text-2xl">The apology letter</h2>
      <p className="text-muted mt-2 text-[15px] leading-relaxed">{APOLOGY_LETTER.intro}</p>

      <motion.div variants={rise} className="surface border-line mt-5 rounded-[6px] border">
        <div className="border-line flex items-center justify-between border-b px-4 py-2.5">
          <span className="eyebrow">Format</span>
          <Button size="sm" variant="ghost" onClick={() => void copy(APOLOGY_LETTER.template)}>
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
        <pre className="scroll-thin overflow-x-auto px-4 py-4 font-mono text-[12px] leading-relaxed whitespace-pre-wrap">
          {APOLOGY_LETTER.template}
        </pre>
      </motion.div>

      <ul className="mt-5 space-y-2">
        {APOLOGY_LETTER.tips.map((t) => (
          <li key={t} className="text-muted flex gap-2.5 text-[14px] leading-relaxed">
            <span className="text-mark mt-2 size-1 shrink-0 rounded-full bg-current" />
            {t}
          </li>
        ))}
      </ul>
    </motion.section>
  )
}
