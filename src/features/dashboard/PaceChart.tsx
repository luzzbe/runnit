import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatPace } from '@/lib/stats/calculations'
import type { Run } from '@/types'

function paceLabel(value: number) {
  return `${formatPace(value)} /km`
}

function shortDate(iso: string) {
  const [, m, d] = iso.split('-')
  return `${d}/${m}`
}

interface PaceChartProps {
  runs: Run[]
}

export function PaceChart({ runs }: PaceChartProps) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 30)
  const cutoffStr = cutoff.toISOString().slice(0, 10)

  const data = runs
    .filter((r) => r.date >= cutoffStr && r.pace > 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((r) => ({ date: shortDate(r.date), pace: r.pace }))

  if (data.length < 2) return null

  const paces = data.map((d) => d.pace)
  const min = Math.min(...paces)
  const max = Math.max(...paces)
  // Add 5% padding so the line isn't flush against edges
  const pad = (max - min) * 0.05 || 0.1

  return (
    <div className="mb-5">
      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
        Allure – 30 derniers jours
      </p>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[max + pad, min - pad]}
            tickFormatter={formatPace}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            width={42}
          />
          <Tooltip
            formatter={(value) => [paceLabel(Number(value)), 'Allure']}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Line
            type="monotone"
            dataKey="pace"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ r: 3, fill: '#6366f1' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
