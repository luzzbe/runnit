import { useNavigate } from 'react-router-dom'
import { TrendingUp, TrendingDown, Minus, Plus, Zap, Target, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/PageHeader'
import { formatPace, formatDuration } from '@/lib/stats/calculations'
import type { Last4WeeksAvg } from '@/lib/stats/calculations'
import type { WeeklyStats, ProgressInsight, UserProfile, Run } from '@/types'
import { PaceChart } from './PaceChart'

const GOAL_LABELS: Record<UserProfile['goal'], string> = {
  run_30min: 'Courir 30 min sans s\'arrêter',
  run_5k: 'Courir 5 km',
  run_10k: 'Courir 10 km',
  run_3x_week: 'Courir 3x par semaine',
  improve_pace: 'Améliorer mon allure',
}

function TrendIcon({ pct }: { pct: number }) {
  if (pct > 5) return <TrendingUp size={14} className="text-emerald-500" />
  if (pct < -5) return <TrendingDown size={14} className="text-red-400" />
  return <Minus size={14} className="text-slate-400" />
}

function StatCard({
  label,
  value,
  sub,
  trend,
}: {
  label: string
  value: string
  sub?: string
  trend?: number
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        {(sub !== undefined || trend !== undefined) && (
          <div className="flex items-center gap-1 mt-1">
            {trend !== undefined && <TrendIcon pct={trend} />}
            {sub && <p className="text-xs text-slate-400">{sub}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function FeelingDots({ value }: { value: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${i <= Math.round(value) ? 'bg-emerald-400' : 'bg-slate-200'}`}
        />
      ))}
    </div>
  )
}

interface DashboardPageProps {
  profile: UserProfile
  currentWeek: WeeklyStats
  last4: Last4WeeksAvg
  summary: string
  insights: ProgressInsight[]
  runs: Run[]
}

export function DashboardPage({ profile, currentWeek, last4, summary, insights, runs }: DashboardPageProps) {
  const navigate = useNavigate()

  const distanceTrend =
    last4.avgDistance > 0
      ? ((currentWeek.totalDistanceKm - last4.avgDistance) / last4.avgDistance) * 100
      : 0
  const durationTrend =
    last4.avgDuration > 0
      ? ((currentWeek.totalDurationMinutes - last4.avgDuration) / last4.avgDuration) * 100
      : 0

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  return (
    <>
      <PageHeader
        subtitle={`${greeting},`}
        title={`${profile.firstName} 👋`}
        actions={
          <button
            onClick={() => navigate('/ajouter')}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            <Plus size={18} />
          </button>
        }
      />
      <div className="px-4 pt-4 pb-6 max-w-lg mx-auto">
      {/* Objectif */}
      <div className="bg-primary-600 rounded-2xl p-4 mb-5 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Target size={16} className="opacity-80" />
          <span className="text-xs font-medium opacity-80">Objectif en cours</span>
        </div>
        <p className="font-semibold">{GOAL_LABELS[profile.goal]}</p>
      </div>

      {/* Stats semaine */}
      <div className="flex items-center gap-2 mb-3">
        <Calendar size={16} className="text-slate-400" />
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Cette semaine
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard
          label="Sorties"
          value={String(currentWeek.runCount)}
          sub={`objectif ${profile.weeklyFrequency}x`}
        />
        <StatCard
          label="Distance"
          value={`${currentWeek.totalDistanceKm.toFixed(1)} km`}
          trend={distanceTrend}
          sub={
            last4.avgDistance > 0
              ? `moy. ${last4.avgDistance.toFixed(1)} km`
              : undefined
          }
        />
        <StatCard
          label="Temps couru"
          value={currentWeek.totalDurationMinutes > 0 ? formatDuration(currentWeek.totalDurationMinutes) : '--'}
          trend={durationTrend}
        />
        <StatCard
          label="Allure moyenne"
          value={currentWeek.avgPace > 0 ? `${formatPace(currentWeek.avgPace)} /km` : '--'}
        />
      </div>

      {/* Graphique allure */}
      <PaceChart runs={runs} />

      {/* Ressenti */}
      {currentWeek.avgFeeling > 0 && (
        <Card className="mb-5">
          <CardContent className="pt-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">Ressenti moyen</p>
              <p className="text-xs text-slate-400 mt-0.5">sur {currentWeek.runCount} sortie{currentWeek.runCount > 1 ? 's' : ''}</p>
            </div>
            <FeelingDots value={currentWeek.avgFeeling} />
          </CardContent>
        </Card>
      )}

      {/* Bilan */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-5">
        <p className="text-sm text-amber-900 leading-relaxed">{summary}</p>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Progression détectée
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            {insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-3 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                <p className="text-sm text-emerald-800">{insight.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      {currentWeek.runCount === 0 && (
        <Button className="w-full" size="lg" onClick={() => navigate('/ajouter')}>
          <Plus size={20} />
          Ajouter ma première sortie de la semaine
        </Button>
      )}
      </div>
    </>
  )
}
