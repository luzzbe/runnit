import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import type { UserProfile, RunningLevel, RunningGoal } from '@/types'

interface OnboardingPageProps {
  onComplete: (profile: UserProfile) => void
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [firstName, setFirstName] = useState('')
  const [level, setLevel] = useState<RunningLevel>('beginner')
  const [goal, setGoal] = useState<RunningGoal>('run_5k')
  const [freq, setFreq] = useState(3)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onComplete({
      id: crypto.randomUUID(),
      firstName: firstName.trim(),
      level,
      goal,
      weeklyFrequency: freq,
      createdAt: new Date().toISOString(),
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-5xl mb-3">🏃</p>
          <h1 className="text-3xl font-bold text-slate-900">Runnit</h1>
          <p className="text-slate-500 mt-2 text-sm">
            Ton coach de progression, pas ton réseau social.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <Label htmlFor="firstName">Comment tu t'appelles ?</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Ton prénom"
              value={firstName}
              autoFocus
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="level">Ton niveau actuel</Label>
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
            <Label htmlFor="goal">Ton objectif</Label>
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
            <Label htmlFor="freq">Combien de fois par semaine ?</Label>
            <Select
              id="freq"
              value={String(freq)}
              onChange={(e) => setFreq(parseInt(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <option key={n} value={n}>
                  {n} fois
                </option>
              ))}
            </Select>
          </div>

          <Button type="submit" size="lg" className="w-full mt-2" disabled={!firstName.trim()}>
            Commencer →
          </Button>
        </form>
      </div>
    </div>
  )
}
