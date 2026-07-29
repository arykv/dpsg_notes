import { Link, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { Printer } from 'lucide-react'
import { PRINTABLES, printableBySlug, type Printable } from '@/data/print'
import { SectionHead } from '@/components/ui/primitives'
import NotFound from '@/routes/NotFound'
import { inView, rise, stagger } from '@/lib/motion'

/**
 * Things meant to leave the screen.
 *
 * These are the only pages on the site designed for paper first. The print
 * stylesheet in index.css strips the header, footer, ruling and colour so what
 * comes out of a printer is black on white and legible from across a room —
 * a wall chart you have to squint at is a wall chart you stop looking at.
 */
export default function Print() {
  const { slug } = useParams()
  if (!slug) return <PrintIndex />

  const item = printableBySlug(slug)
  if (!item) return <NotFound />

  return (
    <div className="mx-auto max-w-4xl px-4 pt-12 pb-8 sm:px-6">
      {/* Screen-only chrome. None of this prints. */}
      <div className="print:hidden">
        <div className="register pl-5 sm:pl-16">
          <SectionHead
            eyebrow={item.kind === 'chart' ? 'Wall chart' : 'One page'}
            title={item.title}
            description={item.blurb}
          />
          <button
            onClick={() => window.print()}
            className="bg-[var(--mark)] mt-6 inline-flex h-11 items-center gap-2 rounded-[6px] px-5 text-[15px] font-medium text-[#241703] transition-[filter,transform] hover:brightness-108 active:scale-[0.98]"
          >
            <Printer className="size-4" />
            Print it
          </button>
          <p className="text-faint mt-2.5 text-xs">
            {item.kind === 'chart'
              ? 'Set your printer to A3 if you have it, landscape, and it will fill a wall. A4 works too.'
              : 'A4, portrait. Or just send someone the link.'}
          </p>
        </div>
      </div>

      <article className="printable mt-10">
        <header className="border-line mb-6 border-b pb-4">
          <h1 className="text-2xl sm:text-3xl">{item.title}</h1>
          <p className="text-muted mt-1 text-[14px]">{item.subtitle}</p>
        </header>

        {item.groups && <ChartBody item={item} />}
        {item.sections && <LetterBody item={item} />}

        {item.footnote && (
          <p className="text-faint border-line mt-8 border-t pt-4 text-[11px] leading-relaxed">
            {item.footnote}
          </p>
        )}
      </article>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

function ChartBody({ item }: { item: Printable }) {
  return (
    <div className="columns-1 gap-8 sm:columns-2 print:columns-2">
      {item.groups!.map((g) => (
        <section key={g.heading} className="mb-7 break-inside-avoid">
          <h2 className="border-[var(--mark)] mb-2 border-b-2 pb-1 text-[15px]">{g.heading}</h2>
          <dl>
            {g.rows.map((r) => (
              <div
                key={r.term}
                className="border-line flex flex-wrap justify-between gap-x-4 gap-y-0.5 border-b py-1.5 last:border-b-0"
              >
                <dt className="text-[13px]">{r.term}</dt>
                <dd className="text-muted font-mono text-[12px]">{r.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  )
}

function LetterBody({ item }: { item: Printable }) {
  return (
    <div className="space-y-7">
      {item.sections!.map((s) => (
        <section key={s.heading} className="break-inside-avoid">
          <h2 className="border-[var(--mark)] mb-2.5 border-b-2 pb-1 text-[15px]">{s.heading}</h2>
          <ul className="space-y-2">
            {s.items.map((i) => (
              <li key={i.slice(0, 24)} className="flex gap-2.5 text-[14px] leading-relaxed">
                <span className="text-mark mt-2 size-1 shrink-0 rounded-full bg-current print:bg-black" />
                {i}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function PrintIndex() {
  return (
    <div className="register mx-auto max-w-3xl px-4 pt-12 pb-8 pl-5 sm:px-6 sm:pl-16">
      <SectionHead
        eyebrow="Print"
        title="Things worth putting on a wall"
        description="The cheapest revision there is — you look at a chart for months without meaning to. All free, all designed for paper, none of them behind anything."
      />

      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger(0.05)}
        className="mt-10 space-y-3"
      >
        {PRINTABLES.map((p) => (
          <motion.div key={p.slug} variants={rise}>
            <Link
              to={`/print/${p.slug}`}
              className="surface border-line hover:border-line-strong block rounded-[6px] border p-5 transition-colors"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="text-[17px]">{p.title}</h2>
                <span className="eyebrow">{p.kind === 'chart' ? 'A3 wall chart' : 'One page'}</span>
              </div>
              <p className="text-muted mt-2 text-[14px] leading-relaxed">{p.blurb}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.p
        initial="hidden"
        whileInView="show"
        viewport={inView}
        variants={rise}
        className="text-faint mt-8 text-[13px] leading-relaxed"
      >
        Nothing here is sold, and nothing needs an account. If a printed version would genuinely be
        more useful than a home-printed one, that is a thing worth making later — but it will never
        be the only way to get the content.
      </motion.p>
    </div>
  )
}
