import { memo, type CSSProperties } from 'react'
import type { Employee } from '../types/employee'

export const ROW_GRID_CLASS = 'grid grid-cols-[60px_1.2fr_1.6fr_120px_160px_100px_120px] items-center gap-2 px-4'

const STATUS_STYLES: Record<Employee['status'], string> = {
  Active: 'bg-success-soft text-success',
  Inactive: 'bg-neutral-soft text-neutral',
  'On Leave': 'bg-warning-soft text-warning',
}

function StatusPill({ status }: { status: Employee['status'] }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  )
}

interface RowActionsProps {
  employee: Employee
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
}

function RowActions({ employee, onEdit, onDelete }: RowActionsProps) {
  return (
    <span className="flex gap-3">
      <button
        type="button"
        onClick={() => onEdit(employee)}
        className="text-xs font-medium text-primary hover:underline"
        aria-label={`Edit ${employee.firstName} ${employee.lastName}`}
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => onDelete(employee)}
        className="text-xs font-medium text-danger hover:underline"
        aria-label={`Delete ${employee.firstName} ${employee.lastName}`}
      >
        Delete
      </button>
    </span>
  )
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
      className={`${ROW_GRID_CLASS} border-b border-hairline text-sm text-ink-secondary hover:bg-canvas-soft`}
    >
      <span role="cell" className="truncate tabular-nums text-ink-muted">
        {employee.id}
      </span>
      <span role="cell" className="truncate font-medium text-ink">
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
        <StatusPill status={employee.status} />
      </span>
      <span role="cell">
        <RowActions employee={employee} onEdit={onEdit} onDelete={onDelete} />
      </span>
    </div>
  )
}

export const EmployeeRow = memo(EmployeeRowComponent)

interface EmployeeCardProps {
  employee: Employee
  style: CSSProperties
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
}

// Mobile equivalent of EmployeeRow, same virtualization, stacked layout
// instead of a 7-column grid.
function EmployeeCardComponent({ employee, style, onEdit, onDelete }: EmployeeCardProps) {
  return (
    <div style={style} className="px-3 py-1.5">
      <div role="row" className="rounded-lg border border-hairline bg-canvas p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p role="cell" className="truncate font-medium text-ink">
              {employee.firstName} {employee.lastName}
            </p>
            <p role="cell" className="truncate text-xs text-ink-muted">
              {employee.email}
            </p>
          </div>
          <span role="cell">
            <StatusPill status={employee.status} />
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-ink-secondary">
          <span role="cell">
            {employee.department} · {employee.role}
          </span>
          <span role="cell" className="tabular-nums text-ink-muted">
            #{employee.id}
          </span>
        </div>
        <div className="mt-2 border-t border-hairline pt-2">
          <RowActions employee={employee} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>
    </div>
  )
}

export const EmployeeCard = memo(EmployeeCardComponent)
