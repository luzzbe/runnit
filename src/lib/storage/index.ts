import type { UserProfile, Run } from '@/types'

const KEYS = {
  PROFILE: 'runnit_profile',
  RUNS: 'runnit_runs',
} as const

function getItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export const storage = {
  getProfile: (): UserProfile | null => getItem<UserProfile>(KEYS.PROFILE),
  saveProfile: (profile: UserProfile): void => setItem(KEYS.PROFILE, profile),

  getRuns: (): Run[] => getItem<Run[]>(KEYS.RUNS) ?? [],
  saveRuns: (runs: Run[]): void => setItem(KEYS.RUNS, runs),

  addRun: (run: Run): void => {
    storage.saveRuns([...storage.getRuns(), run])
  },
  updateRun: (updated: Run): void => {
    storage.saveRuns(storage.getRuns().map((r) => (r.id === updated.id ? updated : r)))
  },
  deleteRun: (id: string): void => {
    storage.saveRuns(storage.getRuns().filter((r) => r.id !== id))
  },

  clearAll: (): void => {
    localStorage.removeItem(KEYS.PROFILE)
    localStorage.removeItem(KEYS.RUNS)
  },
}
