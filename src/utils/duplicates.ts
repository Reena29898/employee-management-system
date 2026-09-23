import type { Employee } from '../types/employee'

/** Finds an existing employee with the same email, case- and whitespace-insensitive. */
export function findEmailDuplicate(email: string, employees: Employee[], editingId?: number): Employee | undefined {
  const normalized = email.trim().toLowerCase()
  if (!normalized) return undefined
  return employees.find((employee) => employee.id !== editingId && employee.email.toLowerCase() === normalized)
}
