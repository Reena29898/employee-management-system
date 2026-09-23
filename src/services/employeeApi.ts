import type { Employee, EmployeeStatus } from '../types/employee'
import { DEPARTMENTS, STATUSES } from '../types/employee'
import { ROLES_BY_DEPARTMENT } from '../utils/roles'
import { sanitizeText } from '../utils/sanitize'

// Env-configured rather than hardcoded. No auth token needed, JSONPlaceholder is public.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://jsonplaceholder.typicode.com'

interface JsonPlaceholderUser {
  id: number
  name: string
  username: string
  email: string
  company: {
    name: string
    bs: string
  }
}

export class EmployeeApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EmployeeApiError'
  }
}

/** Deterministically maps an id into one of a fixed set of values. */
function pickByIndex<T>(values: readonly T[], index: number): T {
  return values[index % values.length]
}

/** True for a record that has enough usable data to become an Employee. */
function isUsableRecord(user: JsonPlaceholderUser): boolean {
  return Boolean(user && typeof user.name === 'string' && user.name.trim() && typeof user.email === 'string')
}

// Handles JSONPlaceholder fixture names like "Mrs. Dennis Schulist".
const HONORIFIC_PREFIX = /^(mr|mrs|ms|miss|dr|prof)\.?\s+/i

// Treat API data as untrusted, same as form input.
function toEmployee(user: JsonPlaceholderUser, index: number): Employee {
  const cleanedName = user.name.trim().replace(HONORIFIC_PREFIX, '')
  const [firstNameRaw, ...rest] = cleanedName.split(/\s+/)
  const lastNameRaw = rest.join(' ') || user.username || 'Unknown'
  const department = pickByIndex(DEPARTMENTS, index)
  const role = pickByIndex(ROLES_BY_DEPARTMENT[department], index)
  const status: EmployeeStatus = pickByIndex(STATUSES, index)

  return {
    id: user.id,
    firstName: sanitizeText(firstNameRaw),
    lastName: sanitizeText(lastNameRaw),
    email: sanitizeText(user.email).toLowerCase(),
    department,
    role,
    status,
  }
}

// Only place fetch() is called; components go through useEmployees instead.
export async function fetchEmployees(signal?: AbortSignal): Promise<Employee[]> {
  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}/users`, { signal })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }
    throw new EmployeeApiError('Could not reach the employee service. Check your connection and try again.')
  }

  if (!response.ok) {
    throw new EmployeeApiError(`Employee service returned an error (status ${response.status}).`)
  }

  const users = (await response.json()) as JsonPlaceholderUser[]

  if (!Array.isArray(users)) {
    throw new EmployeeApiError('Employee service returned an unexpected response shape.')
  }

  return users.filter(isUsableRecord).map(toEmployee)
}
