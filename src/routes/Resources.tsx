import { motion } from 'motion/react'
import { ArrowUpRight, Lock, Mail, Play, Quote } from 'lucide-react'
import { LINKS, LINK_CATEGORIES } from '@/data/links'
import { CHANNELS } from '@/data/channels'
import { SectionHead } from '@/components/ui/primitives'
import { ButtonLink } from '@/components/ui/Button'
import { inView, rise, stagger } from '@/lib/motion'
import { cn } from '@/lib/cn'

export default function Resources() {
  return (
    <div className="register mx-auto max-w-4xl px-4 pt-12 pl-5 sm:px-6 sm:pl-16">
      <SectionHead
        eyebrow="Resources"
        title="Everything worth opening, and nothing that isn’t"
        description="Every link on this page has been checked by hand. If one breaks, tell us and it goes — a directory is only useful if you can trust every row in it."
      />

      <Channels />

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

function Channels() {
  const [pick, ...rest] = [...CHANNELS].sort((a, b) => Number(b.pick) - Number(a.pick))

  return (
    <motion.section initial="hidden" animate="show" variants={stagger(0.04)}>
      <h2 className="text-lg">Teachers worth your evening</h2>
      <p className="text-muted mt-1 mb-4 text-[13px]">
        Free channels that cover the CBSE syllabus properly, not clip farms.
      </p>

      {/* The one with a real story behind it gets the space to tell it. */}
      {pick && (
        <motion.a
          variants={rise}
          href={pick.href}
          target="_blank"
          rel="noreferrer noopener"
          className="group surface border-line-strong mb-3 block rounded-[6px] border p-5 transition-colors hover:border-[var(--mark)]"
        >
          <div className="flex items-start gap-4">
            <span className="text-mark border-[var(--mark)]/45 grid size-10 shrink-0 place-items-center rounded-[5px] border">
              <Play className="size-4 fill-current" />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[17px]">{pick.name}</h3>
                <span className="eyebrow">Aryan’s pick</span>
              </div>
              <p className="text-muted mt-1 text-[13px]">{pick.bestFor}</p>

              {pick.note && (
                <blockquote className="border-[var(--pen)]/40 mt-4 border-l-2 pl-4">
                  <Quote className="text-pen mb-1.5 size-3" aria-hidden />
                  <p className="dedication text-[15px] leading-relaxed">{pick.note}</p>
                  <footer className="text-faint mt-2 font-mono text-[10px] tracking-[0.14em] uppercase">
                    Aryan Rao · Class of 2026
                  </footer>
                </blockquote>
              )}

              <span className="text-accent mt-4 inline-flex items-center gap-1 text-[13px] font-medium">
                Open {pick.handle}
                <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </motion.a>
      )}

      <div className="grid gap-2.5 sm:grid-cols-2">
        {rest.map((c) => (
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
