import type { Run, WeeklyStats, PersonalRecords, ProgressInsight } from '@/types'
import { getWeekStart, getWeeksAgo } from '@/lib/dates/utils'

export function calculatePace(distanceKm: number, durationMinutes: number): number {
  if (distanceKm === 0) return 0
  return durationMinutes / distanceKm
}

export function formatPace(paceMinPerKm: number): string {
  if (!paceMinPerKm || paceMinPerKm <= 0) return '--:--'
  const minutes = Math.floor(paceMinPerKm)
  const seconds = Math.round((paceMinPerKm - minutes) * 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}min`
  return `${h}h${m.toString().padStart(2, '0')}`
}

export function getWeeklyStats(runs: Run[], weekStart: Date): WeeklyStats {
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 7)

  const weekRuns = runs.filter((r) => {
    const d = new Date(r.date)
    return d >= weekStart && d < weekEnd
  })

  const totalDistance = weekRuns.reduce((s, r) => s + r.distanceKm, 0)
  const totalDuration = weekRuns.reduce((s, r) => s + r.durationMinutes, 0)

  return {
    weekStart: weekStart.toISOString(),
    runCount: weekRuns.length,
    totalDistanceKm: totalDistance,
    totalDurationMinutes: totalDuration,
    avgPace: totalDistance > 0 ? totalDuration / totalDistance : 0,
    avgFeeling:
      weekRuns.length > 0 ? weekRuns.reduce((s, r) => s + r.feeling, 0) / weekRuns.length : 0,
    runs: weekRuns,
  }
}

export interface Last4WeeksAvg {
  avgDistance: number
  avgDuration: number
  avgRunCount: number
  avgFeeling: number
}

export function getLast4WeeksAvg(runs: Run[]): Last4WeeksAvg {
  const weekStart = getWeekStart(new Date())

  const weeks = [1, 2, 3, 4].map((n) => getWeeklyStats(runs, getWeeksAgo(weekStart, n)))

  const activeWeeks = weeks.filter((w) => w.runCount > 0)
  const divisor = activeWeeks.length || 1

  return {
    avgDistance: weeks.reduce((s, w) => s + w.totalDistanceKm, 0) / 4,
    avgDuration: weeks.reduce((s, w) => s + w.totalDurationMinutes, 0) / 4,
    avgRunCount: weeks.reduce((s, w) => s + w.runCount, 0) / 4,
    avgFeeling: activeWeeks.reduce((s, w) => s + w.avgFeeling, 0) / divisor,
  }
}

export function getPersonalRecords(runs: Run[]): PersonalRecords {
  if (runs.length === 0) {
    return {
      bestPace: null,
      longestDistance: null,
      longestDuration: null,
      bestWeekVolume: null,
      bestStreak: null,
    }
  }

  const paceRuns = runs.filter((r) => r.distanceKm >= 1 && r.pace > 0)
  const bestPaceRun = paceRuns.reduce<Run | null>(
    (best, r) => (!best || r.pace < best.pace ? r : best),
    null,
  )

  const longestDistanceRun = runs.reduce<Run | null>(
    (best, r) => (!best || r.distanceKm > best.distanceKm ? r : best),
    null,
  )

  const longestDurationRun = runs.reduce<Run | null>(
    (best, r) => (!best || r.durationMinutes > best.durationMinutes ? r : best),
    null,
  )

  const weekStarts = new Set<string>()
  runs.forEach((r) => weekStarts.add(getWeekStart(new Date(r.date)).toISOString()))

  let bestWeek: { value: number; weekStart: string } | null = null
  weekStarts.forEach((ws) => {
    const stats = getWeeklyStats(runs, new Date(ws))
    if (!bestWeek || stats.totalDistanceKm > bestWeek.value) {
      bestWeek = { value: stats.totalDistanceKm, weekStart: ws }
    }
  })

  const streak = calculateBestStreak(runs)

  return {
    bestPace: bestPaceRun
      ? { value: bestPaceRun.pace, runId: bestPaceRun.id, date: bestPaceRun.date }
      : null,
    longestDistance: longestDistanceRun
      ? {
          value: longestDistanceRun.distanceKm,
          runId: longestDistanceRun.id,
          date: longestDistanceRun.date,
        }
      : null,
    longestDuration: longestDurationRun
      ? {
          value: longestDurationRun.durationMinutes,
          runId: longestDurationRun.id,
          date: longestDurationRun.date,
        }
      : null,
    bestWeekVolume: bestWeek,
    bestStreak: streak,
  }
}

function calculateBestStreak(runs: Run[]): { value: number; endDate: string } | null {
  const weekStarts = new Set<string>()
  runs.forEach((r) => weekStarts.add(getWeekStart(new Date(r.date)).toISOString()))

  const sorted = Array.from(weekStarts).sort()
  if (sorted.length === 0) return null

  let current = 1
  let best = 1
  let bestEnd = sorted[0]

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1])
    const curr = new Date(sorted[i])
    const diffWeeks = (curr.getTime() - prev.getTime()) / (7 * 24 * 60 * 60 * 1000)

    if (Math.round(diffWeeks) === 1) {
      current++
      if (current > best) {
        best = current
        bestEnd = sorted[i]
      }
    } else {
      current = 1
    }
  }

  return { value: best, endDate: bestEnd }
}

export function generateWeeklySummary(
  currentWeek: WeeklyStats,
  last4: Last4WeeksAvg,
  firstName: string,
): string {
  if (currentWeek.runCount === 0) {
    return `${firstName}, tu n'as pas encore couru cette semaine. C'est le bon moment pour chausser tes baskets !`
  }

  const parts: string[] = []
  parts.push(
    `Cette semaine, tu as couru ${currentWeek.runCount} fois pour un total de ${currentWeek.totalDistanceKm.toFixed(1)} km.`,
  )

  if (last4.avgDistance > 0) {
    const change =
      ((currentWeek.totalDistanceKm - last4.avgDistance) / last4.avgDistance) * 100
    if (change > 10) {
      parts.push(
        `C'est ${Math.round(change)} % de plus que ta moyenne des 4 dernières semaines — excellent effort !`,
      )
    } else if (change < -15) {
      parts.push(
        `C'est un peu moins que d'habitude, mais chaque sortie compte pour rester dans le rythme.`,
      )
    } else {
      parts.push(`Tu es dans ta moyenne habituelle — la régularité, c'est la clé.`)
    }
  }

  if (currentWeek.avgFeeling >= 4) {
    parts.push(`Ton ressenti est excellent, tu vas clairement dans la bonne direction.`)
  } else if (currentWeek.avgFeeling >= 3) {
    parts.push(`Ton ressenti est bon. Continue sur cette lancée.`)
  } else if (currentWeek.avgFeeling > 0) {
    parts.push(`Les jambes sont un peu lourdes cette semaine — écoute ton corps.`)
  }

  return parts.join(' ')
}

export function detectProgressInsights(
  runs: Run[],
  currentWeek: WeeklyStats,
  last4: Last4WeeksAvg,
): ProgressInsight[] {
  const insights: ProgressInsight[] = []

  if (last4.avgDistance > 0) {
    const change =
      (currentWeek.totalDistanceKm - last4.avgDistance) / last4.avgDistance
    if (change >= 0.1) {
      insights.push({
        type: 'volume',
        message: `Tu cours ${Math.round(change * 100)} % de plus que ta moyenne des 4 dernières semaines.`,
        positive: true,
      })
    }
  }

  if (last4.avgRunCount > 0 && currentWeek.runCount >= Math.ceil(last4.avgRunCount)) {
    insights.push({
      type: 'consistency',
      message: `Tu maintiens ta régularité — c'est la base de toute progression.`,
      positive: true,
    })
  }

  const recentRuns = runs.slice(-10)
  const olderRuns = runs.slice(-20, -10)

  if (recentRuns.length >= 3 && olderRuns.length >= 3) {
    const recentFeel = recentRuns.reduce((s, r) => s + r.feeling, 0) / recentRuns.length
    const olderFeel = olderRuns.reduce((s, r) => s + r.feeling, 0) / olderRuns.length
    const recentPace = recentRuns.reduce((s, r) => s + r.pace, 0) / recentRuns.length
    const olderPace = olderRuns.reduce((s, r) => s + r.pace, 0) / olderRuns.length

    if (recentFeel > olderFeel + 0.3 && Math.abs(recentPace - olderPace) < 0.5) {
      insights.push({
        type: 'efficiency',
        message: `Ton ressenti s'améliore à allure équivalente — tu deviens plus efficace.`,
        positive: true,
      })
    }

    if (olderPace > 0 && recentPace < olderPace - 0.2) {
      insights.push({
        type: 'pace',
        message: `Ton allure s'améliore sur les dernières sorties. Beau travail !`,
        positive: true,
      })
    }

    const recentFatigue = recentRuns.reduce((s, r) => s + r.fatigue, 0) / recentRuns.length
    const olderFatigue = olderRuns.reduce((s, r) => s + r.fatigue, 0) / olderRuns.length
    if (olderFatigue - recentFatigue > 0.4) {
      insights.push({
        type: 'feeling',
        message: `Ta fatigue diminue — ton corps s'adapte à l'effort.`,
        positive: true,
      })
    }
  }

  return insights
}
