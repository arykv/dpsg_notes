import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { Plus, RotateCcw, X } from 'lucide-react'
import { TOOLS } from '@/data/tools'
import {
  GRADE_BANDS,
  bestOfFive,
  cgpa,
  cgpaToPercentage,
  gradeFor,
  marksNeeded,
  readAttendance,
} from '@/lib/marks'
import { trim } from '@/lib/format'
import { useLocalStorage } from '@/lib/hooks'
import { Button } from '@/components/ui/Button'
import { NumberField, Readout, SectionHead, Segmented } from '@/components/ui/primitives'
import { inView, rise, stagger } from '@/lib/motion'
import { cn } from '@/lib/cn'

export default function Tools() {
  const [params] = useSearchParams()

  // Deep links land on the right calculator rather than the top of the page.
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (!hash) return
    const el = document.getElementById(hash)
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }, [])

  return (
    <div className="register mx-auto max-w-3xl px-4 pt-12 pl-5 sm:px-6 sm:pl-16">
      <SectionHead
        eyebrow="Tools"
        title="The maths around the maths"
        description="Percentages, attendance and grade points, worked out the way CBSE works them out. Nothing here leaves your browser."
      />

      <nav className="mb-10 flex flex-wrap gap-1.5">
        {TOOLS.map((t) => (
          <a
            key={t.id}
            href={`#${t.id}`}
            className="border-line text-muted hover:border-line-strong rounded-[5px] border px-2.5 py-1 text-[13px] font-medium transition-colors hover:text-[var(--text)]"
          >
            {t.name}
          </a>
        ))}
      </nav>

      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger(0.06)}
        className="space-y-6 pb-8"
      >
        <PercentageTool initialMarks={params.get('marks')} />
        <TargetTool />
        <AttendanceTool />
        <GradeTool />
        <QuestionTargetTool />
        <CountdownTool />
        <UnitsTool />
      </motion.div>
    </div>
  )
}

/* --- shared shell --------------------------------------------------------- */

function Tool({
  id,
  title,
  blurb,
  children,
  footnote,
}: {
  id: string
  title: string
  blurb: string
  children: React.ReactNode
  footnote?: string
}) {
  return (
    <motion.section
      id={id}
      variants={rise}
      whileInView="show"
      viewport={inView}
      className="surface border-line scroll-mt-24 rounded-[8px] border p-5 shadow-card sm:p-6"
    >
      <h2 className="text-xl">{title}</h2>
      <p className="text-muted mt-1.5 text-sm leading-relaxed">{blurb}</p>
      <div className="mt-5">{children}</div>
      {footnote && <p className="text-faint border-line mt-5 border-t pt-4 text-xs leading-relaxed">{footnote}</p>}
    </motion.section>
  )
}

/* --- 1 · percentage ------------------------------------------------------- */

function PercentageTool({ initialMarks }: { initialMarks: string | null }) {
  const [marks, setMarks] = useLocalStorage<string[]>('dpsg.marks', ['', '', '', '', ''])
  const [mode, setMode] = useState<'best5' | 'all'>('best5')

  // Marks handed over from the command palette win over whatever was saved.
  useEffect(() => {
    if (initialMarks) setMarks(initialMarks.split(',').slice(0, 8))
  }, [initialMarks, setMarks])

  const numbers = marks.map(Number).filter((n) => Number.isFinite(n) && n > 0)
  const best = bestOfFive(numbers)
  const plainAverage = numbers.length ? numbers.reduce((a, b) => a + b, 0) / numbers.length : 0
  const shown = mode === 'best5' ? best.percentage : plainAverage

  return (
    <Tool
      id="percentage"
      title="Percentage & best of five"
      blurb="Enter each subject out of 100. Best of five drops your weakest paper, which is the number most schools print."
      footnote="Best of five keeps your top five scores. Some schools insist English is one of them — check your report card before you celebrate."
    >
      <Segmented
        label="Percentage mode"
        value={mode}
        onChange={setMode}
        options={[
          { value: 'best5', label: 'Best of five' },
          { value: 'all', label: 'Average of all' },
        ]}
        className="mb-4"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {marks.map((m, i) => (
          <div key={i} className="flex items-end gap-2">
            <div className="flex-1">
              <NumberField
                label={`Subject ${i + 1}`}
                value={m}
                onChange={(v) => setMarks((prev) => prev.map((x, j) => (i === j ? v : x)))}
                suffix="/100"
                max={100}
                placeholder="—"
              />
            </div>
            {marks.length > 1 && (
              <button
                onClick={() => setMarks((prev) => prev.filter((_, j) => j !== i))}
                aria-label={`Remove subject ${i + 1}`}
                className="text-faint hover:text-[var(--text)] mb-0.5 grid size-11 shrink-0 place-items-center rounded-[6px] transition-colors"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => setMarks((p) => [...p, ''])}>
          <Plus className="size-3.5" />
          Add subject
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setMarks(['', '', '', '', ''])}>
          <RotateCcw className="size-3.5" />
          Clear
        </Button>
      </div>

      {numbers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 grid gap-3 sm:grid-cols-3"
        >
          <Readout
            value={`${trim(shown)}%`}
            label={mode === 'best5' ? 'Best of five' : 'Average'}
            sub={
              mode === 'best5' && best.dropped !== undefined
                ? `Dropped your ${best.dropped}`
                : `Across ${numbers.length} subject${numbers.length === 1 ? '' : 's'}`
            }
          />
          <Readout
            value={String(best.total)}
            label="Total"
            tone="mark"
            sub={`Out of ${best.counted.length * 100}`}
          />
          <Readout
            value={trim(cgpa(numbers), 1)}
            label="CGPA"
            sub={`≈ ${trim(cgpaToPercentage(cgpa(numbers)), 1)}% by the ×9.5 rule`}
          />
        </motion.div>
      )}
    </Tool>
  )
}

/* --- 2 · target ----------------------------------------------------------- */

function TargetTool() {
  const [scored, setScored] = useState('')
  const [papers, setPapers] = useState('4')
  const [left, setLeft] = useState('1')
  const [target, setTarget] = useState('90')

  const done = Number(scored)
  const count = Number(papers)
  const remaining = Number(left)
  const goal = Number(target)

  const valid = [done, count, remaining, goal].every(Number.isFinite) && count > 0 && remaining > 0

  // Treat the papers already written as a single block at their average.
  const needed = valid ? marksNeeded(Array(count).fill(done / count), goal, remaining) : null
  const outOfReach = needed !== null && needed > 100

  return (
    <Tool
      id="target"
      title="Target marks"
      blurb="You know the percentage you want. This tells you what the papers you haven’t written yet have to score."
      footnote="Assumes every paper is out of 100 and weighted the same, which is true for most CBSE boards."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <NumberField
          label="Marks so far (total)"
          value={scored}
          onChange={setScored}
          placeholder="340"
          hint="Add up everything you’ve already scored"
        />
        <NumberField label="Papers written" value={papers} onChange={setPapers} min={1} />
        <NumberField label="Papers left" value={left} onChange={setLeft} min={1} />
        <NumberField label="Percentage you want" value={target} onChange={setTarget} suffix="%" max={100} />
      </div>

      {needed !== null && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
          <Readout
            value={outOfReach ? 'Not possible' : `${trim(needed)}/100`}
            tone={outOfReach ? 'warn' : 'accent'}
            label={`To finish on ${trim(goal)}%`}
            sub={
              outOfReach
                ? `You’d need ${trim(needed)} in each remaining paper. Pick a target you can actually hit — recalculate with a lower number.`
                : remaining === 1
                  ? 'In your last paper.'
                  : `In each of your ${remaining} remaining papers.`
            }
          />
        </motion.div>
      )}
    </Tool>
  )
}

/* --- 3 · attendance ------------------------------------------------------- */

function AttendanceTool() {
  const [attended, setAttended] = useState('')
  const [held, setHeld] = useState('')
  const [remaining, setRemaining] = useState('30')
  const [required, setRequired] = useState('75')

  const a = Number(attended)
  const h = Number(held)
  const r = Number(remaining)
  const req = Number(required)
  const valid = Number.isFinite(a) && Number.isFinite(h) && h > 0 && a <= h

  const read = valid ? readAttendance(a, h, Math.max(0, r || 0), req || 75) : null

  return (
    <Tool
      id="attendance"
      title="Attendance"
      blurb="CBSE wants 75% to let you sit the boards. This works out where you stand and how much room is left."
      footnote="Medical leave and school-approved absences are usually excused — this doesn’t know about those. Ask your class teacher before making plans."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <NumberField label="Classes attended" value={attended} onChange={setAttended} placeholder="128" />
        <NumberField label="Classes held" value={held} onChange={setHeld} placeholder="160" />
        <NumberField label="Classes still to come" value={remaining} onChange={setRemaining} />
        <NumberField label="Required" value={required} onChange={setRequired} suffix="%" max={100} />
      </div>

      {read && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 grid gap-3 sm:grid-cols-3"
        >
          <Readout
            value={`${trim(read.current, 1)}%`}
            label="Right now"
            tone={read.meets ? 'accent' : 'warn'}
            sub={read.meets ? `Above the ${trim(req)}% line` : `Below the ${trim(req)}% line`}
          />
          {read.meets ? (
            <Readout
              value={String(read.canMiss)}
              label="You can still miss"
              tone="mark"
              sub={
                read.canMiss === 0
                  ? 'Not a single one. Go to class.'
                  : `And still finish on ${trim(req)}%.`
              }
            />
          ) : (
            <Readout
              value={read.impossible ? '—' : String(read.mustAttend)}
              label="Attend in a row"
              tone={read.impossible ? 'warn' : 'mark'}
              sub={
                read.impossible
                  ? `Not reachable with ${r} classes left. Talk to your class teacher now, not in March.`
                  : `To climb back to ${trim(req)}%.`
              }
            />
          )}
          <Readout
            value={`${h}`}
            label="Classes so far"
            sub={`${a} attended · ${h - a} missed`}
          />
        </motion.div>
      )}
    </Tool>
  )
}

/* --- 4 · grade points ----------------------------------------------------- */

function GradeTool() {
  const [mark, setMark] = useState('')
  const n = Number(mark)
  const valid = Number.isFinite(n) && mark.trim() !== '' && n >= 0 && n <= 100
  const grade = valid ? gradeFor(n) : null

  return (
    <Tool
      id="grade"
      title="Grade points"
      blurb="Where a mark lands on the CBSE nine-point scale."
      footnote="CBSE awards grades on relative position within a subject in some years, so the bands can shift. These are the standard ones."
    >
      <div className="max-w-xs">
        <NumberField label="Marks" value={mark} onChange={setMark} suffix="/100" max={100} />
      </div>

      {grade && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-5 grid gap-3 sm:grid-cols-2">
          <Readout value={grade.label} label="Grade" sub={`Marks from ${grade.from} up`} />
          <Readout value={String(grade.points)} label="Grade points" tone="mark" sub="Out of 10" />
        </motion.div>
      )}

      <div className="border-line mt-5 overflow-hidden rounded-[6px] border">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="surface-2 text-faint">
              <th className="px-3 py-2 text-left font-medium">Grade</th>
              <th className="px-3 py-2 text-left font-medium">Marks</th>
              <th className="px-3 py-2 text-right font-medium">Points</th>
            </tr>
          </thead>
          <tbody>
            {GRADE_BANDS.map((g, i) => {
              const upper = i === 0 ? 100 : GRADE_BANDS[i - 1]!.from - 1
              const active = grade?.label === g.label
              return (
                <tr
                  key={g.label}
                  className={cn(
                    'border-line border-t transition-colors',
                    active && 'bg-[var(--mark)]/10',
                  )}
                >
                  <td className={cn('px-3 py-2 font-medium', active && 'text-accent')}>{g.label}</td>
                  <td className="text-muted px-3 py-2 tabular">
                    {g.from}–{upper}
                  </td>
                  <td className="px-3 py-2 text-right tabular">{g.points || '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Tool>
  )
}

/* --- 5 · countdown -------------------------------------------------------- */

/* --- 5 · question target -------------------------------------------------- */

/**
 * The only number that has ever predicted anyone's marks.
 *
 * Watching a one-shot feels like progress and isn't. Solving does. The point of
 * this calculator is to make a small daily number look like the large number it
 * actually becomes — five a day is nothing, and five a day is also a thousand
 * questions by the boards.
 */
function QuestionTargetTool() {
  const [perDay, setPerDay] = useLocalStorage<string>('dpsg.qPerDay', '5')
  const [subjects, setSubjects] = useLocalStorage<string>('dpsg.qSubjects', '3')
  const [date, setDate] = useLocalStorage<string>('dpsg.examDate', '')
  const [restDays, setRestDays] = useLocalStorage<string>('dpsg.qRestDays', '1')

  const read = useMemo(() => {
    const q = Number(perDay)
    const s = Number(subjects)
    const rest = Number(restDays)
    if (!Number.isFinite(q) || !Number.isFinite(s) || q <= 0 || s <= 0) return null
    if (!date) return null

    const target = new Date(`${date}T09:00:00`)
    if (Number.isNaN(target.getTime())) return null

    const days = Math.ceil((target.getTime() - Date.now()) / 86_400_000)
    if (days <= 0) return { days, past: true } as const

    // Rest days are per week and honest — a plan that assumes seven days a week
    // is a plan you break in a fortnight and then abandon entirely.
    const working = Math.max(0, days - Math.floor(days / 7) * Math.min(Math.max(rest, 0), 6))
    const perSubject = working * q
    const total = perSubject * s

    // Three minutes a question is a fair average across an MCQ and a five-marker.
    const minutesPerDay = q * s * 3

    return { days, working, perSubject, total, minutesPerDay, past: false } as const
  }, [perDay, subjects, date, restDays])

  return (
    <Tool
      id="questions"
      title="Question target"
      blurb="Watching explanations feels like studying. Solving is studying. This turns a small daily number into the one it adds up to."
      footnote="Three minutes a question is a rough blend of a one-mark MCQ and a five-mark long answer — your own pace will differ, and the daily minutes are only there to tell you whether the target is survivable."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label="Questions a day, per subject"
          value={perDay}
          onChange={setPerDay}
          min={1}
          max={200}
          hint="Pick a number you'll still hit on a bad day."
        />
        <NumberField
          label="Subjects you're doing this for"
          value={subjects}
          onChange={setSubjects}
          min={1}
          max={6}
        />
        <NumberField
          label="Rest days a week"
          value={restDays}
          onChange={setRestDays}
          min={0}
          max={6}
          hint="Be honest. Zero is not a plan."
        />
        <div>
          <label htmlFor="q-exam-date" className="text-muted mb-1.5 block text-[13px] font-medium">
            First paper
          </label>
          <input
            id="q-exam-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="surface border-line hover:border-line-strong focus:border-[var(--mark)] h-11 w-full rounded-[6px] border px-3 text-[15px] transition-colors focus:outline-none"
          />
        </div>
      </div>

      {read && read.past && (
        <p className="text-muted mt-5 text-[14px]">That date has passed. Set the next one.</p>
      )}

      {read && !read.past && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <Readout
              value={read.total.toLocaleString('en-IN')}
              label="Questions by the boards"
              tone="mark"
              sub={`Across ${subjects} subject${Number(subjects) === 1 ? '' : 's'}`}
            />
            <Readout
              value={read.perSubject.toLocaleString('en-IN')}
              label="Per subject"
              sub={`Over ${read.working} study days`}
            />
            <Readout
              value={`${Math.floor(read.minutesPerDay / 60)}h ${read.minutesPerDay % 60}m`}
              label="A day"
              tone={read.minutesPerDay > 240 ? 'warn' : 'accent'}
              sub={read.minutesPerDay > 240 ? 'That is a lot. Lower it.' : 'Roughly, at three minutes each'}
            />
          </div>

          <p className="border-[var(--mark)]/50 bg-[var(--mark)]/[0.06] mt-4 rounded-[5px] border-l-2 px-4 py-3 text-[14px] leading-relaxed">
            {read.total >= 1000
              ? `${perDay} a day sounds like nothing. It is ${read.total.toLocaleString('en-IN')} questions before you sit the first paper — more than any question bank you were going to buy.`
              : `That is ${read.total.toLocaleString('en-IN')} questions. Worth nudging the daily number up: it compounds far faster than it feels like it should.`}
          </p>
        </motion.div>
      )}
    </Tool>
  )
}

/* --- 6 · countdown -------------------------------------------------------- */

function CountdownTool() {
  const [date, setDate] = useLocalStorage<string>('dpsg.examDate', '')

  const read = useMemo(() => {
    if (!date) return null
    const target = new Date(`${date}T09:00:00`)
    if (Number.isNaN(target.getTime())) return null
    const days = Math.ceil((target.getTime() - Date.now()) / 86_400_000)
    return {
      days,
      weekends: Math.floor(Math.max(0, days) / 7) * 2,
      // A realistic evening: two focused hours on a school day.
      hours: Math.max(0, days) * 2,
    }
  }, [date])

  return (
    <Tool
      id="countdown"
      title="Exam countdown"
      blurb="Days are abstract. Study sessions aren’t."
      footnote="Two hours per weekday is a working assumption, not advice — adjust it in your head for how you actually study."
    >
      <div className="max-w-xs">
        <label htmlFor="exam-date" className="text-muted mb-1.5 block text-[13px] font-medium">
          First paper
        </label>
        <input
          id="exam-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="surface border-line hover:border-line-strong focus:border-[var(--mark)] h-11 w-full rounded-[6px] border px-3 text-[15px] transition-colors focus:outline-none"
        />
      </div>

      {read && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 grid gap-3 sm:grid-cols-3"
        >
          <Readout
            value={read.days > 0 ? String(read.days) : read.days === 0 ? 'Today' : 'Done'}
            label={read.days === 1 ? 'Day left' : 'Days left'}
            tone={read.days <= 7 ? 'mark' : 'accent'}
            sub={read.days < 0 ? 'That date has passed.' : undefined}
          />
          <Readout value={String(read.weekends)} label="Weekend days" sub="The ones that actually count" />
          <Readout value={`${read.hours}h`} label="Study hours" sub="At two focused hours a day" />
        </motion.div>
      )}
    </Tool>
  )
}

/* --- 6 · units ------------------------------------------------------------ */

const UNIT_GROUPS = {
  Length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, 'µm': 1e-6, nm: 1e-9, Å: 1e-10 },
  Mass: { kg: 1, g: 0.001, mg: 1e-6, t: 1000, u: 1.66054e-27 },
  Energy: { J: 1, kJ: 1000, cal: 4.184, kcal: 4184, eV: 1.602176634e-19 },
  Pressure: { Pa: 1, kPa: 1000, atm: 101325, bar: 100000, torr: 133.322, mmHg: 133.322 },
  Volume: { L: 1, mL: 0.001, 'm³': 1000, 'cm³': 0.001 },
} as const

type GroupName = keyof typeof UNIT_GROUPS

function UnitsTool() {
  const [group, setGroup] = useState<GroupName>('Energy')
  const [value, setValue] = useState('1')
  const [from, setFrom] = useState<string>('eV')

  const units = UNIT_GROUPS[group] as Record<string, number>
  const unitNames = Object.keys(units)
  const factor = units[from] ?? 1
  const base = Number(value) * factor
  const valid = Number.isFinite(Number(value)) && value.trim() !== ''

  function switchGroup(g: GroupName) {
    setGroup(g)
    setFrom(Object.keys(UNIT_GROUPS[g])[0]!)
  }

  return (
    <Tool
      id="units"
      title="Unit converter"
      blurb="The SI conversions physics and chemistry papers expect you to already know."
      footnote="Temperature isn’t here on purpose — it’s an offset, not a factor, and mixing the two is how people get it wrong."
    >
      <div className="mb-4 flex flex-wrap gap-1.5">
        {(Object.keys(UNIT_GROUPS) as GroupName[]).map((g) => (
          <button
            key={g}
            onClick={() => switchGroup(g)}
            aria-pressed={group === g}
            className={cn(
              'rounded-[5px] border px-2.5 py-1 text-[13px] font-medium transition-colors',
              group === g
                ? 'bg-[var(--mark)]/14 border-[var(--mark)]/40 text-accent'
                : 'border-line text-muted hover:border-line-strong hover:text-[var(--text)]',
            )}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <NumberField label="Value" value={value} onChange={setValue} step={0.0001} min={-Infinity} />
        <div>
          <label htmlFor="unit-from" className="text-muted mb-1.5 block text-[13px] font-medium">
            Unit
          </label>
          <select
            id="unit-from"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="surface border-line hover:border-line-strong focus:border-[var(--mark)] h-11 rounded-[6px] border px-3 text-[15px] transition-colors focus:outline-none"
          >
            {unitNames.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      {valid && (
        <div className="border-line mt-5 divide-y divide-[var(--line)] overflow-hidden rounded-[6px] border">
          {unitNames
            .filter((u) => u !== from)
            .map((u) => {
              const converted = base / units[u]!
              const display =
                Math.abs(converted) !== 0 && (Math.abs(converted) < 1e-4 || Math.abs(converted) >= 1e7)
                  ? converted.toExponential(4)
                  : trim(converted, 6)
              return (
                <div key={u} className="flex items-baseline justify-between gap-4 px-3.5 py-2.5">
                  <span className="text-muted font-mono text-[13px]">{u}</span>
                  <span className="text-[15px] font-medium tabular">{display}</span>
                </div>
              )
            })}
        </div>
      )}
    </Tool>
  )
}
