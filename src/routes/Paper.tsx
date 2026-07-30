import { motion } from 'motion/react'
import { ArrowUpRight, Asterisk, Check } from 'lucide-react'
import {
  ANATOMY,
  BOTH_ATTEMPTED_QUESTIONS,
  CS_MARKS,
  CS_PRINTED_TOTAL,
  CS_SLOTS,
  CS_TOTAL,
  JOURNEY,
  LESSONS,
} from '@/data/paper'
import { SectionHead } from '@/components/ui/primitives'
import { ButtonLink } from '@/components/ui/Button'
import { inView, rise, stagger } from '@/lib/motion'

/**
 * What happens to your paper after you hand it in.
 *
 * Nobody documents this. Everyone wonders about it the evening after a board
 * exam, and the only answers online are guesses. This page is written from one
 * real evaluated script, read page by page — and where the document doesn't
 * settle something, it says so rather than filling the gap.
 */
export default function Paper() {
  return (
    <div className="register mx-auto max-w-3xl px-4 pt-12 pb-8 pl-5 sm:px-6 sm:pl-16">
      <SectionHead
        level={1}
        eyebrow="The answer script"
        title="What happens to your paper after you hand it in"
        description="Read off four real evaluated Class 12 scripts, bought back from CBSE. How they're scanned, how they're marked, and the six things it changed about how I'd write a paper."
      />

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-muted mt-2 text-[15px] leading-relaxed"
      >
        You spend two years writing papers and never once see what one looks like at the other end.
        I paid to get all five back and went through every page of every one. Almost none of what
        follows is written down anywhere else, so where the scripts don't actually answer a
        question, I've said that instead of guessing.
      </motion.p>

      {/* The document itself, offered before any of the claims about it. */}
      <motion.aside
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="surface border-line-strong mt-8 rounded-[6px] border p-5"
      >
        <p className="eyebrow">Don't take my word for it</p>
        <h2 className="mt-1.5 text-[17px]">All five scripts are on this site, 183 pages</h2>
        <p className="text-muted mt-2 text-[14px] leading-relaxed">
          Every paper I sat, exactly as CBSE returned them — the ticks, the crosses, the
          blank pages and the rough work. Only the script's barcode is covered. Everything claimed
          below can be checked against them. Physics is the most revealing: the examiner writes the
          half-mark arithmetic straight onto the page. Chemistry is the most useful, because it is
          the one I did badly.
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <ButtonLink to="/paper/script/computer-science" size="sm" variant="mark">
            Computer Science, 35 pages
          </ButtonLink>
          <ButtonLink to="/paper/script/physics" size="sm" variant="secondary">
            Physics, 35 pages
          </ButtonLink>
          <ButtonLink to="/paper/script/chemistry" size="sm" variant="secondary">
            Chemistry, 35 pages
          </ButtonLink>
          <ButtonLink to="/paper/script/mathematics" size="sm" variant="secondary">
            Maths, 43 pages
          </ButtonLink>
          <ButtonLink to="/paper/script/english" size="sm" variant="secondary">
            English, 35 pages
          </ButtonLink>
        </div>
      </motion.aside>

      <Journey />
      <Anatomy />
      <MarksSummary />
      <Lessons />

      {/* --- Get your own ------------------------------------------------- */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={inView}
        variants={stagger(0.04)}
        className="mt-20"
      >
        <h2 className="text-2xl">Get your own, and check it</h2>
        <p className="text-muted mt-2 text-[15px] leading-relaxed">
          The ordering window opens a few weeks after the result and does not reopen. Order the
          photocopy even if you have no intention of applying for re-evaluation — those are separate
          applications with separate deadlines, and this one is the only way to see your own paper.
        </p>
        <p className="text-muted mt-3 text-[15px] leading-relaxed">
          When it arrives, put page one next to your marksheet. If the totals differ, you have found
          your own moderation.
        </p>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <ButtonLink to="/results" size="sm" variant="mark">
            My marksheets, and the moderation proof
          </ButtonLink>
          <ButtonLink to="https://www.cbse.gov.in/" external size="sm" variant="secondary">
            cbse.gov.in
            <ArrowUpRight className="size-3.5" />
          </ButtonLink>
        </div>
      </motion.section>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

function Journey() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={stagger(0.05)}
      className="mt-16"
      id="journey"
    >
      <h2 className="text-2xl">Where it goes</h2>

      <ol className="mt-8 space-y-9">
        {JOURNEY.map((s, i) => (
          <motion.li key={s.id} variants={rise} className="relative pl-11">
            {/* Step marker, with a hairline running down to the next one. */}
            <span
              aria-hidden
              className="surface-2 border-line-strong text-mark absolute top-0 left-0 grid size-7 place-items-center rounded-full border font-mono text-[11px] font-medium"
            >
              {i + 1}
            </span>
            {i < JOURNEY.length - 1 && (
              <span
                aria-hidden
                className="bg-[var(--line)] absolute top-8 bottom-[-2.25rem] left-[0.84rem] w-px"
              />
            )}

            <p className="eyebrow">{s.label}</p>
            <h3 className="mt-1.5 text-[17px]">{s.title}</h3>
            <p className="text-muted mt-2 text-[14px] leading-relaxed">{s.body}</p>

            {s.evidence && (
              <p className="border-[var(--mark)]/50 bg-[var(--mark)]/[0.06] mt-3 rounded-[5px] border-l-2 px-4 py-2.5 text-[13px] leading-relaxed">
                <span className="eyebrow mr-2">On my script</span>
                {s.evidence}
              </p>
            )}
          </motion.li>
        ))}
      </ol>
    </motion.section>
  )
}

function Anatomy() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={stagger(0.03)}
      className="mt-20"
      id="anatomy"
    >
      <h2 className="text-2xl">What's actually printed on it</h2>
      <p className="text-muted mt-1.5 text-sm">
        Nine things on the booklet that nobody mentions, and what each one is for.
      </p>

      <div className="mt-6 space-y-3">
        {ANATOMY.map((a) => (
          <motion.article
            key={a.id}
            variants={rise}
            className="surface border-line rounded-[6px] border p-5"
          >
            <h3 className="text-[15px]">{a.thing}</h3>
            <p className="text-muted mt-1.5 text-[14px] leading-relaxed">{a.what}</p>
            {a.soWhat && (
              <p className="mt-2.5 flex gap-2 text-[14px] leading-relaxed font-medium">
                <Check className="text-mark mt-1 size-3.5 shrink-0" aria-hidden />
                {a.soWhat}
              </p>
            )}
          </motion.article>
        ))}
      </div>
    </motion.section>
  )
}

/**
 * The question-wise summary, transcribed. It's a wall of numbers, which is
 * exactly why it's worth showing — no one has ever seen one.
 */
function MarksSummary() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={stagger(0.04)}
      className="mt-20"
      id="summary"
    >
      <p className="eyebrow mb-2">Page one</p>
      <h2 className="text-2xl sm:text-3xl">
        The <span className="marked">question-wise marks summary</span>
      </h2>

      <div className="text-muted mt-4 space-y-3 text-[15px] leading-relaxed">
        <p>
          This is the most useful page in the whole document and it is pure text — no handwriting,
          no name, no roll number, just a barcode and a table. Here is mine, transcribed exactly:
          every scoring slot in my Computer Science paper and what it got.
        </p>
        <p>
          The footnote at the bottom of the real page reads{' '}
          <span className="font-mono text-[13px]">'*' marked marks are omitted for totaling</span>.
          Add up only the unasterisked rows and you get <strong>{CS_TOTAL}</strong> — exactly the
          Total Marks printed at the top of the same page. So the rule is real, and it is arithmetic
          rather than a claim.
        </p>
      </div>

      <motion.div
        variants={rise}
        className="surface border-line-strong mt-7 overflow-hidden rounded-[6px] border"
      >
        <div className="border-line flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b px-5 py-3">
          <span className="eyebrow">083 · Computer Science · XII Summer-2026</span>
          <span className="text-faint font-mono text-[11px] tabular">{CS_SLOTS} slots</span>
        </div>

        <ul className="grid grid-cols-2 gap-x-6 gap-y-px px-5 py-4 sm:grid-cols-3">
          {CS_MARKS.map((r) => (
            <li
              key={r.q}
              className="border-line/60 flex items-baseline justify-between gap-3 border-b py-1.5 last:border-b-0"
            >
              <span
                className={`font-mono text-[12px] ${r.omitted ? 'text-faint' : 'text-muted'}`}
              >
                {r.q}
                {r.omitted && (
                  <Asterisk className="mb-1 ml-0.5 inline size-2.5" aria-label="omitted from total" />
                )}
              </span>
              <span
                className={`font-mono text-[12px] tabular ${
                  r.marks === null
                    ? 'text-faint'
                    : r.omitted
                      ? 'text-faint'
                      : r.marks === 0
                        ? 'text-pen font-medium'
                        : 'font-medium'
                }`}
              >
                {r.marks === null ? 'NA' : r.marks}
              </span>
            </li>
          ))}
        </ul>

        <div className="surface-2 border-line-strong flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t px-5 py-4">
          <span className="eyebrow">Unasterisked rows, totalled</span>
          <span className="font-display text-mark text-3xl font-bold tabular">
            {CS_TOTAL} / {CS_PRINTED_TOTAL}
          </span>
        </div>
      </motion.div>

      <p className="text-faint mt-3 text-[12px] leading-relaxed">
        <Asterisk className="mb-0.5 inline size-2.5" aria-hidden /> evaluated but omitted from the
        total · NA — not attempted · marks in red were lost
      </p>

      <div className="text-muted mt-8 space-y-3 text-[15px] leading-relaxed">
        <p>
          Two things fall out of this table. The first is that I answered both alternatives on{' '}
          {BOTH_ATTEMPTED_QUESTIONS} either/or questions, and every one of those second attempts was
          marked and then thrown away. On my paper both alternatives happened to score the same, so
          the script cannot tell you which one CBSE keeps — I'm not going to pretend it can. What it
          does tell you is that the second attempt bought me nothing but lost time.
        </p>
        <p>
          The second is Q2. One mark, an MCQ, and I got it wrong — you can see the zero sitting in
          the table above. It is the only mark I lost in the entire first section, and I have no
          excuse for it beyond reading the question too quickly.
        </p>
      </div>
    </motion.section>
  )
}

function Lessons() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={stagger(0.04)}
      className="mt-20"
      id="lessons"
    >
      <h2 className="text-2xl">Six things it changed about how I'd write a paper</h2>

      <div className="mt-6 space-y-6">
        {LESSONS.map((l) => (
          <motion.article key={l.id} variants={rise}>
            <h3 className="text-[17px]">{l.rule}</h3>
            <p className="text-muted mt-1.5 text-[14px] leading-relaxed">{l.body}</p>
          </motion.article>
        ))}
      </div>
    </motion.section>
  )
}
