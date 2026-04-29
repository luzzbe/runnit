import { useState } from 'react'
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AddRunPage } from './AddRunPage'
import { formatPace, formatDuration } from '@/lib/stats/calculations'
import { formatShortDate } from '@/lib/dates/utils'
import type { Run } from '@/types'

const TYPE_LABELS: Record<Run['type'], string> = {
  easy: 'Footing',
  interval: 'Fractionné',
  long_run: 'Sortie longue',
  race: 'Course',
}

const TYPE_VARIANT: Record<Run['type'], 'default' | 'success' | 'warning' | 'info'> = {
  easy: 'default',
  interval: 'info',
  long_run: 'success',
  race: 'warning',
}

function FeelingEmoji({ value }: { value: number }) {
  const emojis = ['😩', '😕', '😐', '🙂', '😄']
  return <span title={`Ressenti ${value}/5`}>{emojis[value - 1]}</span>
}

interface RunCardProps {
  run: Run
  onUpdate: (run: Run) => void
  onDelete: (id: string) => void
}

export function RunCard({ run, onUpdate, onDelete }: RunCardProps) {
  const [editing, setEditing] = useState(false)
  const [expanded, setExpanded] = useState(false)

  if (editing) {
    return (
      <Card>
        <CardContent className="pt-4">
          <AddRunPage
            onAdd={() => {}}
            editRun={run}
            onUpdate={(updated) => {
              onUpdate(updated)
              setEditing(false)
            }}
            onCancel={() => setEditing(false)}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-sm font-semibold text-slate-700 capitalize">
                {formatShortDate(run.date)}
              </span>
              <Badge variant={TYPE_VARIANT[run.type]}>{TYPE_LABELS[run.type]}</Badge>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-lg font-bold text-slate-900">
                {run.distanceKm.toFixed(1)} km
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-sm text-slate-600">{formatDuration(run.durationMinutes)}</span>
              <span className="text-slate-400">·</span>
              <span className="text-sm text-slate-600">{formatPace(run.pace)} /km</span>
              <FeelingEmoji value={run.feeling} />
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="p-1.5 text-slate-400 hover:text-slate-600"
              aria-label="Voir détails"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <span className="text-slate-400">Fatigue</span>
                <span className="ml-2 font-medium text-slate-700">{run.fatigue}/5</span>
              </div>
              <div>
                <span className="text-slate-400">Ressenti</span>
                <span className="ml-2 font-medium text-slate-700">{run.feeling}/5</span>
              </div>
            </div>
            {run.notes && (
              <p className="text-sm text-slate-600 italic mb-3">"{run.notes}"</p>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
                className="flex-1"
              >
                <Pencil size={14} />
                Modifier
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (confirm('Supprimer cette sortie ?')) onDelete(run.id)
                }}
                className="flex-1"
              >
                <Trash2 size={14} />
                Supprimer
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
