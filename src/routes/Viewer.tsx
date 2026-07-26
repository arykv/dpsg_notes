import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  ArrowLeft,
  Bookmark,
  Check,
  Download,
  ExternalLink,
  FileQuestion,
  Link2,
  Loader2,
  Share2,
} from 'lucide-react'
import { RESOURCES, getResource } from '@/data/resources'
import { getSubject } from '@/data/subjects'
import { KIND_LABELS, STREAM_LABELS, formatDate, formatSize } from '@/lib/format'
import { useCopy, useRecents, useSaved } from '@/lib/hooks'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Badge, EmptyState, Hint } from '@/components/ui/primitives'
import { ResourceCard } from '@/components/ResourceCard'
import { cn } from '@/lib/cn'
import { stagger } from '@/lib/motion'

export default function Viewer() {
  const { id } = useParams<{ id: string }>()
  const resource = id ? getResource(id) : undefined
  const { push } = useRecents()
  const { has, toggle } = useSaved()
  const { copied, copy } = useCopy()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (resource) push(resource.id)
  }, [resource, push])

  useEffect(() => {
    if (resource) document.title = `${resource.title} — DPSG Notes`
    return () => {
      document.title = 'DPSG Notes — everything you need for school, in one place'
    }
  }, [resource])

  const related = useMemo(
    () =>
      resource
        ? RESOURCES.filter((r) => r.subject === resource.subject && r.id !== resource.id).slice(0, 3)
        : [],
    [resource],
  )

  if (!resource) {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-24 sm:px-6">
        <EmptyState
          icon={<FileQuestion className="size-5" />}
          title="That file isn’t here"
          description="The link may be old, or the file was renamed. The library search will find it if it still exists."
          action={
            <ButtonLink to="/library" variant="primary" size="sm">
              Open the library
            </ButtonLink>
          }
        />
      </div>
    )
  }

  const subject = getSubject(resource.subject)
  const saved = has(resource.id)

  async function share() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: resource!.title, url })
        return
      } catch {
        /* the user backed out — fall through to copying */
      }
    }
    void copy(url)
  }

  return (
    <div className="register mx-auto max-w-6xl px-4 pt-8 pl-5 sm:px-6 sm:pl-16">
      <Link
        to="/library"
        className="text-muted hover:text-[var(--text)] inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors"
      >
        <ArrowLeft className="size-3.5" />
        Library
      </Link>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_20rem]">
        {/* Reader */}
        <div className="surface border-line relative overflow-hidden rounded-[8px] border shadow-card">
          {!loaded && (
            <div className="text-faint absolute inset-0 z-10 grid place-items-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="size-5 animate-spin" />
                <p className="text-[13px]">
                  Loading {formatSize(resource.sizeMb) ?? 'the file'}…
                </p>
              </div>
            </div>
          )}
          <object
            data={`${resource.href}#view=FitH`}
            type="application/pdf"
            title={resource.title}
            onLoad={() => setLoaded(true)}
            className="h-[62vh] min-h-[26rem] w-full lg:h-[78vh]"
          >
            {/* iOS Safari and most Android browsers refuse to embed PDFs. */}
            <div className="grid h-[62vh] place-items-center px-6 text-center">
              <div>
                <p className="text-sm font-medium">Your browser won’t show PDFs inline</p>
                <p className="text-muted mt-1.5 text-[13px]">
                  Common on phones. Open it in a new tab instead — it&rsquo;s the same file.
                </p>
                <ButtonLink to={resource.href} external variant="primary" size="sm" className="mt-4">
                  Open the PDF
                  <ExternalLink className="size-3.5" />
                </ButtonLink>
              </div>
            </div>
          </object>
        </div>

        {/* Details */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="surface border-line rounded-[8px] border p-5 shadow-card">
            <div className="flex items-center gap-2">
              <Badge tone={resource.official ? 'mark' : 'accent'}>
                {resource.official ? 'Official' : KIND_LABELS[resource.kind]}
              </Badge>
              <Badge tone="outline">Class {resource.grade}</Badge>
              {resource.handwritten && <Badge tone="outline">Handwritten</Badge>}
            </div>

            <h1 className="mt-3.5 text-2xl">{resource.title}</h1>
            <p className="text-muted mt-1.5 text-sm">
              {subject?.name} · {STREAM_LABELS[resource.stream]}
            </p>

            <dl className="border-line mt-5 space-y-2.5 border-t pt-4 text-[13px]">
              <Row label="Shared by" value={resource.contributor} />
              <Row label="Updated" value={formatDate(resource.updated)} />
              {resource.pages && <Row label="Pages" value={String(resource.pages)} />}
              {resource.sizeMb && <Row label="Size" value={formatSize(resource.sizeMb)!} />}
            </dl>

            <div className="mt-5 grid gap-2">
              <ButtonLink to={resource.href} external variant="primary" size="md">
                <Download className="size-4" />
                Download
              </ButtonLink>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" size="md" onClick={share}>
                  {copied ? (
                    <>
                      <Check className="size-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Share2 className="size-4" />
                      Share
                    </>
                  )}
                </Button>

                <Hint label={saved ? 'Remove from saved' : 'Saved on this device'}>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => toggle(resource.id)}
                    aria-pressed={saved}
                  >
                    <Bookmark className={cn('size-4', saved && 'fill-current text-[var(--mark)]')} />
                    {saved ? 'Saved' : 'Save'}
                  </Button>
                </Hint>
              </div>
            </div>

            <button
              onClick={() => void copy(window.location.href)}
              className="text-faint hover:text-[var(--text)] mt-3 flex w-full items-center justify-center gap-1.5 text-xs transition-colors"
            >
              <Link2 className="size-3" />
              Copy link
            </button>
          </div>

          <p className="text-faint mt-4 px-1 text-xs leading-relaxed">
            Written by a student, not the school. Cross-check anything that looks off against the{' '}
            <Link to="/chapters" className="underline underline-offset-2">
              NCERT book
            </Link>
            .
          </p>
        </aside>
      </div>

      {related.length > 0 && (
        <motion.section
          initial="hidden"
          animate="show"
          variants={stagger(0.04)}
          className="mt-12 pb-4"
        >
          <p className="eyebrow mb-4">More {subject?.name.toLowerCase()}</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r, i) => (
              <ResourceCard key={r.id} resource={r} index={i} />
            ))}
          </div>
        </motion.section>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-faint">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  )
}
