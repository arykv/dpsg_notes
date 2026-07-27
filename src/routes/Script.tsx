import { motion } from 'motion/react'
import { EyeOff } from 'lucide-react'
import { CS_SCRIPT, CS_SCRIPT_BLANKS, CS_SCRIPT_PAGES, scriptImage } from '@/data/script'
import { CS_PRINTED_TOTAL } from '@/data/paper'
import { SectionHead } from '@/components/ui/primitives'
import { ButtonLink } from '@/components/ui/Button'
import { inView, rise } from '@/lib/motion'

/**
 * The whole answer script, published.
 *
 * The rest of the site makes claims about what CBSE does to a paper. This is
 * the document those claims are read off — so a student can check them instead
 * of taking my word for it. That's the entire reason it's here.
 */
export default function Script() {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-12 pb-8 sm:px-6">
      <div className="register pl-5 sm:pl-16">
        <SectionHead
          eyebrow="Computer Science · 083 · 2026"
          title="My whole answer script, all 35 pages"
          description={`The evaluated Class 12 Computer Science paper that scored ${CS_PRINTED_TOTAL}/70 in theory, exactly as CBSE returned it. Nothing rearranged, nothing left out — including the ten blank pages and the rough work.`}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-muted mt-2 space-y-3 text-[15px] leading-relaxed"
        >
          <p>
            Everything else on this site makes claims about what happens to a board paper. It would
            be a bit rich to ask you to believe them without showing you the document, so here it
            is.
          </p>
        </motion.div>

        {/* What's covered. Stating it precisely is the point. */}
        <div className="surface border-line mt-7 rounded-[6px] border p-5">
          <div className="flex items-start gap-2.5">
            <EyeOff className="text-mark mt-0.5 size-4 shrink-0" aria-hidden />
            <div>
              <h2 className="text-[15px]">Three things are covered, and nothing else</h2>
              <ul className="text-muted mt-2.5 space-y-1.5 text-[14px] leading-relaxed">
                <li>· The barcode number on page 1.</li>
                <li>· The office-use block on the cover — the QR code and the IDEN, BAG and CHK numbers beside it.</li>
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

        <p className="text-faint mt-6 font-mono text-[11px] tabular">
          {CS_SCRIPT_PAGES} pages · {CS_SCRIPT_BLANKS} blank · scans, so they load as you scroll
        </p>
      </div>

      {/* --- The pages ----------------------------------------------------- */}
      <ol className="mt-10 space-y-10">
        {CS_SCRIPT.map((p, i) => (
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
                Page {p.n} of {CS_SCRIPT_PAGES}
                {p.booklet !== undefined && ` · booklet ${p.booklet}`}
              </span>
              {p.section && (
                <span className="border-[var(--mark)]/50 text-mark rounded-[3px] border px-1.5 py-px font-mono text-[9px] font-medium tracking-[0.12em] uppercase">
                  {p.section}
                </span>
              )}
            </div>
            <p className={`mb-3 text-[14px] leading-relaxed ${p.blank ? 'text-faint' : 'text-muted'}`}>
              {p.caption}
            </p>
            <a
              href={scriptImage(p.n)}
              target="_blank"
              rel="noreferrer noopener"
              className="border-line hover:border-line-strong block overflow-hidden rounded-[6px] border transition-colors"
            >
              <img
                src={scriptImage(p.n)}
                alt={`Answer script page ${p.n}${p.booklet !== undefined ? `, booklet page ${p.booklet}` : ''} — ${p.caption}`}
                width={1700}
                height={1202}
                // The first couple are above the fold on most screens; the rest
                // are a 2 MB document nobody should download all of at once.
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
        on this site, tell me — <a className="underline decoration-dotted underline-offset-2" href="mailto:dpsgnotes@gmail.com">dpsgnotes@gmail.com</a>.
      </p>
    </div>
  )
}
