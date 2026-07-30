import { Link, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { EyeOff } from 'lucide-react'
import { SCRIPTS, blankCount, scriptBySlug, scriptImage, type Script as ScriptData } from '@/data/script'
import { SectionHead } from '@/components/ui/primitives'
import { ButtonLink } from '@/components/ui/Button'
import NotFound from '@/routes/NotFound'
import { inView, rise } from '@/lib/motion'

/**
 * A whole answer script, published.
 *
 * The rest of the site makes claims about what CBSE does to a paper. These are
 * the documents those claims are read off — so a student can check them instead
 * of taking my word for it. That's the entire reason they're here.
 */
export default function Script() {
  const { slug } = useParams()
  const script = slug ? scriptBySlug(slug) : undefined
  if (!script) return <NotFound />

  const others = SCRIPTS.filter((s) => s.slug !== script.slug)
  const moderation = script.marksheetTotal - script.scriptTotal

  return (
    <div className="mx-auto max-w-4xl px-4 pt-12 pb-8 sm:px-6">
      <div className="register pl-5 sm:pl-16">
        <SectionHead
          level={1}
          eyebrow={`${script.subject} · ${script.code} · 2026`}
          title={`My whole ${script.subject} script, all ${script.pages.length} pages`}
          description={script.lede}
        />

        <div className="border-line-strong mt-6 flex flex-wrap items-baseline gap-x-8 gap-y-2 border-y py-4">
          <span className="flex items-baseline gap-2.5">
            <span className="font-display text-3xl font-bold tabular">{script.scriptTotal}</span>
            <span className="eyebrow">On the script</span>
          </span>
          <span className="flex items-baseline gap-2.5">
            <span className="font-display text-mark text-3xl font-bold tabular">
              {script.marksheetTotal}
            </span>
            <span className="eyebrow">
              {moderation > 0 ? `On the marksheet · +${moderation}` : 'On the marksheet · unchanged'}
            </span>
          </span>
        </div>

        {/* What's covered. Stating it precisely is the point. */}
        <div className="surface border-line mt-7 rounded-[6px] border p-5">
          <div className="flex items-start gap-2.5">
            <EyeOff className="text-mark mt-0.5 size-4 shrink-0" aria-hidden />
            <div>
              <h2 className="text-[15px]">Three things are covered, and nothing else</h2>
              <ul className="text-muted mt-2.5 space-y-1.5 text-[14px] leading-relaxed">
                <li>· The barcode number on page 1.</li>
                <li>
                  · The office-use block on the cover — the QR code and the IDEN, BAG and CHK
                  numbers beside it.
                </li>
                <li>· The small blue stamp the scanning centre puts on every page.</li>
              </ul>
              <p className="text-muted mt-3 text-[14px] leading-relaxed">
                All three identify the <em>script</em>, not me. Every mark, tick, cross, correction
                and word of handwriting is untouched — covering those would defeat the purpose.
              </p>
              <p className="text-muted mt-3 text-[14px] leading-relaxed">
                There was never a name or a roll number to remove. CBSE's own instructions, printed
                inside the cover and readable on page 3 below, forbid writing your roll number, name
                or school anywhere in your answers.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <ButtonLink to="/paper" size="sm" variant="mark">
            What all of this means
          </ButtonLink>
          <ButtonLink to="/results" size="sm" variant="secondary">
            The marksheet it became
          </ButtonLink>
        </div>

        {others.length > 0 && (
          <p className="text-muted mt-5 text-[14px]">
            Also published:{' '}
            {others.map((o, i) => (
              <span key={o.slug}>
                {i > 0 && ', '}
                <Link
                  to={`/paper/script/${o.slug}`}
                  className="underline decoration-dotted underline-offset-2 hover:text-[var(--text)]"
                >
                  {o.subject}
                </Link>
              </span>
            ))}
            .
          </p>
        )}

        <p className="text-faint mt-6 font-mono text-[11px] tabular">
          {script.pages.length} pages · {blankCount(script)} blank · scans, so they load as you
          scroll
        </p>
      </div>

      {/* --- The pages ----------------------------------------------------- */}
      <ol className="mt-10 space-y-10">
        {script.pages.map((p, i) => (
          <motion.li
            key={p.n}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            variants={rise}
            id={`page-${p.n}`}
            className="scroll-mt-24"
          >
            <div className="mb-2.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="eyebrow">
                Page {p.n} of {script.pages.length}
                {p.booklet !== undefined && ` · booklet ${p.booklet}`}
              </span>
              {p.section && (
                <span className="border-[var(--mark)]/50 text-mark rounded-[3px] border px-1.5 py-px font-mono text-[9px] font-medium tracking-[0.12em] uppercase">
                  {p.section}
                </span>
              )}
            </div>
            <p
              className={`mb-3 text-[14px] leading-relaxed ${p.blank ? 'text-faint' : 'text-muted'}`}
            >
              {p.caption}
            </p>
            <a
              href={scriptImage(script.slug, p.n)}
              target="_blank"
              rel="noreferrer noopener"
              className="border-line hover:border-line-strong block overflow-hidden rounded-[6px] border transition-colors"
            >
              <img
                src={scriptImage(script.slug, p.n)}
                alt={`${script.subject} answer script page ${p.n}${
                  p.booklet !== undefined ? `, booklet page ${p.booklet}` : ''
                } — ${p.caption}`}
                width={1700}
                height={1202}
                // The first couple are above the fold on most screens; the rest
                // are megabytes nobody should download all at once.
                loading={i < 2 ? 'eager' : 'lazy'}
                decoding="async"
                className="block h-auto w-full bg-[var(--surface-2)]"
              />
            </a>
          </motion.li>
        ))}
      </ol>

      <p className="text-faint register mt-14 pl-5 text-[13px] leading-relaxed sm:pl-16">
        That's the whole document. If you spot something in it I've described wrongly anywhere else
        on this site, tell me —{' '}
        <a
          className="underline decoration-dotted underline-offset-2"
          href="mailto:dpsgnotes@gmail.com"
        >
          dpsgnotes@gmail.com
        </a>
        .
      </p>
    </div>
  )
}

/** Re-exported so the route file stays the only place that knows about params. */
export type { ScriptData }
