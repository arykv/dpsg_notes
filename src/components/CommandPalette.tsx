import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Command } from 'cmdk'
import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowUpRight,
  Calculator,
  Clock,
  CornerDownLeft,
  ExternalLink,
  FileText,
  Hash,
  Library,
  Link2,
  Moon,
  Percent,
  Sun,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { searchAll, SEARCH_ITEMS, type SearchItem } from '@/lib/search'
import { useLocalStorage } from '@/lib/hooks'
import { useTheme } from '@/lib/theme'
import { Kbd } from '@/components/ui/primitives'
import { bestOfFive } from '@/lib/marks'
import { trim } from '@/lib/format'

const TYPE_ICON: Record<SearchItem['type'], typeof FileText> = {
  resource: FileText,
  subject: Library,
  tool: Calculator,
  link: Link2,
  page: Hash,
}

const TYPE_LABEL: Record<SearchItem['type'], string> = {
  resource: 'Notes',
  subject: 'Subjects',
  tool: 'Tools',
  link: 'Outside links',
  page: 'Pages',
}

/** Things worth showing before anyone has typed anything. */
const STARTERS = SEARCH_ITEMS.filter((i) =>
  ['page-library', 'page-tools', 'page-day', 'tool-percentage', 'page-links'].includes(i.id),
)

/**
 * Reads a bare list of numbers as marks. Typing "87 92 78 95 84" into the
 * palette is faster than opening a calculator, and it's exactly what students
 * do the evening results come out.
 */
function readMarks(query: string): number[] | null {
  const parts = query.trim().split(/[\s,]+/).filter(Boolean)
  if (parts.length < 2) return null
  const nums = parts.map(Number)
  if (nums.some((n) => !Number.isFinite(n) || n < 0 || n > 100)) return null
  return nums
}

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()
  const [recentQueries, setRecentQueries] = useLocalStorage<string[]>('dpsg.searches', [])

  useEffect(() => {
    if (!open) {
      // Let the exit animation finish before wiping the field.
      const id = setTimeout(() => setQuery(''), 180)
      return () => clearTimeout(id)
    }
    return undefined
  }, [open])

  const results = useMemo(() => searchAll(query, 14), [query])
  const marks = useMemo(() => readMarks(query), [query])

  const grouped = useMemo(() => {
    const source = query.trim() ? results : STARTERS
    const map = new Map<SearchItem['type'], SearchItem[]>()
    for (const item of source) {
      const bucket = map.get(item.type) ?? []
      bucket.push(item)
      map.set(item.type, bucket)
    }
    return [...map.entries()]
  }, [query, results])

  function go(item: SearchItem) {
    if (query.trim()) {
      setRecentQueries((prev) => [query.trim(), ...prev.filter((q) => q !== query.trim())].slice(0, 5))
    }
    onOpenChange(false)
    if (item.external) {
      window.open(item.to, '_blank', 'noopener,noreferrer')
    } else {
      navigate(item.to)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[3px]"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 6 }}
                transition={{ type: 'spring', stiffness: 480, damping: 38 }}
                className={cn(
                  'surface border-line fixed inset-x-4 top-[12vh] z-50 mx-auto max-w-xl overflow-hidden',
                  'rounded-[8px] border shadow-[0_32px_80px_-24px_rgb(0_0_0/0.55)]',
                )}
              >
                <Dialog.Title className="sr-only">Search DPSG Notes</Dialog.Title>
                <Command shouldFilter={false} loop label="Search DPSG Notes">
            <div className="border-line flex items-center gap-3 border-b px-4">
              <Command.Input
                autoFocus
                value={query}
                onValueChange={setQuery}
                placeholder="Search notes, tools, timings — or paste your marks"
                className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[var(--text-faint)]"
              />
              <Kbd>esc</Kbd>
            </div>

            <Command.List className="scroll-thin max-h-[min(60vh,26rem)] overflow-y-auto p-2">
              <Command.Empty className="px-3 py-10 text-center">
                <p className="text-sm font-medium">Nothing matched “{query}”</p>
                <p className="text-faint mt-1 text-[13px]">
                  Try a subject, a class, or the person who wrote the notes.
                </p>
              </Command.Empty>

              {/* Marks pasted straight into the search bar get answered inline. */}
              {marks && (
                <Command.Group heading={<GroupLabel>Your marks</GroupLabel>}>
                  <Row
                    icon={Percent}
                    title={`${trim(bestOfFive(marks).percentage)}% aggregate`}
                    subtitle={`Best of five from ${marks.length} subject${marks.length === 1 ? '' : 's'} · counted ${bestOfFive(marks).counted.join(', ')}`}
                    onSelect={() => {
                      onOpenChange(false)
                      navigate(`/tools?marks=${marks.join(',')}#percentage`)
                    }}
                    trailing="Open calculator"
                  />
                </Command.Group>
              )}

              {!query.trim() && recentQueries.length > 0 && (
                <Command.Group heading={<GroupLabel>Recent searches</GroupLabel>}>
                  {recentQueries.map((q) => (
                    <Row
                      key={q}
                      icon={Clock}
                      title={q}
                      onSelect={() => setQuery(q)}
                      value={`recent-${q}`}
                    />
                  ))}
                </Command.Group>
              )}

              {grouped.map(([type, items]) => (
                <Command.Group key={type} heading={<GroupLabel>{TYPE_LABEL[type]}</GroupLabel>}>
                  {items.map((item) => (
                    <Row
                      key={item.id}
                      value={item.id}
                      icon={TYPE_ICON[item.type]}
                      title={item.title}
                      subtitle={item.subtitle}
                      onSelect={() => go(item)}
                      external={item.external}
                    />
                  ))}
                </Command.Group>
              ))}

              {!query.trim() && (
                <Command.Group heading={<GroupLabel>Settings</GroupLabel>}>
                  <Row
                    value="theme"
                    icon={theme === 'dark' ? Sun : Moon}
                    title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    onSelect={() => {
                      toggle()
                      onOpenChange(false)
                    }}
                  />
                </Command.Group>
              )}
            </Command.List>

            <div className="border-line text-faint flex items-center gap-4 border-t px-4 py-2.5 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd> move
              </span>
              <span className="flex items-center gap-1.5">
                <Kbd>
                  <CornerDownLeft className="size-2.5" />
                </Kbd>
                open
              </span>
              <span className="ml-auto hidden sm:block">Tip: paste five marks to get your aggregate</span>
            </div>
                </Command>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return <span className="eyebrow block px-2 pt-3 pb-1.5">{children}</span>
}

function Row({
  icon: Icon,
  title,
  subtitle,
  onSelect,
  value,
  external,
  trailing,
}: {
  icon: typeof FileText
  title: string
  subtitle?: string
  onSelect: () => void
  value?: string
  external?: boolean
  trailing?: string
}) {
  return (
    <Command.Item
      value={value ?? title}
      onSelect={onSelect}
      className={cn(
        'group flex cursor-pointer items-center gap-3 rounded-[6px] px-2.5 py-2.5',
        'data-[selected=true]:surface-2 transition-colors',
      )}
    >
      <span className="surface-2 text-muted group-data-[selected=true]:text-accent grid size-8 shrink-0 place-items-center rounded-[5px] transition-colors">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{title}</span>
        {subtitle && <span className="text-faint block truncate text-xs">{subtitle}</span>}
      </span>
      {trailing && <span className="text-faint shrink-0 text-[11px]">{trailing}</span>}
      {external ? (
        <ExternalLink className="text-faint size-3.5 shrink-0" />
      ) : (
        <ArrowUpRight className="text-faint size-3.5 shrink-0 opacity-0 transition-opacity group-data-[selected=true]:opacity-100" />
      )}
    </Command.Item>
  )
}
