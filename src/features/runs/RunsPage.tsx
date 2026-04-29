import { List } from 'lucide-react'
import { RunCard } from './RunCard'
import type { Run } from '@/types'

interface RunsPageProps {
  runs: Run[]
  onUpdate: (run: Run) => void
  onDelete: (id: string) => void
}

export function RunsPage({ runs, onUpdate, onDelete }: RunsPageProps) {
  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <List size={20} className="text-slate-400" />
        <h1 className="text-xl font-bold text-slate-900">Historique</h1>
        <span className="ml-auto text-sm text-slate-400">{runs.length} sorties</span>
      </div>

      {runs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🏃</p>
          <p className="text-slate-500">Aucune sortie enregistrée.</p>
          <p className="text-sm text-slate-400 mt-1">
            Ajoute ta première sortie via le bouton +
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {runs.map((run) => (
            <RunCard key={run.id} run={run} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
