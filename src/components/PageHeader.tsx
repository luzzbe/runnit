import { createPortal } from 'react-dom'
import { useState, useLayoutEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface PageHeaderProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  back?: boolean | (() => void)
  actions?: React.ReactNode
}

export function PageHeader({ title, subtitle, icon, back, actions }: PageHeaderProps) {
  const navigate = useNavigate()
  const [target, setTarget] = useState<HTMLElement | null>(null)

  useLayoutEffect(() => {
    setTarget(document.getElementById('header-portal'))
  }, [])

  function handleBack() {
    if (typeof back === 'function') back()
    else navigate(-1)
  }

  if (!target) return null

  return createPortal(
    <div className="bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_rgb(0,0,0,0.06)] px-4 h-16 flex items-center gap-3">
      {back && (
        <button
          onClick={handleBack}
          className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 tap-press shrink-0"
        >
          <ArrowLeft size={18} />
        </button>
      )}
      {icon && !back && <span className="text-slate-400">{icon}</span>}
      <div className="flex-1 min-w-0">
        {subtitle && <p className="text-xs text-slate-400 leading-none mb-0.5">{subtitle}</p>}
        <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>,
    target,
  )
}
