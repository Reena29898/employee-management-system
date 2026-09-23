import { memo, type CSSProperties } from 'react'
import type { Employee } from '../types/employee'

export const ROW_GRID_CLASS = 'grid grid-cols-[60px_1.2fr_1.6fr_120px_160px_100px_120px] items-center gap-2 px-4'

const STATUS_STYLES: Record<Employee['status'], string> = {
  Active: 'bg-green-100 text-green-800',
  Inactive: 'bg-slate-100 text-slate-600',
  'On Leave': 'bg-amber-100 text-amber-800',
}

interface EmployeeRowProps {
  employee: Employee
  style: CSSProperties
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
}

function EmployeeRowComponent({ employee, style, onEdit, onDelete }: EmployeeRowProps) {
  return (
    <div
      role="row"
      style={style}
      className={`${ROW_GRID_CLASS} border-b border-slate-100 text-sm text-slate-700 hover:bg-slate-50`}
    >
      <span role="cell" className="truncate text-slate-500">
        {employee.id}
      </span>
      <span role="cell" className="truncate font-medium text-slate-900">
        {employee.firstName} {employee.lastName}
      </span>
      <span role="cell" className="truncate">
        {employee.email}
      </span>
      <span role="cell" className="truncate">
        {employee.department}
      </span>
      <span role="cell" className="truncate">
        {employee.role}
      </span>
      <span role="cell">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[employee.status]}`}>
          {employee.status}
        </span>
      </span>
      <span role="cell" className="flex gap-3">
        <button
          type="button"
          onClick={() => onEdit(employee)}
          className="text-xs font-medium text-blue-600 hover:underline"
          aria-label={`Edit ${employee.firstName} ${employee.lastName}`}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(employee)}
          className="text-xs font-medium text-red-600 hover:underline"
          aria-label={`Delete ${employee.firstName} ${employee.lastName}`}
        >
          Delete
        </button>
      </span>
    </div>
  )
}

// Rows only need to re-render when their own employee data or callback
// identities change, not when the parent re-renders for unrelated reasons
// (e.g. the search input updating on every keystroke before it's debounced).
export const EmployeeRow = memo(EmployeeRowComponent)
