import { Navigation } from './Navigation'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="h-[100dvh] flex flex-col bg-slate-50 overflow-hidden">
      <div id="header-portal" className="flex-none" />
      <main className="flex-1 overflow-y-auto overscroll-none">
        {children}
      </main>
      <Navigation />
    </div>
  )
}
