import type { Run, UserProfile } from '@/types'
import { calculatePace } from '@/lib/stats/calculations'

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

function makeRun(
  daysBack: number,
  distanceKm: number,
  durationMinutes: number,
  feeling: 1 | 2 | 3 | 4 | 5,
  fatigue: 1 | 2 | 3 | 4 | 5,
  type: Run['type'] = 'easy',
  notes?: string,
): Run {
  return {
    id: crypto.randomUUID(),
    date: daysAgo(daysBack),
    distanceKm,
    durationMinutes,
    pace: calculatePace(distanceKm, durationMinutes),
    feeling,
    fatigue,
    type,
    notes,
    createdAt: new Date().toISOString(),
  }
}

export const demoProfile: UserProfile = {
  id: crypto.randomUUID(),
  firstName: 'Alex',
  level: 'beginner',
  goal: 'run_5k',
  weeklyFrequency: 3,
  createdAt: new Date().toISOString(),
}

export const demoRuns: Run[] = [
  makeRun(2, 4.2, 32, 4, 3, 'easy', 'Bonne sortie matinale'),
  makeRun(4, 5.0, 37, 3, 4, 'easy'),
  makeRun(6, 3.5, 28, 5, 2, 'easy', 'Jambes légères !'),
  makeRun(9, 6.1, 48, 3, 4, 'long_run'),
  makeRun(11, 4.0, 31, 4, 3, 'easy'),
  makeRun(13, 4.5, 36, 4, 3, 'easy'),
  makeRun(16, 5.5, 45, 3, 4, 'long_run'),
  makeRun(18, 3.8, 30, 4, 2, 'easy', 'Bon rythme'),
  makeRun(20, 4.2, 33, 3, 3, 'easy'),
  makeRun(23, 5.0, 40, 4, 3, 'easy'),
  makeRun(25, 3.0, 24, 5, 2, 'interval', 'Fractionné 5x400m'),
  makeRun(27, 6.0, 50, 3, 4, 'long_run'),
  makeRun(30, 4.5, 36, 4, 3, 'easy'),
  makeRun(32, 3.5, 28, 4, 2, 'easy'),
  makeRun(34, 5.2, 42, 3, 4, 'easy'),
]
