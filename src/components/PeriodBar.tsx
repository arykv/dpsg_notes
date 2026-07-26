import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useNow } from '@/lib/hooks'
import { useSchedule } from '@/lib/schedule-store'
import { formatClock, formatCountdown, minutesNow, readDay } from '@/data/schedule'
import { glide } from '@/lib/motion'

/**
 * The school day as a single ruled line.
 *
 * Every student already knows what period it is — but they don't know how many
 * minutes are left, and that's the number they actually want at 10:47am. The
 * bar draws the whole day to scale, lights the block you're standing in, and
 * fills it as the period runs down.
 */
export function PeriodBar({ compact = false }: { compact?: boolean }) {
  const periods = useSchedule()
  const now = useNow(compact ? 30_000 : 15_000)
  const day = useMemo(() => readDay(now, periods), [now, periods])

  const first = periods[0]
  const last = periods[periods.length - 1]
  const span = first && last ? last.end - first.start : 1

  const headline =
    day.status === 'holiday'
      ? 'No school today'
      : day.status === 'before'
        ? `${day.next?.name ?? 'School'} starts soon`
        : day.status === 'after'
          ? 'School’s out'
          : (day.current?.name ?? day.next?.name ?? 'Between periods')

  const detail =
    day.status === 'holiday'
      ? 'Sunday — the library is still open'
      : day.status === 'before'
        ? `Bell in ${formatCountdown(day.minutesLeft)}`
        : day.status === 'after'
          ? first
            ? `Back at ${formatClock(first.start)} tomorrow`
            : ''
          : day.current
            ? `${formatCountdown(day.minutesLeft)} left${day.next ? ` · ${day.next.name} next` : ''}`
            : `Starts in ${formatCountdown(day.minutesLeft)}`

  const live = day.status === 'during'

  if (compact) {
    return (
      <Link
        to="/day"
        className="text-muted hover:text-[var(--text)] group hidden items-center gap-2 text-[13px] font-medium transition-colors md:flex"
      >
        <span
          className={cn(
            'size-1.5 rounded-full',
            live ? 'bg-[var(--mark)] shadow-[0_0_0_3px_var(--color-mark-400)]/20' : 'bg-[var(--line-strong)]',
          )}
        >
          {live && (
            <motion.span
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="block size-full rounded-full bg-[var(--mark)]"
            />
          )}
        </span>
        <span>{headline}</span>
        {live && day.current && (
          <span className="text-faint font-mono text-xs tabular">
            {formatCountdown(day.minutesLeft)}
          </span>
        )}
      </Link>
    )
  }

  return (
    <div className="surface border-line rounded-[8px] border p-4 shadow-card sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              {live && (
                <motion.span
                  animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full bg-[var(--mark)]"
                />
              )}
              <span
                className={cn(
                  'relative size-2 rounded-full',
                  live ? 'bg-[var(--mark)]' : 'bg-[var(--line-strong)]',
                )}
              />
            </span>
            <p className="eyebrow">Right now</p>
          </div>
          <h3 className="mt-1.5 text-xl sm:text-2xl">{headline}</h3>
          <p className="text-muted mt-0.5 text-sm tabular">{detail}</p>
        </div>

        <Link
          to="/day"
          className="text-muted hover:text-[var(--text)] -mr-1 flex shrink-0 items-center gap-0.5 text-[13px] font-medium transition-colors"
        >
          Timings
          <ChevronRight className="size-3.5" />
        </Link>
      </div>

      {/* The day, to scale. Breaks are drawn hollow so they read as gaps. */}
      <div
        className="flex h-9 items-stretch gap-[3px]"
        role="img"
        aria-label={`School day from ${first ? formatClock(first.start) : ''} to ${last ? formatClock(last.end) : ''}. ${headline}. ${detail}.`}
      >
        {periods.map((p) => {
          const isNow = day.current?.name === p.name
          const isPast = day.status !== 'holiday' && p.end <= minutesNow(now)
          const width = ((p.end - p.start) / span) * 100

          return (
            <div
              key={p.name}
              style={{ width: `${width}%` }}
              className={cn(
                'relative overflow-hidden rounded-[5px] transition-colors duration-500',
                p.kind === 'break'
                  ? 'border-line border border-dashed'
                  : isNow
                    ? 'bg-[var(--mark)]/15 ring-1 ring-[var(--mark)]/50'
                    : isPast
                      ? 'bg-[var(--line)]'
                      : 'surface-2',
              )}
            >
              {isNow && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: Math.max(0.02, day.progress) }}
                  transition={glide}
                  style={{ transformOrigin: 'left' }}
                  className="absolute inset-0 bg-[var(--mark)]/45"
                />
              )}
              {/* Only the current block earns a label — the rest are texture. */}
              {isNow && width > 7 && (
                <span className="text-accent absolute inset-0 grid place-items-center font-mono text-[10px] font-medium">
                  {formatCountdown(day.minutesLeft)}
                </span>
              )}
            </div>
          )
        })}
      </div>

      <div className="text-faint mt-2 flex justify-between font-mono text-[10px] tabular">
        <span>{first ? formatClock(first.start) : ''}</span>
        <span>{last ? formatClock(last.end) : ''}</span>
      </div>
    </div>
  )
}
