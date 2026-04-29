import { Navigation } from './Navigation'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="pb-20 min-h-screen">{children}</main>
      <Navigation />
    </div>
  )
}
