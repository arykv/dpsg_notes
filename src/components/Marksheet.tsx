import { motion } from 'motion/react'
import { EyeOff } from 'lucide-react'
import {
  aggregate,
  counted,
  formatPercent,
  percentage,
  subjectTotal,
  theoryPercentage,
  type Marksheet as MarksheetData,
} from '@/data/results'
import { inView, rise, stagger } from '@/lib/motion'

/**
 * A statement of marks, rebuilt.
 *
 * This is deliberately not a scan. The real document carries a roll number,
 * both parents' names and a date of birth, none of which belong on the
 * internet — and a redaction box is a promise you have to trust, whereas a
 * component simply never held the data. The withheld row says so out loud,
 * because saying it is the point.
 *
 * It still has to read as a document rather than a dashboard: mono figures,
 * hairline rules, a totals row that lands hard, no colour except where a
 * subject didn't count.
 */
export function Marksheet({ sheet }: { sheet: MarksheetData }) {
  const pct = percentage(sheet)
  const theoryPct = theoryPercentage(sheet)
  // Every CBSE subject is out of 100, but almost none of them are out of 100 in
  // the exam hall. Showing the denominators is the difference between a table
  // of marks and a table that can be read.
  const sameSplit = sheet.subjects.every((s) => s.theoryMax === sheet.subjects[0]?.theoryMax)

  return (
    <motion.figure
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={stagger(0.03)}
      className="surface border-line-strong overflow-hidden rounded-[6px] border"
    >
      {/* Masthead */}
      <motion.figcaption variants={rise} className="border-line border-b px-5 py-4">
        <p className="eyebrow">Central Board of Secondary Education</p>
        <h2 className="mt-1.5 text-lg">
          {sheet.examName}, {sheet.year}
        </h2>
        <p className="text-faint mt-1 font-mono text-[11px]">
          Class {sheet.grade} · Statement of Marks
        </p>
      </motion.figcaption>

      {/* Marks table */}
      <div className="scroll-thin overflow-x-auto">
        <table className="w-full min-w-[20rem] border-collapse text-left">
          <thead>
            <tr className="border-line border-b">
              <th scope="col" className="eyebrow py-2.5 pr-2 pl-5 font-medium">
                Subject
              </th>
              <th scope="col" className="eyebrow px-2 py-2.5 text-right font-medium">
                Theory{sameSplit && sheet.subjects[0] ? ` /${sheet.subjects[0].theoryMax}` : ''}
              </th>
              <th scope="col" className="eyebrow px-2 py-2.5 text-right font-medium">
                Prac / IA
              </th>
              <th scope="col" className="eyebrow py-2.5 pr-5 pl-2 text-right font-medium">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {sheet.subjects.map((s) => {
              const inFive = counted(sheet, s)
              return (
                <tr
                  key={s.subject}
                  className="border-line border-b last:border-b-0"
                  // A dropped subject is still on the document — it just didn't
                  // count. Dimming it says that faster than a footnote.
                  aria-label={inFive ? undefined : `${s.subject} — not counted`}
                >
                  <td className={`py-2.5 pr-2 pl-5 text-[14px] ${inFive ? '' : 'text-faint'}`}>
                    {s.subject}
                    {!inFive && (
                      <span className="text-faint ml-2 font-mono text-[10px]">not counted</span>
                    )}
                  </td>
                  <td
                    className={`px-2 py-2.5 text-right font-mono text-[13px] tabular ${inFive ? '' : 'text-faint'}`}
                  >
                    {s.theory}
                    <span className="text-faint text-[10px]">/{s.theoryMax}</span>
                  </td>
                  <td
                    className={`px-2 py-2.5 text-right font-mono text-[13px] tabular ${inFive ? '' : 'text-faint'}`}
                  >
                    {s.internal}
                    <span className="text-faint text-[10px]">/{s.internalMax}</span>
                  </td>
                  <td
                    className={`py-2.5 pr-5 pl-2 text-right font-mono text-[13px] font-medium tabular ${
                      inFive ? '' : 'text-faint'
                    }`}
                  >
                    {subjectTotal(s)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Totals — the line the whole document exists for. */}
      <motion.div
        variants={rise}
        className="surface-2 border-line-strong flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t px-5 py-4"
      >
        <span className="eyebrow">
          Best {sheet.countedSubjects} · {aggregate(sheet)} / {sheet.countedSubjects * 100}
        </span>
        <span className="font-display text-mark text-3xl font-bold tabular">
          {formatPercent(pct)}
        </span>
      </motion.div>

      {/* The same result on the written papers alone. Costs a couple of points
          and buys the number above its credibility. */}
      <motion.div
        variants={rise}
        className="border-line flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-t px-5 py-3"
      >
        <span className="eyebrow">On the written papers only</span>
        <span className="font-display text-lg font-bold tabular">{formatPercent(theoryPct)}</span>
      </motion.div>

      {/* The internal column deserves a warning label, and it isn't the same
          warning in both years. */}
      <p className="border-line text-muted border-t px-5 py-3 text-[12px] leading-relaxed">
        <span className="eyebrow mr-2">On that column</span>
        {sheet.internalNote}
      </p>

      {/* The withheld fields. Naming them is the trust signal. */}
      <div className="border-line text-faint flex items-start gap-2.5 border-t px-5 py-3 text-[12px] leading-relaxed">
        <EyeOff className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        <p>
          Roll number, both parents' names and date of birth are on the real marksheet and are
          withheld. This table is rebuilt from the marks alone — there is no scan of the document
          anywhere on this site.
          {sheet.droppedNote && <> {sheet.droppedNote}</>}
        </p>
      </div>
    </motion.figure>
  )
}
