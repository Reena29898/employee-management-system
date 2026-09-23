import { forwardRef, useMemo, type CSSProperties, type HTMLAttributes } from 'react'
import { FixedSizeList as List, type ListChildComponentProps } from 'react-window'
import { EmployeeCard, EmployeeRow, ROW_GRID_CLASS } from './EmployeeRow'
import type { Employee, SortKey, SortState } from '../types/employee'

interface EmployeeTableProps {
  employees: Employee[]
  sort: SortState
  onSortChange: (key: SortKey) => void
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
  layout: 'table' | 'cards'
}

const ROW_HEIGHT = 52
const CARD_HEIGHT = 116
const LIST_HEIGHT = 480

interface RowData {
  rows: Employee[]
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
}

function VirtualRow({ index, style, data }: ListChildComponentProps<RowData>) {
  const employee = data.rows[index]
  return <EmployeeRow employee={employee} style={style} onEdit={data.onEdit} onDelete={data.onDelete} />
}

function VirtualCard({ index, style, data }: ListChildComponentProps<RowData>) {
  const employee = data.rows[index]
  return <EmployeeCard employee={employee} style={style} onEdit={data.onEdit} onDelete={data.onDelete} />
}

// react-window's default wrapper is a plain div; this gives it role="rowgroup".
const Body = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function Body(props, ref) {
  return <div ref={ref} role="rowgroup" {...props} />
})

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'department', label: 'Department' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
]

function SortIcon({ direction }: { direction: 'asc' | 'desc' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`h-3.5 w-3.5 transition-transform ${direction === 'desc' ? 'rotate-180' : ''}`}
    >
      <path fillRule="evenodd" d="M10 4a.75.75 0 01.55.24l4.5 5a.75.75 0 11-1.1 1.02L10 6.06l-3.95 4.2a.75.75 0 11-1.1-1.02l4.5-5A.75.75 0 0110 4z" />
    </svg>
  )
}

function EmptyState() {
  return (
    <div role="status" className="rounded-md border border-dashed border-hairline-strong py-16 text-center text-ink-muted">
      No employees match your search and filters.
    </div>
  )
}

export function EmployeeTable({ employees, sort, onSortChange, onEdit, onDelete, layout }: EmployeeTableProps) {
  const itemData = useMemo<RowData>(() => ({ rows: employees, onEdit, onDelete }), [employees, onEdit, onDelete])

  if (employees.length === 0) {
    return <EmptyState />
  }

  if (layout === 'cards') {
    return (
      <div role="table" aria-label="Employees">
        <List
          height={Math.min(LIST_HEIGHT, employees.length * CARD_HEIGHT)}
          width="100%"
          itemCount={employees.length}
          itemSize={CARD_HEIGHT}
          itemData={itemData}
          itemKey={(index, data) => data.rows[index].id}
          innerElementType={Body}
        >
          {VirtualCard}
        </List>
      </div>
    )
  }

  return (
    <div role="table" aria-label="Employees" className="overflow-hidden rounded-md border border-hairline">
      <div role="rowgroup">
        <div
          role="row"
          className={`${ROW_GRID_CLASS} border-b border-hairline bg-canvas-soft py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted`}
        >
          {COLUMNS.map((column) => {
            const isActive = sort.key === column.key
            return (
              <span key={column.key} role="columnheader" aria-sort={isActive ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}>
                <button
                  type="button"
                  onClick={() => onSortChange(column.key)}
                  className={`flex w-full items-center gap-1 py-1 text-left hover:text-ink ${isActive ? 'text-ink' : ''}`}
                >
                  {column.label}
                  {isActive && <SortIcon direction={sort.direction} />}
                </button>
              </span>
            )
          })}
          <span role="columnheader">Actions</span>
        </div>
      </div>

      <List
        height={Math.min(LIST_HEIGHT, employees.length * ROW_HEIGHT)}
        width="100%"
        itemCount={employees.length}
        itemSize={ROW_HEIGHT}
        itemData={itemData}
        itemKey={(index, data) => data.rows[index].id}
        innerElementType={Body}
        style={{ overflowX: 'hidden' } as CSSProperties}
      >
        {VirtualRow}
      </List>
    </div>
  )
}
