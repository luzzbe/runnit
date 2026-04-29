import { Navigation } from './Navigation'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="app-shell fixed inset-0 flex flex-col bg-slate-50 overflow-hidden">
      <div id="header-portal" className="flex-none bg-white" style={{ paddingTop: 'env(safe-area-inset-top)' }} />
      <main className="flex-1 overflow-y-auto overscroll-none">
        {children}
      </main>
      <Navigation />
    </div>
  )
}
