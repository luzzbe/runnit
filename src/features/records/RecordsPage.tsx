import { Trophy, Zap, MapPin, Clock, BarChart2, Repeat } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/PageHeader'
import { formatPace, formatDuration } from '@/lib/stats/calculations'
import { formatDate } from '@/lib/dates/utils'
import type { PersonalRecords } from '@/types'

interface RecordItemProps {
  icon: React.ReactNode
  title: string
  value: string
  sub?: string
  colorClass?: string
}

function RecordItem({ icon, title, value, sub, colorClass = '' }: RecordItemProps) {
  return (
    <Card className={colorClass}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400 font-semibold">
          <span className="text-primary-500">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-black text-slate-900">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </CardContent>
    </Card>
  )
}

interface RecordsPageProps {
  records: PersonalRecords
}

export function RecordsPage({ records }: RecordsPageProps) {
  const hasAny = Object.values(records).some((v) => v !== null)

  return (
    <>
      <PageHeader
        icon={<Trophy size={18} className="text-amber-500" />}
        title="Records personnels"
      />
      <div className="px-4 pt-4 pb-6 max-w-lg mx-auto">
        {!hasAny ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🏆</p>
            <p className="text-slate-500">Tes records apparaîtront ici.</p>
            <p className="text-sm text-slate-400 mt-1">
              Commence par ajouter quelques sorties !
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              {records.bestPace && (
                <RecordItem
                  icon={<Zap size={16} />}
                  title="Meilleure allure"
                  value={`${formatPace(records.bestPace.value)} /km`}
                  sub={formatDate(records.bestPace.date)}
                  colorClass="bg-amber-50"
                />
              )}
              {records.longestDistance && (
                <RecordItem
                  icon={<MapPin size={16} />}
                  title="Plus longue distance"
                  value={`${records.longestDistance.value.toFixed(1)} km`}
                  sub={formatDate(records.longestDistance.date)}
                  colorClass="bg-blue-50"
                />
              )}
              {records.longestDuration && (
                <RecordItem
                  icon={<Clock size={16} />}
                  title="Plus longue durée"
                  value={formatDuration(records.longestDuration.value)}
                  sub={formatDate(records.longestDuration.date)}
                  colorClass="bg-purple-50"
                />
              )}
            </div>
            {records.bestWeekVolume && (
              <RecordItem
                icon={<BarChart2 size={16} />}
                title="Meilleure semaine"
                value={`${records.bestWeekVolume.value.toFixed(1)} km`}
                sub={`semaine du ${formatDate(records.bestWeekVolume.weekStart)}`}
                colorClass="bg-emerald-50"
              />
            )}
            {records.bestStreak && (
              <RecordItem
                icon={<Repeat size={16} />}
                title="Meilleure régularité"
                value={`${records.bestStreak.value} semaine${records.bestStreak.value > 1 ? 's' : ''} consécutives`}
              />
            )}
          </div>
        )}
      </div>
    </>
  )
}
