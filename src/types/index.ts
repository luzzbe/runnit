export type RunningLevel = 'beginner' | 'intermediate' | 'advanced'

export type RunningGoal =
  | 'run_30min'
  | 'run_5k'
  | 'run_10k'
  | 'run_3x_week'
  | 'improve_pace'

export type RunType = 'easy' | 'interval' | 'long_run' | 'race'

export interface UserProfile {
  id: string
  firstName: string
  level: RunningLevel
  goal: RunningGoal
  weeklyFrequency: number
  createdAt: string
}

export interface Run {
  id: string
  date: string
  distanceKm: number
  durationMinutes: number
  pace: number
  feeling: 1 | 2 | 3 | 4 | 5
  fatigue: 1 | 2 | 3 | 4 | 5
  type: RunType
  notes?: string
  createdAt: string
}

export interface WeeklyStats {
  weekStart: string
  runCount: number
  totalDistanceKm: number
  totalDurationMinutes: number
  avgPace: number
  avgFeeling: number
  runs: Run[]
}

export interface PersonalRecords {
  bestPace: { value: number; runId: string; date: string } | null
  longestDistance: { value: number; runId: string; date: string } | null
  longestDuration: { value: number; runId: string; date: string } | null
  bestWeekVolume: { value: number; weekStart: string } | null
  bestStreak: { value: number; endDate: string } | null
}

export interface ProgressInsight {
  type: 'volume' | 'consistency' | 'feeling' | 'efficiency' | 'pace'
  message: string
  positive: boolean
}
