import { motion } from 'motion/react'
import { ArrowUpRight, BookOpen, Lock, Mail, Play } from 'lucide-react'
import { LINKS, LINK_CATEGORIES } from '@/data/links'
import { MORE_CHANNELS, MY_RESOURCES, MY_RESULT } from '@/data/channels'
import { SectionHead } from '@/components/ui/primitives'
import { ButtonLink } from '@/components/ui/Button'
import { inView, rise, stagger } from '@/lib/motion'
import { cn } from '@/lib/cn'

export default function Resources() {
  return (
    <div className="register mx-auto max-w-4xl px-4 pt-12 pl-5 sm:px-6 sm:pl-16">
      <SectionHead
        eyebrow="Resources"
        title="Where to actually learn this stuff"
        description="The channels and sites I used myself, then everything else worth opening. Every link has been checked by hand — a directory is only useful if you can trust every row in it."
      />

      <MyStack />
      <MoreChannels />

      <div className="mt-16 space-y-12 pb-4">
        {LINK_CATEGORIES.map((cat) => {
          const items = LINKS.filter((l) => l.category === cat.id)
          if (!items.length) return null

          return (
            <motion.section
              key={cat.id}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              variants={stagger(0.03)}
            >
              <h2 className="text-lg">{cat.label}</h2>
              <p className="text-muted mt-1 mb-4 text-[13px]">{cat.blurb}</p>

              <div className="grid gap-2.5 sm:grid-cols-2">
                {items.map((l) => (
                  <motion.a
                    key={l.id}
                    variants={rise}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group surface border-line hover:border-line-strong flex gap-3 rounded-[6px] border p-4 transition-colors"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-semibold">{l.label}</span>
                        {l.requiresLogin && (
                          <Lock className="text-faint size-3 shrink-0" aria-label="Needs a login" />
                        )}
                      </span>
                      <span className="text-muted mt-1 block text-[13px] leading-relaxed">
                        {l.description}
                      </span>
                      <span className="text-faint mt-2 block truncate font-mono text-[10px]">
                        {new URL(l.href).hostname.replace(/^www\./, '')}
                      </span>
                    </span>
                    <ArrowUpRight className="text-faint size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </motion.a>
                ))}
              </div>
            </motion.section>
          )
        })}
      </div>

      <Contribute />
    </div>
  )
}

/* -------------------------------------------------------------------------- */

/**
 * The section juniors will trust most — one person naming what he used and
 * what it got him, rather than a directory of everything that exists.
 */
function MyStack() {
  return (
    <motion.section initial="hidden" animate="show" variants={stagger(0.04)}>
      <h2 className="text-lg">What I actually studied from</h2>
      <p className="text-muted mt-1 text-[13px]">
        Not a list of everything out there — just the channels I used myself, subject by
        subject.
      </p>

      {/* The result, up front. It's the only reason this list is worth reading. */}
      <motion.div
        variants={rise}
        className="border-line-strong mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-y py-4"
      >
        <span className="font-display text-mark text-3xl font-bold tabular">
          {MY_RESULT.percentage}
        </span>
        <span className="eyebrow">{MY_RESULT.label}</span>
        <span className="text-muted min-w-0 flex-1 text-[13px] leading-relaxed">
          {MY_RESULT.note}
        </span>
      </motion.div>

      <div className="mt-5 space-y-2.5">
        {MY_RESOURCES.map((s) => {
          // Not everything on this list is a link — one of them is a stack of
          // sheets your school already handed you.
          const linked = Boolean(s.href)
          return (
            <motion.div
              key={s.id}
              variants={rise}
              className="surface border-line rounded-[6px] border p-4 sm:p-5"
            >
              <div className="flex items-start gap-3.5">
                <span className="text-mark border-[var(--mark)]/40 mt-0.5 grid size-8 shrink-0 place-items-center rounded-[5px] border">
                  {linked ? <Play className="size-3.5 fill-current" /> : <BookOpen className="size-3.5" />}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <h3 className="text-[16px]">{s.name}</h3>
                    <span className="text-faint font-mono text-[10px] tracking-[0.1em] uppercase">
                      {s.subjects.join(' · ')}
                    </span>
                  </div>

                  <p className="dedication text-muted mt-2 text-[15px] leading-relaxed">
                    {s.note}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                    {linked && (
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-accent group inline-flex items-center gap-1 text-[13px] font-medium"
                      >
                        {s.handle || 'Open'}
                        <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                    )}

                    {s.alsoAt && (
                      <a
                        href={s.alsoAt.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-faint hover:text-[var(--text)] inline-flex items-center gap-1 text-[13px] transition-colors"
                      >
                        <Play className="size-3 fill-current" />
                        {s.alsoAt.label}
                      </a>
                    )}

                    {s.highlight && (
                      <a
                        href={s.highlight.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-faint hover:text-[var(--text)] inline-flex items-center gap-1 text-[13px] transition-colors"
                      >
                        <Play className="size-3 fill-current" />
                        {s.highlight.label}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <p className="text-faint mt-4 text-xs leading-relaxed">
        Nobody paid for a place on this list, and nothing here costs money.
      </p>
    </motion.section>
  )
}

function MoreChannels() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={stagger(0.03)}
      className="mt-16"
    >
      <h2 className="text-lg">Others worth knowing about</h2>
      <p className="text-muted mt-1 mb-4 text-[13px]">
        Checked, free, and strong for subjects I didn’t take.
      </p>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {MORE_CHANNELS.map((c) => (
          <motion.a
            key={c.id}
            variants={rise}
            href={c.href}
            target="_blank"
            rel="noreferrer noopener"
            className={cn(
              'group surface border-line hover:border-line-strong flex gap-3 rounded-[6px] border p-4 transition-colors',
            )}
          >
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{c.name}</span>
              <span className="text-muted mt-1 block text-[13px] leading-relaxed">{c.bestFor}</span>
              <span className="text-faint mt-2 block font-mono text-[10px]">
                {c.subjects.slice(0, 3).join(' · ')}
              </span>
            </span>
            <ArrowUpRight className="text-faint size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </motion.a>
        ))}
      </div>
    </motion.section>
  )
}

function Contribute() {
  return (
    <div className="border-line mt-14 rounded-[8px] border border-dashed p-6">
      <h2 className="text-lg">Know something that should be here?</h2>
      <p className="text-muted mt-2 text-sm leading-relaxed">
        Notes you wrote, a teacher who explains it better, a paper nobody else has, the
        school&rsquo;s current ERP link — send it over and it goes up credited to you. There&rsquo;s
        no upload form on purpose: everything here is checked by a person first, so juniors can
        trust what they find.
      </p>
      <ButtonLink
        to="mailto:dpsgnotes@gmail.com?subject=Resource%20for%20DPSG%20Notes&body=What%20it%20is%3A%0AClass%20and%20subject%3A%0AYour%20name%20(for%20credit)%3A%0A%0A(attach%20the%20file%20or%20paste%20the%20link)"
        external
        variant="primary"
        size="md"
        className="mt-5"
      >
        <Mail className="size-4" />
        dpsgnotes@gmail.com
      </ButtonLink>
    </div>
  )
}
