import { lazy, Suspense, useCallback, useMemo, useState } from 'react'
import { SearchBar } from './components/SearchBar'
import { FilterPanel } from './components/FilterPanel'
import { EmployeeTable } from './components/EmployeeTable'
import { Pagination } from './components/Pagination'
import { Modal } from './components/Modal'
import { ConfirmDialog } from './components/ConfirmDialog'
import { ExportControls } from './components/ExportControls'
import { Loading } from './components/Loading'
import { StatRow } from './components/StatRow'
import { useEmployees } from './hooks/useEmployees'
import { useMediaQuery } from './hooks/useMediaQuery'
import { clampPage, sortEmployees } from './utils/helpers'
import type { Department, Employee, EmployeeFormValues, NewEmployee, SortKey, SortState } from './types/employee'

// Lazy-loaded: only needed once a modal opens.
const EmployeeForm = lazy(() => import('./components/EmployeeForm').then((m) => ({ default: m.EmployeeForm })))

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const
const DEFAULT_SORT: SortState = { key: 'id', direction: 'asc' }

function toFormValues(employee: Employee): EmployeeFormValues {
  const { firstName, lastName, email, department, role, status } = employee
  return { firstName, lastName, email, department, role, status }
}

function App() {
  const { employees, status, error, addEmployee, updateEmployee, deleteEmployee, refetch } = useEmployees()
  const isMobile = useMediaQuery('(max-width: 639px)')

  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState<Department[]>([])
  const [sort, setSort] = useState<SortState>(DEFAULT_SORT)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null)

  const filteredEmployees = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    const matching = employees.filter((employee) => {
      const matchesSearch =
        term === '' ||
        `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(term) ||
        employee.email.toLowerCase().includes(term) ||
        employee.role.toLowerCase().includes(term)

      const matchesDepartment = departmentFilter.length === 0 || departmentFilter.includes(employee.department)

      return matchesSearch && matchesDepartment
    })

    return sortEmployees(matching, sort)
  }, [employees, searchTerm, departmentFilter, sort])

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize))

  // Clamped during render instead of in an effect, so a filter/delete that
  // shrinks the result set can't leave the page number out of range.
  const currentPage = clampPage(page, totalPages)

  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredEmployees.slice(start, start + pageSize)
  }, [filteredEmployees, currentPage, pageSize])

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
    setPage(1)
  }, [])

  const handleDepartmentChange = useCallback((departments: Department[]) => {
    setDepartmentFilter(departments)
    setPage(1)
  }, [])

  const handleSortChange = useCallback((key: SortKey) => {
    setSort((current) => {
      if (current.key !== key) return { key, direction: 'asc' }
      return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
    })
    setPage(1)
  }, [])

  const handleAddSubmit = useCallback(
    (values: NewEmployee) => {
      addEmployee(values)
      setIsAddModalOpen(false)
      setPage(1)
    },
    [addEmployee],
  )

  const handleEditSubmit = useCallback(
    (values: NewEmployee) => {
      if (!editingEmployee) return
      updateEmployee(editingEmployee.id, values)
      setEditingEmployee(null)
    },
    [editingEmployee, updateEmployee],
  )

  const handleConfirmDelete = useCallback(() => {
    if (!deletingEmployee) return
    deleteEmployee(deletingEmployee.id)
    setDeletingEmployee(null)
  }, [deletingEmployee, deleteEmployee])

  return (
    <div className="min-h-screen bg-canvas-soft">
      <header className="border-b border-hairline bg-canvas">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white"
          >
            ER
          </div>
          <div>
            <h1 className="text-base font-semibold text-ink">Employee Records</h1>
            <p className="text-xs text-ink-muted">Search, filter and manage the employee roster.</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {status === 'success' && <StatRow employees={employees} />}

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchBar onSearch={handleSearch} />
            <FilterPanel selectedDepartments={departmentFilter} onChange={handleDepartmentChange} />
          </div>

          <div className="flex items-center gap-2">
            <ExportControls employees={filteredEmployees} />
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-level-1 hover:bg-primary-hover"
            >
              Add employee
            </button>
          </div>
        </div>

        <p aria-live="polite" className="sr-only">
          {status === 'success' ? `${filteredEmployees.length} employees found` : ''}
        </p>

        <div className="rounded-lg border border-hairline bg-canvas p-4 shadow-level-1">
          {status === 'loading' && <Loading />}

          {status === 'error' && (
            <div role="alert" className="flex flex-col items-center gap-3 py-16 text-center">
              <p className="text-sm text-danger">{error}</p>
              <button
                type="button"
                onClick={refetch}
                className="rounded-md border border-hairline-strong px-4 py-2 text-sm font-medium text-ink-secondary hover:bg-canvas-soft"
              >
                Retry
              </button>
            </div>
          )}

          {status === 'success' && (
            <>
              <EmployeeTable
                employees={paginatedEmployees}
                sort={sort}
                onSortChange={handleSortChange}
                onEdit={setEditingEmployee}
                onDelete={setDeletingEmployee}
                layout={isMobile ? 'cards' : 'table'}
              />

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-center gap-2 text-sm text-ink-muted">
                  Rows per page
                  <select
                    value={pageSize}
                    onChange={(event) => {
                      setPageSize(Number(event.target.value))
                      setPage(1)
                    }}
                    className="rounded-md border border-hairline-strong px-2 py-1 text-sm text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </label>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalRecords={filteredEmployees.length}
                  pageSize={pageSize}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </div>
      </main>

      <Modal isOpen={isAddModalOpen} title="Add employee" onClose={() => setIsAddModalOpen(false)}>
        <Suspense fallback={<Loading label="Loading form…" />}>
          <EmployeeForm employees={employees} onSubmit={handleAddSubmit} onCancel={() => setIsAddModalOpen(false)} />
        </Suspense>
      </Modal>

      <Modal isOpen={editingEmployee !== null} title="Edit employee" onClose={() => setEditingEmployee(null)}>
        <Suspense fallback={<Loading label="Loading form…" />}>
          {editingEmployee && (
            <EmployeeForm
              employees={employees}
              editingId={editingEmployee.id}
              initialValues={toFormValues(editingEmployee)}
              submitLabel="Save changes"
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingEmployee(null)}
            />
          )}
        </Suspense>
      </Modal>

      <ConfirmDialog
        isOpen={deletingEmployee !== null}
        title="Delete employee"
        message={
          deletingEmployee
            ? `Remove ${deletingEmployee.firstName} ${deletingEmployee.lastName} from the records? This can't be undone.`
            : ''
        }
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingEmployee(null)}
      />
    </div>
  )
}

export default App
