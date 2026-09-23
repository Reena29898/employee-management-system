import { lazy, Suspense, useCallback, useMemo, useState } from 'react'
import { SearchBar } from './components/SearchBar'
import { FilterPanel } from './components/FilterPanel'
import { EmployeeTable } from './components/EmployeeTable'
import { Pagination } from './components/Pagination'
import { Modal } from './components/Modal'
import { ConfirmDialog } from './components/ConfirmDialog'
import { ExportControls } from './components/ExportControls'
import { Loading } from './components/Loading'
import { useEmployees } from './hooks/useEmployees'
import { clampPage } from './utils/helpers'
import type { Department, Employee, EmployeeFormValues, NewEmployee } from './types/employee'

// The form is only needed once a modal is opened, so it's split into its
// own chunk instead of being part of the initial bundle.
const EmployeeForm = lazy(() => import('./components/EmployeeForm').then((m) => ({ default: m.EmployeeForm })))

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const

function toFormValues(employee: Employee): EmployeeFormValues {
  const { firstName, lastName, email, department, role, status } = employee
  return { firstName, lastName, email, department, role, status }
}

function App() {
  const { employees, status, error, addEmployee, updateEmployee, deleteEmployee, refetch } = useEmployees()

  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState<Department[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null)

  const filteredEmployees = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    return employees.filter((employee) => {
      const matchesSearch =
        term === '' ||
        `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(term) ||
        employee.email.toLowerCase().includes(term) ||
        employee.role.toLowerCase().includes(term)

      const matchesDepartment = departmentFilter.length === 0 || departmentFilter.includes(employee.department)

      return matchesSearch && matchesDepartment
    })
  }, [employees, searchTerm, departmentFilter])

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize))

  // Search/filter results shrink the page count, and deleting the last
  // record on a page does too. Either way the stored page number can end up
  // past the new last page, so it's clamped here during render rather than
  // corrected afterwards in an effect.
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
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Employee Records</h1>
          <p className="mt-1 text-sm text-slate-500">Search, filter and manage the employee roster.</p>
        </header>

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
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add employee
            </button>
          </div>
        </div>

        <p aria-live="polite" className="sr-only">
          {status === 'success' ? `${filteredEmployees.length} employees found` : ''}
        </p>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          {status === 'loading' && <Loading />}

          {status === 'error' && (
            <div role="alert" className="flex flex-col items-center gap-3 py-16 text-center">
              <p className="text-sm text-red-600">{error}</p>
              <button
                type="button"
                onClick={refetch}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Retry
              </button>
            </div>
          )}

          {status === 'success' && (
            <>
              <EmployeeTable
                employees={paginatedEmployees}
                onEdit={setEditingEmployee}
                onDelete={setDeletingEmployee}
              />

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  Rows per page
                  <select
                    value={pageSize}
                    onChange={(event) => {
                      setPageSize(Number(event.target.value))
                      setPage(1)
                    }}
                    className="rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
      </div>

      <Modal isOpen={isAddModalOpen} title="Add employee" onClose={() => setIsAddModalOpen(false)}>
        <Suspense fallback={<Loading label="Loading form…" />}>
          <EmployeeForm onSubmit={handleAddSubmit} onCancel={() => setIsAddModalOpen(false)} />
        </Suspense>
      </Modal>

      <Modal isOpen={editingEmployee !== null} title="Edit employee" onClose={() => setEditingEmployee(null)}>
        <Suspense fallback={<Loading label="Loading form…" />}>
          {editingEmployee && (
            <EmployeeForm
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
