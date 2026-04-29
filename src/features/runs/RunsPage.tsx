import { List } from 'lucide-react'
import { RunCard } from './RunCard'
import { PageHeader } from '@/components/PageHeader'
import type { Run } from '@/types'

interface RunsPageProps {
  runs: Run[]
  onUpdate: (run: Run) => void
  onDelete: (id: string) => void
}

export function RunsPage({ runs, onUpdate, onDelete }: RunsPageProps) {
  return (
    <>
      <PageHeader
        icon={<List size={18} />}
        title="Historique"
        actions={
          runs.length > 0 ? (
            <span className="text-sm text-slate-400">{runs.length} sorties</span>
          ) : undefined
        }
      />
      <div className="px-4 pt-4 pb-6 max-w-lg mx-auto">
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
    </>
  )
}
