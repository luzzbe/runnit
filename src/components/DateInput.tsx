import { useMemo } from 'react'
import { Select } from '@/components/ui/select'

const MOIS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

interface DateInputProps {
  value: string
  max?: string
  onChange: (value: string) => void
  required?: boolean
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function DateInput({ value, max, onChange, required }: DateInputProps) {
  const today = new Date()
  const maxDate = max ? new Date(max + 'T00:00:00') : today
  const maxYear = maxDate.getFullYear()
  const minYear = maxYear - 5

  const [year, month, day] = useMemo(() => {
    if (value) {
      const [y, m, d] = value.split('-').map(Number)
      return [y, m, d]
    }
    return [today.getFullYear(), today.getMonth() + 1, today.getDate()]
  }, [value])

  const daysInMonth = new Date(year, month, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i)

  function update(y: number, m: number, d: number) {
    const clampedDay = Math.min(d, new Date(y, m, 0).getDate())
    const result = `${y}-${pad(m)}-${pad(clampedDay)}`
    onChange(max && result > max ? max : result)
  }

  return (
    <div className="flex gap-2">
      <Select
        value={String(day)}
        onChange={(e) => update(year, month, Number(e.target.value))}
        required={required}
        className="w-[4.5rem] flex-none"
      >
        {days.map((d) => (
          <option key={d} value={d}>{pad(d)}</option>
        ))}
      </Select>
      <Select
        value={String(month)}
        onChange={(e) => update(year, Number(e.target.value), day)}
        className="flex-1"
      >
        {months.map((m) => (
          <option key={m} value={m}>{MOIS[m - 1]}</option>
        ))}
      </Select>
      <Select
        value={String(year)}
        onChange={(e) => update(Number(e.target.value), month, day)}
        className="w-[5.5rem] flex-none"
      >
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </Select>
    </div>
  )
}
