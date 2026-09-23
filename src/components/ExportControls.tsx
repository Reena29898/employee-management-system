import { downloadEmployeesCsv, downloadEmployeesJson } from '../utils/exportUtils'
import type { Employee } from '../types/employee'

interface ExportControlsProps {
  employees: Employee[]
}

// Exports the filtered result set passed in, not the full roster.
export function ExportControls({ employees }: ExportControlsProps) {
  const disabled = employees.length === 0

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => downloadEmployeesCsv(employees)}
        disabled={disabled}
        className="rounded-md border border-hairline-strong px-3 py-2 text-sm font-medium text-ink-secondary hover:bg-canvas-soft disabled:cursor-not-allowed disabled:opacity-50"
      >
        Export CSV
      </button>
      <button
        type="button"
        onClick={() => downloadEmployeesJson(employees)}
        disabled={disabled}
        className="rounded-md border border-hairline-strong px-3 py-2 text-sm font-medium text-ink-secondary hover:bg-canvas-soft disabled:cursor-not-allowed disabled:opacity-50"
      >
        Export JSON
      </button>
    </div>
  )
}
