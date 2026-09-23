import { forwardRef, useMemo, type CSSProperties, type HTMLAttributes } from 'react'
import { FixedSizeList as List, type ListChildComponentProps } from 'react-window'
import { EmployeeRow, ROW_GRID_CLASS } from './EmployeeRow'
import type { Employee } from '../types/employee'

interface EmployeeTableProps {
  employees: Employee[]
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
}

const ROW_HEIGHT = 52
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

// Gives the virtualized rows a proper ARIA rowgroup wrapper instead of the
// generic div react-window renders by default, so the table stays announced
// correctly to screen readers even though rows are absolutely positioned.
const Body = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function Body(props, ref) {
  return <div ref={ref} role="rowgroup" {...props} />
})

const HEADER_CELLS = ['ID', 'Name', 'Email', 'Department', 'Role', 'Status', 'Actions']

export function EmployeeTable({ employees, onEdit, onDelete }: EmployeeTableProps) {
  // Stable reference unless the actual data or handlers change, so the
  // virtualization layer doesn't think every row needs a fresh render.
  const itemData = useMemo<RowData>(() => ({ rows: employees, onEdit, onDelete }), [employees, onEdit, onDelete])

  if (employees.length === 0) {
    return (
      <div role="status" className="rounded-md border border-dashed border-slate-300 py-16 text-center text-slate-500">
        No employees match your search and filters.
      </div>
    )
  }

  return (
    <div role="table" aria-label="Employees" className="overflow-hidden rounded-md border border-slate-200">
      <div role="rowgroup">
        <div
          role="row"
          className={`${ROW_GRID_CLASS} border-b border-slate-200 bg-slate-50 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500`}
        >
          {HEADER_CELLS.map((label) => (
            <span role="columnheader" key={label}>
              {label}
            </span>
          ))}
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
