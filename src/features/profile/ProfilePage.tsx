import { useState } from 'react'
import { User, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { demoProfile, demoRuns } from '@/data/demo'
import type { UserProfile, RunningLevel, RunningGoal } from '@/types'

interface ProfilePageProps {
  profile: UserProfile | null
  onSave: (profile: UserProfile) => void
  onLoadDemo: (profile: UserProfile, runs: import('@/types').Run[]) => void
  onReset: () => void
}

export function ProfilePage({ profile, onSave, onLoadDemo, onReset }: ProfilePageProps) {
  const [firstName, setFirstName] = useState(profile?.firstName ?? '')
  const [level, setLevel] = useState<RunningLevel>(profile?.level ?? 'beginner')
  const [goal, setGoal] = useState<RunningGoal>(profile?.goal ?? 'run_5k')
  const [freq, setFreq] = useState(profile?.weeklyFrequency ?? 3)
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const p: UserProfile = {
      id: profile?.id ?? crypto.randomUUID(),
      firstName: firstName.trim(),
      level,
      goal,
      weeklyFrequency: freq,
      createdAt: profile?.createdAt ?? new Date().toISOString(),
    }
    onSave(p)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <User size={20} className="text-slate-400" />
        <h1 className="text-xl font-bold text-slate-900">Mon profil</h1>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5">
        <div>
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Ton prénom"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="level">Niveau</Label>
          <Select
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value as RunningLevel)}
          >
            <option value="beginner">Débutant</option>
            <option value="intermediate">Intermédiaire</option>
            <option value="advanced">Confirmé</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="goal">Objectif principal</Label>
          <Select
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value as RunningGoal)}
          >
            <option value="run_30min">Courir 30 minutes sans s'arrêter</option>
            <option value="run_5k">Courir 5 km</option>
            <option value="run_10k">Courir 10 km</option>
            <option value="run_3x_week">Courir 3 fois par semaine</option>
            <option value="improve_pace">Améliorer mon allure</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="freq">Fréquence souhaitée (sorties / semaine)</Label>
          <Input
            id="freq"
            type="number"
            min={1}
            max={7}
            value={freq}
            onChange={(e) => setFreq(parseInt(e.target.value) || 1)}
          />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={!firstName.trim()}>
          {saved ? '✓ Profil enregistré !' : 'Enregistrer'}
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-200">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Données
        </h2>
        <div className="flex flex-col gap-3">
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm font-medium text-slate-700 mb-1">Données de démonstration</p>
              <p className="text-xs text-slate-400 mb-3">
                Charge un profil et 15 sorties exemples pour explorer l'app.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onLoadDemo(demoProfile, demoRuns)}
              >
                Charger les données démo
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <p className="text-sm font-medium text-red-600 mb-1">Réinitialiser</p>
              <p className="text-xs text-slate-400 mb-3">
                Supprime toutes tes sorties et ton profil. Irréversible.
              </p>
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => {
                  if (confirm('Supprimer toutes les données ?')) onReset()
                }}
              >
                <RotateCcw size={14} />
                Tout supprimer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
