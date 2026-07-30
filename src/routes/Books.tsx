import { motion } from 'motion/react'
import { ArrowUpRight, BadgeIndianRupee, Ban } from 'lucide-react'
import { BOOK_SOURCES, NO_AFFILIATE_NOTE, SHELF } from '@/data/books'
import { SectionHead } from '@/components/ui/primitives'
import { ButtonLink } from '@/components/ui/Button'
import { inView, rise, stagger } from '@/lib/motion'

/**
 * The shelf.
 *
 * Deliberately short, and deliberately contains a subject with no book against
 * it. Every "best books for Class 12" page is a list of things to buy, because
 * every one of them earns on the click. This one earns nothing, which is what
 * makes it possible to say "don't buy anything for Maths" — the single most
 * useful line on the page.
 */
export default function Books() {
  return (
    <div className="register mx-auto max-w-3xl px-4 pt-12 pb-8 pl-5 sm:px-6 sm:pl-16">
      <SectionHead
        level={1}
        eyebrow="The shelf"
        title="The three books I'd buy, and the one subject I wouldn't"
        description="Four subjects, three books. Nothing here is sponsored, nothing is an affiliate link, and one row tells you to keep your money."
      />

      {/* Say the money thing first, because it's what makes the rest readable. */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="surface border-line mt-8 rounded-[6px] border p-5"
      >
        <div className="flex items-start gap-2.5">
          <BadgeIndianRupee className="text-mark mt-0.5 size-4 shrink-0" aria-hidden />
          <p className="text-muted text-[14px] leading-relaxed">{NO_AFFILIATE_NOTE}</p>
        </div>
      </motion.div>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={inView}
        variants={stagger(0.05)}
        className="mt-10 space-y-4"
      >
        {SHELF.map((s) => (
          <motion.article
            key={s.id}
            variants={rise}
            className={`rounded-[6px] border p-5 ${
              s.book ? 'surface border-line' : 'surface-2 border-[var(--mark)]/50'
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 className="text-[17px]">{s.subject}</h2>
              {s.book ? (
                <span className="text-mark font-mono text-[12px]">{s.book}</span>
              ) : (
                <span className="text-mark inline-flex items-center gap-1.5 font-mono text-[12px] font-medium">
                  <Ban className="size-3.5" aria-hidden />
                  Buy nothing
                </span>
              )}
            </div>

            <p className="text-muted mt-2.5 text-[14px] leading-relaxed">{s.note}</p>

            {s.instead && (
              <>
                <p className="eyebrow mt-4 mb-2">Do this instead</p>
                <ul className="space-y-2">
                  {s.instead.map((i) => (
                    <li key={i.slice(0, 24)} className="flex gap-2.5 text-[14px] leading-relaxed">
                      <span className="text-mark mt-2 size-1 shrink-0 rounded-full bg-current" />
                      {i}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </motion.article>
        ))}
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={inView}
        variants={stagger(0.04)}
        className="mt-14"
      >
        <h2 className="text-2xl">Before you buy anything</h2>
        <p className="text-muted mt-2 text-[15px] leading-relaxed">
          Both of these are free, official, and better than most of what you'd pay for. Work through
          them first and you may find you don't need the book at all — which is the outcome I'd
          rather you had.
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {BOOK_SOURCES.map((s) => (
            <ButtonLink key={s.href} to={s.href} external size="sm" variant="secondary">
              {s.label}
              <ArrowUpRight className="size-3.5" />
            </ButtonLink>
          ))}
          <ButtonLink to="/tools#questions" size="sm" variant="mark">
            Set a question target
          </ButtonLink>
        </div>
      </motion.section>
    </div>
  )
}
