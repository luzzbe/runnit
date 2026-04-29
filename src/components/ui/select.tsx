import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
      'disabled:opacity-50 appearance-none',
      className,
    )}
    {...props}
  />
))
Select.displayName = 'Select'
