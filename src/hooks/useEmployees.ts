import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchEmployees, EmployeeApiError } from '../services/employeeApi'
import { buildEmployeeRoster, nextEmployeeId } from '../utils/helpers'
import type { Employee, NewEmployee } from '../types/employee'

export type FetchStatus = 'loading' | 'success' | 'error'

interface UseEmployeesResult {
  employees: Employee[]
  status: FetchStatus
  error: string | null
  addEmployee: (employee: NewEmployee) => Employee
  updateEmployee: (id: number, updates: NewEmployee) => void
  deleteEmployee: (id: number) => void
  refetch: () => void
}

// Owns the roster in state. Filtering/sorting/pagination happen in App.tsx
// as derived values, not here, so we're not keeping duplicate copies of it.
export function useEmployees(): UseEmployeesResult {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [status, setStatus] = useState<FetchStatus>('loading')
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)
  const abortRef = useRef<AbortController | null>(null)
  const nextIdRef = useRef(1)

  useEffect(() => {
    const controller = new AbortController()
    abortRef.current = controller

    setStatus('loading')
    setError(null)

    fetchEmployees(controller.signal)
      .then((data) => {
        const dataset = buildEmployeeRoster(data)
        nextIdRef.current = nextEmployeeId(dataset)
        setEmployees(dataset)
        setStatus('success')
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        const message = err instanceof EmployeeApiError ? err.message : 'Something went wrong loading employees.'
        setError(message)
        setStatus('error')
      })

    return () => controller.abort()
  }, [reloadToken])

  const addEmployee = useCallback((employee: NewEmployee): Employee => {
    const created: Employee = { ...employee, id: nextIdRef.current }
    nextIdRef.current += 1
    setEmployees((current) => [created, ...current])
    return created
  }, [])

  const updateEmployee = useCallback((id: number, updates: NewEmployee) => {
    setEmployees((current) => current.map((employee) => (employee.id === id ? { ...updates, id } : employee)))
  }, [])

  const deleteEmployee = useCallback((id: number) => {
    setEmployees((current) => current.filter((employee) => employee.id !== id))
  }, [])

  const refetch = useCallback(() => setReloadToken((token) => token + 1), [])

  return { employees, status, error, addEmployee, updateEmployee, deleteEmployee, refetch }
}
