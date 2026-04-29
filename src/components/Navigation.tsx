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
    <nav className="absolute inset-x-0 bg-white border-t border-slate-200 safe-area-bottom-offset z-50">
      <div className="flex items-stretch h-16">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5 text-xs transition-colors',
                isActive ? 'text-primary-600' : 'text-slate-400',
              )
            }
          >
            <Icon size={22} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
