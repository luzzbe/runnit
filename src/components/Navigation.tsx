import { NavLink } from 'react-router-dom'
import { Home, PlusCircle, List, Trophy, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/ajouter', icon: PlusCircle, label: 'Ajouter' },
  { to: '/historique', icon: List, label: 'Historique' },
  { to: '/records', icon: Trophy, label: 'Records' },
  { to: '/profil', icon: User, label: 'Profil' },
] as const

export function Navigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 bg-white shadow-[0_-1px_0_0_rgb(0,0,0,0.06)] px-2 pb-2 z-50">
      <div className="flex items-stretch h-16">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center justify-center tap-press transition-colors',
                isActive ? 'text-primary-600' : 'text-slate-300',
              )
            }
          >
            {({ isActive }) => (
              <span
                className={cn(
                  'flex flex-col items-center gap-0.5',
                  isActive ? 'bg-primary-50 rounded-2xl px-4 py-1.5' : 'px-4 py-1.5',
                )}
              >
                <Icon size={24} />
                <span className="text-[10px] font-medium">{label}</span>
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
