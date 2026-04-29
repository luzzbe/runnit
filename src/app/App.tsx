import { useState, useCallback } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { OnboardingPage } from '@/features/profile/OnboardingPage'
import { ProfilePage } from '@/features/profile/ProfilePage'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { AddRunPage } from '@/features/runs/AddRunPage'
import { RunsPage } from '@/features/runs/RunsPage'
import { RecordsPage } from '@/features/records/RecordsPage'
import { useProfile } from '@/hooks/useProfile'
import { useRuns } from '@/hooks/useRuns'
import { useStats } from '@/hooks/useStats'
import { storage } from '@/lib/storage'
import type { Run, UserProfile } from '@/types'

export default function App() {
  const { profile, saveProfile } = useProfile()
  const { runs, addRun, updateRun, deleteRun } = useRuns()
  const [resetKey, setResetKey] = useState(0)

  const firstName = profile?.firstName ?? ''
  const { currentWeek, last4, records, summary, insights } = useStats(runs, firstName)

  const handleReset = useCallback(() => {
    storage.clearAll()
    setResetKey((k) => k + 1)
    window.location.hash = '#/'
    window.location.reload()
  }, [])

  const handleLoadDemo = useCallback(
    (demoProfile: UserProfile, demoRuns: Run[]) => {
      storage.clearAll()
      storage.saveProfile(demoProfile)
      storage.saveRuns(demoRuns)
      window.location.reload()
    },
    [],
  )

  if (!profile) {
    return (
      <HashRouter key={resetKey}>
        <OnboardingPage onComplete={saveProfile} />
      </HashRouter>
    )
  }

  return (
    <HashRouter key={resetKey}>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage
                profile={profile}
                currentWeek={currentWeek}
                last4={last4}
                summary={summary}
                insights={insights}
              />
            }
          />
          <Route
            path="/ajouter"
            element={<AddRunPage onAdd={addRun} />}
          />
          <Route
            path="/historique"
            element={
              <RunsPage runs={runs} onUpdate={updateRun} onDelete={deleteRun} />
            }
          />
          <Route
            path="/records"
            element={<RecordsPage records={records} />}
          />
          <Route
            path="/profil"
            element={
              <ProfilePage
                profile={profile}
                onSave={saveProfile}
                onLoadDemo={handleLoadDemo}
                onReset={handleReset}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}
