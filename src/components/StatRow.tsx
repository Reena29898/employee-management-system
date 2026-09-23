import { useMemo } from 'react'
import type { Employee } from '../types/employee'

interface StatRowProps {
  employees: Employee[]
}

interface Stat {
  label: string
  value: number
}

// Counts against the full roster, not the filtered/paginated view.
export function StatRow({ employees }: StatRowProps) {
  const stats = useMemo<Stat[]>(() => {
    const active = employees.filter((employee) => employee.status === 'Active').length
    const onLeave = employees.filter((employee) => employee.status === 'On Leave').length
    const departments = new Set(employees.map((employee) => employee.department)).size

    return [
      { label: 'Total employees', value: employees.length },
      { label: 'Active', value: active },
      { label: 'On leave', value: onLeave },
      { label: 'Departments', value: departments },
    ]
  }, [employees])

  return (
    <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border border-hairline bg-canvas p-4 shadow-level-1">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">{stat.label}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-ink">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
