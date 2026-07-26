import { motion } from 'motion/react'
import { Navigate, useLocation } from 'react-router-dom'
import { ButtonLink } from '@/components/ui/Button'
import { legacyTarget } from '@/data/legacy-routes'

/**
 * A 404 that behaves like a teacher rather than an error page: it says what
 * happened, admits the likely cause, and hands you somewhere to go.
 *
 * The old site had pages at /class11science.html and the like, so a fair number
 * of dead links are still floating around in WhatsApp groups.
 */
export default function NotFound() {
  const { pathname } = useLocation()

  // Old links still circulate in class groups; send them where the file went.
  const moved = legacyTarget(pathname)
  if (moved) return <Navigate to={moved} replace />

  const looksLegacy = pathname.endsWith('.html')

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        {/* Marked out of 100, like everything else here. */}
        <p className="font-display text-accent text-[6rem] leading-none font-black tracking-tighter sm:text-[8rem]">
          404
        </p>
        <p className="eyebrow -mt-2">out of 100</p>

        <h1 className="mt-7 text-3xl sm:text-4xl">This page doesn’t exist</h1>

        <p className="text-muted mx-auto mt-4 max-w-md text-[15px] leading-relaxed">
          {looksLegacy
            ? 'That’s a link to the old version of this site. Everything moved into one searchable library — the file you want is almost certainly still here.'
            : 'The link might be old, or something got renamed. Search usually finds it faster than guessing at the URL.'}
        </p>

        <p className="text-faint mt-4 font-mono text-xs break-all">{pathname}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <ButtonLink to="/library" variant="primary" size="md">
            Search the library
          </ButtonLink>
          <ButtonLink to="/" variant="secondary" size="md">
            Back home
          </ButtonLink>
        </div>
      </motion.div>
    </div>
  )
}
