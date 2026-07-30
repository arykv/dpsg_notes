import * as Tooltip from '@radix-ui/react-tooltip'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { snap } from '@/lib/motion'

/* --- Badge ---------------------------------------------------------------- */

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: React.ReactNode
  tone?: 'neutral' | 'accent' | 'mark' | 'outline'
  className?: string
}) {
  const tones = {
    neutral: 'surface-2 text-muted border-transparent',
    accent: 'border-line-strong text-muted',
    mark: 'border-[var(--mark)]/50 text-mark',
    outline: 'border-line text-faint',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-[3px] border px-1.5 py-px',
        'font-mono text-[9px] font-medium tracking-[0.12em] uppercase',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/* --- Section heading ------------------------------------------------------ */

export function SectionHead({
  eyebrow,
  title,
  description,
  action,
  /**
   * `1` when this head *is* the page's title rather than a section inside it.
   *
   * This existed as a hard-coded `h2`, and the consequence was that 24 of the
   * site's 30 routes shipped without an `<h1>` anywhere in them — because on
   * almost every page the first `SectionHead` is the page title. A screen reader
   * user navigating by headings had no top-level landmark to start from on any
   * of those pages. It looks identical either way, which is exactly why it went
   * unnoticed for so long.
   */
  level = 2,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: React.ReactNode
  level?: 1 | 2
}) {
  const Heading = level === 1 ? 'h1' : 'h2'
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-xl">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <Heading className="text-2xl sm:text-3xl">{title}</Heading>
        {description && <p className="text-muted mt-2 text-sm leading-relaxed">{description}</p>}
      </div>
      {action}
    </div>
  )
}

/* --- Empty state ---------------------------------------------------------- */

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={snap}
      className="border-line flex flex-col items-center rounded-[8px] border border-dashed px-6 py-16 text-center"
    >
      <div className="surface-2 text-faint mb-4 grid size-11 place-items-center rounded-[6px]">
        {icon}
      </div>
      <h3 className="text-lg">{title}</h3>
      <p className="text-muted mt-1.5 max-w-sm text-sm leading-relaxed">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  )
}

/* --- Tooltip -------------------------------------------------------------- */

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return (
    <Tooltip.Provider delayDuration={280} skipDelayDuration={200}>
      {children}
    </Tooltip.Provider>
  )
}

export function Hint({
  label,
  keys,
  children,
  side = 'top',
}: {
  label: string
  keys?: string[]
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
}) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side={side}
          sideOffset={8}
          className={cn(
            'glass border-line z-50 flex items-center gap-2 rounded-[5px] border px-2.5 py-1.5',
            'text-xs font-medium shadow-card',
            'data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0',
          )}
        >
          {label}
          {keys && (
            <span className="flex gap-1">
              {keys.map((k) => (
                <Kbd key={k}>{k}</Kbd>
              ))}
            </span>
          )}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}

/* --- Keyboard key --------------------------------------------------------- */

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      className={cn(
        'border-line text-faint inline-flex h-5 min-w-5 items-center justify-center',
        'rounded border px-1 font-mono text-[10px] font-medium',
        'bg-[var(--surface-2)]',
      )}
    >
      {children}
    </kbd>
  )
}

/* --- Segmented control ---------------------------------------------------- */

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  className,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
  label: string
  className?: string
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        'surface-2 border-line inline-flex items-center gap-0.5 rounded-[6px] border p-0.5',
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'relative rounded-[10px] px-3 py-1.5 text-[13px] font-medium transition-colors',
              active ? 'text-[var(--text)]' : 'text-muted hover:text-[var(--text)]',
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${label}`}
                transition={snap}
                className="surface border-line absolute inset-0 rounded-[10px] border shadow-card"
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}

/* --- Number field --------------------------------------------------------- */

export function NumberField({
  label,
  value,
  onChange,
  suffix,
  min = 0,
  max,
  step = 1,
  placeholder,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  suffix?: string
  min?: number
  max?: number
  step?: number
  placeholder?: string
  hint?: string
}) {
  const id = `f-${label.replace(/\s+/g, '-').toLowerCase()}`
  return (
    <div>
      <label htmlFor={id} className="text-muted mb-1.5 block text-[13px] font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={value}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'surface border-line h-11 w-full rounded-[6px] border px-3 text-[15px] tabular',
            'placeholder:text-[var(--text-faint)] transition-colors',
            'hover:border-line-strong focus:border-[var(--mark)] focus:outline-none',
            suffix && 'pr-12',
          )}
        />
        {suffix && (
          <span className="text-faint pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 font-mono text-xs">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-faint mt-1.5 text-xs">{hint}</p>}
    </div>
  )
}

/* --- Result readout ------------------------------------------------------- */

export function Readout({
  value,
  label,
  tone = 'accent',
  sub,
}: {
  value: string
  label: string
  tone?: 'accent' | 'mark' | 'warn'
  sub?: string
}) {
  const tones = {
    accent: 'text-[var(--text)]',
    mark: 'text-mark',
    warn: 'text-pen',
  }
  return (
    <div className="surface-2 border-line rounded-[6px] border p-4">
      <p className="eyebrow mb-1.5">{label}</p>
      <p className={cn('font-display text-[2rem] font-bold tabular tracking-tight', tones[tone])}>
        {value}
      </p>
      {sub && <p className="text-muted mt-1.5 text-[13px] leading-snug">{sub}</p>}
    </div>
  )
}
