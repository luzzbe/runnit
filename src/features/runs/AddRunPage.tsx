import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { calculatePace, formatPace } from '@/lib/stats/calculations'
import { todayISO } from '@/lib/dates/utils'
import type { Run, RunType } from '@/types'

interface AddRunPageProps {
  onAdd: (run: Run) => void
  editRun?: Run | null
  onUpdate?: (run: Run) => void
  onCancel?: () => void
}

function RatingButtons({
  value,
  onChange,
  labels,
}: {
  value: number
  onChange: (v: number) => void
  labels: string[]
}) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
            value === n
              ? 'bg-primary-600 text-white'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
          title={labels[n - 1]}
        >
          {n}
        </button>
      ))}
    </div>
  )
}

export function AddRunPage({ onAdd, editRun, onUpdate, onCancel }: AddRunPageProps) {
  const navigate = useNavigate()
  const isEditing = Boolean(editRun)

  const [date, setDate] = useState(editRun?.date ?? todayISO())
  const [distanceStr, setDistanceStr] = useState(editRun?.distanceKm.toString() ?? '')
  const [hours, setHours] = useState(
    editRun ? String(Math.floor(editRun.durationMinutes / 60)) : '0',
  )
  const [minutes, setMinutes] = useState(
    editRun ? String(editRun.durationMinutes % 60) : '',
  )
  const [type, setType] = useState<RunType>(editRun?.type ?? 'easy')
  const [feeling, setFeeling] = useState<number>(editRun?.feeling ?? 3)
  const [fatigue, setFatigue] = useState<number>(editRun?.fatigue ?? 3)
  const [notes, setNotes] = useState(editRun?.notes ?? '')

  const distance = parseFloat(distanceStr) || 0
  const totalMinutes = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0)
  const pace = calculatePace(distance, totalMinutes)

  const isValid = distance > 0 && totalMinutes > 0 && date

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return

    const run: Run = {
      id: editRun?.id ?? crypto.randomUUID(),
      date,
      distanceKm: distance,
      durationMinutes: totalMinutes,
      pace,
      feeling: feeling as Run['feeling'],
      fatigue: fatigue as Run['fatigue'],
      type,
      notes: notes.trim() || undefined,
      createdAt: editRun?.createdAt ?? new Date().toISOString(),
    }

    if (isEditing && onUpdate) {
      onUpdate(run)
      onCancel?.()
    } else {
      onAdd(run)
      navigate('/')
    }
  }

  function handleBack() {
    if (onCancel) onCancel()
    else navigate(-1)
  }

  return (
    <div className="px-4 pt-4 pb-4 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={handleBack} className="p-2 -ml-2 text-slate-500 hover:text-slate-700">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-slate-900">
          {isEditing ? 'Modifier la sortie' : 'Nouvelle sortie'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            max={todayISO()}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="type">Type de sortie</Label>
          <Select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as RunType)}
          >
            <option value="easy">Footing / sortie facile</option>
            <option value="interval">Fractionné</option>
            <option value="long_run">Sortie longue</option>
            <option value="race">Course officielle</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="distance">Distance (km)</Label>
          <Input
            id="distance"
            type="number"
            min="0.1"
            max="200"
            step="0.1"
            placeholder="5.0"
            value={distanceStr}
            onChange={(e) => setDistanceStr(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Durée</Label>
          <div className="flex gap-2 items-center">
            <div className="flex-1">
              <Input
                type="number"
                min="0"
                max="23"
                placeholder="0"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
              <p className="text-xs text-slate-400 text-center mt-1">heures</p>
            </div>
            <span className="text-slate-400 text-lg font-medium mb-4">:</span>
            <div className="flex-1">
              <Input
                type="number"
                min="0"
                max="59"
                placeholder="30"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                required
              />
              <p className="text-xs text-slate-400 text-center mt-1">minutes</p>
            </div>
          </div>
        </div>

        {pace > 0 && (
          <div className="flex items-center gap-2 bg-primary-50 rounded-xl px-4 py-3">
            <Activity size={16} className="text-primary-600" />
            <span className="text-sm font-medium text-primary-700">
              Allure calculée : {formatPace(pace)} /km
            </span>
          </div>
        )}

        <div>
          <Label>Ressenti (1 = difficile · 5 = super)</Label>
          <RatingButtons
            value={feeling}
            onChange={setFeeling}
            labels={['Difficile', 'Moyen', 'Correct', 'Bien', 'Super']}
          />
        </div>

        <div>
          <Label>Fatigue (1 = frais · 5 = épuisé)</Label>
          <RatingButtons
            value={fatigue}
            onChange={setFatigue}
            labels={['Frais', 'Léger', 'Normal', 'Fatigué', 'Épuisé']}
          />
        </div>

        <div>
          <Label htmlFor="notes">Notes (optionnel)</Label>
          <Textarea
            id="notes"
            rows={3}
            placeholder="Comment s'est passée ta sortie ?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <Button type="submit" size="lg" disabled={!isValid} className="w-full mt-1">
          {isEditing ? 'Enregistrer les modifications' : 'Enregistrer la sortie'}
        </Button>
      </form>
    </div>
  )
}
