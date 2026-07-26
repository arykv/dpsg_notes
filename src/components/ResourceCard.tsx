import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Bookmark, Download } from 'lucide-react'
import type { Resource } from '@/data/types'
import { getSubject } from '@/data/subjects'
import { KIND_LABELS, formatSize, relativeDate } from '@/lib/format'
import { cn } from '@/lib/cn'
import { rise } from '@/lib/motion'
import { useSaved } from '@/lib/hooks'
import { Badge, Hint } from '@/components/ui/primitives'

export function ResourceCard({ resource, index = 0 }: { resource: Resource; index?: number }) {
  const subject = getSubject(resource.subject)
  const { has, toggle } = useSaved()
  const saved = has(resource.id)

  const meta = [
    `Class ${resource.grade}`,
    subject?.name,
    resource.pages ? `${resource.pages} pages` : undefined,
    formatSize(resource.sizeMb),
  ].filter(Boolean)

  return (
    <motion.article
      variants={rise}
      custom={index}
      className={cn(
        'group surface border-line relative rounded-[8px] border p-4 shadow-card',
        'transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-line-strong',
      )}
    >
      <div className="flex items-start gap-3">
        {/* The subject mark: two letters, set in mono, doing the job an icon would do worse. */}
        <span
          className="surface-2 text-accent grid size-10 shrink-0 place-items-center rounded-[6px] font-mono text-[13px] font-medium"
          aria-hidden
        >
          {subject?.code ?? '··'}
        </span>

        <div className="min-w-0 flex-1">
          <Link to={`/library/${resource.id}`} className="block focus-visible:outline-none">
            {/* The whole card is clickable, but only the title takes focus. */}
            <span className="absolute inset-0 rounded-[8px]" aria-hidden />
            <h3 className="truncate text-[15px] leading-snug font-semibold">{resource.title}</h3>
          </Link>
          <p className="text-faint mt-1 truncate text-xs">{meta.join(' · ')}</p>
        </div>

        <Hint label={saved ? 'Remove from saved' : 'Save for later'}>
          <button
            onClick={() => toggle(resource.id)}
            aria-label={saved ? `Remove ${resource.title} from saved` : `Save ${resource.title}`}
            aria-pressed={saved}
            className={cn(
              'relative z-10 grid size-8 shrink-0 place-items-center rounded-[5px] transition-colors',
              saved
                ? 'text-mark'
                : 'text-faint opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:text-[var(--text)]',
            )}
          >
            <Bookmark className={cn('size-4', saved && 'fill-current')} />
          </button>
        </Hint>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Badge tone={resource.official ? 'mark' : 'accent'}>
          {resource.official ? 'Official' : KIND_LABELS[resource.kind]}
        </Badge>
        {resource.handwritten && <Badge tone="outline">Handwritten</Badge>}
        <span className="text-faint truncate text-xs">
          by {resource.contributor} · {relativeDate(resource.updated)}
        </span>
        <a
          href={resource.href}
          download
          onClick={(e) => e.stopPropagation()}
          aria-label={`Download ${resource.title}`}
          className="text-faint relative z-10 ml-auto grid size-8 shrink-0 place-items-center rounded-[5px] opacity-0 transition-[opacity,color] group-hover:opacity-100 focus-visible:opacity-100 hover:text-[var(--text)]"
        >
          <Download className="size-4" />
        </a>
      </div>
    </motion.article>
  )
}
