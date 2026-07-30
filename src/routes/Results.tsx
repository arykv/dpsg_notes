import { motion } from 'motion/react'
import { ArrowUpRight, Equal, Plus } from 'lucide-react'
import {
  CHEMISTRY_RAW,
  CLASS_10,
  CLASS_12,
  EXACT_MATCHES,
  MODERATION,
  PERCENT_WITHOUT_MODERATION,
  TOTAL_MODERATION,
  formatPercent,
  moderationGain,
  percentage,
} from '@/data/results'
import { Marksheet } from '@/components/Marksheet'
import { SectionHead } from '@/components/ui/primitives'
import { ButtonLink } from '@/components/ui/Button'
import { inView, rise, stagger } from '@/lib/motion'

/**
 * The trust page.
 *
 * Every study site claims a topper wrote it. This one shows the marksheets —
 * rebuilt, never scanned — and then does the thing almost nobody does: puts the
 * evaluated answer scripts next to the marksheet and reads off the difference.
 */
export default function Results() {
  return (
    <div className="register mx-auto max-w-3xl px-4 pt-12 pb-8 pl-5 sm:px-6 sm:pl-16">
      <SectionHead
        level={1}
        eyebrow="Results & proof"
        title="My marksheets, and proof that CBSE moderation is real"
        description="Both boards, subject by subject. Then the part nobody checks: my evaluated answer scripts next to the marksheet they turned into."
      />

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-muted mt-2 text-[15px] leading-relaxed"
      >
        Everything on this site is written from two board results. It's fair to want to see them
        before taking any of the advice, so here they are in full — including the subject I dropped
        and the paper that went worst.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
        className="text-muted mt-3 text-[15px] leading-relaxed"
      >
        Both tables are split into what I wrote in the hall and what my school marked, because those
        are not the same thing and a single number hides it. My Class 10 table used to show the
        subject totals in the theory column, which quietly claimed I had written a 98-mark
        Computer Applications paper. I hadn't — it is a 50-mark paper, and I got 48. The row under
        each table is the same result counting only the written papers. It is about two points lower
        in both years, and that is the honest number.
      </motion.p>

      {/* --- The marksheets ------------------------------------------------ */}

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={inView}
        variants={stagger(0.06)}
        className="mt-12 space-y-6"
      >
        <motion.div variants={rise}>
          <Marksheet sheet={CLASS_12} />
        </motion.div>
        <motion.div variants={rise}>
          <Marksheet sheet={CLASS_10} />
        </motion.div>
      </motion.section>

      <ModerationEvidence />

      {/* --- How to check your own ----------------------------------------- */}

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={inView}
        variants={stagger(0.04)}
        className="mt-16"
      >
        <h2 className="text-2xl">Do this with your own papers</h2>
        <p className="text-muted mt-2 text-[15px] leading-relaxed">
          CBSE sells you photocopies of your own evaluated answer books after the result. The window
          is short — a few weeks — and once it closes it does not reopen. It is worth the money even
          if you have no intention of applying for re-evaluation, because it is the only way you
          ever find out what your writing actually looked like to an examiner.
        </p>

        <ul className="mt-5 space-y-2.5">
          {[
            'Order the photocopy on the CBSE results portal in the window they announce with the result. Verification of marks, photocopy and re-evaluation are three different applications with three different deadlines.',
            'Page one is a question-wise marks summary. Add it up and compare it against the theory column of your marksheet — not the total, which includes practicals and internal assessment.',
            'If they match on some subjects and not others, the ones that do not match gained marks after evaluation. That is moderation, and it is normal.',
          ].map((t) => (
            <motion.li
              key={t.slice(0, 24)}
              variants={rise}
              className="text-muted flex gap-2.5 text-[14px] leading-relaxed"
            >
              <span className="text-mark mt-2 size-1 shrink-0 rounded-full bg-current" />
              {t}
            </motion.li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <ButtonLink to="https://www.cbse.gov.in/" external size="sm" variant="secondary">
            cbse.gov.in
            <ArrowUpRight className="size-3.5" />
          </ButtonLink>
          <ButtonLink to="/strategy" size="sm" variant="ghost">
            What I did in the exam hall
          </ButtonLink>
        </div>
      </motion.section>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

/**
 * The strongest thing on the site: the OSM total against the marksheet total,
 * with three exact matches doing the work of a proof.
 */
function ModerationEvidence() {
  const withModeration = percentage(CLASS_12)

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={stagger(0.04)}
      className="mt-20"
      id="moderation"
    >
      <p className="eyebrow mb-2">The evidence</p>
      <h2 className="text-2xl sm:text-3xl">
        CBSE <span className="marked">moderation is real</span>, and here is a receipt
      </h2>

      <div className="text-muted mt-4 space-y-3 text-[15px] leading-relaxed">
        <p>
          Every year the same rumour goes around: that the board quietly adds marks, or that it
          doesn't and people are coping. Nobody settles it, because settling it needs two documents
          that almost nobody puts side by side — your evaluated answer scripts and your marksheet.
        </p>
        <p>
          I have both. The evaluated script prints a{' '}
          <span className="font-mono text-[13px]">Total Marks</span> figure on page one. The
          marksheet prints a theory figure months later. For {EXACT_MATCHES} of my five subjects,
          those two numbers are identical.
        </p>
        <p>
          That's what makes the other two readable. If the script's figure were something else — a
          raw score before some other adjustment, a different quantity entirely — it would not land
          exactly on the marksheet {EXACT_MATCHES} times out of five. It's the same field. So where
          it differs, marks were genuinely added after my paper was marked.
        </p>
      </div>

      {/* The table. */}
      <motion.div
        variants={rise}
        className="surface border-line-strong mt-8 overflow-hidden rounded-[6px] border"
      >
        <div className="scroll-thin overflow-x-auto">
          <table className="w-full min-w-[20rem] border-collapse text-left">
            <thead>
              <tr className="border-line border-b">
                <th scope="col" className="eyebrow py-2.5 pr-2 pl-4 font-medium">
                  Subject
                </th>
                <th scope="col" className="eyebrow px-2 py-2.5 text-right font-medium">
                  Script
                </th>
                <th scope="col" className="eyebrow px-2 py-2.5 text-right font-medium">
                  Marksheet
                </th>
                <th scope="col" className="eyebrow py-2.5 pr-4 pl-2 text-right font-medium">
                  Change
                </th>
              </tr>
            </thead>
            <tbody>
              {MODERATION.map((r) => {
                const gain = moderationGain(r)
                return (
                  <tr key={r.subject} className="border-line border-b last:border-b-0">
                    <td className="py-2.5 pr-2 pl-4 text-[14px]">{r.subject}</td>
                    <td className="px-2 py-2.5 text-right font-mono text-[13px] tabular">
                      {r.osm}
                    </td>
                    <td className="px-2 py-2.5 text-right font-mono text-[13px] tabular">
                      {r.marksheet}
                    </td>
                    <td className="py-2.5 pr-4 pl-2 text-right">
                      {gain === 0 ? (
                        <span className="text-faint inline-flex items-center gap-1 font-mono text-[12px]">
                          <Equal className="size-3" aria-hidden />
                          <span className="sr-only">no change</span>
                        </span>
                      ) : (
                        <span className="text-mark inline-flex items-center gap-0.5 font-mono text-[13px] font-medium tabular">
                          <Plus className="size-3" aria-hidden />
                          {gain}
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="surface-2 border-line-strong border-t px-5 py-4">
          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
            <span className="flex items-baseline gap-2.5">
              <span className="font-display text-mark text-3xl font-bold tabular">
                +{TOTAL_MODERATION}
              </span>
              <span className="eyebrow">marks added</span>
            </span>
            <span className="flex items-baseline gap-2.5">
              <span className="font-display text-2xl font-bold tabular">
                {formatPercent(PERCENT_WITHOUT_MODERATION)} → {formatPercent(withModeration)}
              </span>
              <span className="eyebrow">aggregate</span>
            </span>
          </div>
        </div>
      </motion.div>

      <p className="text-faint mt-3 text-[12px] leading-relaxed">
        Answer-script figures are the "Total Marks" printed on page one of each evaluated script,
        bought back from CBSE. Marksheet figures are the theory column only — practicals and
        internal assessment are never moderated.
      </p>

      <div className="text-muted mt-8 space-y-3 text-[15px] leading-relaxed">
        <p>
          Nine marks across five papers. On the aggregate it's the difference between{' '}
          {formatPercent(PERCENT_WITHOUT_MODERATION)} and {formatPercent(withModeration)} — small
          enough that nobody would notice, large enough to move a cutoff.
        </p>
        <p>
          There's a smaller adjustment underneath it that I only found by adding the question-wise
          marks up by hand. On four of the five scripts the individual marks total exactly the
          figure printed at the top. On Chemistry they come to <strong>{CHEMISTRY_RAW}</strong> and
          the script prints <strong>52</strong>. Chemistry is also the only paper with an odd number
          of half-marks — eleven of them, against ten in Physics, four in English and two in Maths,
          all of which paired up into whole numbers. So a fraction gets rounded up before moderation
          is applied at all, and Chemistry's real journey is {CHEMISTRY_RAW} → 52 → 59.
        </p>
        <p>
          Two things follow from this, and they pull in opposite directions. Moderation is real, so
          a paper that felt like a disaster is probably not the disaster you think it is. And
          moderation is small, so it will not save a paper you left half-finished. It closes gaps of
          a few marks, not of twenty.
        </p>
      </div>
    </motion.section>
  )
}
