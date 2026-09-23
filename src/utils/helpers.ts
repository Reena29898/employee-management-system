import {
  DEPARTMENTS,
  type Department,
  type Employee,
  type EmployeeStatus,
  type SortState,
  STATUSES,
} from '../types/employee'
import { ROLES_BY_DEPARTMENT } from './roles'

// JSONPlaceholder only gives us 10 people, not enough to test pagination or
// virtualization properly. Cross-multiplying first/last names gives 100
// distinct rows instead of repeating the same 10 with a "+1" email suffix.
export function buildEmployeeRoster(base: Employee[]): Employee[] {
  if (base.length === 0) return base

  const firstNames = base.map((employee) => employee.firstName)
  const lastNames = base.map((employee) => employee.lastName)

  const roster: Employee[] = []
  let id = 1

  for (let i = 0; i < firstNames.length; i += 1) {
    for (let j = 0; j < lastNames.length; j += 1) {
      if (i === j) {
        roster.push({ ...base[i], id })
        id += 1
        continue
      }

      const firstName = firstNames[i]
      const lastName = lastNames[j]
      const spread = i * lastNames.length + j
      const department: Department = DEPARTMENTS[spread % DEPARTMENTS.length]
      const role = ROLES_BY_DEPARTMENT[department][spread % ROLES_BY_DEPARTMENT[department].length]
      const status: EmployeeStatus = STATUSES[spread % STATUSES.length]

      roster.push({
        id,
        firstName,
        lastName,
        email: `${firstName}.${lastName}@example.com`.toLowerCase(),
        department,
        role,
        status,
      })
      id += 1
    }
  }

  return roster
}

/** Generates a new id one higher than the current maximum in the dataset. */
export function nextEmployeeId(employees: Employee[]): number {
  return employees.reduce((max, employee) => Math.max(max, employee.id), 0) + 1
}

export function clampPage(page: number, totalPages: number): number {
  if (totalPages <= 0) return 1
  return Math.min(Math.max(page, 1), totalPages)
}

function sortValue(employee: Employee, key: SortState['key']): string | number {
  switch (key) {
    case 'id':
      return employee.id
    case 'name':
      return `${employee.lastName} ${employee.firstName}`.toLowerCase()
    case 'email':
      return employee.email.toLowerCase()
    case 'department':
      return employee.department.toLowerCase()
    case 'role':
      return employee.role.toLowerCase()
    case 'status':
      return employee.status.toLowerCase()
  }
}

// Returns a new sorted array, doesn't touch the original.
export function sortEmployees(employees: Employee[], sort: SortState): Employee[] {
  const direction = sort.direction === 'asc' ? 1 : -1

  return [...employees].sort((a, b) => {
    const valueA = sortValue(a, sort.key)
    const valueB = sortValue(b, sort.key)
    if (valueA < valueB) return -1 * direction
    if (valueA > valueB) return 1 * direction
    return 0
  })
}
