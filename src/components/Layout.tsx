import { Navigation } from './Navigation'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="app-shell flex flex-col bg-slate-50">
      <div
        id="header-portal"
        className="fixed inset-x-0 top-0 z-50 bg-white"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      />
      <main className="flex-1 safe-area-content-top safe-area-content-bottom">
        {children}
      </main>
      <Navigation />
    </div>
  )
}
