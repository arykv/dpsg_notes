import { useCallback } from 'react'
import { DEFAULT_PERIODS } from '@/data/schedule'
import type { Period } from '@/data/types'
import { useLocalStorage } from './hooks'

const KEY = 'dpsg.schedule'

/**
 * Timings live in the browser, not in the repo.
 *
 * Sections run different bells and the notice board changes twice a year, so
 * shipping one hard-coded timetable would be wrong for most people reading it.
 * Instead everyone starts on a sensible default and fixes it once.
 */
export function useSchedule(): Period[] {
  const [periods] = useLocalStorage<Period[]>(KEY, DEFAULT_PERIODS)
  return Array.isArray(periods) && periods.length ? periods : DEFAULT_PERIODS
}

export function useScheduleEditor() {
  const [periods, setPeriods] = useLocalStorage<Period[]>(KEY, DEFAULT_PERIODS)

  const update = useCallback(
    (index: number, patch: Partial<Period>) => {
      setPeriods((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)))
    },
    [setPeriods],
  )

  const reset = useCallback(() => setPeriods(DEFAULT_PERIODS), [setPeriods])

  const isCustom = JSON.stringify(periods) !== JSON.stringify(DEFAULT_PERIODS)

  return { periods, update, reset, isCustom }
}
