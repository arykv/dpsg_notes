import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Menu, Moon, Search, Sun, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useTheme } from '@/lib/theme'
import { snap } from '@/lib/motion'
import { Hint, Kbd } from '@/components/ui/primitives'
import { PeriodBar } from '@/components/PeriodBar'

const NAV = [
  { to: '/library', label: 'Library' },
  { to: '/chapters', label: 'Chapters' },
  { to: '/resources', label: 'Resources' },
  { to: '/tools', label: 'Tools' },
  { to: '/day', label: 'School day' },
  { to: '/about', label: 'About' },
]

export function Header({ onOpenSearch }: { onOpenSearch: () => void }) {
  const { theme, toggle } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [lifted, setLifted] = useState(false)
  const { scrollY } = useScroll()
  const { pathname } = useLocation()

  useMotionValueEvent(scrollY, 'change', (y) => setLifted(y > 12))

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-[background-color,border-color,box-shadow] duration-300',
        lifted ? 'glass border-line border-b' : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-2.5"
          aria-label="DPSG Notes — home"
        >
          <span className="border-line-strong text-mark grid h-7 place-items-center rounded-[3px] border px-1.5 font-mono text-[11px] font-medium tracking-[0.1em]">
            DPSG
          </span>
          <span className="font-display hidden text-[15px] font-bold tracking-tight sm:block">
            Notes
          </span>
        </Link>

        <span className="border-line mx-1 hidden h-5 w-px border-l lg:block" />
        <PeriodBar compact />

        <nav className="ml-auto hidden items-center gap-0.5 md:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'relative rounded-[5px] px-3 py-1.5 text-[13px] font-medium transition-colors',
                  isActive ? 'text-[var(--text)]' : 'text-muted hover:text-[var(--text)]',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={snap}
                      className="surface-2 absolute inset-0 rounded-[5px]"
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-2">
          <button
            onClick={onOpenSearch}
            aria-label="Search everything"
            aria-keyshortcuts="Meta+K"
            className={cn(
              'surface-2 border-line text-faint hover:border-line-strong flex h-9 items-center gap-2 rounded-[6px] border px-3 transition-colors',
              'hover:text-[var(--text)] sm:min-w-56',
            )}
          >
            <Search className="size-4 shrink-0" />
            <span className="hidden text-[13px] sm:block">Search everything</span>
            <span className="ml-auto hidden gap-1 sm:flex">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </span>
          </button>

          <Hint label={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}>
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="text-muted hover:surface-2 grid size-9 place-items-center rounded-[6px] transition-colors hover:text-[var(--text)]"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, rotate: -70, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 70, scale: 0.7 }}
                  transition={snap}
                  className="grid place-items-center"
                >
                  {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </Hint>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="text-muted hover:surface-2 grid size-9 place-items-center rounded-[6px] transition-colors hover:text-[var(--text)] md:hidden"
          >
            {menuOpen ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="glass border-line overflow-hidden border-b md:hidden"
          >
            <div className="flex flex-col gap-0.5 px-4 pt-1 pb-4">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'rounded-[5px] px-3 py-2.5 text-[15px] font-medium transition-colors',
                    pathname === item.to
                      ? 'surface-2 text-[var(--text)]'
                      : 'text-muted active:surface-2',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
