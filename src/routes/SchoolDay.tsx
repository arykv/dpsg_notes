import { motion } from 'motion/react'
import { Check, Pencil, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { PeriodBar } from '@/components/PeriodBar'
import { Button } from '@/components/ui/Button'
import { Badge, SectionHead } from '@/components/ui/primitives'
import { useScheduleEditor } from '@/lib/schedule-store'
import { formatClock } from '@/data/schedule'
import { useNow } from '@/lib/hooks'
import { readDay } from '@/data/schedule'
import { cn } from '@/lib/cn'
import { rise, stagger } from '@/lib/motion'

/** "08:40" ⇄ minutes from midnight, for the time inputs. */
function toInput(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`
}
function fromInput(value: string): number | null {
  const [h, m] = value.split(':').map(Number)
  if (h === undefined || m === undefined || Number.isNaN(h) || Number.isNaN(m)) return null
  return h * 60 + m
}

export default function SchoolDay() {
  const { periods, update, reset, isCustom } = useScheduleEditor()
  const [editing, setEditing] = useState(false)
  const now = useNow(20_000)
  const day = readDay(now, periods)

  return (
    <div className="register mx-auto max-w-3xl px-4 pt-12 pl-5 sm:px-6 sm:pl-16">
      <SectionHead
        level={1}
        eyebrow="School day"
        title="What period is it?"
        description="Timings start on a sensible default. Fix them once to match your section and this device remembers — nothing is sent anywhere."
        action={
          <Button size="sm" variant={editing ? 'primary' : 'secondary'} onClick={() => setEditing((v) => !v)}>
            {editing ? <Check className="size-3.5" /> : <Pencil className="size-3.5" />}
            {editing ? 'Done' : 'Edit timings'}
          </Button>
        }
      />

      <PeriodBar />

      <motion.ol
        initial="hidden"
        animate="show"
        variants={stagger(0.03)}
        className="mt-8 space-y-1.5 pb-8"
      >
        {periods.map((p, i) => {
          const isNow = day.current?.name === p.name
          return (
            <motion.li
              key={`${p.name}-${i}`}
              variants={rise}
              className={cn(
                'surface border-line flex items-center gap-3 rounded-[6px] border px-4 py-3 transition-colors',
                isNow && 'border-[var(--mark)]/45 bg-[var(--mark)]/[0.07]',
              )}
            >
              <span
                className={cn(
                  'w-1 self-stretch rounded-full',
                  isNow ? 'bg-[var(--mark)]' : p.kind === 'break' ? 'bg-[var(--mark)]/40' : 'bg-[var(--line-strong)]',
                )}
                aria-hidden
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={cn('text-sm font-semibold', isNow && 'text-accent')}>{p.name}</p>
                  {isNow && <Badge tone="accent">Now</Badge>}
                  {p.kind === 'break' && !isNow && <Badge tone="mark">Break</Badge>}
                </div>

                {editing ? (
                  <div className="mt-2 flex items-center gap-2">
                    <TimeInput
                      label={`${p.name} starts`}
                      value={toInput(p.start)}
                      onChange={(v) => {
                        const mins = fromInput(v)
                        if (mins !== null) update(i, { start: mins })
                      }}
                    />
                    <span className="text-faint text-xs">to</span>
                    <TimeInput
                      label={`${p.name} ends`}
                      value={toInput(p.end)}
                      onChange={(v) => {
                        const mins = fromInput(v)
                        if (mins !== null) update(i, { end: mins })
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-faint mt-0.5 font-mono text-xs tabular">
                    {formatClock(p.start)} — {formatClock(p.end)} · {p.end - p.start} min
                  </p>
                )}
              </div>
            </motion.li>
          )
        })}
      </motion.ol>

      <div className="border-line flex flex-wrap items-center gap-3 rounded-[8px] border border-dashed p-5">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">
            {isCustom ? 'These are your timings' : 'These are the default timings'}
          </p>
          <p className="text-muted mt-1 text-[13px] leading-relaxed">
            {isCustom
              ? 'Saved on this device only. Clearing your browser data resets them.'
              : 'They’re a reasonable senior-school day, not a scan of the notice board. Edit them to match your section.'}
          </p>
        </div>
        {isCustom && (
          <Button size="sm" variant="secondary" onClick={reset}>
            <RotateCcw className="size-3.5" />
            Reset to default
          </Button>
        )}
      </div>
    </div>
  )
}

function TimeInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <input
      type="time"
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="surface-2 border-line focus:border-[var(--mark)] h-8 rounded-[5px] border px-2 font-mono text-xs tabular focus:outline-none"
    />
  )
}
