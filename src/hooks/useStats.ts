import { useMemo } from 'react'
import type { Run } from '@/types'
import { getWeekStart } from '@/lib/dates/utils'
import {
  getWeeklyStats,
  getLast4WeeksAvg,
  getPersonalRecords,
  generateWeeklySummary,
  detectProgressInsights,
} from '@/lib/stats/calculations'

export function useStats(runs: Run[], firstName: string) {
  return useMemo(() => {
    const weekStart = getWeekStart(new Date())
    const currentWeek = getWeeklyStats(runs, weekStart)
    const last4 = getLast4WeeksAvg(runs)
    const records = getPersonalRecords(runs)
    const summary = generateWeeklySummary(currentWeek, last4, firstName)
    const insights = detectProgressInsights(runs, currentWeek, last4)

    return { currentWeek, last4, records, summary, insights }
  }, [runs, firstName])
}
