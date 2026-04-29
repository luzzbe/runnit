import { useState, useCallback } from 'react'
import { storage } from '@/lib/storage'
import type { Run } from '@/types'

export function useRuns() {
  const [runs, setRuns] = useState<Run[]>(() =>
    [...storage.getRuns()].sort((a, b) => b.date.localeCompare(a.date)),
  )

  const refresh = useCallback(() => {
    setRuns([...storage.getRuns()].sort((a, b) => b.date.localeCompare(a.date)))
  }, [])

  const addRun = useCallback(
    (run: Run) => {
      storage.addRun(run)
      refresh()
    },
    [refresh],
  )

  const updateRun = useCallback(
    (run: Run) => {
      storage.updateRun(run)
      refresh()
    },
    [refresh],
  )

  const deleteRun = useCallback(
    (id: string) => {
      storage.deleteRun(id)
      refresh()
    },
    [refresh],
  )

  return { runs, addRun, updateRun, deleteRun }
}
