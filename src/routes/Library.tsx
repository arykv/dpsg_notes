import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Bookmark, Search, SlidersHorizontal, X } from 'lucide-react'
import { RESOURCES } from '@/data/resources'
import { SUBJECTS, subjectName } from '@/data/subjects'
import type { Grade, ResourceKind, Stream } from '@/data/types'
import { KIND_LABELS, STREAM_LABELS } from '@/lib/format'
import { searchResourceIds } from '@/lib/search'
import { useDebounced, useSaved } from '@/lib/hooks'
import { ResourceCard } from '@/components/ResourceCard'
import { Button } from '@/components/ui/Button'
import { EmptyState, SectionHead, Segmented } from '@/components/ui/primitives'
import { cn } from '@/lib/cn'
import { stagger } from '@/lib/motion'

type Sort = 'recent' | 'title' | 'size'

const GRADES: Grade[] = [9, 10, 11, 12]
const STREAMS: Stream[] = ['science', 'commerce', 'arts']
const KINDS = Object.keys(KIND_LABELS) as ResourceKind[]

export default function Library() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const debounced = useDebounced(query, 100)
  const [showFilters, setShowFilters] = useState(false)
  const { ids: savedIds } = useSaved()

  const subject = params.get('subject')
  const grade = params.get('grade')
  const stream = params.get('stream')
  const kind = params.get('kind')
  const savedOnly = params.get('saved') === '1'
  const sort = (params.get('sort') as Sort) ?? 'recent'

  // Keep the URL in step with the query so a search can be sent to a friend.
  useEffect(() => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (debounced.trim()) next.set('q', debounced.trim())
        else next.delete('q')
        return next
      },
      { replace: true },
    )
  }, [debounced, setParams])

  function setParam(key: string, value: string | null) {
    setParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value === null || next.get(key) === value) next.delete(key)
      else next.set(key, value)
      return next
    })
  }

  const activeFilters = [subject, grade, stream, kind, savedOnly ? 'saved' : null].filter(Boolean)

  const results = useMemo(() => {
    const ranked = searchResourceIds(debounced)
    const order = ranked ? new Map(ranked.map((id, i) => [id, i])) : null

    let list = RESOURCES.filter((r) => {
      if (order && !order.has(r.id)) return false
      if (subject && r.subject !== subject) return false
      if (grade && r.grade !== Number(grade)) return false
      if (stream && r.stream !== stream && r.stream !== 'common') return false
      if (kind && r.kind !== kind) return false
      if (savedOnly && !savedIds.includes(r.id)) return false
      return true
    })

    if (order) {
      // A search puts relevance first; sorting only applies when browsing.
      list = list.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0))
    } else if (sort === 'title') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title))
    } else if (sort === 'size') {
      list = [...list].sort((a, b) => (a.sizeMb ?? 0) - (b.sizeMb ?? 0))
    } else {
      list = [...list].sort((a, b) => b.updated.localeCompare(a.updated))
    }

    return list
  }, [debounced, subject, grade, stream, kind, savedOnly, savedIds, sort])

  return (
    <div className="register mx-auto max-w-6xl px-4 pt-12 pl-5 sm:px-6 sm:pl-16">
      <SectionHead
        eyebrow="Library"
        title={subject ? subjectName(subject as never) : 'Everything, in one list'}
        description="Handwritten notes scanned by students here, plus anything else people have sent in. Filters stack and the URL keeps them, so you can send someone a link straight to what you found."
      />

      {/* Search + controls */}
      <div className="sticky top-16 z-20 -mx-4 mb-6 px-4 py-3 sm:-mx-6 sm:px-6">
        <div className="glass border-line rounded-[8px] border p-2 shadow-card">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="text-faint pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the library…"
                aria-label="Search the library"
                className="h-10 w-full rounded-[6px] bg-transparent pr-3 pl-9 text-sm outline-none placeholder:text-[var(--text-faint)]"
              />
            </div>

            <Button
              size="sm"
              variant={showFilters || activeFilters.length ? 'primary' : 'secondary'}
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
            >
              <SlidersHorizontal className="size-3.5" />
              Filters
              {activeFilters.length > 0 && (
                <span className="ml-0.5 font-mono text-[11px]">{activeFilters.length}</span>
              )}
            </Button>
          </div>

          <AnimatePresence initial={false}>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="border-line mt-2 space-y-3 border-t px-1 pt-3 pb-1">
                  <FilterRow label="Class">
                    {GRADES.map((g) => (
                      <Chip
                        key={g}
                        active={grade === String(g)}
                        onClick={() => setParam('grade', String(g))}
                      >
                        Class {g}
                      </Chip>
                    ))}
                  </FilterRow>

                  <FilterRow label="Stream">
                    {STREAMS.map((s) => (
                      <Chip key={s} active={stream === s} onClick={() => setParam('stream', s)}>
                        {STREAM_LABELS[s]}
                      </Chip>
                    ))}
                  </FilterRow>

                  <FilterRow label="Subject">
                    {SUBJECTS.map((s) => (
                      <Chip
                        key={s.id}
                        active={subject === s.id}
                        onClick={() => setParam('subject', s.id)}
                      >
                        {s.name}
                      </Chip>
                    ))}
                  </FilterRow>

                  <FilterRow label="Type">
                    {KINDS.map((k) => (
                      <Chip key={k} active={kind === k} onClick={() => setParam('kind', k)}>
                        {KIND_LABELS[k]}
                      </Chip>
                    ))}
                  </FilterRow>

                  <FilterRow label="Only">
                    <Chip
                      active={savedOnly}
                      onClick={() => setParam('saved', savedOnly ? null : '1')}
                    >
                      <Bookmark className={cn('size-3', savedOnly && 'fill-current')} />
                      Saved ({savedIds.length})
                    </Chip>
                  </FilterRow>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Active filters + sort */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <p className="text-muted text-[13px] tabular">
          {results.length} {results.length === 1 ? 'file' : 'files'}
          {debounced.trim() && <span className="text-faint"> for “{debounced.trim()}”</span>}
        </p>

        {activeFilters.length > 0 && (
          <button
            onClick={() =>
              setParams((prev) => {
                const next = new URLSearchParams()
                const q = prev.get('q')
                if (q) next.set('q', q)
                return next
              })
            }
            className="text-faint hover:text-[var(--text)] flex items-center gap-1 text-[13px] transition-colors"
          >
            <X className="size-3" />
            Clear filters
          </button>
        )}

        <div className="ml-auto">
          <Segmented
            label="Sort"
            value={sort}
            onChange={(v) => setParam('sort', v === 'recent' ? null : v)}
            options={[
              { value: 'recent', label: 'Newest' },
              { value: 'title', label: 'A–Z' },
              { value: 'size', label: 'Smallest' },
            ]}
          />
        </div>
      </div>

      {results.length > 0 ? (
        <motion.div
          key={`${debounced}-${activeFilters.join()}-${sort}`}
          initial="hidden"
          animate="show"
          variants={stagger(0.03)}
          className="grid gap-3 pb-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {results.map((r, i) => (
            <ResourceCard key={r.id} resource={r} index={i} />
          ))}
        </motion.div>
      ) : (
        <EmptyState
          icon={<Search className="size-5" />}
          title={savedOnly ? 'Nothing saved yet' : 'No match'}
          description={
            savedOnly
              ? 'Tap the bookmark on any file and it turns up here, on this device.'
              : 'Nothing here fits that. The notes written by students are still few — try the NCERT chapters, or email what you have and it goes up credited to you.'
          }
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setQuery('')
                setParams(new URLSearchParams())
              }}
            >
              Reset everything
            </Button>
          }
        />
      )}
    </div>
  )
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="eyebrow w-14 shrink-0">{label}</span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[5px] border px-2.5 py-1 text-[13px] font-medium transition-colors',
        active
          ? 'bg-[var(--mark)]/14 border-[var(--mark)]/40 text-accent'
          : 'border-line text-muted hover:border-line-strong hover:text-[var(--text)]',
      )}
    >
      {children}
    </button>
  )
}
