import type { Department, Employee, EmployeeStatus } from '../types/employee'
import { DEPARTMENTS, STATUSES } from '../types/employee'

// Base URL is read from env config rather than hardcoded, so it can change
// per environment without touching source. JSONPlaceholder is a public,
// keyless mock API, so no auth token is needed here.
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

const ROLES_BY_DEPARTMENT: Record<Department, readonly string[]> = {
  Engineering: ['Frontend Developer', 'Backend Developer', 'QA Engineer', 'DevOps Engineer'],
  Sales: ['Account Executive', 'Sales Manager', 'Business Development Rep'],
  Marketing: ['Marketing Specialist', 'Content Strategist', 'SEO Analyst'],
  HR: ['HR Generalist', 'Recruiter', 'People Partner'],
  Finance: ['Financial Analyst', 'Accountant', 'Payroll Specialist'],
  Support: ['Support Engineer', 'Customer Success Manager', 'Help Desk Analyst'],
}

function toEmployee(user: JsonPlaceholderUser, index: number): Employee {
  const [firstName, ...rest] = user.name.split(' ')
  const lastName = rest.join(' ') || user.username
  const department = pickByIndex(DEPARTMENTS, index)
  const role = pickByIndex(ROLES_BY_DEPARTMENT[department], index)
  const status: EmployeeStatus = pickByIndex(STATUSES, index)

  return {
    id: user.id,
    firstName,
    lastName,
    email: user.email.toLowerCase(),
    department,
    role,
    status,
  }
}

/**
 * Fetches the employee roster from the mock REST API. All UI components
 * consume this through the useEmployees hook, never fetch() directly.
 */
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

  return users.map(toEmployee)
}
