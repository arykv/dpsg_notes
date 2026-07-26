import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/** State that survives a refresh. Falls back gracefully in private windows. */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage full or blocked — the session still works, it just won't persist */
    }
  }, [key, value])

  return [value, setValue] as const
}

/** A ticking clock, at whatever resolution the caller actually needs. */
export function useNow(intervalMs = 30_000): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

/** Defers a fast-changing value so typing never waits on a re-render. */
export function useDebounced<T>(value: T, ms = 120): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(id)
  }, [value, ms])
  return debounced
}


/** Copy-to-clipboard with the "Copied" state built in. */
export function useCopy(resetMs = 1600) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setCopied(false), resetMs)
        return true
      } catch {
        return false
      }
    },
    [resetMs],
  )

  useEffect(() => () => window.clearTimeout(timer.current), [])
  return { copied, copy }
}

/**
 * The last few things a student opened, newest first.
 * Small enough to keep in localStorage, useful enough to be the first thing
 * on the home page for anyone who has been here before.
 */
export function useRecents(limit = 6) {
  const [ids, setIds] = useLocalStorage<string[]>('dpsg.recents', [])

  const push = useCallback(
    (id: string) => {
      setIds((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, limit))
    },
    [setIds, limit],
  )

  const clear = useCallback(() => setIds([]), [setIds])

  return { ids, push, clear }
}

/** Saved resources — the student's own shortlist. */
export function useSaved() {
  const [ids, setIds] = useLocalStorage<string[]>('dpsg.saved', [])
  const set = useMemo(() => new Set(ids), [ids])

  const toggle = useCallback(
    (id: string) => {
      setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]))
    },
    [setIds],
  )

  return { ids, has: (id: string) => set.has(id), toggle }
}

/** Registers a global shortcut. Ignores keystrokes aimed at a text field. */
export function useHotkey(
  match: (e: KeyboardEvent) => boolean,
  handler: (e: KeyboardEvent) => void,
) {
  const saved = useRef(handler)
  saved.current = handler

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      const typing =
        el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA' || el?.isContentEditable
      if (typing && !(e.metaKey || e.ctrlKey)) return
      if (match(e)) {
        e.preventDefault()
        saved.current(e)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [match])
}
