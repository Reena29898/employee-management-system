export const DEPARTMENTS = [
  'Engineering',
  'Sales',
  'Marketing',
  'HR',
  'Finance',
  'Support',
] as const

export type Department = (typeof DEPARTMENTS)[number]

export const STATUSES = ['Active', 'Inactive', 'On Leave'] as const

export type EmployeeStatus = (typeof STATUSES)[number]

export interface Employee {
  id: number
  firstName: string
  lastName: string
  email: string
  department: Department
  role: string
  status: EmployeeStatus
}

/** Shape used by the create form, before an id has been assigned. */
export type NewEmployee = Omit<Employee, 'id'>

export interface EmployeeFormValues {
  firstName: string
  lastName: string
  email: string
  department: Department | ''
  role: string
  status: EmployeeStatus
}

export type EmployeeFormErrors = Partial<Record<keyof EmployeeFormValues, string>>

export const SORT_KEYS = ['id', 'name', 'email', 'department', 'role', 'status'] as const

export type SortKey = (typeof SORT_KEYS)[number]

export type SortDirection = 'asc' | 'desc'

export interface SortState {
  key: SortKey
  direction: SortDirection
}
